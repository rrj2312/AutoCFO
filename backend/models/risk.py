from pydantic import BaseModel
from typing import Optional


class Risk(BaseModel):
    business_id: str
    risk_type: str
    severity: str           # "high" | "medium" | "low"
    description: str
    recommended_action: str
    is_resolved: bool = False


class RiskResponse(Risk):
    id: str
    created_at: Optional[str] = None


class RiskSaveRequest(BaseModel):
    business_id: str
    risk_type: str
    severity: str
    description: str
    recommended_action: str