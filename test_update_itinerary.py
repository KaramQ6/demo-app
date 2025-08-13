#!/usr/bin/env python3
"""
Test update itinerary operation specifically
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

async def test_update_itinerary():
    """Test itinerary update operation"""
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
        
        # First create an itinerary
        print("\n📋 Creating itinerary...")
        itinerary_data = {
            "destination_id": "test-update-dest",
            "destination_name": "Test Update Destination",
            "status": "planned",
            "priority": 1
        }
        
        response = await client.post(
            f"{API_BASE_URL}/itineraries",
            headers=headers,
            json=itinerary_data
        )
        
        if response.status_code != 200:
            print(f"❌ Create failed: {response.status_code} - {response.text}")
            return
        
        created_data = response.json()
        itinerary_id = created_data["id"]
        print(f"✅ Created itinerary ID: {itinerary_id}")
        
        # Now test update
        print("\n📋 Testing update...")
        update_data = {
            "notes": "Updated notes",
            "status": "in_progress",
            "priority": 2
        }
        
        response = await client.put(
            f"{API_BASE_URL}/itineraries/{itinerary_id}",
            headers=headers,
            json=update_data
        )
        
        print(f"PUT /itineraries/{itinerary_id} - Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Clean up
        print("\n🗑️ Cleaning up...")
        response = await client.delete(
            f"{API_BASE_URL}/itineraries/{itinerary_id}",
            headers=headers
        )
        print(f"Delete status: {response.status_code}")

if __name__ == "__main__":
    asyncio.run(test_update_itinerary())