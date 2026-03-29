import os
import time
import subprocess
from datetime import datetime

# Paths
SKILLS_DIR = r"C:\Users\Phan Thuan\.gemini\antigravity\skills"
PROJECT_DIR = r"C:\Users\Phan Thuan\.gemini\antigravity\skills-guide"

def get_latest_mtime(directory):
    latest_mtime = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                mtime = os.path.getmtime(os.path.join(root, file))
                if mtime > latest_mtime:
                    latest_mtime = mtime
    return latest_mtime

def rebuild():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Detected changes. Triggering rebuild...")
    try:
        # Step 1: Extract
        subprocess.run(["python", "extract_skills.py"], cwd=PROJECT_DIR, check=True)
        # Step 2: Build
        subprocess.run(["python", "build_html.py"], cwd=PROJECT_DIR, check=True)
        # Step 3: Inject
        subprocess.run(["python", "inject_html.py"], cwd=PROJECT_DIR, check=True)
        # Step 4: Sync to GitHub (optional but useful for Vercel)
        subprocess.run(["git", "add", "."], cwd=PROJECT_DIR, check=True)
        subprocess.run(["git", "commit", "-m", "auto-sync: contextual update"], cwd=PROJECT_DIR, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=PROJECT_DIR, check=True)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Sync complete!")
    except Exception as e:
        print(f"Error during rebuild: {e}")

def main():
    print("--- ANTIGRAVITY CONTEXTUAL AUTOMATION MODE ACTIVATED ---")
    print(f"Watching: {SKILLS_DIR}")
    print("Press Ctrl+C to stop.")
    
    last_mtime = get_latest_mtime(SKILLS_DIR)
    
    while True:
        try:
            current_mtime = get_latest_mtime(SKILLS_DIR)
            if current_mtime > last_mtime:
                rebuild()
                last_mtime = current_mtime
            time.sleep(3)
        except KeyboardInterrupt:
            print("\nAutomation mode stopped.")
            break
        except Exception as e:
            print(f"Watcher error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
