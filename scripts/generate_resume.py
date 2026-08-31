import os
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
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
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

def generate_docx(output_path: Path):
    doc = Document()
    
    # Page setup - 0.35 in margins (perfect 1-page fit)
    for section in doc.sections:
        section.top_margin = Inches(0.35)
        section.bottom_margin = Inches(0.35)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)
    
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(8.6)
    style_normal.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    
    def add_section_heading(title, is_first=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3) if is_first else Pt(9.5)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.keep_with_next = True
        
        run = p.add_run(title)
        run.bold = True
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        
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
        table.columns[0].width = Inches(5.7)
        table.columns[1].width = Inches(1.8)
        
        cell_l = table.cell(0, 0)
        cell_r = table.cell(0, 1)
        set_cell_margins(cell_l, top=0, bottom=0, left=0, right=0)
        set_cell_margins(cell_r, top=0, bottom=0, left=0, right=0)
        
        p_l = cell_l.paragraphs[0]
        p_l.paragraph_format.space_before = Pt(1.5) if is_first_item else Pt(3.5)
        p_l.paragraph_format.space_after = Pt(0.5)
        run_title = p_l.add_run(left_title)
        run_title.bold = True
        run_title.font.size = Pt(8.8)
        run_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        
        if left_sub:
            run_sub = p_l.add_run(f" | {left_sub}")
            run_sub.font.size = Pt(8.3)
            run_sub.font.italic = True
            run_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
            
        p_r = cell_r.paragraphs[0]
        p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_r.paragraph_format.space_before = Pt(1.5) if is_first_item else Pt(3.5)
        p_r.paragraph_format.space_after = Pt(0.5)
        run_date = p_r.add_run(right_date)
        run_date.bold = True
        run_date.font.size = Pt(8.3)
        run_date.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        
        if right_loc:
            p_r.add_run(f"  ({right_loc})").font.size = Pt(7.8)

    def add_bullet(text, space_after=1.2):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.08
        p.paragraph_format.left_indent = Inches(0.18)
        
        run_t = p.add_run(text)
        run_t.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        run_t.font.size = Pt(8.3)
        return p

    # --- Header ---
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(1.0)
    run_name = p_name.add_run("TAIWO HENRY FADENI")
    run_name.bold = True
    run_name.font.size = Pt(14.5)
    run_name.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2.0)
    run_sub = p_sub.add_run("SOFTWARE & AI ENGINEER | LLM SYSTEMS • RAG & AGENT WORKFLOWS • DISTRIBUTED BACKENDS")
    run_sub.bold = True
    run_sub.font.size = Pt(8.6)
    run_sub.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)
    
    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(4.0)
    run_c = p_contact.add_run("Lagos, Nigeria (Remote / Relocation)  •  +234 706 616 1980  •  hfadeni@gmail.com\n")
    run_c.font.size = Pt(8.0)
    run_c.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
    
    run_links = p_contact.add_run("Portfolio: henryfadeni.vercel.app  •  GitHub: github.com/Protagonist01  •  LinkedIn: linkedin.com/in/henry-fadeni-ai-engineer")
    run_links.font.size = Pt(8.0)
    run_links.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)

    # --- Professional Summary ---
    add_section_heading("PROFESSIONAL SUMMARY", is_first=True)
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(1)
    p_sum.paragraph_format.space_after = Pt(3)
    p_sum.paragraph_format.line_spacing = 1.08
    run_sum = p_sum.add_run(
        "Software & AI Engineer with an Electrical & Electronics Engineering foundation, specializing in production-grade LLM systems, "
        "evaluated RAG architectures, autonomous agent workflows, and high-throughput distributed backends. Experienced in building "
        "deterministic guardrails, human-in-the-loop controls, automated evaluation suites, and observable asynchronous "
        "backend pipelines. Proven track record of shipping end-to-end applications from distributed backend architecture to polished user interfaces."
    )
    run_sum.font.size = Pt(8.4)

    # --- Technical Skills ---
    add_section_heading("TECHNICAL SKILLS")
    skills = [
        ("Programming Languages: ", "Python, SQL (PostgreSQL, DuckDB, SQLite), JavaScript, MATLAB"),
        ("AI & LLM Systems: ", "LangGraph, LangChain, RAG Architecture, Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering, Guardrails & Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL), Automated Evaluations (Golden Sets, Spider Benchmark)"),
        ("Backend & Distributed Systems: ", "FastAPI, WebSockets, RESTful APIs, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Caching, Sliding-Window Rate Limiting), AsyncIO, DuckDB, PostgreSQL, SQLite, Alembic, Pandas, PySpark"),
        ("Frontend & UI Engineering: ", "React, Next.js, Responsive Design, State Management, Interactive Data Dashboards"),
        ("DevOps, Cloud & Observability: ", "AWS, Cloudflare, Docker, GitHub Actions (CI/CD), Git, Pytest (80%+ CI Coverage Gates), Prometheus, Grafana, Loki, Supabase, Vercel")
    ]
    for label, val in skills:
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_before = Pt(0)
        p_sk.paragraph_format.space_after = Pt(1.5)
        p_sk.paragraph_format.line_spacing = 1.08
        r_lbl = p_sk.add_run(label)
        r_lbl.bold = True
        r_lbl.font.size = Pt(8.2)
        r_lbl.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        r_val = p_sk.add_run(val)
        r_val.font.size = Pt(8.2)

    # --- Selected AI & Backend Projects ---
    add_section_heading("SELECTED AI & BACKEND PROJECTS")
    
    # Project 1: RAA
    add_item_header("Retrieval-Augmented Analytics Dashboard (Text-to-SQL)", "FastAPI · DuckDB · sqlglot · Redis · SSE", "2026", is_first_item=True)
    add_bullet("Architected a natural-language to SQL analytics workspace executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.")
    add_bullet("Built a 2-stage AST validation pipeline using sqlglot (enforcing table/column verification, write-query rejection, and injection safeguards) with self-correction retry logic.")
    add_bullet("Engineered an automated evaluation harness across an 80-pair Golden Set (adapted from Spider), achieving 96% SQL validity, 74% execution accuracy, 61% failure self-correction, and ~4.2s p95 latency.")

    # Project 2: Code Review Agent
    add_item_header("Autonomous AI Code Review Agent", "Python · FastAPI · LangGraph · Celery · Redis · Docker", "2026")
    add_bullet("Developed an event-driven GitHub App agent that parses pull-request diffs, retrieves relevant file context, and publishes line-level inline reviews and commit statuses.")
    add_bullet("Implemented HMAC-SHA256 webhook verification, Redis sliding-window rate limiting, and asynchronous job queuing via Celery workers to decouple webhook intake from model inference.")
    add_bullet("Built pluggable multi-provider LLM abstraction (OpenAI, Anthropic, Groq, Ollama), structured JSON validation, and an evaluation harness with an 80% CI code coverage gate.")

    # Project 3: Self-Healing Monitor
    add_item_header("Self-Healing Microservices Monitor (Autonomous SRE Agent)", "LangGraph · ChromaDB · Prometheus · Postgres", "2026")
    add_bullet("Built an incident-response agent integrating Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.")
    add_bullet("Engineered a 4-condition deterministic policy gate (confidence >= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions with PostgreSQL audit trails.")
    add_bullet("Achieved 100% (4/4) action and policy correctness across simulated failure scenarios with a live React operator dashboard.")

    # Project 4: Realtime Chat
    add_item_header("Realtime Multi-Room Chat Backend", "FastAPI · WebSockets · Redis Pub/Sub · SQLite · Docker", "2026")
    add_bullet("Engineered a distributed multi-room WebSocket backend scaling across workers using reference-counted Redis Pub/Sub channels (one channel per active room).")
    add_bullet("Implemented JWT authentication during WebSocket handshakes, Redis hash presence tracking with multi-device deduplication, and cursor-paginated message history (15 msgs/page).")
    add_bullet("Authored cross-process integration test suites verifying synchronized multi-worker message delivery and connection fault isolation.")

    # --- Professional Experience & Research ---
    add_section_heading("PROFESSIONAL EXPERIENCE & RESEARCH")
    
    add_item_header("Freelance Software & AI Engineer", "Independent Engineering & Consulting", "Jan 2025 – Present", "Remote", is_first_item=True)
    add_bullet("Designed and delivered production-grade AI systems, RAG workflows, agentic automation pipelines, and backend APIs for international clients and product builds.")
    add_bullet("Implemented rigorous evaluation harnesses, safety guardrails, and deterministic tool-use boundaries across web, voice, and developer automation applications.")

    add_item_header("Electrical & Automation Engineering Intern", "Promasidor Nigeria Limited", "May 2024 – Sep 2024", "Lagos, NG")
    add_bullet("Supported maintenance, diagnostic troubleshooting, and optimization of automated PLC-driven production-line systems in a high-volume FMCG manufacturing facility.")
    add_bullet("Applied structured root-cause analysis (RCA) to resolve electrical and sensor faults, cutting recurring downtime; documented 5+ automation workflows and SOPs.")

    add_item_header("Student Research Assistant", "Communication Research Group & Control Systems Lab", "2020 – 2025", "OAU, NG")
    add_bullet("Co-developed an IoT-compatible telemetry station and simulated sensor-to-microcontroller data transmission using MATLAB and Simulink.")
    add_bullet("Modeled Signal-to-Noise Ratio (SNR) across wireless configurations and contributed to smart metering prototypes for service-based tariff billing.")

    # --- Education & Professional Development ---
    add_section_heading("EDUCATION & PROFESSIONAL DEVELOPMENT")
    add_item_header("B.Eng., Electrical & Electronics Engineering", "Obafemi Awolowo University", "2019 – 2025", "Ile-Ife, Nigeria", is_first_item=True)
    
    p_train = doc.add_paragraph()
    p_train.paragraph_format.space_before = Pt(1.5)
    p_train.paragraph_format.space_after = Pt(1)
    r_tr_lbl = p_train.add_run("Specialized Training: ")
    r_tr_lbl.bold = True
    r_tr_lbl.font.size = Pt(8.0)
    r_tr_val = p_train.add_run("Data Engineering Track (DataCamp, 2024–2025)  •  Software & Data Engineering (Data Epic, 2025)  •  Computational Thinking for Problem Solving (UPenn, 2022)")
    r_tr_val.font.size = Pt(8.0)
    
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
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

