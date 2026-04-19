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
    try:
        res = supabase.table("actions") \
            .select("*") \
            .eq("business_id", business_id) \
            .execute()

        return {
            "actions": res.data or []
        }

    except Exception as e:
        return {
            "actions": [],
            "error": str(e)
        }
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