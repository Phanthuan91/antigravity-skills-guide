import os
import re
import json

SKILLS_DIR = r"C:\Users\Phan Thuan\.gemini\antigravity\skills"
OUT_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"

# Vietnamese character set for robust detection
VN_CHARS = "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ"

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
    "Apply and enforce brand voice, style guide, and messaging pillars across content": "Áp dụng và thực thi giọng điệu thương hiệu, quy chuẩn phong cách và thông điệp cốt lõi.",
    "Draft marketing content across channels": "Soạn thảo nội dung marketing đa kênh (blog, mạng xã hội, email...)",
    "Benchmark compensation against market data": "Đánh giá mức lương và phúc lợi so với dữ liệu thị trường thực tế.",
    "Audit designs and code for WCAG 2.1 AA compliance": "Kiểm định thiết kế và mã nguồn về mức độ tuân thủ tiêu chuẩn tiếp cận WCAG 2.1 AA.",
    "Research a company or person and get actionable sales intel": "Nghiên cứu công ty/cá nhân để thu thập thông tin tình báo kinh doanh phục vụ bán hàng.",
    "Performance profiling principles. Measurement, analysis, and optimization techniques.": "Nguyên lý định danh hiệu năng (profiling). Các kỹ thuật đo lường, phân tích và tối ưu hóa.",
    "Pragmatic coding standards - concise, direct, no over-engineering": "Quy chuẩn mã nguồn tinh gọn - súc tích, trực diện, không lạm dụng thiết kế.",
    "API design principles and decision-making. REST vs GraphQL vs tRPC": "Nguyên tắc thiết kế API: So sánh REST, GraphQL và tRPC để đưa ra lựa chọn tối ưu.",
    "Architectural decision-making framework. Requirements analysis, trade-off evaluation": "Khung ra quyết định kiến trúc: Phân tích yêu cầu và đánh giá sự đánh đổi (trade-offs).",
    "Bash/Linux terminal patterns. Critical commands, piping, error handling": "Mẫu lệnh Bash/Linux: Các lệnh quan trọng, kỹ thuật bọc lệnh (piping) và xử lý lỗi.",
    "AI operational modes (brainstorm, implement, debug, review, teach, ship, orchestrate)": "Các chế độ vận hành của AI (tư duy, triển khai, sửa lỗi, đánh giá, hướng dẫn...).",
    "Socratic questioning protocol + user communication": "Quy trình đặt câu hỏi kiểu Socrates và giao tiếp với người dùng.",
    "Code review guidelines covering code quality, security, and best practices": "Hướng dẫn review mã nguồn về chất lượng, bảo mật và các quy chuẩn tốt nhất.",
    "Database design principles and decision-making. Schema design, indexing strategy": "Nguyên tắc thiết kế cơ sở dữ liệu: Thiết kế schema, chiến lược đánh index và chọn ORM.",
    "Production deployment principles and decision-making. Safe deployment workflows": "Nguyên tắc triển khai Production: Quy trình triển khai an toàn, kỹ thuật rollback.",
    "Documentation templates and structure guidelines. README, API docs": "Mẫu tài liệu và hướng dẫn cấu trúc: README, tài liệu API, comment mã nguồn.",
    "Design thinking and decision-making for web UI": "Tư duy thiết kế và ra quyết định cho giao diện người dùng Web.",
    "Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity)": "Tối ưu hóa công cụ tạo nội dung (GEO) cho các bộ máy tìm kiếm AI.",
    "Internationalization and localization patterns. Detecting hardcoded strings": "Mẫu đa ngôn ngữ và địa phương hóa (i18n/L10n). Khử các chuỗi văn bản cứng.",
    "Automatic agent selection and intelligent task routing": "Tự động lựa chọn agent và điều hướng tác vụ thông minh dựa trên yêu cầu.",
    "Expert Model Context Protocol developer who designs, builds, and tests MCP servers": "Chuyên gia phát triển Giao thức Ngữ cảnh Mô hình (MCP) - thiết kế và xây dựng server.",
    "Mobile-first design thinking and decision-making for iOS and Android": "Tư duy thiết kế ưu tiên di động (Mobile-first) cho iOS và Android.",
    "Node.js development principles and decision-making. Framework selection": "Nguyên tắc phát triển Node.js: Lựa chọn framework, mô hình bất đồng bộ và bảo mật.",
    "Multi-agent orchestration patterns. Use when multiple independent tasks can run": "Mẫu điều phối đa agent: Sử dụng khi cần phối hợp nhiều tác vụ độc lập.",
    "Structured task planning with clear breakdowns, dependencies": "Lập kế hoạch tác vụ có cấu trúc: Phân rã công việc, xác định phụ thuộc và xác minh.",
    "PowerShell Windows patterns. Critical pitfalls, operator syntax": "Mẫu lệnh PowerShell Windows: Các lỗi thường gặp, cú pháp toán tử và xử lý lỗi.",
    "Python development principles and decision-making. Framework selection": "Nguyên tắc phát triển Python: Lựa chọn framework, async patterns và cấu trúc dự án.",
    "Red team tactics principles based on MITRE ATT&CK": "Nguyên lý tấn công (Red team) dựa trên khung kỹ thuật MITRE ATT&CK.",
    "SEO fundamentals, E-E-A-T, Core Web Vitals": "Nền tảng SEO: Các chỉ số E-E-A-T, Core Web Vitals và nguyên lý thuật toán Google.",
    "Server management principles and decision-making": "Nguyên tắc quản trị máy chủ: Quản lý tiến trình, chiến lược giám sát và mở rộng.",
    "4-phase systematic debugging methodology with root cause analysis": "Phương pháp sửa lỗi hệ thống 4 pha: Phân tích nguyên nhân gốc rễ và xác minh.",
    "Tailwind CSS v4 principles. CSS-first configuration": "Nguyên lý Tailwind CSS v4: Cấu hình ưu tiên CSS, container queries và thiết kế hiện đại.",
    "Test-Driven Development workflow principles. RED-GREEN-REFACTOR": "Nguyên lý quy trình TDD: Chu trình RED-GREEN-REFACTOR (Viết test - Viết code - Tối ưu).",
    "Testing patterns and principles. Unit, integration, mocking strategies": "Mẫu và nguyên lý kiểm thử: Chiến lược Unit test, Integration test và Mocking.",
    "Advanced vulnerability analysis principles. OWASP 2025": "Nguyên lý phân tích lỗ hổng nâng cao: OWASP 2025, bảo mật chuỗi cung ứng.",
    "Review UI code for Web Interface Guidelines compliance": "Đánh giá mã nguồn UI theo tiêu chuẩn Hướng dẫn Giao diện Web (WIG).",
    "Web application testing principles. E2E, Playwright": "Nguyên lý kiểm thử ứng dụng Web: Kiểm thử cuối đầu (E2E) và audit sâu.",
    "React and Next.js performance optimization from Vercel Engineering": "Tối ưu hóa hiệu năng React và Next.js theo tiêu chuẩn kỹ thuật của Vercel.",
    "Master Rust 1.75+ with modern async patterns, advanced type system": "Làm chủ Rust 1.75+ với các mẫu async hiện đại, hệ thống kiểu dữ liệu nâng cao.",
}

