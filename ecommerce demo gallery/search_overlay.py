with open("src/styles.css", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = [m.span() for m in re.finditer(r'\.demo-modal-overlay', content)]
for start, end in matches:
    # print context of 100 characters around the match
    slice_start = max(0, start - 50)
    slice_end = min(len(content), end + 150)
    print(f"Match at {start}:")
    print(content[slice_start:slice_end])
    print("-" * 50)
