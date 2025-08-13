import os
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([SUPABASE_URL, SUPABASE_ANON_KEY]):
    raise ValueError("Supabase configuration is missing")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer token scheme
security = HTTPBearer()

class AuthHandler:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def encode_token(self, user_id: str, email: str) -> str:
        payload = {
            'exp': datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
            'iat': datetime.utcnow(),
            'sub': user_id,
            'email': email
        }
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Token expired'
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid token'
            )

auth_handler = AuthHandler()

async def verify_supabase_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Verify Supabase JWT token and return user information
    """
    try:
        token = credentials.credentials
        
        # Try to verify with Supabase first
        try:
            user_response = supabase.auth.get_user(token)
            if user_response.user:
                return {
                    "user_id": user_response.user.id,
                    "email": user_response.user.email,
                    "user": user_response.user
                }
        except Exception as supabase_error:
            # If Supabase verification fails, try local JWT verification
            payload = auth_handler.decode_token(token)
            return {
                "user_id": payload.get("sub"),
                "email": payload.get("email"),
                "user": None
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(auth_data: Dict[str, Any] = Depends(verify_supabase_token)) -> Dict[str, Any]:
    """
    Get current user from authentication data
    """
    if not auth_data.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return auth_data

async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[Dict[str, Any]]:
    """
    Get current user but don't require authentication (optional)
    """
    if not credentials:
        return None
        
    try:
        return await verify_supabase_token(credentials)
    except HTTPException:
        return None

# Utility functions
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Authenticate user with email and password using Supabase
    """
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if auth_response.user:
            return {
                "user": auth_response.user,
                "session": auth_response.session
            }
    except Exception as e:
        return None
    
    return None

async def register_user(email: str, password: str, full_name: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Register a new user using Supabase
    """
    try:
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "full_name": full_name
                }
            }
        })
        
        if auth_response.user:
            return {
                "user": auth_response.user,
                "session": auth_response.session
            }
    except Exception as e:
        return None
    
    return None