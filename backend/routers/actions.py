from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_client import supabase

router = APIRouter()


class ActionRequest(BaseModel):
    business_id: str
    action_type: str
    description: str
    status: str = "completed"   # "completed" | "pending" | "failed"


@router.get("/actions/{business_id}")
def get_actions(business_id: str):
    """
    Returns the last 20 actions logged for a business, newest first.
    """
    try:
        result = supabase.table("actions_log") \
            .select("*") \
            .eq("business_id", business_id) \
            .order("created_at", desc=True) \
            .limit(20) \
            .execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/action-taken")
def log_action(body: ActionRequest):
    """
    Logs an action into actions_log.
    Called by AI module or n8n after an automated action is taken.
    """
    try:
        result = supabase.table("actions_log").insert({
            "business_id": body.business_id,
            "action_type": body.action_type,
            "description": body.description,
            "status": body.status,
        }).execute()
        return {"status": "logged", "action_id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))