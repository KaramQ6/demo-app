#!/usr/bin/env python3
"""
Focused test for itinerary operations to debug the issue
"""

import asyncio
import json
import os
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Configuration
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://smarttour-hybrid.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

# Test data
TEST_USER_EMAIL = "smarttour.test@example.com"
TEST_USER_PASSWORD = "SmartTour2025!"

async def test_itinerary_operations():
    """Test itinerary operations with detailed logging"""
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("🔐 Logging in...")
        
        # Login first
        params = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = await client.post(f"{API_BASE_URL}/auth/login", params=params)
        
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return
        
        data = response.json()
        auth_token = data["access_token"]
        user_id = data["user"]["id"]
        
        print(f"✅ Login successful - User ID: {user_id}")
        
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Test GET itineraries
        print("\n📋 Testing GET itineraries...")
        response = await client.get(f"{API_BASE_URL}/itineraries", headers=headers)
        print(f"GET /itineraries - Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Response: {response.text}")
        else:
            data = response.json()
            print(f"Retrieved {len(data)} itineraries")
        
        # Test POST itinerary (create)
        print("\n📋 Testing POST itinerary...")
        itinerary_data = {
            "destination_id": "petra-jordan-test",
            "destination_name": "Petra Archaeological Park",
            "destination_type": "historical_site",
            "destination_icon": "🏛️",
            "notes": "Must visit the Treasury and Monastery",
            "status": "planned",
            "visit_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "priority": 1
        }
        
        print(f"Sending data: {json.dumps(itinerary_data, indent=2)}")
        
        response = await client.post(
            f"{API_BASE_URL}/itineraries",
            headers=headers,
            json=itinerary_data
        )
        
        print(f"POST /itineraries - Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            created_data = response.json()
            print(f"✅ Itinerary created successfully - ID: {created_data.get('id')}")
        else:
            print(f"❌ Itinerary creation failed")

if __name__ == "__main__":
    asyncio.run(test_itinerary_operations())