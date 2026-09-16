import os
import shutil
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas
import pymupdf

def set_cell_margins(cell, top=0, bottom=0, left=0, right=0):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_hyperlink(paragraph, url, text, color="1769E8", font_size_pt=7.5):
    part = paragraph.part
    r_id = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    hyperlink = parse_xml(
        f'<w:hyperlink xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        f'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="{r_id}"/>'
    )
    new_run = parse_xml('<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>')
    sz_val = int(font_size_pt * 2)
    rPr = parse_xml(
        f'<w:rPr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        f'<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>'
        f'<w:sz w:val="{sz_val}"/>'
        f'<w:color w:val="{color}"/>'
        f'</w:rPr>'
    )
    new_run.append(rPr)
    t_elem = parse_xml(f'<w:t xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">{text}</w:t>')
    new_run.append(t_elem)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)

def generate_docx(output_path: Path):
    doc = Document()
    
    # Page setup - 0.30 in margins (top/bottom) and 0.40 in (left/right) for perfect 1-page fit
    for section in doc.sections:
        section.top_margin = Inches(0.30)
        section.bottom_margin = Inches(0.30)
        section.left_margin = Inches(0.40)
        section.right_margin = Inches(0.40)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)
    
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(8.0)
    style_normal.font.color.rgb = RGBColor(0x31, 0x41, 0x58)
    
    def add_section_heading(title, is_first=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2) if is_first else Pt(6.5)
        p.paragraph_format.space_after = Pt(1.5)
        p.paragraph_format.keep_with_next = True
        
        run = p.add_run(title)
        run.bold = True
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
        
        pPr = p._element.get_or_add_pPr()
        pBdr = parse_xml(
            '<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            '<w:bottom w:val="single" w:sz="6" w:space="1" w:color="94A3B8"/>'
            '</w:pBdr>'
        )
        pPr.append(pBdr)
        return p

    def add_item_header(left_title, left_sub, right_date, right_loc=None, is_first_item=False):
        table = doc.add_table(rows=1, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        table.columns[0].width = Inches(6.0)
        table.columns[1].width = Inches(1.7)
        
        cell_l = table.cell(0, 0)
        cell_r = table.cell(0, 1)
        set_cell_margins(cell_l, top=0, bottom=0, left=0, right=0)
        set_cell_margins(cell_r, top=0, bottom=0, left=0, right=0)
        
        p_l = cell_l.paragraphs[0]
        p_l.paragraph_format.space_before = Pt(1.0) if is_first_item else Pt(2.5)
        p_l.paragraph_format.space_after = Pt(0.2)
        run_title = p_l.add_run(left_title)
        run_title.bold = True
        run_title.font.size = Pt(8.2)
        run_title.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
        
        if left_sub:
            run_sub = p_l.add_run(f"  |  {left_sub}")
            run_sub.font.size = Pt(7.7)
            run_sub.font.italic = True
            run_sub.font.color.rgb = RGBColor(0x52, 0x60, 0x77)
            
        p_r = cell_r.paragraphs[0]
        p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_r.paragraph_format.space_before = Pt(1.0) if is_first_item else Pt(2.5)
        p_r.paragraph_format.space_after = Pt(0.2)
        run_date = p_r.add_run(right_date)
        run_date.bold = True
        run_date.font.size = Pt(7.7)
        run_date.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
        
        if right_loc:
            r_loc = p_r.add_run(f"  ({right_loc})")
            r_loc.font.size = Pt(6.8)
            r_loc.font.color.rgb = RGBColor(0x60, 0x70, 0x89)

    def add_bullet(runs_or_text, space_after=0.8):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.05
        p.paragraph_format.left_indent = Inches(0.18)
        
        if isinstance(runs_or_text, str):
            runs = [(runs_or_text, False)]
        else:
            runs = runs_or_text
            
        for t, is_bold in runs:
            r = p.add_run(t)
            r.font.color.rgb = RGBColor(0x31, 0x41, 0x58)
            r.font.size = Pt(7.7)
            r.bold = is_bold
        return p

    # --- Header ---
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(0.5)
    run_name = p_name.add_run("TAIWO HENRY FADENI")
    run_name.bold = True
    run_name.font.size = Pt(14.0)
    run_name.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(1.5)
    run_sub = p_sub.add_run("APPLIED AI & SOFTWARE ENGINEER | LLM SYSTEMS | RAG & AGENT WORKFLOWS | DISTRIBUTED BACKENDS")
    run_sub.bold = True
    run_sub.font.size = Pt(8.2)
    run_sub.font.color.rgb = RGBColor(0x17, 0x69, 0xE8)
    
    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(3.0)
    run_c = p_contact.add_run("Lagos, Nigeria (Remote / Relocation)  |  +234 706 616 1980  |  ")
    run_c.font.size = Pt(7.5)
    run_c.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
    
    add_hyperlink(p_contact, "mailto:hfadeni@gmail.com", "hfadeni@gmail.com", color="1769E8", font_size_pt=7.5)
    
    run_nl = p_contact.add_run("\n")
    run_nl.font.size = Pt(7.5)
    
    add_hyperlink(p_contact, "https://henryfadeni.vercel.app/", "Portfolio", color="1769E8", font_size_pt=7.5)
    run_sep1 = p_contact.add_run("  |  ")
    run_sep1.font.size = Pt(7.5)
    run_sep1.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
    
    add_hyperlink(p_contact, "https://github.com/Protagonist01", "GitHub", color="1769E8", font_size_pt=7.5)
    run_sep2 = p_contact.add_run("  |  ")
    run_sep2.font.size = Pt(7.5)
    run_sep2.font.color.rgb = RGBColor(0x17, 0x20, 0x33)
    
    add_hyperlink(p_contact, "https://www.linkedin.com/in/henry-fadeni-ai-engineer/", "LinkedIn", color="1769E8", font_size_pt=7.5)

    # --- Professional Summary ---
    add_section_heading("PROFESSIONAL SUMMARY", is_first=True)
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(0)
    p_sum.paragraph_format.space_after = Pt(2)
    p_sum.paragraph_format.line_spacing = 1.05
    run_sum = p_sum.add_run(
        "Applied AI & Software Engineer with an Electrical & Electronics Engineering foundation, specializing in production-grade LLM systems, "
        "evaluated RAG architectures, autonomous agent workflows, and high-throughput asynchronous backends. Experienced in building "
        "deterministic guardrails, human-in-the-loop controls, automated evaluation suites, and observable asynchronous backend pipelines. "
        "Proven track record of shipping end-to-end applications from distributed backend architecture to polished user interfaces."
    )
    run_sum.font.size = Pt(7.7)

    # --- Technical Skills ---
    add_section_heading("TECHNICAL SKILLS")
    skills = [
        ("Programming Languages: ", "Python, SQL (PostgreSQL, DuckDB, SQLite), JavaScript, MATLAB"),
        ("AI & LLM Systems: ", "LangGraph, LangChain, RAG Architecture, Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering, Guardrails & Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL), Automated Evaluations (Golden Sets, Spider Benchmark)"),
        ("Backend & Distributed Systems: ", "FastAPI, WebSockets, RESTful APIs, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Caching, Sliding-Window Rate Limiting), AsyncIO, PostgreSQL, DuckDB, SQLite, Alembic, Keycloak, MinIO, Pandas, PySpark"),
        ("Frontend & UI Engineering: ", "React, Next.js, State Management, Interactive Data Dashboards"),
        ("DevOps, Cloud & Observability: ", "AWS, Cloudflare, Docker, GitHub Actions (CI/CD), Git, Pytest (80%+ CI Coverage Gates), Prometheus, Grafana, Loki, Supabase, Vercel"),
        ("Automation: ", "n8n (self-hosted workflows, webhook orchestration, custom code nodes), event-driven pipelines, scheduled ETL, apps integration")
    ]
    for label, val in skills:
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_before = Pt(0)
        p_sk.paragraph_format.space_after = Pt(1.0)
        p_sk.paragraph_format.line_spacing = 1.05
        r_lbl = p_sk.add_run(label)
        r_lbl.bold = True
        r_lbl.font.size = Pt(7.7)
        r_lbl.font.color.rgb = RGBColor(0x31, 0x41, 0x58)
        r_val = p_sk.add_run(val)
        r_val.font.size = Pt(7.7)

    # --- Applied AI & Backend Projects ---
    add_section_heading("APPLIED AI & BACKEND PROJECTS")
    
    # Project 1: Imaging Referral Workbench
    add_item_header("Imaging Referral Workbench", "FastAPI | PostgreSQL | Next.js | Keycloak | Docker", "2026", is_first_item=True)
    add_bullet("Built an end-to-end synthetic imaging-referral workflow spanning document intake/OCR, evidence-linked human review, a deterministic 15-rule readiness engine, immutable handoffs, and a FHIR read API.")
    add_bullet("Enforced tenant isolation with PostgreSQL RLS, server-side RBAC, OIDC/opaque sessions, CSRF protection, malware quarantine, and append-only audit trails.")
    add_bullet("Verified 92 automated tests (31 security); packaged API, UI, workers, identity, and private object storage with Docker, GitHub Actions, encrypted backup/restore, and a TLS-ready hosted-demo stack.")

    # Project 2: RAA
    add_item_header("Retrieval-Augmented Analytics Workspace (Text-to-SQL)", "FastAPI | DuckDB | sqlglot | Redis | SSE", "2026")
    add_bullet("Natural-language analytics interface executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.")
    add_bullet("Built a 2-stage AST validation pipeline using sqlglot (table/column verification, write-query rejection, and injection safeguards) with self-correction retry logic.")
    add_bullet([
        ("Automated an 80-pair Golden Set evaluation, achieving ", False),
        ("96% SQL validity, 74% execution accuracy, 61% failure self-correction, and ~4.2s p95 latency", True),
        (".", False)
    ])

    # Project 3: Self-Healing Monitor
    add_item_header("Self-Healing Microservices Monitor (Autonomous SRE Agent)", "LangGraph | ChromaDB | Prometheus | Postgres | React", "2026")
    add_bullet("Integrated Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.")
    add_bullet("Designed a 4-condition policy gate (confidence >= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions with PostgreSQL audit trails.")
    add_bullet([
        ("Scored ", False),
        ("100% action and policy correctness", True),
        (" across simulated failure scenarios with a live React operator dashboard.", False)
    ])

    # Project 4: Realtime Chat
    add_item_header("Distributed Realtime Chat Backend", "FastAPI | WebSockets | Redis Pub/Sub | SQLite | Docker", "2026")
    add_bullet("Scaled multi-room WebSocket delivery across workers using reference-counted Redis Pub/Sub channels (one channel per active room).")
    add_bullet("Added JWT handshake authentication, Redis-hash presence with multi-device deduplication, and cursor-paginated history; verified multi-worker delivery and fault isolation with cross-process tests.")

    # Project 5: Code Review Agent
    add_item_header("Autonomous Code Review Agent (GitHub App)", "Python | FastAPI | LangGraph | Celery | Redis | Docker", "2025")
    add_bullet("Built an event-driven GitHub App that parses pull-request diffs, retrieves file context, and publishes line-level reviews and commit statuses.")
    add_bullet("Decoupled webhook intake from model inference with Celery, HMAC-SHA256 verification, and Redis sliding-window rate limiting.")
    add_bullet([
        ("Implemented a pluggable multi-provider LLM layer (OpenAI, Anthropic, Groq, Ollama) behind an ", False),
        ("80% CI code coverage gate", True),
        (".", False)
    ])

    # --- Experience ---
    add_section_heading("EXPERIENCE")
    
    # Role 1: Cedarstone Business Services
    add_item_header("Automation Engineer", "Cedarstone Business Services (Contract)", "Feb 2026 - Jul 2026", "Remote", is_first_item=True)
    add_bullet("Engineered business automation workflows covering proposal preparation, invoice receivables follow-up, and client onboarding.")
    add_bullet("Implemented automated pricing calculations, multi-tier discount approval routing, dispute-aware payment tracking, and onboarding exception handling.")

    # Role 2: Meridian Knowledge
    add_item_header("Applied AI & Software Engineer", "Meridian Knowledge (Contract)", "May 2024 - Oct 2025", "Remote")
    add_bullet("Architected multimodal document-ingestion pipelines extracting and indexing data from PDFs, scanned forms, and structured records.")
    add_bullet("Integrated LLM extraction with deterministic validation rules, human-in-the-loop review interfaces, and automated quality evaluation suites.")

    # --- Education ---
    add_section_heading("EDUCATION")
    add_item_header("B.Eng., Electrical & Electronics Engineering", "Obafemi Awolowo University", "2019 - 2025", "Ile-Ife, Nigeria", is_first_item=True)
    
    p_train = doc.add_paragraph()
    p_train.paragraph_format.space_before = Pt(1.0)
    p_train.paragraph_format.space_after = Pt(0.5)
    r_tr_lbl = p_train.add_run("Additional Training: ")
    r_tr_lbl.bold = True
    r_tr_lbl.font.size = Pt(7.5)
    r_tr_lbl.font.color.rgb = RGBColor(0x31, 0x41, 0x58)
    r_tr_val = p_train.add_run("Data Engineering Track (DataCamp, 2024-2025)  |  Software & Data Engineering (Data Epic, 2025)  |  Computational Thinking for Problem Solving (UPenn, 2022)")
    r_tr_val.font.size = Pt(7.5)
    r_tr_val.font.color.rgb = RGBColor(0x31, 0x41, 0x58)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output_path)
    print(f"Generated DOCX: {output_path}")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for state in self._saved_page_states:
            self.__dict__.update(state)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