def translate_to_vn(text, skill_name):
    # If already has true VN chars, return as is
    if any(c in VN_CHARS for c in text):
        return text
        
    # Check exact map (case insensitive)
    for eng, vn in TRANSLATION_MAP.items():
        if eng.lower() in text.lower():
            return vn
            
    # Pattern matching for Agency skills
    if skill_name.startswith("agency-"):
        role = skill_name.replace("agency-", "").replace("-", " ").title()
        role_map = {
            "Accessibility Auditor": "Kiểm định Tiếp cận",
            "Account Strategist": "Chiến lược Khách hàng",
            "Accounts Payable Agent": "Đại lý Thanh toán",
            "Ad Creative Strategist": "Sáng tạo Quảng cáo",
            "Ai Engineer": "Kỹ sư AI",
            "Backend Architect": "Kiến trúc sư Backend",
            "Frontend Developer": "Lập trình viên Frontend",
            "Devops Automator": "Tự động hóa DevOps",
            "Security Engineer": "Kỹ sư Bảo mật",
            "Software Architect": "Kiến trúc sư Phần mềm",
            "Ui Designer": "Thiết kế Giao diện UI",
            "Ux Architect": "Kiến trúc sư Trải nghiệm",
            "Workflow Optimizer": "Tối ưu Quy trình",
            "Technical Writer": "Viết tài liệu Kỹ thuật",
            "Content Creator": "Sáng tạo Nội dung",
            "Seo Specialist": "Chuyên gia SEO",
            "Social Media Strategist": "Chiến lược Mạng xã hội",
            "Data Engineer": "Kỹ sư Dữ liệu",
            "Product Manager": "Quản lý Sản phẩm",
            "Sprint Prioritizer": "Ưu tiên Sprint",
            "Growth Hacker": "Tăng trưởng (Growth)",
        }
        translated_role = role_map.get(role, role)
        return f"Hệ thống AI chuyên trách ({translated_role}) hỗ trợ doanh nghiệp thực hiện các nhiệm vụ chuyên sâu về {role.lower()}."

    # Pattern matching for KWP skills
    if skill_name.startswith("kwp-"):
        parts = skill_name.split('-')
        category = parts[1] if len(parts) > 1 else ""
        action = parts[-1].replace("-", " ")
        cat_map = {
            "sales": "Bán hàng",
            "marketing": "Tiếp thị",
            "product": "Sản phẩm",
            "eng": "Kỹ thuật",
            "biz": "Doanh nghiệp",
            "data": "Dữ liệu",
            "legal": "Pháp lý",
            "finance": "Tài chính",
            "hr": "Nhân sự",
            "design": "Thiết kế",
            "ops": "Vận hành",
            "productivity": "Năng suất",
            "enterprise": "Doanh nghiệp",
        }
        return f"Quy trình làm việc (KWP) cho bộ phận {cat_map.get(category, category)}: Tập trung vào {action}."

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
    if not description or not any(c in VN_CHARS for c in description):
        found_vn = False
        # Look for VN text in body
        for p in body.split('\n'):
            p = p.strip()
            # Ignore headers, tables, code blocks, short lines, and check for VN chars
            if p and not p.startswith('#') and p.count('|') < 2 and not p.startswith('```') and len(p) > 20:
                if any(c in VN_CHARS for c in p):
                    description = p
                    found_vn = True
                    break
        
        # If still no VN text, apply AI translation patterns
        if not found_vn or not any(c in VN_CHARS for c in description):
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
