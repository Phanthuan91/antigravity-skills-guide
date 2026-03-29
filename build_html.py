import json
import os

JSON_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"
TEMPLATE_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\index.html"

def generate_row(skill):
    # Meta label based on name or category
    meta = "Core"
    if skill['name'].startswith('agency-'): meta = "Agent"
    elif skill['name'].startswith('kwp-'): meta = "Plugin"
    
    return f"""
        <div class="data-row" id="skill-{skill['name']}">
          <div class="col-label"><code>{skill['name']}</code></div>
          <div class="col-meta">{meta}</div>
          <div class="col-value">{skill['description']}</div>
        </div>"""

def main():
    if not os.path.exists(JSON_FILE):
        print("JSON file not found.")
        return

    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        skills = json.load(f)

    # Categories
    agencies = [s for s in skills if s['category'] == 'agencies']
    kwp_sales = [s for s in skills if s['category'] == 'kwp-sales']
    kwp_marketing = [s for s in skills if s['category'] == 'kwp-marketing']
    kwp_eng = [s for s in skills if s['category'] == 'kwp-eng']
    kwp_biz = [s for s in skills if s['category'] == 'kwp-biz']
    kwp_product = [s for s in skills if s['category'] == 'kwp-product']
    tech = [s for s in skills if s['category'] == 'tech']
    awf = [s for s in skills if s['category'] == 'awf']

    # New: Recursive scan SOPs
    sop_dir = r"D:\brain\sops"
    sops = []
    if os.path.exists(sop_dir):
        for root, dirs, files in os.walk(sop_dir):
            for file in files:
                if file.endswith(".md"):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, sop_dir)
                    sops.append({
                        "name": rel_path.replace(".md", "").replace("\\", "/"),
                        "path": full_path,
                        "description": f"Quy trình vận hành chuẩn cho {rel_path.replace('.md', '').replace('\\', '/')}"
                    })

    print(f"Total skills: {len(skills)}")
    print(f"SOPs found: {len(sops)}")

    # Generate Sections
    def make_section(title, id_name, skill_list, is_sop=False):
        if not skill_list: return ""
        
        header = f'    <section class="content-section js-section hidden-section" id="{id_name}">\n'
        header += f'      <h2 class="section-title">{title} ({len(skill_list)})</h2>\n'
        header += '      <div class="data-table-wrap">\n'
        header += '        <div class="data-table-header">\n'
        header += f'          <div>{"Tên Quy trình" if is_sop else "Skill ID / Name"}</div>\n'
        header += '          <div>Loại</div>\n'
        header += f'          <div>{"Mô tả quy trình" if is_sop else "Mô tả chức năng"}</div>\n'
        header += '        </div>\n'
        
        if is_sop:
            rows = ""
            for sop in skill_list:
                rows += f"""
        <div class="data-row" id="sop-{sop['name']}">
          <div class="col-label"><a href="file:///{sop['path'].replace('\\', '/')}" target="_blank"><code>{sop['name']}</code></a></div>
          <div class="col-meta">SOP</div>
          <div class="col-value">{sop['description']}</div>
        </div>"""
        else:
            rows = "".join([generate_row(s) for s in skill_list])
            
        return header + rows + "\n      </div>\n    </section>"

    # Load Slash Commands
    core_commands = []
    try:
        with open(r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\commands_data.json", 'r', encoding='utf-8') as f:
            core_commands = json.load(f)
    except Exception as e:
        print(f"Error loading core commands: {e}")

    # Sidebar Nav
    sidebar_nav = f"""
      <div class="nav-label">Bắt đầu</div>
      <a href="#hero" class="nav-link active" id="nav-hero">Tổng quan</a>
      <a href="#features" class="nav-link" id="nav-features">Tính năng nổi bật</a>
      <a href="#guide" class="nav-link" id="nav-guide">Cẩm nang vận hành</a>
      
      <div class="nav-label">Quy chuẩn SOP</div>
      <a href="#sop-library" class="nav-link" id="nav-sop-library" style="color:var(--primary); font-weight:600">Thư viện SOP</a>
      <a href="#slash-commands" class="nav-link" id="nav-slash-commands">Danh mục Lệnh (/)</a>
      
      <div class="automation-status">
        <div class="pulse-dot"></div>
        <span>Chế độ Kích hoạt tự động</span>
      </div>
      
      <div class="nav-label">Chuyên Gia & Quy Trình</div>
      <a href="#agencies" class="nav-link" id="nav-agencies">Chuyên Gia AI</a>
      
      <div class="nav-label">Tiện Ích KWP (Plugins)</div>
      <a href="#kwp-sales" class="nav-link" id="nav-kwp-sales">Bán Hàng & Tiếp Cận</a>
      <a href="#kwp-marketing" class="nav-link" id="nav-kwp-marketing">Marketing & Tăng Trưởng</a>
      <a href="#kwp-product" class="nav-link" id="nav-kwp-product">Sản Phẩm & Lộ Trình</a>
      <a href="#kwp-eng" class="nav-link" id="nav-kwp-eng">Dữ Liệu & Kỹ Thuật</a>
      <a href="#kwp-biz" class="nav-link" id="nav-kwp-biz">Kinh Doanh & Vận Hành</a>
      
      <div class="nav-label">Lõi & Hệ Thống</div>
      <a href="#tech" class="nav-link" id="nav-tech">Mẫu Kỹ Thuật</a>
      <a href="#awf" class="nav-link" id="nav-awf">Quy Trình AWF</a>
    """

    # Build Final HTML
    def generate_cmd_row(cmd):
        return f"""
        <div class="data-row" id="command-{cmd['name'].replace('/', '')}">
          <div class="col-label"><code style="background:var(--primary-light); color:var(--primary)">{cmd['name']}</code></div>
          <div class="col-meta">Command</div>
          <div class="col-value"><strong>{cmd['description'].split(',')[0]}</strong><br><span style="font-size:12px; color:var(--text-dim)">{cmd['description']}</span></div>
        </div>"""

    def make_command_section(title, id_name, cmd_list):
        header = f'    <section class="content-section js-section hidden-section" id="{id_name}">\n'
        header += f'      <h2 class="section-title">{title} ({len(cmd_list)})</h2>\n'
        header += '      <div class="data-table-wrap">\n'
        header += '        <div class="data-table-header">\n'
        header += '          <div>Lệnh / Phím tắt</div>\n'
        header += '          <div>Loại</div>\n'
        header += '          <div>Chức năng và cách dùng</div>\n'
        header += '        </div>\n'
        rows = "".join([generate_cmd_row(c) for c in cmd_list])
        return header + rows + "\n      </div>\n    </section>"

    sections_html = (
        make_section("Thư viện Quy trình vận hành (SOP)", "sop-library", sops, is_sop=True) +
        make_command_section("Danh Sách Lệnh Nhanh (/)", "slash-commands", core_commands) +
        make_section("Hệ Thống Chuyên Gia AI (Personas)", "agencies", agencies) +
        make_section("KWP: Bán Hàng & Tiếp Cận", "kwp-sales", kwp_sales) +
        make_section("KWP: Marketing & Tăng Trưởng", "kwp-marketing", kwp_marketing) +
        make_section("KWP: Sản Phẩm & Lộ Trình", "kwp-product", kwp_product) +
        make_section("KWP: Dữ Liệu & Kỹ Thuật", "kwp-eng", kwp_eng) +
        make_section("KWP: Kinh Doanh & Vận Hành", "kwp-biz", kwp_biz) +
        make_section("Mẫu Kỹ Thuật (Engineering Patterns)", "tech", tech) +
        make_section("Quy Trình Nội Bộ AWF", "awf", awf)
    )

    with open(r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\generated_content.html", "w", encoding='utf-8') as f:
        f.write(sections_html)
    
    with open(r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\generated_nav.html", "w", encoding='utf-8') as f:
        f.write(sidebar_nav)

    print("Generated content and nav snippets with SOPs and Slash Commands.")

if __name__ == "__main__":
    main()
