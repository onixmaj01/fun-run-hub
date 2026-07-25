import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Initialize environment variables from the .env file
load_dotenv()

# Retrieve credentials securely
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Establish the client connection
supabase: Client = create_client(url, key)

# Execute test query against the target table
try:
    response = supabase.table("watched_events").select("*").execute()
    print("Database connection operational! 📊")
    print("Retrieved Data:", response.data)
except Exception as e:
    print("Defect detected in connection:", e)