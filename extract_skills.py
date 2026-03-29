import os
import re
import json

SKILLS_DIR = r"C:\Users\Phan Thuan\.gemini\antigravity\skills"
OUT_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"

def extract_metadata(skill_path):
    skill_md = os.path.join(skill_path, "SKILL.md")
    if not os.path.exists(skill_md):
        return None
    
    try:
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return None
        
    # Extract YAML frontmatter
    fm_match = re.search(r'^---(.*?)---', content, re.DOTALL | re.MULTILINE)
    frontmatter = {}
    if fm_match:
        fm_block = fm_match.group(1)
        current_key = None
        for line in fm_block.split('\n'):
            line = line.rstrip()
            if not line: continue
            if ':' in line and not line.startswith(' '):
                key, val = line.split(':', 1)
                current_key = key.strip()
                frontmatter[current_key] = val.strip()
            elif current_key and line.startswith(' '):
                frontmatter[current_key] = (frontmatter[current_key] + " " + line.strip()).strip()
    
    name = frontmatter.get('name', os.path.basename(skill_path))
    description = frontmatter.get('description', '').strip()
    
    # Clean up YAML block markers
    description = re.sub(r'^[>|]-?\s*', '', description)
    
    # Detect if we need to search body for Vietnamese
    is_pure_ascii = not any(ord(c) > 127 for c in description)
    if not description or is_pure_ascii:
        # Search body for first paragraph that has VN chars
        body = content.split('---')[-1] if '---' in content else content
        for p in body.split('\n'): # Check line by line for first descriptive line
            p = p.strip()
            # Must not be header, must be long enough, must have VN chars
            if p and not p.startswith('#') and len(p) > 20 and any(ord(c) > 127 for c in p):
                description = p
                break
    
    if not description:
        description = "Chưa có mô tả kỹ năng bằng tiếng Việt."
        
    # Clean up description
    description = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', description) # Remove links
    description = re.sub(r'\*\*(.*?)\*\*', r'\1', description) # Remove bold
    description = description.replace('\n', ' ').strip()
    if len(description) > 300:
        description = description[:297] + "..."
    
    # Categorize using FOLDER name
    folder_name = os.path.basename(skill_path).lower()
    category = "other"
    
    if folder_name.startswith("agency-"):
        category = "agencies"
    elif folder_name.startswith("kwp-"):
        if "sales" in folder_name: category = "kwp-sales"
        elif "marketing" in folder_name: category = "kwp-marketing"
        elif "product-management" in folder_name: category = "kwp-product"
        elif any(k in folder_name for k in ["engineering", "data", "bio-research"]): category = "kwp-eng"
        elif any(k in folder_name for k in ["finance", "legal", "human-resources", "operations", "admin", "productivity", "enterprise-search", "cowork-plugin-management"]): category = "kwp-biz"
        else: category = "kwp-biz"
    elif folder_name.startswith("awf-"):
        category = "awf"
    elif any(k in folder_name for k in ["test", "pattern", "best-practices", "design", "standard", "guide"]):
        category = "tech"
    else:
        category = "tech"
    
    return {
        "name": name,
        "description": description,
        "category": category
    }

def main():
    all_skills = []
    if not os.path.exists(SKILLS_DIR):
        print(f"Error: {SKILLS_DIR} not found.")
        return

    for item in os.listdir(SKILLS_DIR):
        full_path = os.path.join(SKILLS_DIR, item)
        if os.path.isdir(full_path):
            meta = extract_metadata(full_path)
            if meta:
                all_skills.append(meta)
    
    all_skills.sort(key=lambda x: x['name'])
    
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_skills, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(all_skills)} skills to {OUT_FILE}")

if __name__ == "__main__":
    main()
