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
        
    # Extract YAML frontmatter or fallback to manual parsing
    name_match = re.search(r"^name:\s*(.*)$", content, re.MULTILINE)
    desc_match = re.search(r"^description:\s*(.*)$", content, re.MULTILINE)
    
    name = name_match.group(1).strip() if name_match else os.path.basename(skill_path)
    description = desc_match.group(1).strip() if desc_match else "Chưa có mô tả kỹ năng."
    
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
        # Fallback to name-based if folder doesn't have prefix
        low_name = name.lower()
        if "pattern" in low_name or "best-practices" in low_name: category = "tech"
        else: category = "tech"
    
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
