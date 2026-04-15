from fastapi import APIRouter, HTTPException
from models.risk import RiskSaveRequest
from services.supabase_client import supabase
from services.n8n_trigger import trigger_risk_alert_webhook

router = APIRouter()

SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2}


@router.get("/risks/{business_id}")
def get_risks(business_id: str):
    """
    Returns all unresolved risks for a business, ordered by severity (high first).
    """
    try:
        result = supabase.table("risks") \
            .select("*") \
            .eq("business_id", business_id) \
            .eq("is_resolved", False) \
            .execute()

        risks = result.data or []
        risks.sort(key=lambda r: SEVERITY_ORDER.get(r.get("severity", "low"), 2))
        return risks

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/risks/save")
async def save_risk(body: RiskSaveRequest):
    """
    Called by Person 2's AI module to save a detected risk.
    Automatically triggers n8n WhatsApp alert for HIGH severity risks.
    """
    try:
        result = supabase.table("risks").insert({
            "business_id": body.business_id,
            "risk_type": body.risk_type,
            "severity": body.severity,
            "description": body.description,
            "recommended_action": body.recommended_action,
            "is_resolved": False,
        }).execute()

        saved_risk = result.data[0]

        # Fire WhatsApp alert for high severity
        if body.severity == "high":
            await trigger_risk_alert_webhook(saved_risk)

        return {"status": "saved", "risk_id": saved_risk["id"]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/risks/{risk_id}/resolve")
def resolve_risk(risk_id: str):
    """
    Marks a risk as resolved.
    """
    try:
        supabase.table("risks") \
            .update({"is_resolved": True}) \
            .eq("id", risk_id) \
            .execute()
        return {"status": "resolved", "risk_id": risk_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))