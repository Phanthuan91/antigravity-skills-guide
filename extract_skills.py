import os
import re
import json

SKILLS_DIR = r"C:\Users\Phan Thuan\.gemini\antigravity\skills"
OUT_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"

def extract_metadata(skill_path):
    skill_md = os.path.join(skill_path, "SKILL.md")
    if not os.path.exists(skill_md):
        return None
    
    with open(skill_md, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract YAML frontmatter
    name = os.path.basename(skill_path)
    description = ""
    
    # Simple YAML parser for name and description
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
            
    # Parse fm_lines simple way
    current_key = None
    for line in fm_lines:
        if ':' in line and not line.startswith(' '):
            key, val = line.split(':', 1)
            current_key = key.strip()
            frontmatter[current_key] = val.strip()
        elif current_key and line.startswith(' '):
            frontmatter[current_key] += " " + line.strip()

    name = frontmatter.get('name', name)
    description = frontmatter.get('description', "").strip()
    
    # Handle block scalars and missing VN descriptions
    if description in [">", ">-", "|", "|-"] or not description or any(c.isalpha() for c in description) and not any(ord(c) > 127 for c in description):
        # Scan body for first Vietnamese sentence (heuristic: contains non-ascii Vietnamese characters)
        body = content.split('---')[-1] if '---' in content else content
        # Look for first paragraph after first header
        vn_match = re.search(r"^#.*?\n\n(.*?)\n", body, re.MULTILINE | re.DOTALL)
        if vn_match:
            candidate = vn_match.group(1).strip()
            if any(ord(c) > 127 for c in candidate): # Has VN chars
                description = candidate
        
    if not description or description in [">", ">-", "|", "|-"]:
        description = "Chưa có mô tả kỹ năng bằng tiếng Việt."
    
    # Clean up description (remove markdown links, etc)
    description = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', description)
    description = description.split('\n')[0] # Keep only first line/paragraph
    
    # Categorize using FOLDER name for more reliability
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
    for item in os.listdir(SKILLS_DIR):
        full_path = os.path.join(SKILLS_DIR, item)
        if os.path.isdir(full_path):
            meta = extract_metadata(full_path)
            if meta:
                all_skills.append(meta)
    
    # Sort by name
    all_skills.sort(key=lambda x: x['name'])
    
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_skills, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(all_skills)} skills to {OUT_FILE}")

if __name__ == "__main__":
    main()
