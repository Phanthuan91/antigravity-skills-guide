import json
import os
import re

JSON_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"
APP_JS = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\app.js"

def main():
    if not os.path.exists(JSON_FILE):
        return

    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        skills = json.load(f)

    # Base commands from original app.js or system
    base_commands = [
        {"name": "/orchestrate", "desc": "Điều phối đa chuyên gia", "id": "commands"},
        {"name": "/ui-ux-pro-max", "desc": "Thiết kế UI chuyên nghiệp", "id": "commands"},
        {"name": "/create", "desc": "Xây dựng ứng dụng hoàn chỉnh", "id": "commands"},
        {"name": "/init", "desc": "Khởi tạo dự án mới", "id": "hero"},
        {"name": "/plan", "desc": "Lập kế hoạch tính năng", "id": "hero"},
        {"name": "/design", "desc": "Thiết kế hệ thống", "id": "hero"},
        {"name": "/code", "desc": "Viết mã nguồn chuyên sâu", "id": "hero"},
        {"name": "/run", "desc": "Chạy ứng dụng & Kiểm thử", "id": "hero"},
        {"name": "/debug", "desc": "Sửa lỗi hệ thống", "id": "hero"},
        {"name": "/test", "desc": "Kiểm thử đơn vị & E2E", "id": "hero"},
        {"name": "/audit", "desc": "Kiểm tra bảo mật", "id": "hero"},
        {"name": "/deploy", "desc": "Triển khai Production", "id": "hero"}
    ]

    # Add all 238 skills
    for s in skills:
        # Avoid duplicates with base commands
        if any(bc['name'] == '/'+s['name'] or bc['name'] == s['name'] for bc in base_commands):
            continue
            
        # Map category to ID
        target_id = "agencies"
        if s['category'].startswith('kwp-'):
            target_id = s['category']
        elif s['category'] == 'other':
            target_id = "tech"
            if s['name'].startswith('awf-'): target_id = "awf"

        base_commands.append({
            "name": "/" + s['name'],
            "desc": s['description'][:60] + "...",
            "id": target_id
        })

    # Read app.js
    with open(APP_JS, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace SLASH_COMMANDS array
    js_array = json.dumps(base_commands, ensure_ascii=False, indent=2)
    new_content = re.sub(r'const SLASH_COMMANDS = \[.*?\];', f'const SLASH_COMMANDS = {js_array};', content, flags=re.DOTALL)

    with open(APP_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated app.js with {len(base_commands)} commands.")

if __name__ == "__main__":
    main()
