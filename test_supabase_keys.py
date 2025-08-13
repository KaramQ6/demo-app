#!/usr/bin/env python3
"""
Test Supabase keys directly
"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('/app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("🔍 Testing Supabase Keys...")
print(f"URL: {SUPABASE_URL}")
print(f"Anon Key: {SUPABASE_ANON_KEY[:20]}..." if SUPABASE_ANON_KEY else "None")
print(f"Service Role Key: {SUPABASE_SERVICE_ROLE_KEY[:20]}..." if SUPABASE_SERVICE_ROLE_KEY else "None")

# Test anon key
print("\n🔑 Testing Anon Key...")
try:
    supabase_anon = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    response = supabase_anon.table("profiles").select("*").limit(1).execute()
    print(f"✅ Anon key works - Response: {len(response.data)} records")
except Exception as e:
    print(f"❌ Anon key failed: {str(e)}")

# Test service role key
print("\n🔑 Testing Service Role Key...")
try:
    supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    response = supabase_admin.table("profiles").select("*").limit(1).execute()
    print(f"✅ Service role key works - Response: {len(response.data)} records")
except Exception as e:
    print(f"❌ Service role key failed: {str(e)}")

# Test creating a record with service role key
print("\n📝 Testing Create Operation with Service Role Key...")
try:
    test_data = {
        "id": "test-profile-123",
        "preferences": {"test": True}
    }
    
    response = supabase_admin.table("profiles").insert(test_data).execute()
    print(f"✅ Create operation works - Response: {response.data}")
    
    # Clean up
    supabase_admin.table("profiles").delete().eq("id", "test-profile-123").execute()
    print("🧹 Test record cleaned up")
    
except Exception as e:
    print(f"❌ Create operation failed: {str(e)}")