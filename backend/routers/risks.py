from fastapi import APIRouter, HTTPException
from models.risk import RiskSaveRequest
from services.supabase_client import supabase
from services.whatsapp import send_whatsapp

router = APIRouter()

@router.get("/risks/{business_id}")
async def get_risks(business_id: str):
    response = supabase.table("risks").select("*").eq("business_id", business_id).execute()
    return response.data


@router.post("/risks/save")
async def save_risk(body: RiskSaveRequest):
    data = {
        "business_id": body.business_id,
        "risk_type": body.risk_type,
        "description": body.description,
        "severity": body.severity,
        "recommended_action": body.recommended_action,
        "status": "open"
    }

    response = supabase.table("risks").insert(data).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to save risk")

    saved_risk = response.data[0]

    if body.severity == "high":
        msg = (
            f"🚨 AutoCFO Alert\n"
            f"Risk: {body.risk_type}\n"
            f"{body.description}\n"
            f"Action: {body.recommended_action}"
        )
        await send_whatsapp(msg)

    return saved_risk


@router.patch("/risks/resolve/{risk_id}")
async def resolve_risk(risk_id: str):
    response = (
        supabase.table("risks")
        .update({"status": "resolved"})
        .eq("id", risk_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Risk not found")

    return response.data[0]