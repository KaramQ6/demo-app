#!/usr/bin/env python3
"""
SmartTour.Jo Backend API Testing Suite
Comprehensive testing for all backend endpoints and functionality
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import uuid

import httpx
import websockets
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Configuration
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://b460b936-2f95-45df-a335-9461bc0b1fb5.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"
WS_BASE_URL = BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://')

# Test data
TEST_USER_EMAIL = "smarttour.test@example.com"
TEST_USER_PASSWORD = "SmartTour2025!"
TEST_USER_NAME = "Smart Tour Tester"

class BackendTester:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.auth_token = None
        self.user_id = None
        self.test_results = {}
        self.created_itinerary_id = None
        
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
        
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
    
    async def test_health_endpoints(self):
        """Test health and status endpoints"""
        print("\n🔍 Testing Health & Status Endpoints...")
        
        # Test /api/health
        try:
            response = await self.client.get(f"{API_BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") in ["healthy", "unhealthy"] and "timestamp" in data:
                    self.log_result("Health Check", True, f"Health endpoint working - Status: {data.get('status')}")
                else:
                    self.log_result("Health Check", False, "Health endpoint returned invalid format", data)
            else:
                self.log_result("Health Check", False, f"Health endpoint returned {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Health Check", False, f"Health endpoint failed with exception: {str(e)}")
        
        # Test /api/ root endpoint
        try:
            response = await self.client.get(f"{API_BASE_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_result("Root Endpoint", True, f"Root endpoint working - Version: {data.get('version')}")
                else:
                    self.log_result("Root Endpoint", False, "Root endpoint returned invalid format", data)
            else:
                self.log_result("Root Endpoint", False, f"Root endpoint returned {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Root Endpoint", False, f"Root endpoint failed with exception: {str(e)}")
    
    async def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test user registration
        try:
            # Use query parameters for registration
            params = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
                "full_name": TEST_USER_NAME
            }
            
            response = await self.client.post(f"{API_BASE_URL}/auth/register", params=params)
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and data["user"].get("email") == TEST_USER_EMAIL:
                    self.log_result("User Registration", True, "User registration successful")
                else:
                    self.log_result("User Registration", False, "Registration returned invalid format", data)
            elif response.status_code == 400 and "already registered" in response.text.lower():
                self.log_result("User Registration", True, "User already exists (expected for repeated tests)")
            else:
                self.log_result("User Registration", False, f"Registration failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Registration", False, f"Registration failed with exception: {str(e)}")
        
        # Test user login
        try:
            login_data = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            response = await self.client.post(f"{API_BASE_URL}/auth/login", data=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_result("User Login", True, f"Login successful - User ID: {self.user_id}")
                else:
                    self.log_result("User Login", False, "Login returned invalid format", data)
            else:
                self.log_result("User Login", False, f"Login failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Login", False, f"Login failed with exception: {str(e)}")
        
        # Test token validation with /auth/me
        if self.auth_token:
            try:
                headers = {"Authorization": f"Bearer {self.auth_token}"}
                response = await self.client.get(f"{API_BASE_URL}/auth/me", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if "user_id" in data and "email" in data:
                        self.log_result("Token Validation", True, f"Token validation successful - Email: {data.get('email')}")
                    else:
                        self.log_result("Token Validation", False, "Token validation returned invalid format", data)
                else:
                    self.log_result("Token Validation", False, f"Token validation failed with {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Token Validation", False, f"Token validation failed with exception: {str(e)}")
    
    async def test_user_profile(self):
        """Test user profile endpoints"""
        print("\n👤 Testing User Profile Management...")
        
        if not self.auth_token:
            self.log_result("Profile Tests", False, "No auth token available - skipping profile tests")
            return
        
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        # Test GET profile
        try:
            response = await self.client.get(f"{API_BASE_URL}/profile", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "preferences" in data:
                    self.log_result("Get Profile", True, f"Profile retrieved successfully - ID: {data.get('id')}")
                else:
                    self.log_result("Get Profile", False, "Profile returned invalid format", data)
            else:
                self.log_result("Get Profile", False, f"Get profile failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Profile", False, f"Get profile failed with exception: {str(e)}")
        
        # Test PUT profile (update)
        try:
            update_data = {
                "preferences": {
                    "interests": ["historical_sites", "nature", "adventure"],
                    "budget": "medium",
                    "travelsWith": "Family",
                    "language": "en"
                }
            }
            
            response = await self.client.put(
                f"{API_BASE_URL}/profile", 
                headers=headers,
                json=update_data
            )
            
            if response.status_code == 200:
                data = response.json()
                if "preferences" in data and data["preferences"].get("budget") == "medium":
                    self.log_result("Update Profile", True, "Profile updated successfully")
                else:
                    self.log_result("Update Profile", False, "Profile update returned invalid format", data)
            else:
                self.log_result("Update Profile", False, f"Update profile failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Update Profile", False, f"Update profile failed with exception: {str(e)}")
    
    async def test_itinerary_crud(self):
        """Test itinerary CRUD operations"""
        print("\n📋 Testing Itinerary CRUD Operations...")
        
        if not self.auth_token:
            self.log_result("Itinerary Tests", False, "No auth token available - skipping itinerary tests")
            return
        
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        
        # Test GET itineraries (initially empty)
        try:
            response = await self.client.get(f"{API_BASE_URL}/itineraries", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Itineraries", True, f"Retrieved {len(data)} itineraries")
                else:
                    self.log_result("Get Itineraries", False, "Itineraries returned invalid format", data)
            else:
                self.log_result("Get Itineraries", False, f"Get itineraries failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Itineraries", False, f"Get itineraries failed with exception: {str(e)}")
        
        # Test POST itinerary (create)
        try:
            itinerary_data = {
                "destination_id": "petra-jordan",
                "destination_name": "Petra Archaeological Park",
                "destination_type": "historical_site",
                "destination_icon": "🏛️",
                "notes": "Must visit the Treasury and Monastery",
                "status": "planned",
                "visit_date": (datetime.now() + timedelta(days=30)).isoformat(),
                "priority": 1
            }
            
            response = await self.client.post(
                f"{API_BASE_URL}/itineraries",
                headers=headers,
                json=itinerary_data
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data.get("destination_name") == "Petra Archaeological Park":
                    self.created_itinerary_id = data["id"]
                    self.log_result("Create Itinerary", True, f"Itinerary created successfully - ID: {self.created_itinerary_id}")
                else:
                    self.log_result("Create Itinerary", False, "Create itinerary returned invalid format", data)
            else:
                self.log_result("Create Itinerary", False, f"Create itinerary failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Itinerary", False, f"Create itinerary failed with exception: {str(e)}")
        
        # Test PUT itinerary (update)
        if self.created_itinerary_id:
            try:
                update_data = {
                    "notes": "Updated: Must visit the Treasury, Monastery, and Royal Tombs",
                    "status": "in_progress",
                    "priority": 2
                }
                
                response = await self.client.put(
                    f"{API_BASE_URL}/itineraries/{self.created_itinerary_id}",
                    headers=headers,
                    json=update_data
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "in_progress" and data.get("priority") == 2:
                        self.log_result("Update Itinerary", True, "Itinerary updated successfully")
                    else:
                        self.log_result("Update Itinerary", False, "Update itinerary returned invalid format", data)
                else:
                    self.log_result("Update Itinerary", False, f"Update itinerary failed with {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Update Itinerary", False, f"Update itinerary failed with exception: {str(e)}")
        
        # Test DELETE itinerary
        if self.created_itinerary_id:
            try:
                response = await self.client.delete(
                    f"{API_BASE_URL}/itineraries/{self.created_itinerary_id}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "message" in data and "deleted" in data["message"].lower():
                        self.log_result("Delete Itinerary", True, "Itinerary deleted successfully")
                    else:
                        self.log_result("Delete Itinerary", False, "Delete itinerary returned unexpected format", data)
                else:
                    self.log_result("Delete Itinerary", False, f"Delete itinerary failed with {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Delete Itinerary", False, f"Delete itinerary failed with exception: {str(e)}")
    
    async def test_weather_api(self):
        """Test weather API functionality"""
        print("\n🌤️ Testing Weather API...")
        
        # Test weather with default parameters (Amman, Jordan)
        try:
            response = await self.client.get(f"{API_BASE_URL}/weather/current")
            
            if response.status_code == 200:
                data = response.json()
                if "temperature" in data and "cityName" in data:
                    self.log_result("Weather Default", True, f"Weather data retrieved - City: {data.get('cityName')}, Temp: {data.get('temperature')}°C")
                else:
                    self.log_result("Weather Default", False, "Weather returned invalid format", data)
            else:
                self.log_result("Weather Default", False, f"Weather API failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Weather Default", False, f"Weather API failed with exception: {str(e)}")
        
        # Test weather with custom coordinates (Petra)
        try:
            params = {
                "lat": 30.3285,
                "lon": 35.4444,
                "lang": "en"
            }
            
            response = await self.client.get(f"{API_BASE_URL}/weather/current", params=params)
            
            if response.status_code == 200:
                data = response.json()
                if "temperature" in data:
                    self.log_result("Weather Custom Location", True, f"Custom location weather retrieved - Temp: {data.get('temperature')}°C")
                else:
                    self.log_result("Weather Custom Location", False, "Custom weather returned invalid format", data)
            else:
                self.log_result("Weather Custom Location", False, f"Custom weather failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Weather Custom Location", False, f"Custom weather failed with exception: {str(e)}")
    
    async def test_chat_api(self):
        """Test chat API functionality"""
        print("\n💬 Testing Chat API...")
        
        # Test chat without authentication
        try:
            chat_data = {
                "message": "What are the best places to visit in Jordan?"
            }
            
            response = await self.client.post(f"{API_BASE_URL}/chat/message", data=chat_data)
            
            if response.status_code == 200:
                data = response.json()
                if "reply" in data:
                    self.log_result("Chat Unauthenticated", True, f"Chat response received: {data.get('reply')[:100]}...")
                else:
                    self.log_result("Chat Unauthenticated", False, "Chat returned invalid format", data)
            else:
                self.log_result("Chat Unauthenticated", False, f"Chat API failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Chat Unauthenticated", False, f"Chat API failed with exception: {str(e)}")
        
        # Test chat with authentication
        if self.auth_token:
            try:
                headers = {"Authorization": f"Bearer {self.auth_token}"}
                chat_data = {
                    "message": "Recommend a 3-day itinerary for Jordan based on my preferences"
                }
                
                response = await self.client.post(f"{API_BASE_URL}/chat/message", headers=headers, data=chat_data)
                
                if response.status_code == 200:
                    data = response.json()
                    if "reply" in data:
                        self.log_result("Chat Authenticated", True, f"Authenticated chat response received: {data.get('reply')[:100]}...")
                    else:
                        self.log_result("Chat Authenticated", False, "Authenticated chat returned invalid format", data)
                else:
                    self.log_result("Chat Authenticated", False, f"Authenticated chat failed with {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Chat Authenticated", False, f"Authenticated chat failed with exception: {str(e)}")
    
    async def test_smart_itinerary(self):
        """Test smart itinerary suggestions"""
        print("\n🧠 Testing Smart Itinerary Suggestions...")
        
        # Test without authentication
        try:
            response = await self.client.post(f"{API_BASE_URL}/itinerary/suggest")
            
            if response.status_code == 200:
                data = response.json()
                if "tripPlan" in data and "details" in data["tripPlan"]:
                    self.log_result("Smart Itinerary Unauthenticated", True, f"Itinerary suggestion received: {data['tripPlan']['details'][:100]}...")
                else:
                    self.log_result("Smart Itinerary Unauthenticated", False, "Smart itinerary returned invalid format", data)
            else:
                self.log_result("Smart Itinerary Unauthenticated", False, f"Smart itinerary failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Smart Itinerary Unauthenticated", False, f"Smart itinerary failed with exception: {str(e)}")
        
        # Test with authentication
        if self.auth_token:
            try:
                headers = {"Authorization": f"Bearer {self.auth_token}"}
                response = await self.client.post(f"{API_BASE_URL}/itinerary/suggest", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if "tripPlan" in data and "details" in data["tripPlan"]:
                        self.log_result("Smart Itinerary Authenticated", True, f"Personalized itinerary suggestion received: {data['tripPlan']['details'][:100]}...")
                    else:
                        self.log_result("Smart Itinerary Authenticated", False, "Authenticated smart itinerary returned invalid format", data)
                else:
                    self.log_result("Smart Itinerary Authenticated", False, f"Authenticated smart itinerary failed with {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Smart Itinerary Authenticated", False, f"Authenticated smart itinerary failed with exception: {str(e)}")
    
    async def test_websocket(self):
        """Test WebSocket functionality"""
        print("\n🔌 Testing WebSocket Real-time Communication...")
        
        try:
            client_id = str(uuid.uuid4())
            ws_url = f"{WS_BASE_URL}/ws/{client_id}"
            
            async with websockets.connect(ws_url, timeout=10) as websocket:
                # Test echo message
                test_message = {
                    "type": "test",
                    "message": "Hello WebSocket!",
                    "timestamp": datetime.now().isoformat()
                }
                
                await websocket.send(json.dumps(test_message))
                
                # Wait for response
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                
                if response_data.get("type") == "echo" and "message" in response_data:
                    self.log_result("WebSocket Echo", True, f"WebSocket echo successful - Client ID: {client_id}")
                else:
                    self.log_result("WebSocket Echo", False, "WebSocket echo returned invalid format", response_data)
                
                # Test broadcast message
                broadcast_message = {
                    "type": "crowd_update",
                    "data": {"location": "Petra", "crowd_level": 75}
                }
                
                await websocket.send(json.dumps(broadcast_message))
                
                # Give some time for broadcast processing
                await asyncio.sleep(1)
                self.log_result("WebSocket Broadcast", True, "WebSocket broadcast message sent successfully")
                
        except asyncio.TimeoutError:
            self.log_result("WebSocket Connection", False, "WebSocket connection timed out")
        except Exception as e:
            self.log_result("WebSocket Connection", False, f"WebSocket failed with exception: {str(e)}")
    
    async def test_error_handling(self):
        """Test error handling and security"""
        print("\n🛡️ Testing Error Handling & Security...")
        
        # Test invalid endpoint
        try:
            response = await self.client.get(f"{API_BASE_URL}/nonexistent")
            if response.status_code == 404:
                self.log_result("404 Error Handling", True, "404 error properly returned for invalid endpoint")
            else:
                self.log_result("404 Error Handling", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_result("404 Error Handling", False, f"Error handling test failed: {str(e)}")
        
        # Test unauthorized access
        try:
            response = await self.client.get(f"{API_BASE_URL}/profile")
            if response.status_code == 401:
                self.log_result("Unauthorized Access", True, "401 error properly returned for unauthorized access")
            else:
                self.log_result("Unauthorized Access", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Unauthorized Access", False, f"Unauthorized test failed: {str(e)}")
        
        # Test invalid token
        try:
            headers = {"Authorization": "Bearer invalid_token_here"}
            response = await self.client.get(f"{API_BASE_URL}/profile", headers=headers)
            if response.status_code == 401:
                self.log_result("Invalid Token", True, "401 error properly returned for invalid token")
            else:
                self.log_result("Invalid Token", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Invalid Token", False, f"Invalid token test failed: {str(e)}")
        
        # Test CORS headers
        try:
            response = await self.client.options(f"{API_BASE_URL}/health")
            headers = response.headers
            if "access-control-allow-origin" in headers:
                self.log_result("CORS Headers", True, "CORS headers properly configured")
            else:
                self.log_result("CORS Headers", False, "CORS headers missing", dict(headers))
        except Exception as e:
            self.log_result("CORS Headers", False, f"CORS test failed: {str(e)}")
    
    async def test_legacy_endpoints(self):
        """Test legacy compatibility endpoints"""
        print("\n🔄 Testing Legacy Compatibility...")
        
        # Test POST /api/status
        try:
            status_data = {
                "client_name": "SmartTour.Jo Test Client"
            }
            
            response = await self.client.post(f"{API_BASE_URL}/status", json=status_data)
            
            if response.status_code == 200:
                data = response.json()
                if "client_name" in data and "timestamp" in data:
                    self.log_result("Legacy Status Create", True, "Legacy status creation successful")
                else:
                    self.log_result("Legacy Status Create", False, "Legacy status returned invalid format", data)
            else:
                self.log_result("Legacy Status Create", False, f"Legacy status failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Legacy Status Create", False, f"Legacy status failed with exception: {str(e)}")
        
        # Test GET /api/status
        try:
            response = await self.client.get(f"{API_BASE_URL}/status")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    self.log_result("Legacy Status Get", True, f"Legacy status retrieval successful - {len(data)} records")
                else:
                    self.log_result("Legacy Status Get", False, "Legacy status returned invalid format", data)
            else:
                self.log_result("Legacy Status Get", False, f"Legacy status get failed with {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Legacy Status Get", False, f"Legacy status get failed with exception: {str(e)}")
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*80)
        print("🎯 SMARTTOUR.JO BACKEND TEST SUMMARY")
        print("="*80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"   • {test_name}: {result['message']}")
        
        print("\n" + "="*80)
        
        return passed_tests, failed_tests, total_tests

async def main():
    """Main test execution"""
    print("🚀 Starting SmartTour.Jo Backend API Testing...")
    print(f"🌐 Backend URL: {BACKEND_URL}")
    print(f"🔗 API Base URL: {API_BASE_URL}")
    
    async with BackendTester() as tester:
        # Run all tests
        await tester.test_health_endpoints()
        await tester.test_authentication_flow()
        await tester.test_user_profile()
        await tester.test_itinerary_crud()
        await tester.test_weather_api()
        await tester.test_chat_api()
        await tester.test_smart_itinerary()
        await tester.test_websocket()
        await tester.test_error_handling()
        await tester.test_legacy_endpoints()
        
        # Print summary
        passed, failed, total = tester.print_summary()
        
        # Save results to file
        with open('/app/backend_test_results.json', 'w') as f:
            json.dump(tester.test_results, f, indent=2, default=str)
        
        print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
        
        return failed == 0

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)