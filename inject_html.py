import os

INDEX_HTML = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\index.html"
CONTENT_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\generated_content.html"
NAV_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\generated_nav.html"

def main():
    if not os.path.exists(INDEX_HTML):
        print("index.html not found.")
        return

    with open(INDEX_HTML, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. Inject Navigation
    if os.path.exists(NAV_FILE):
        with open(NAV_FILE, 'r', encoding='utf-8') as f:
            new_nav = f.read()
        
        nav_start = -1
        nav_end = -1
        for i, line in enumerate(lines):
            if '<nav class="sidebar-nav">' in line:
                nav_start = i
            if '</nav>' in line and nav_start != -1:
                nav_end = i
                break
        
        if nav_start != -1 and nav_end != -1:
            lines = lines[:nav_start + 1] + [new_nav] + lines[nav_end:]
            print("Injected Navigation.")

    # 2. Inject Content
    if os.path.exists(CONTENT_FILE):
        with open(CONTENT_FILE, 'r', encoding='utf-8') as f:
            new_content = f.read()
        
        content_start = -1
        content_end = -1
        for i, line in enumerate(lines):
            if "<!-- Slash Commands Section Placeholder -->" in line:
                content_start = i
            if "</main>" in line:
                content_end = i
                break
        
        if content_start != -1 and content_end != -1:
            # We want to keep everything before and after. 
            # The placeholder is where we start injecting.
            # We stop before </main>.
            lines = lines[:content_start + 1] + ["\n" + new_content + "\n"] + lines[content_end:]
            print("Injected Content.")

    with open(INDEX_HTML, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Update complete. index.html has {len(lines)} elements.")

if __name__ == "__main__":
    main()
