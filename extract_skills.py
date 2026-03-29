import os
import re
import json

SKILLS_DIR = r"C:\Users\Phan Thuan\.gemini\antigravity\skills"
OUT_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"

# AI Translation Map for common keywords and patterns
TRANSLATION_MAP = {
    "Expert accessibility specialist who audits interfaces against WCAG standards": "Chuyên gia tiếp cận (accessibility) chuyên kiểm tra giao diện theo chuẩn WCAG",
    "Plan marketing campaigns with objectives": "Lập kế hoạch chiến dịch marketing với mục tiêu cụ thể",
    "Expert content strategist and creator": "Chuyên gia chiến lược và sáng tạo nội dung",
    "Senior backend architect specializing in scalable system design": "Kiến trúc sư hệ thống backend cấp cao, chuyên về thiết kế hệ thống mở rộng",
    "Expert frontend developer specializing in modern web technologies": "Lập trình viên frontend chuyên nghiệp với các công nghệ web hiện đại",
    "Expert developer advocate specializing in building developer communities": "Chuyên gia quan hệ lập trình viên (DevRel) chuyên xây dựng cộng đồng",
    "Expert DevOps engineer specializing in infrastructure automation": "Kỹ sư DevOps chuyên về tự động hóa hạ tầng và CI/CD",
    "Expert software architect specializing in system design": "Kiến trúc sư phần mềm chuyên về thiết kế hệ thống và DDD",
    "Expert site reliability engineer specializing in SLOs": "Kỹ sư SRE chuyên về độ tin cậy hệ thống và SLO/SLI",
    "Expert application security engineer specializing in threat modeling": "Kỹ sư bảo mật ứng dụng chuyên về mô hình hóa mối đe dọa (threat modeling)",
    "Senior pre-sales engineer specializing in technical discovery": "Kỹ sư giải pháp (Pre-sales) chuyên về tư vấn kỹ thuật và demo",
    "Expert UI designer specializing in visual design systems": "Thiết kế giao diện UI chuyên về hệ thống thiết kế (Design Systems)",
    "Expert user experience researcher specializing in user behavior analysis": "Chuyên gia nghiên cứu trải nghiệm người dùng (UX Researcher)",
    "Apply and enforce brand voice, style guide, and messaging pillars across content": "Áp dụng và thực thi giọng điệu thương hiệu, quy chuẩn phong cách và các trụ cột thông điệp trong nội dung.",
    "Draft marketing content across channels": "Soạn thảo nội dung marketing đa kênh (blog, social, email...)",
    "Benchmark compensation against market data": "Đánh giá mức lương so với dữ liệu thị trường.",
    "Audit designs and code for WCAG 2.1 AA compliance": "Kiểm định thiết kế và mã nguồn về mức độ tuân thủ tiêu chuẩn WCAG 2.1 AA.",
    "Research a company or person and get actionable sales intel": "Nghiên cứu công ty hoặc cá nhân để lấy thông tin kinh doanh hữu ích.",
}