def generate_pdf(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        leftMargin=24,
        rightMargin=24,
        topMargin=20,
        bottomMargin=20
    )
    
    styles = getSampleStyleSheet()
    
    c_primary = colors.HexColor("#0F172A")
    c_blue = colors.HexColor("#2563EB")
    c_text = colors.HexColor("#334155")
    c_muted = colors.HexColor("#64748B")
    c_border = colors.HexColor("#94A3B8")
    
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14.0,
        leading=16.0,
        alignment=1,
        textColor=c_primary,
        spaceAfter=2.0
    )
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.0,
        leading=9.8,
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
        textColor=c_text,
        spaceAfter=11.0
    )
    
    section_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=10.5,
        textColor=c_primary,
        spaceBefore=11.0,
        spaceAfter=1.0,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=9.4,
        textColor=c_text,
        spaceAfter=2.0
    )
    
    item_title_style = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=9.4,
        textColor=c_primary
    )
    
    item_date_style = ParagraphStyle(
        'ItemDate',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.6,
        leading=9.4,
        alignment=2,
        textColor=c_primary
    )
    
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.2,
        textColor=c_text,
        leftIndent=9,
        firstLineIndent=-9,
        spaceAfter=1.2
    )
    
    story = []
    
    # Header
    story.append(Paragraph("TAIWO HENRY FADENI", name_style))
    story.append(Paragraph("SOFTWARE & AI ENGINEER | LLM SYSTEMS &bull; RAG & AGENT WORKFLOWS &bull; DISTRIBUTED BACKENDS", title_style))
    contact_text = (
        "Lagos, Nigeria (Remote / Relocation) &nbsp;&bull;&nbsp; +234 706 616 1980 &nbsp;&bull;&nbsp; "
        '<a href="mailto:hfadeni@gmail.com" color="#2563EB">hfadeni@gmail.com</a> &nbsp;&bull;&nbsp; '
        '<a href="https://henryfadeni.vercel.app/" color="#2563EB">Portfolio</a> &nbsp;&bull;&nbsp; '
        '<a href="https://github.com/Protagonist01" color="#2563EB">GitHub</a> &nbsp;&bull;&nbsp; '
        '<a href="https://www.linkedin.com/in/henry-fadeni-ai-engineer/" color="#2563EB">LinkedIn</a>'
    )
    story.append(Paragraph(contact_text, contact_style))
    
    def section_header(title, is_first=False):
        sb = 0 if is_first else 11.0
        sec_st = ParagraphStyle(
            f'Sec_{title}',
            parent=section_style,
            spaceBefore=sb
        )
        story.append(Paragraph(title, sec_st))
        story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=1.0, spaceAfter=3.5))
        
    def item_row(left_title, left_stack, right_date, right_loc="", is_first_item=False):
        top_pad = 0.5 if is_first_item else 4.0
        left_p = Paragraph(f"<b>{left_title}</b>" + (f" &nbsp;|&nbsp; <i><font color='#475569'>{left_stack}</font></i>" if left_stack else ""), item_title_style)
        right_str = f"<b>{right_date}</b>"
        if right_loc:
            right_str += f" &nbsp;<font color='#64748B' size='6.5'>({right_loc})</font>"
        right_p = Paragraph(right_str, item_date_style)
        t = Table([[left_p, right_p]], colWidths=[424, 140])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), top_pad),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0.5),
        ]))
        return t

    # Summary
    section_header("PROFESSIONAL SUMMARY", is_first=True)
    summary_p = (
        "Software & AI Engineer with an Electrical & Electronics Engineering foundation, specializing in production-grade LLM systems, "
        "evaluated RAG architectures, autonomous agent workflows, and high-throughput distributed backends. Experienced in building "
        "deterministic guardrails, human-in-the-loop controls, automated evaluation suites, and observable asynchronous "
        "backend pipelines. Proven track record of shipping end-to-end applications from distributed backend architecture to polished user interfaces."
    )
    story.append(Paragraph(summary_p, body_style))
    
    # Skills
    section_header("TECHNICAL SKILLS")
    skills_data = [
        ("<b>Programming Languages:</b>", "Python, SQL (PostgreSQL, DuckDB, SQLite), JavaScript, MATLAB"),
        ("<b>AI & LLM Systems:</b>", "LangGraph, LangChain, RAG Architecture, Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Caching, Prompt Engineering, Guardrails & Policy Gates, Structured Outputs (Pydantic), Human-in-the-Loop (HITL), Automated Evaluations"),
        ("<b>Backend & Distributed Systems:</b>", "FastAPI, WebSockets, RESTful APIs, Server-Sent Events (SSE), Celery, Redis (Pub/Sub, Caching, Sliding-Window Rate Limiting), AsyncIO, DuckDB, PostgreSQL, SQLite, Alembic, Pandas, PySpark"),
        ("<b>Frontend & UI Engineering:</b>", "React, Next.js, Responsive Design, State Management, Interactive Data Dashboards"),
        ("<b>DevOps, Cloud & Observability:</b>", "AWS, Cloudflare, Docker, GitHub Actions (CI/CD), Git, Pytest (80%+ CI Coverage Gates), Prometheus, Grafana, Loki, Supabase, Vercel")
    ]
    for lbl, val in skills_data:
        p = Paragraph(f"{lbl} <font color='#334155'>{val}</font>", body_style)
        story.append(p)
        
    # Projects
    section_header("SELECTED AI & BACKEND PROJECTS")
    
    # Project 1: RAA
    story.append(item_row("Retrieval-Augmented Analytics Dashboard (Text-to-SQL)", "FastAPI · DuckDB · sqlglot · Redis · SSE", "2026", is_first_item=True))
    story.append(Paragraph("&bull; Architected a natural-language to SQL analytics workspace executing sandboxed, read-only analytical queries against DuckDB with streamed SSE explanations and dynamic charts.", bullet_style))
    story.append(Paragraph("&bull; Built a 2-stage AST validation pipeline using sqlglot (enforcing table/column verification, write-query rejection, and injection safeguards) with self-correction retry logic.", bullet_style))
    story.append(Paragraph("&bull; Engineered an automated evaluation harness across an 80-pair Golden Set (adapted from Spider), achieving <b>96% SQL validity</b>, <b>74% execution accuracy</b>, <b>61% failure self-correction</b>, and <b>~4.2s p95 latency</b>.", bullet_style))
    
    # Project 2: Code Review Agent
    story.append(item_row("Autonomous AI Code Review Agent", "Python · FastAPI · LangGraph · Celery · Redis · Docker", "2026"))
    story.append(Paragraph("&bull; Developed an event-driven GitHub App agent that parses pull-request diffs, retrieves relevant file context, and publishes line-level inline reviews and commit statuses.", bullet_style))
    story.append(Paragraph("&bull; Implemented HMAC-SHA256 webhook verification, Redis sliding-window rate limiting, and asynchronous job queuing via Celery workers to decouple webhook intake from model inference.", bullet_style))
    story.append(Paragraph("&bull; Built pluggable multi-provider LLM abstraction (OpenAI, Anthropic, Groq, Ollama), structured JSON validation, and an evaluation harness with an <b>80% CI code coverage gate</b>.", bullet_style))

    # Project 3: Self-Healing Monitor
    story.append(item_row("Self-Healing Microservices Monitor (Autonomous SRE Agent)", "LangGraph · ChromaDB · Prometheus · Postgres", "2026"))
    story.append(Paragraph("&bull; Built an incident-response agent integrating Prometheus Alertmanager webhooks, LangGraph multi-step diagnosis, and ChromaDB vector runbook retrieval.", bullet_style))
    story.append(Paragraph("&bull; Engineered a 4-condition deterministic policy gate (confidence >= 0.75, allowlisted low-risk actions, impact checks, human approval routing) preventing destructive runaway executions with PostgreSQL audit trails.", bullet_style))
    story.append(Paragraph("&bull; Achieved <b>100% (4/4) action and policy correctness</b> across simulated failure scenarios with a live React operator dashboard.", bullet_style))

    # Project 4: Realtime Chat
    story.append(item_row("Realtime Multi-Room Chat Backend", "FastAPI · WebSockets · Redis Pub/Sub · SQLite · Docker", "2026"))
    story.append(Paragraph("&bull; Engineered a distributed multi-room WebSocket backend scaling across workers using reference-counted Redis Pub/Sub channels (one channel per active room).", bullet_style))
    story.append(Paragraph("&bull; Implemented JWT authentication during WebSocket handshakes, Redis hash presence tracking with multi-device deduplication, and cursor-paginated message history (15 msgs/page).", bullet_style))
    story.append(Paragraph("&bull; Authored cross-process integration test suites verifying synchronized multi-worker message delivery and connection fault isolation.", bullet_style))

    # Experience
    section_header("PROFESSIONAL EXPERIENCE & RESEARCH")
    
    story.append(item_row("Freelance Software & AI Engineer", "Independent Engineering & Consulting", "Jan 2025 – Present", "Remote", is_first_item=True))
    story.append(Paragraph("&bull; Designed and delivered production-grade AI systems, RAG workflows, agentic automation pipelines, and backend APIs for international clients and product builds.", bullet_style))
    story.append(Paragraph("&bull; Implemented rigorous evaluation harnesses, safety guardrails, and deterministic tool-use boundaries across web, voice, and developer automation applications.", bullet_style))

    story.append(item_row("Electrical & Automation Engineering Intern", "Promasidor Nigeria Limited", "May 2024 – Sep 2024", "Lagos, NG"))
    story.append(Paragraph("&bull; Supported maintenance, diagnostic troubleshooting, and optimization of automated PLC-driven production-line systems in a high-volume FMCG manufacturing facility.", bullet_style))
    story.append(Paragraph("&bull; Applied structured root-cause analysis (RCA) to resolve electrical and sensor faults, cutting recurring downtime; documented 5+ automation workflows and SOPs.", bullet_style))

    story.append(item_row("Student Research Assistant", "Communication Research Group & Control Systems Lab", "2020 – 2025", "OAU, NG"))
    story.append(Paragraph("&bull; Co-developed an IoT-compatible telemetry station and simulated sensor-to-microcontroller data transmission using MATLAB and Simulink.", bullet_style))
    story.append(Paragraph("&bull; Modeled Signal-to-Noise Ratio (SNR) across wireless configurations and contributed to smart metering prototypes for service-based tariff billing.", bullet_style))

    # Education
    section_header("EDUCATION & PROFESSIONAL DEVELOPMENT")
    story.append(item_row("B.Eng., Electrical & Electronics Engineering", "Obafemi Awolowo University", "2019 – 2025", "Ile-Ife, Nigeria", is_first_item=True))
    training_p = (
        "<b>Specialized Training:</b> Data Engineering Track (DataCamp, 2024–2025) &nbsp;&bull;&nbsp; "
        "Software & Data Engineering (Data Epic, 2025) &nbsp;&bull;&nbsp; Computational Thinking for Problem Solving (UPenn, 2022)"
    )
    story.append(Paragraph(training_p, body_style))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated PDF: {output_path}")

