from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from services.supabase_client import supabase

router = APIRouter()


class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(body: SignupRequest):
    """
    Creates a new user with email + password via Supabase Auth.
    Returns session token on success.
    """
    try:
        response = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password,
        })
        if response.user is None:
            raise HTTPException(status_code=400, detail="Signup failed")
        return {
            "user_id": response.user.id,
            "email": response.user.email,
            "access_token": response.session.access_token if response.session else None,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(body: LoginRequest):
    """
    Logs in with email + password via Supabase Auth.
    Returns session token.
    """
    try:
        response = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password,
        })
        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {
            "user_id": response.user.id,
            "email": response.user.email,
            "access_token": response.session.access_token,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/google")
def google_oauth():
    """
    Returns the Supabase Google OAuth redirect URL.
    Frontend should redirect the user to this URL.
    """
    try:
        response = supabase.auth.sign_in_with_oauth({"provider": "google"})
        return {"redirect_url": response.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me")
def get_current_user(authorization: str = Header(...)):
    """
    Returns current user details from a Bearer token.
    Header format: Authorization: Bearer <access_token>
    """
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        if user is None or user.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return {
            "user_id": user.user.id,
            "email": user.user.email,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))