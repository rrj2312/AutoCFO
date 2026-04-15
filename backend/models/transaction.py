from pydantic import BaseModel
from typing import Optional
from datetime import date


class Transaction(BaseModel):
    business_id: str
    date: date
    amount: float
    type: str           # "credit" or "debit"
    category: str       # "vendor" | "client" | "gst" | "salary" | "upi"
    description: str
    source: str         # "bank" | "upi" | "gst"


class TransactionResponse(Transaction):
    id: str