def generate_pdf(output_path: Path):
    source_ref = Path(__file__).resolve().parent / "source_resume.pdf"
    if source_ref.exists():
        output_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_ref, output_path)
        print(f"Synchronized PDF from source: {output_path}")
        return

    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        leftMargin=27.6,
        rightMargin=27.6,
        topMargin=18,
        bottomMargin=18
    )
    
    styles = getSampleStyleSheet()
    
    c_primary = colors.HexColor("#172033")
    c_blue = colors.HexColor("#1769E8")
    c_text = colors.HexColor("#314158")
    c_border = colors.HexColor("#94A3B8")
    
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15.2,
        leading=17.0,
        alignment=1,
        textColor=c_primary,
        spaceAfter=1.5
    )
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.1,
        leading=10.5,
        alignment=1,
        textColor=c_blue,
        spaceAfter=2.0
    )
    
    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.4,
        leading=9.0,
        alignment=1,
        textColor=c_primary,
        spaceAfter=7.0
    )
    
    section_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.7,
        leading=11.0,
        textColor=c_primary,
        spaceBefore=7.0,
        spaceAfter=0.5,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.4,
        leading=8.75,
        textColor=c_text,
        spaceAfter=1.0
    )
    
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.4,
        leading=8.75,
        textColor=c_text,
        leftIndent=7.0,
        firstLineIndent=-7.0,
        spaceAfter=0.0
    )
    
    item_title_style = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.7,
        leading=9.2,
        textColor=c_primary
    )
    
    item_date_style = ParagraphStyle(
        'ItemDate',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.7,
        leading=9.2,
        alignment=2,
        textColor=c_primary
    )

    story = []
    
    # Header
    story.append(Paragraph("TAIWO HENRY FADENI", name_style))
    story.append(Paragraph("APPLIED AI &amp; SOFTWARE ENGINEER | LLM SYSTEMS | RAG &amp; AGENT WORKFLOWS | DISTRIBUTED BACKENDS", title_style))
    contact_text = (
        "Lagos, Nigeria (Remote / Relocation) &nbsp;|&nbsp; +234 706 616 1980 &nbsp;|&nbsp; "
        '<a href="mailto:hfadeni@gmail.com" color="#1769E8">hfadeni@gmail.com</a><br/>'
        '<a href="https://henryfadeni.vercel.app/" color="#1769E8">Portfolio</a> &nbsp;|&nbsp; '
        '<a href="https://github.com/Protagonist01" color="#1769E8">GitHub</a> &nbsp;|&nbsp; '
        '<a href="https://www.linkedin.com/in/henry-fadeni-ai-engineer/" color="#1769E8">LinkedIn</a>'
    )
    story.append(Paragraph(contact_text, contact_style))
    
    def section_header(title, is_first=False):
        sb = 0 if is_first else 7.0
        sec_st = ParagraphStyle(
            f'Sec_{title}',
            parent=section_style,
            spaceBefore=sb
        )
        story.append(Paragraph(title, sec_st))
        story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=1.0, spaceAfter=2.5))
        
    def item_row(left_title, left_stack, right_date, right_loc="", is_first_item=False):
        top_pad = 0.5 if is_first_item else 2.5
        left_p = Paragraph(f"<b>{left_title}</b>" + (f" &nbsp;|&nbsp; <i><font color='#526077'>{left_stack}</font></i>" if left_stack else ""), item_title_style)
        right_str = f"<b>{right_date}</b>"
        if right_loc:
            right_str += f" &nbsp;<font color='#607089' size='6.5'>({right_loc})</font>"
        right_p = Paragraph(right_str, item_date_style)
        t = Table([[left_p, right_p]], colWidths=[450, 106.8])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), top_pad),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0.5),
        ]))
        return t

    # 1. Professional Summary
    section_header("PROFESSIONAL SUMMARY", is_first=True)
    summary_p = (
        "Applied AI &amp; Software Engineer with an Electrical &amp; Electronics Engineering foundation, specializing in production-grade LLM systems, "
        "evaluated RAG architectures, autonomous agent workflows, and high-throughput asynchronous backends. Experienced in building "
        "deterministic guardrails, human-in-the-loop controls, automated evaluation suites, and observable asynchronous backend pipelines. "
        "Proven track record of shipping end-to-end applications from distributed backend architecture to polished user interfaces."
    )
    story.append(Paragraph(summary_p, body_style))
    
    # 2. Technical Skills
    section_header("TECHNICAL SKILLS")
    skills_data = [
        ("<b>Programming Languages:</b>", "Python, SQL (PostgreSQL, DuckDB, SQLite), JavaScript, MATLAB"),
        ("<b>AI &amp; LLM Systems:</b>", "LangGraph, LangChain, RAG Architecture, Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering, Guardrails &amp; Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL), Automated Evaluations (Golden Sets, Spider Benchmark)"),
        ("<b>Backend &amp; Distributed Systems:</b>", "FastAPI, WebSockets, RESTful APIs, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Caching, Sliding-Window Rate Limiting), AsyncIO, PostgreSQL, DuckDB, SQLite, Alembic, Keycloak, MinIO, Pandas, PySpark"),
        ("<b>Frontend &amp; UI Engineering:</b>", "React, Next.js, State Management, Interactive Data Dashboards"),
        ("<b>DevOps, Cloud &amp; Observability:</b>", "AWS, Cloudflare, Docker, GitHub Actions (CI/CD), Git, Pytest (80%+ CI Coverage Gates), Prometheus, Grafana, Loki, Supabase, Vercel"),
        ("<b>Automation:</b>", "n8n (self-hosted workflows, webhook orchestration, custom code nodes), event-driven pipelines, scheduled ETL, apps integration")
    ]
    for lbl, val in skills_data:
        p = Paragraph(f"{lbl} <font color='#314158'>{val}</font>", body_style)
        story.append(p)
        
    # 3. Applied AI & Backend Projects
    section_header("APPLIED AI &amp; BACKEND PROJECTS")
    
    # Project 1: Imaging Referral Workbench
    story.append(item_row("Imaging Referral Workbench", "FastAPI | PostgreSQL | Next.js | Keycloak | Docker", "2026", is_first_item=True))
    story.append(Paragraph("&bull; Built an end-to-end synthetic imaging-referral workflow spanning document intake/OCR, evidence-linked human review, a deterministic 15-rule readiness engine, immutable handoffs, and a FHIR read API.", bullet_style))
    story.append(Paragraph("&bull; Enforced tenant isolation with PostgreSQL RLS, server-side RBAC, OIDC/opaque sessions, CSRF protection, malware quarantine, and append-only audit trails.", bullet_style))
    story.append(Paragraph("&bull; Verified 92 automated tests (31 security); packaged API, UI, workers, identity, and private object storage with Docker, GitHub Actions, encrypted backup/restore, and a TLS-ready hosted-demo stack.", bullet_style))

    # Project 2: RAA
    story.append(item_row("Retrieval-Augmented Analytics Workspace (Text-to-SQL)", "FastAPI | DuckDB | sqlglot | Redis | SSE", "2026"))
    story.append(Paragraph("&bull; Natural-language analytics interface executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.", bullet_style))
    story.append(Paragraph("&bull; Built a 2-stage AST validation pipeline using sqlglot (table/column verification, write-query rejection, and injection safeguards) with self-correction retry logic.", bullet_style))
    story.append(Paragraph("&bull; Automated an 80-pair Golden Set evaluation, achieving <b>96% SQL validity, 74% execution accuracy, 61% failure self-correction, and ~4.2s p95 latency</b>.", bullet_style))
    
    # Project 3: Self-Healing Monitor
    story.append(item_row("Self-Healing Microservices Monitor (Autonomous SRE Agent)", "LangGraph | ChromaDB | Prometheus | Postgres | React", "2026"))
    story.append(Paragraph("&bull; Integrated Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.", bullet_style))
    story.append(Paragraph("&bull; Designed a 4-condition policy gate (confidence &gt;= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions with PostgreSQL audit trails.", bullet_style))
    story.append(Paragraph("&bull; Scored <b>100% action and policy correctness</b> across simulated failure scenarios with a live React operator dashboard.", bullet_style))

    # Project 4: Realtime Chat
    story.append(item_row("Distributed Realtime Chat Backend", "FastAPI | WebSockets | Redis Pub/Sub | SQLite | Docker", "2026"))
    story.append(Paragraph("&bull; Scaled multi-room WebSocket delivery across workers using reference-counted Redis Pub/Sub channels (one channel per active room).", bullet_style))
    story.append(Paragraph("&bull; Added JWT handshake authentication, Redis-hash presence with multi-device deduplication, and cursor-paginated history; verified multi-worker delivery and fault isolation with cross-process tests.", bullet_style))

    # Project 5: Code Review Agent
    story.append(item_row("Autonomous Code Review Agent (GitHub App)", "Python | FastAPI | LangGraph | Celery | Redis | Docker", "2025"))
    story.append(Paragraph("&bull; Built an event-driven GitHub App that parses pull-request diffs, retrieves file context, and publishes line-level reviews and commit statuses.", bullet_style))
    story.append(Paragraph("&bull; Decoupled webhook intake from model inference with Celery, HMAC-SHA256 verification, and Redis sliding-window rate limiting.", bullet_style))
    story.append(Paragraph("&bull; Implemented a pluggable multi-provider LLM layer (OpenAI, Anthropic, Groq, Ollama) behind an <b>80% CI code coverage gate</b>.", bullet_style))

    # 4. Experience
    section_header("EXPERIENCE")
    
    # Role 1: Cedarstone Business Services
    story.append(item_row("Automation Engineer", "Cedarstone Business Services (Contract)", "Feb 2026 - Jul 2026", "Remote", is_first_item=True))
    story.append(Paragraph("&bull; Engineered business automation workflows covering proposal preparation, invoice receivables follow-up, and client onboarding.", bullet_style))
    story.append(Paragraph("&bull; Implemented automated pricing calculations, multi-tier discount approval routing, dispute-aware payment tracking, and onboarding exception handling.", bullet_style))

    # Role 2: Meridian Knowledge
    story.append(item_row("Applied AI &amp; Software Engineer", "Meridian Knowledge (Contract)", "May 2024 - Oct 2025", "Remote"))
    story.append(Paragraph("&bull; Architected multimodal document-ingestion pipelines extracting and indexing data from PDFs, scanned forms, and structured records.", bullet_style))
    story.append(Paragraph("&bull; Integrated LLM extraction with deterministic validation rules, human-in-the-loop review interfaces, and automated quality evaluation suites.", bullet_style))

    # 5. Education
    section_header("EDUCATION")
    
    edu_left = Paragraph("<b>B.Eng., Electrical &amp; Electronics Engineering</b> &nbsp;|&nbsp; <i><font color='#526077'>Obafemi Awolowo University</font></i>", item_title_style)
    edu_right = Paragraph("<b>2019 - 2025</b> &nbsp;<font color='#607089' size='6.5'>(Ile-Ife, Nigeria)</font>", item_date_style)
    t_edu = Table([[edu_left, edu_right]], colWidths=[430, 126.8])
    t_edu.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0.5),
    ]))
    story.append(t_edu)
    
    training_p = (
        "<b>Additional Training:</b> Data Engineering Track (DataCamp, 2024-2025) &nbsp;|&nbsp; "
        "Software &amp; Data Engineering (Data Epic, 2025) &nbsp;|&nbsp; Computational Thinking for Problem Solving (UPenn, 2022)"
    )
    story.append(Paragraph(training_p, body_style))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated PDF: {output_path}")

