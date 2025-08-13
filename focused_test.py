#!/usr/bin/env python3
"""
Focused test for itinerary operations to debug the issue
"""

import asyncio
import json
import os
import httpx
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
    """Test itinerary operations with detailed error logging"""
    
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
        try:
            response = await client.get(f"{API_BASE_URL}/itineraries", headers=headers)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ GET itineraries successful - Found {len(data)} items")
            else:
                print(f"❌ GET itineraries failed")
                
        except Exception as e:
            print(f"❌ GET itineraries exception: {str(e)}")
        
        # Test POST itinerary (create)
        print("\n📝 Testing POST itinerary...")
        try:
            itinerary_data = {
                "destination_id": "test-destination-123",
                "destination_name": "Test Destination",
                "destination_type": "historical_site",
                "destination_icon": "🏛️",
                "notes": "Test itinerary creation",
                "status": "planned",
                "priority": 1
            }
            
            response = await client.post(
                f"{API_BASE_URL}/itineraries",
                headers=headers,
                json=itinerary_data
            )
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ POST itinerary successful - ID: {data.get('id')}")
                return data.get('id')
            else:
                print(f"❌ POST itinerary failed")
                
        except Exception as e:
            print(f"❌ POST itinerary exception: {str(e)}")
        
        return None

if __name__ == "__main__":
    asyncio.run(test_itinerary_operations())