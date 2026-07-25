import os
from dotenv import load_dotenv
from supabase import create_client, Client
from playwright.sync_api import sync_playwright

# 1. Initialize Secure Credentials
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def run_fun_run_watcher():
    print("📊 Fetching target URLs from database...")
    
    # 2. Fetch Data Payload
    try:
        response = supabase.table("watched_events").select("*").execute()
        events = response.data
    except Exception as e:
        print("Defect detected in database connection:", e)
        return

    if not events:
        print("No events found in the database pipeline.")
        return

    # 3. Spin up the automation engine
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 4. Loop through each event and capture proof
        for event in events:
            target = event['target_url']
            platform = event['platform']
            # Format the event name to remove spaces for clean file saving
            name = event['event_name'].replace(" ", "_")

            print(f"🚀 Navigating to {platform}: {name}")
            page.goto(target)
            page.wait_for_load_state("networkidle")

            # Utilize metadata tags for dynamic naming
            filename = f"{platform}_{name}_proof.png"
            page.screenshot(path=filename)
            print(f"✅ Visual proof captured: {filename}")

        browser.close()
        print("🏁 All target runs processed successfully.")

if __name__ == "__main__":
    run_fun_run_watcher()