def sync_resume_files(source_pdf: Path, source_docx: Path, target_dir: Path):
    target_dir.mkdir(parents=True, exist_ok=True)
    # Both filenames maintained for backwards compatibility and clarity
    for pdf_name in ["Henry-Fadeni-Software-AI-Engineer-Resume.pdf", "Henry_Fadeni_Applied_AI_Software_Engineer.pdf"]:
        target_pdf = target_dir / pdf_name
        target_pdf.write_bytes(source_pdf.read_bytes())
    for docx_name in ["Henry_Fadeni_Software_AI_Engineer_Resume.docx", "Henry_Fadeni_Applied_AI_Software_Engineer.docx"]:
        target_docx = target_dir / docx_name
        target_docx.write_bytes(source_docx.read_bytes())

def main():
    root = Path(__file__).resolve().parent.parent
    
    # 1. Assets directory
    assets_dir = root / "assets"
    assets_dir.mkdir(exist_ok=True)
    pdf_asset = assets_dir / "Henry-Fadeni-Software-AI-Engineer-Resume.pdf"
    docx_asset = assets_dir / "Henry_Fadeni_Applied_AI_Software_Engineer.docx"
    
    generate_pdf(pdf_asset)
    generate_docx(docx_asset)
    
    # Mirror both naming conventions in assets
    (assets_dir / "Henry_Fadeni_Applied_AI_Software_Engineer.pdf").write_bytes(pdf_asset.read_bytes())
    (assets_dir / "Henry_Fadeni_Software_AI_Engineer_Resume.docx").write_bytes(docx_asset.read_bytes())
    
    # 2. Public assets directory
    public_assets_dir = root / "public" / "assets"
    sync_resume_files(pdf_asset, docx_asset, public_assets_dir)
    print(f"Synchronized with public assets directory: {public_assets_dir}")

    # 3. Dist assets directory (if dist exists)
    dist_assets_dir = root / "dist" / "assets"
    if dist_assets_dir.exists():
        sync_resume_files(pdf_asset, docx_asset, dist_assets_dir)
        print(f"Synchronized with dist assets directory: {dist_assets_dir}")

    # 4. Also sync to Codex outputs folder if it exists
    codex_outputs = Path(r"C:\Users\wolas\Documents\Codex\2026-07-16\i\outputs")
    if codex_outputs.exists():
        generate_docx(codex_outputs / "Henry_Fadeni_Software_AI_Engineer_Resume_ATS.docx")
        generate_docx(codex_outputs / "Henry_Fadeni_AI_Python_Developer_Mimic.docx")
        generate_docx(codex_outputs / "Henry_Fadeni_Applied_AI_Software_Engineer.docx")
        generate_pdf(codex_outputs / "Henry-Fadeni-Software-AI-Engineer-Resume.pdf")
        generate_pdf(codex_outputs / "Henry_Fadeni_Applied_AI_Software_Engineer.pdf")
        print("Synchronized with Codex outputs directory.")

    doc = pymupdf.open(pdf_asset)
    print(f"PDF Page Count: {len(doc)}")
    if len(doc) == 1:
        print("SUCCESS: PDF fits perfectly on exactly 1 page!")
    else:
        print(f"WARNING: PDF has {len(doc)} pages. Adjusting spacing may be required.")

if __name__ == "__main__":
    main()
