from pydantic import BaseModel
from typing import Optional


class BusinessOnboard(BaseModel):
    user_id: str
    business_name: str
    gst_number: str
    industry: str
    revenue_range: str
    bank: str


class BusinessResponse(BaseModel):
    id: str
    user_id: str
    business_name: str
    gst_number: str
    industry: str
    revenue_range: str
    bank: str
    created_at: Optional[str] = None