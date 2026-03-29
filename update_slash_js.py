import json

JSON_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\skills_data.json"
JS_FILE = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\app.js"

def main():
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        skills = json.load(f)

    commands = []
    # Add core commands from commands_data.json
    try:
        with open(r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide\commands_data.json", 'r', encoding='utf-8') as f:
            core_commands = json.load(f)
            for cmd in core_commands:
                commands.append({
                    "name": cmd['name'],
                    "desc": cmd['description'],
                    "id": "slash-commands" # Point to the new section
                })
    except Exception as e:
        print(f"Error loading core commands: {e}")

    for s in skills:
        commands.append({
            "name": "/" + s['name'],
            "desc": s['description'][:60] + ("..." if len(s['description']) > 60 else ""),
            "id": "skill-" + s['name']
        })

    js_content = json.dumps(commands, indent=2, ensure_ascii=False)

    with open(JS_FILE, 'r', encoding='utf-8') as f:
        app_js = f.read()

    start_marker = "const SLASH_COMMANDS = ["
    end_marker = "]; // END_SLASH_COMMANDS"

    start_idx = app_js.find(start_marker)
    # Tìm end_marker sau start_marker
    end_idx = app_js.find(end_marker, start_idx)

    if start_idx != -1 and end_idx != -1:
        # Giữ lại start_marker và end_marker
        new_js = app_js[:start_idx + len(start_marker)] + "\n" + js_content.strip("[]") + "\n" + app_js[end_idx:]
        with open(JS_FILE, 'w', encoding='utf-8') as f:
            f.write(new_js)
        print(f"Updated SLASH_COMMANDS in app.js with {len(commands)} items.")
    else:
        print("Markers not found in app.js")

if __name__ == "__main__":
    main()
