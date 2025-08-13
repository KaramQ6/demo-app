from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import logging
import httpx
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

# Import our modules
from models import *
from auth import get_current_user, get_optional_user, authenticate_user, register_user, supabase
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuration
APP_NAME = os.getenv("APP_NAME", "SmartTour.Jo API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
N8N_WEBHOOK_BASE_URL = os.getenv("N8N_WEBHOOK_BASE_URL", "https://n8n.smart-tour.app/webhook")

# MongoDB connection (temporary - will migrate to PostgreSQL)
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ.get('DB_NAME', 'smarttour_db')]

# Configure logging
logging.basicConfig(
    level=logging.INFO if not DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan manager for database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up SmartTour.Jo API...")
    logger.info("MongoDB and Supabase connections ready")
    yield
    # Shutdown
    logger.info("Shutting down SmartTour.Jo API...")
    mongo_client.close()
    logger.info("Database connections closed")

# Create FastAPI app
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="SmartTour.Jo Mobile and Web API - Intelligent Tourism Platform for Jordan",
    lifespan=lifespan
)

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

# Health Check Routes
@api_router.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    try:
        # Test MongoDB connection
        await mongo_client.admin.command('ping')
        db_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "unhealthy"
    
    return HealthCheck(
        status="healthy" if db_status == "healthy" else "unhealthy",
        timestamp=datetime.utcnow(),
        version=APP_VERSION,
        database_status=db_status
    )

@api_router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to SmartTour.Jo API",
        "version": APP_VERSION,
        "docs": "/docs",
        "timestamp": datetime.utcnow()
    }

# Authentication Routes
@api_router.post("/auth/login")
async def login(email: str, password: str):
    """Login with email and password"""
    auth_result = await authenticate_user(email, password)
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": auth_result["session"].access_token,
        "refresh_token": auth_result["session"].refresh_token,
        "token_type": "bearer",
        "user": {
            "id": auth_result["user"].id,
            "email": auth_result["user"].email,
            "full_name": auth_result["user"].user_metadata.get("full_name")
        }
    }

@api_router.post("/auth/register")
async def register(email: str, password: str, full_name: Optional[str] = None):
    """Register a new user"""
    auth_result = await register_user(email, password, full_name)
    if not auth_result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed"
        )
    
    return {
        "message": "Registration successful",
        "user": {
            "id": auth_result["user"].id,
            "email": auth_result["user"].email,
            "full_name": auth_result["user"].user_metadata.get("full_name")
        }
    }

