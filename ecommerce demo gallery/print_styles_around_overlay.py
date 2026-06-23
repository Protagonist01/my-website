with open("src/styles.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx in range(3050, 3121):
    if idx < len(lines):
        print(f"{idx+1}: {lines[idx].strip()}")
