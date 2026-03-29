import os
import re

SKILL_PATH = r"C:\Users\Phan Thuan\.gemini\antigravity\skills\awf-adaptive-language\SKILL.md"

def extract_metadata(skill_md):
    with open(skill_md, 'r', encoding='utf-8') as f:
        content = f.read()
        
    description = ""
    lines = content.split('\n')
    in_frontmatter = False
    frontmatter = {}
    
    fm_lines = []
    for line in lines:
        if line.strip() == "---":
            if not in_frontmatter:
                in_frontmatter = True
                continue
            else:
                break
        if in_frontmatter:
            fm_lines.append(line)
            
    current_key = None
    for line in fm_lines:
        if ':' in line and not line.startswith(' '):
            key, val = line.split(':', 1)
            current_key = key.strip()
            frontmatter[current_key] = val.strip()
        elif current_key and line.startswith(' '):
            frontmatter[current_key] += " " + line.strip()

    description = frontmatter.get('description', "").strip()
    
    # NEW FIX: Strip YAML block indicators
    description = re.sub(r'^([>|]-?)\s*', '', description)
    
    print(f"DEBUG: Frontmatter description: '{description}'")

    if description in [">", ">-", "|", "|-"] or not description or (any(c.isalpha() for c in description) and not any(ord(c) > 127 for c in description)):
        body = content.split('---')[-1] if '---' in content else content
        # Look for first paragraph after first header
        # The body might start with \n\n# Header
        vn_match = re.search(r"#.*?\n+(.*?)(\n|$)", body, re.MULTILINE | re.DOTALL)
        if vn_match:
            candidate = vn_match.group(1).strip()
            print(f"DEBUG: Body candidate: '{candidate}'")
            if any(ord(c) > 127 for c in candidate): # Has VN chars
                description = candidate
        
    print(f"FINAL: {description}")

extract_metadata(SKILL_PATH)
