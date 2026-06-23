with open("ecommerce demo gallery/src/styles.css", "r", encoding="utf-8") as f:
    content = f.read()

import re
root_match = re.search(r':root\s*\{([^}]+)\}', content)
if root_match:
    print("styles.css :root content:")
    for line in root_match.group(1).strip().split('\n'):
        print(f"  {line.strip()}")
else:
    print("No :root found in styles.css")