@api_router.get("/auth/me")
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user information"""
    return {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "user": current_user.get("user")
    }

# User Profile Routes
@api_router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get user profile and preferences"""
    try:
        # Get profile from Supabase
        profile_response = supabase.table("profiles").select("*").eq("id", current_user["user_id"]).execute()
        
        if profile_response.data:
            profile_data = profile_response.data[0]
            return UserProfileResponse(
                id=profile_data["id"],
                preferences=profile_data.get("preferences", {}),
                created_at=datetime.fromisoformat(profile_data["created_at"].replace('Z', '+00:00')),
                updated_at=datetime.fromisoformat(profile_data["updated_at"].replace('Z', '+00:00'))
            )
        else:
            # Create default profile
            default_profile = {
                "id": current_user["user_id"],
                "preferences": {"interests": [], "budget": "medium", "travelsWith": "Solo"}
            }
            supabase.table("profiles").insert(default_profile).execute()
            
            return UserProfileResponse(
                id=current_user["user_id"],
                preferences=default_profile["preferences"],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user profile")

@api_router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update user profile and preferences"""
    try:
        update_data = {
            "preferences": profile_update.preferences,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("profiles").upsert({
            "id": current_user["user_id"],
            **update_data
        }).execute()
        
        if response.data:
            profile_data = response.data[0]
            return UserProfileResponse(
                id=profile_data["id"],
                preferences=profile_data["preferences"],
                created_at=datetime.fromisoformat(profile_data["created_at"].replace('Z', '+00:00')),
                updated_at=datetime.fromisoformat(profile_data["updated_at"].replace('Z', '+00:00'))
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to update profile")
            
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="Error updating user profile")

# Itinerary Routes
@api_router.get("/itineraries", response_model=List[ItineraryResponse])
async def get_user_itineraries(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get user's itineraries"""
    try:
        response = supabase.table("itineraries").select("*").eq("user_id", current_user["user_id"]).execute()
        
        itineraries = []
        for item in response.data:
            itineraries.append(ItineraryResponse(
                id=item["id"],
                user_id=item["user_id"],
                destination_id=item["destination_id"],
                destination_name=item["destination_name"],
                destination_type=item.get("destination_type"),
                destination_icon=item.get("destination_icon"),
                notes=item.get("notes"),
                status=item["status"],
                visit_date=datetime.fromisoformat(item["visit_date"].replace('Z', '+00:00')) if item.get("visit_date") else None,
                priority=item["priority"],
                added_at=datetime.fromisoformat(item["added_at"].replace('Z', '+00:00'))
            ))
        
        return itineraries
        
    except Exception as e:
        logger.error(f"Error fetching itineraries: {e}")
        raise HTTPException(status_code=500, detail="Error fetching itineraries")

@api_router.post("/itineraries", response_model=ItineraryResponse)
async def create_itinerary(
    itinerary: ItineraryCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new itinerary item"""
    try:
        itinerary_data = {
            "user_id": current_user["user_id"],
            "destination_id": itinerary.destination_id,
            "destination_name": itinerary.destination_name,
            "destination_type": itinerary.destination_type,
            "destination_icon": itinerary.destination_icon,
            "notes": itinerary.notes,
            "status": itinerary.status,
            "visit_date": itinerary.visit_date.isoformat() if itinerary.visit_date else None,
            "priority": itinerary.priority
        }
        
        response = supabase.table("itineraries").insert(itinerary_data).execute()
        
        if response.data:
            item = response.data[0]
            return ItineraryResponse(
                id=item["id"],
                user_id=item["user_id"],
                destination_id=item["destination_id"],
                destination_name=item["destination_name"],
                destination_type=item.get("destination_type"),
                destination_icon=item.get("destination_icon"),
                notes=item.get("notes"),
                status=item["status"],
                visit_date=datetime.fromisoformat(item["visit_date"].replace('Z', '+00:00')) if item.get("visit_date") else None,
                priority=item["priority"],
                added_at=datetime.fromisoformat(item["added_at"].replace('Z', '+00:00'))
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create itinerary")
            
    except Exception as e:
        logger.error(f"Error creating itinerary: {e}")
        raise HTTPException(status_code=500, detail="Error creating itinerary")

@api_router.put("/itineraries/{itinerary_id}", response_model=ItineraryResponse)
async def update_itinerary(
    itinerary_id: str,
    itinerary_update: ItineraryUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update an itinerary item"""
    try:
        # Check if itinerary belongs to user
        existing = supabase.table("itineraries").select("*").eq("id", itinerary_id).eq("user_id", current_user["user_id"]).execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Itinerary not found")
        
        update_data = {}
        if itinerary_update.destination_name is not None:
            update_data["destination_name"] = itinerary_update.destination_name
        if itinerary_update.destination_type is not None:
            update_data["destination_type"] = itinerary_update.destination_type
        if itinerary_update.destination_icon is not None:
            update_data["destination_icon"] = itinerary_update.destination_icon
        if itinerary_update.notes is not None:
            update_data["notes"] = itinerary_update.notes
        if itinerary_update.status is not None:
            update_data["status"] = itinerary_update.status
        if itinerary_update.visit_date is not None:
            update_data["visit_date"] = itinerary_update.visit_date.isoformat()
        if itinerary_update.priority is not None:
            update_data["priority"] = itinerary_update.priority
        
        response = supabase.table("itineraries").update(update_data).eq("id", itinerary_id).execute()
        
        if response.data:
            item = response.data[0]
            return ItineraryResponse(
                id=item["id"],
                user_id=item["user_id"],
                destination_id=item["destination_id"],
                destination_name=item["destination_name"],
                destination_type=item.get("destination_type"),
                destination_icon=item.get("destination_icon"),
                notes=item.get("notes"),
                status=item["status"],
                visit_date=datetime.fromisoformat(item["visit_date"].replace('Z', '+00:00')) if item.get("visit_date") else None,
                priority=item["priority"],
                added_at=datetime.fromisoformat(item["added_at"].replace('Z', '+00:00'))
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to update itinerary")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating itinerary: {e}")
        raise HTTPException(status_code=500, detail="Error updating itinerary")

@api_router.delete("/itineraries/{itinerary_id}")
async def delete_itinerary(
    itinerary_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete an itinerary item"""
    try:
        response = supabase.table("itineraries").delete().eq("id", itinerary_id).eq("user_id", current_user["user_id"]).execute()
        
        if response.data:
            return {"message": "Itinerary deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Itinerary not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting itinerary: {e}")
        raise HTTPException(status_code=500, detail="Error deleting itinerary")

# Weather Data Routes
@api_router.get("/weather/current")
async def get_current_weather(
    lat: float = 31.9539,
    lon: float = 35.9106,
    lang: str = "en"
):
    """Get current weather data"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{N8N_WEBHOOK_BASE_URL}/Simple-Weather-API-Live-Data",
                json={
                    "lat": lat,
                    "lon": lon,
                    "cityName": "User Location",
                    "lang": lang
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                # Return fallback data
                return {
                    "temperature": 25,
                    "cityName": "Amman",
                    "description": "Clear sky" if lang == "en" else "سماء صافية",
                    "humidity": 50,
                    "wind_speed": 5,
                    "source": "fallback"
                }
                
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        return {
            "temperature": 25,
            "cityName": "Amman", 
            "description": "Clear sky" if lang == "en" else "سماء صافية",
            "humidity": 50,
            "wind_speed": 5,
            "source": "fallback"
        }

# Chat/AI Routes
@api_router.post("/chat/message")
async def send_chat_message(
    message: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Send message to AI chatbot"""
    try:
        # Get user preferences if authenticated
        preferences = {}
        if current_user:
            try:
                profile_response = supabase.table("profiles").select("preferences").eq("id", current_user["user_id"]).execute()
                if profile_response.data:
                    preferences = profile_response.data[0].get("preferences", {})
            except:
                pass
        
        session_id = f"session_{datetime.utcnow().timestamp()}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{N8N_WEBHOOK_BASE_URL}/gemini-tour-chat",
                json={
                    "message": message,
                    "sessionId": session_id,
                    "preferences": preferences,
                    "language": "en",
                    "location": None,
                    "liveData": None
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "reply": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
                    "status": "error"
                }
                
    except Exception as e:
        logger.error(f"Error processing chat message: {e}")
        return {
            "reply": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
            "status": "error"
        }

# Smart Itinerary Routes
@api_router.post("/itinerary/suggest")
async def suggest_itinerary(
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Get AI-suggested itinerary based on user preferences"""
    try:
        # Get user preferences if authenticated
        preferences = {"interests": [], "budget": "medium", "travelsWith": "Solo"}
        user_data = None
        
        if current_user:
            try:
                profile_response = supabase.table("profiles").select("preferences").eq("id", current_user["user_id"]).execute()
                if profile_response.data:
                    preferences = profile_response.data[0].get("preferences", preferences)
                user_data = {"email": current_user["email"]}
            except:
                pass
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{N8N_WEBHOOK_BASE_URL}/Smart-Itinerary-Planner",
                json={
                    "preferences": preferences,
                    "user": user_data,
                    "language": "en",
                    "location": {"lat": 31.9539, "lon": 35.9106},
                    "liveData": None
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                # Return fallback itinerary
                return {
                    "tripPlan": {
                        "details": "Suggested Jordan Travel Plan:\n\n🌅 Day 1: Visit Downtown Amman, Explore Amman Citadel, Dinner at Rainbow Street\n\n🏛️ Day 2: Trip to Jerash Roman ruins, Visit Ajloun Castle\n\n🏖️ Day 3: Dead Sea excursion, Natural mud therapy\n\n💎 Day 4: Travel to Petra, Explore the Rose City\n\n🌵 Day 5: Wadi Rum desert adventure"
                    },
                    "crowdLevel": 45,
                    "planModified": "false",
                    "source": "fallback"
                }
                
    except Exception as e:
        logger.error(f"Error generating suggested itinerary: {e}")
        return {
            "tripPlan": {
                "details": "Suggested Jordan Travel Plan:\n\n🌅 Day 1: Visit Downtown Amman, Explore Amman Citadel, Dinner at Rainbow Street\n\n🏛️ Day 2: Trip to Jerash Roman ruins, Visit Ajloun Castle\n\n🏖️ Day 3: Dead Sea excursion, Natural mud therapy\n\n💎 Day 4: Travel to Petra, Explore the Rose City\n\n🌵 Day 5: Wadi Rum desert adventure"
            },
            "crowdLevel": 45,
            "planModified": "false",
            "source": "fallback"
        }

# WebSocket Route for Real-time Features
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time communication"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle different message types
            if message_data.get("type") == "crowd_update":
                # Broadcast crowd update to all clients
                await manager.broadcast(json.dumps({
                    "type": "crowd_update",
                    "data": message_data.get("data"),
                    "timestamp": datetime.utcnow().isoformat()
                }))
            elif message_data.get("type") == "weather_update":
                # Broadcast weather update
                await manager.broadcast(json.dumps({
                    "type": "weather_update", 
                    "data": message_data.get("data"),
                    "timestamp": datetime.utcnow().isoformat()
                }))
            else:
                # Echo back to sender
                await manager.send_personal_message(json.dumps({
                    "type": "echo",
                    "message": f"Message received: {data}",
                    "client_id": client_id,
                    "timestamp": datetime.utcnow().isoformat()
                }), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"Client {client_id} disconnected")

# Legacy compatibility routes
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Legacy status check endpoint for backward compatibility"""
    return StatusCheck(
        client_name=input.client_name,
        timestamp=datetime.utcnow()
    )

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Legacy status check endpoint for backward compatibility"""
    return [
        StatusCheck(
            client_name="SmartTour.Jo API",
            timestamp=datetime.utcnow()
        )
    ]

# Include router in main app
app.include_router(api_router)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": "internal_error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=DEBUG,
        log_level="info"
    )