def translate_to_vn(text, skill_name):
    # If already has VN chars, return as is
    if any(ord(c) > 127 for c in text):
        return text
        
    # Check exact map
    for eng, vn in TRANSLATION_MAP.items():
        if eng.lower() in text.lower():
            return vn
            
    # Pattern matching for Agency skills
    if skill_name.startswith("agency-"):
        role = skill_name.replace("agency-", "").replace("-", " ").title()
        role_map = {
            "Accessibility Auditor": "Chuyên gia Kiểm định Tiếp cận",
            "Account Strategist": "Chuyên gia Chiến lược Khách hàng",
            "Accounts Payable Agent": "Đại lý Thanh toán Phải trả",
            "Ad Creative Strategist": "Chiến lược gia Sáng tạo Quảng cáo",
            "Ai Engineer": "Kỹ sư Trí tuệ Nhân tạo",
            "Backend Architect": "Kiến trúc sư Backend",
            "Frontend Developer": "Lập trình viên Frontend",
            "Devops Automator": "Chuyên gia Tự động hóa DevOps",
            "Security Engineer": "Kỹ sư Bảo mật",
            "Software Architect": "Kiến trúc sư Phần mềm",
            "Ui Designer": "Thiết kế Giao diện UI",
            "Ux Architect": "Kiến trúc sư Trải nghiệm UX",
            "Workflow Optimizer": "Chuyên gia Tối ưu Quy trình",
            "Technical Writer": "Chuyên viên Viết tài liệu Kỹ thuật",
            "Content Creator": "Người Sáng tạo Nội dung",
            "Seo Specialist": "Chuyên gia SEO",
            "Social Media Strategist": "Chiến lược gia Mạng xã hội",
            "Analytics Reporter": "Chuyên gia Báo cáo Phân tích",
            "Api Tester": "Kỹ sư Kiểm thử API",
            "Devops Automator": "Chuyên gia Tự động hóa DevOps",
            "Brand Guardian": "Người Bảo vệ Thương hiệu",
            "Growth Hacker": "Chuyên gia Tăng trưởng",
        }
        translated_role = role_map.get(role, role)
        return f"Chuyên gia AI Agent ({translated_role}) dành cho các doanh nghiệp, chuyên xử lý nhiệm vụ về {role.lower()}."

    # Pattern matching for KWP skills
    if skill_name.startswith("kwp-"):
        parts = skill_name.split('-')
        category = parts[1] if len(parts) > 1 else ""
        action = parts[-1].replace("-", " ")
        cat_map = {
            "sales": "Kinh doanh/Bán hàng",
            "marketing": "Tiếp thị/Marketing",
            "product": "Sản phẩm",
            "eng": "Kỹ thuật/Engineering",
            "biz": "Doanh nghiệp/Business",
            "data": "Dữ liệu/Data",
            "legal": "Pháp lý/Legal",
            "finance": "Tài chính/Finance",
            "hr": "Nhân sự/HR",
            "design": "Thiết kế/Design",
            "operations": "Vận hành/Ops",
        }
        return f"Quy trình Knowledge Work cho {cat_map.get(category, category)}: Chuyên mục {action}."

    return text # Fallback

def extract_metadata(skill_path):
    skill_md = os.path.join(skill_path, "SKILL.md")
    if not os.path.exists(skill_md): return None
    
    try:
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()
    except: return None
        
    fm_match = re.search(r'^---(.*?)---', content, re.DOTALL | re.MULTILINE)
    frontmatter = {}
    body = content
    if fm_match:
        fm_block = fm_match.group(1)
        body = content[fm_match.end():]
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
    
    skill_folder_name = os.path.basename(skill_path)
    name = frontmatter.get('name', skill_folder_name)
    description = frontmatter.get('description', '').strip()
    description = re.sub(r'^[>|]-?\s*', '', description)
    
    # Check if needs translation
    is_pure_ascii = not any(ord(c) > 127 for c in description)
    if not description or is_pure_ascii:
        found_vn = False
        # Look for VN text in body
        for p in body.split('\n'):
            p = p.strip()
            if p and not p.startswith('#') and p.count('|') < 2 and not p.startswith('```') and len(p) > 20:
                if any(ord(c) > 127 for c in p):
                    description = p
                    found_vn = True
                    break
        
        if not found_vn or not any(ord(c) > 127 for c in description):
            description = translate_to_vn(description, skill_folder_name)
    
    if not description: description = "Chưa có mô tả kỹ năng bằng tiếng Việt."
    description = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', description) 
    description = re.sub(r'\*\*(.*?)\*\*', r'\1', description) 
    description = description.replace('\n', ' ').strip()
    if len(description) > 300: description = description[:297] + "..."
    
    # Categorize
    folder_name = skill_folder_name.lower()
    category = "other"
    if folder_name.startswith("agency-"): category = "agencies"
    elif folder_name.startswith("kwp-"):
        if "sales" in folder_name: category = "kwp-sales"
        elif "marketing" in folder_name: category = "kwp-marketing"
        elif "product" in folder_name: category = "kwp-product"
        elif any(k in folder_name for k in ["engineering", "eng", "data", "bio-research"]): category = "kwp-eng"
        else: category = "kwp-biz"
    elif folder_name.startswith("awf-"): category = "awf"
    elif any(k in folder_name for k in ["test", "pattern", "best-practices", "design", "standard", "guide"]): category = "tech"
    else: category = "tech"
    
    return {"name": name, "description": description, "category": category}

def main():
    all_skills = []
    if not os.path.exists(SKILLS_DIR): return
    for item in os.listdir(SKILLS_DIR):
        full_path = os.path.join(SKILLS_DIR, item)
        if os.path.isdir(full_path):
            meta = extract_metadata(full_path)
            if meta: all_skills.append(meta)
    
    all_skills.sort(key=lambda x: x['name'])
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_skills, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(all_skills)} skills to {OUT_FILE}")

if __name__ == "__main__":
    main()
