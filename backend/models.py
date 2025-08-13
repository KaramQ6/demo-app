from sqlalchemy import Column, String, DateTime, Text, JSON, Integer, Boolean, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

Base = declarative_base()

# SQLAlchemy Models (Database Tables)
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    profiles = relationship("UserProfile", back_populates="user")
    itineraries = relationship("Itinerary", back_populates="user")
    destinations = relationship("UserDestination", back_populates="user")

class UserProfile(Base):
    __tablename__ = "profiles"
    
    id = Column(String, primary_key=True)
    preferences = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Key
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="profiles")

class Itinerary(Base):
    __tablename__ = "itineraries"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    destination_id = Column(String, nullable=False)
    destination_name = Column(String, nullable=False)
    destination_type = Column(String, nullable=True)
    destination_icon = Column(String, nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    status = Column(String, default="planned")  # planned, visited, cancelled
    visit_date = Column(DateTime, nullable=True)
    priority = Column(Integer, default=1)
    
    # Relationships
    user = relationship("User", back_populates="itineraries")

class Destination(Base):
    __tablename__ = "destinations"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    name_ar = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    category = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    rating = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user_destinations = relationship("UserDestination", back_populates="destination")

class UserDestination(Base):
    __tablename__ = "user_destinations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=False)
    visited = Column(Boolean, default=False)
    rating = Column(Integer, nullable=True)
    review = Column(Text, nullable=True)
    visit_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="destinations")
    destination = relationship("Destination", back_populates="user_destinations")

class WeatherData(Base):
    __tablename__ = "weather_data"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    city_name = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    description = Column(String, nullable=True)
    wind_speed = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String, default="api")

# Pydantic Models (API Schemas)
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileBase(BaseModel):
    preferences: Dict[str, Any] = {}

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ItineraryBase(BaseModel):
    destination_id: str
    destination_name: str
    destination_type: Optional[str] = None
    destination_icon: Optional[str] = None
    notes: Optional[str] = None
    status: str = "planned"
    visit_date: Optional[datetime] = None
    priority: int = 1

class ItineraryCreate(ItineraryBase):
    pass

class ItineraryUpdate(BaseModel):
    destination_name: Optional[str] = None
    destination_type: Optional[str] = None
    destination_icon: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    visit_date: Optional[datetime] = None
    priority: Optional[int] = None

class ItineraryResponse(ItineraryBase):
    id: str
    user_id: str
    added_at: datetime
    
    class Config:
        from_attributes = True

class DestinationBase(BaseModel):
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    latitude: float
    longitude: float
    category: Optional[str] = None
    image_url: Optional[str] = None
    rating: float = 0.0

class DestinationCreate(DestinationBase):
    id: str

class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None  
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None

class DestinationResponse(DestinationBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class WeatherResponse(BaseModel):
    id: str
    city_name: str
    temperature: float
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    description: Optional[str] = None
    wind_speed: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    recorded_at: datetime
    source: str
    
    class Config:
        from_attributes = True

# Status and Health Check Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str
    database_status: str