def main():
    root = Path(__file__).resolve().parent.parent
    
    # 1. Assets directory
    assets_dir = root / "assets"
    assets_dir.mkdir(exist_ok=True)
    docx_asset = assets_dir / "Henry_Fadeni_Software_AI_Engineer_Resume.docx"
    pdf_asset = assets_dir / "Henry-Fadeni-Software-AI-Engineer-Resume.pdf"
    generate_docx(docx_asset)
    generate_pdf(pdf_asset)
    
    # 2. Public assets directory (Vite bundles files from public/ directly into dist/)
    public_assets_dir = root / "public" / "assets"
    public_assets_dir.mkdir(parents=True, exist_ok=True)
    generate_docx(public_assets_dir / "Henry_Fadeni_Software_AI_Engineer_Resume.docx")
    generate_pdf(public_assets_dir / "Henry-Fadeni-Software-AI-Engineer-Resume.pdf")
    print(f"Synchronized with public assets directory: {public_assets_dir}")

    # 3. Dist assets directory (if dist exists)
    dist_assets_dir = root / "dist" / "assets"
    if dist_assets_dir.exists():
        generate_docx(dist_assets_dir / "Henry_Fadeni_Software_AI_Engineer_Resume.docx")
        generate_pdf(dist_assets_dir / "Henry-Fadeni-Software-AI-Engineer-Resume.pdf")
        print(f"Synchronized with dist assets directory: {dist_assets_dir}")

    # 4. Also sync to Codex outputs folder if it exists
    codex_outputs = Path(r"C:\Users\wolas\Documents\Codex\2026-07-16\i\outputs")
    if codex_outputs.exists():
        generate_docx(codex_outputs / "Henry_Fadeni_Software_AI_Engineer_Resume_ATS.docx")
        generate_docx(codex_outputs / "Henry_Fadeni_AI_Python_Developer_Mimic.docx")
        generate_pdf(codex_outputs / "Henry-Fadeni-Software-AI-Engineer-Resume.pdf")
        print("Synchronized with Codex outputs directory.")

    doc = pymupdf.open(pdf_asset)
    print(f"PDF Page Count: {len(doc)}")
    if len(doc) == 1:
        print("SUCCESS: PDF fits perfectly on exactly 1 page!")
    else:
        print(f"WARNING: PDF has {len(doc)} pages. Adjusting spacing may be required.")

if __name__ == "__main__":
    main()
