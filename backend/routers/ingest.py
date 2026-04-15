import io
import csv
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.supabase_client import supabase
from services.n8n_trigger import trigger_risk_alert_webhook

router = APIRouter()


def parse_csv(file_bytes: bytes, source: str) -> list[dict]:
    """
    Parses a CSV file into a list of transaction dicts.
    Handles bank, UPI, and GST CSV formats.
    """
    transactions = []
    reader = csv.DictReader(io.StringIO(file_bytes.decode("utf-8")))

    for row in reader:
        try:
            # Normalize column names to lowercase
            row = {k.strip().lower(): v.strip() for k, v in row.items()}

            amount_raw = row.get("debit") or row.get("credit") or row.get("amount") or "0"
            amount = abs(float(amount_raw.replace(",", "") or 0))

            if amount == 0:
                continue

            tx_type = "debit" if row.get("debit") and row["debit"].strip() else "credit"

            transactions.append({
                "date": row.get("date", ""),
                "amount": amount,
                "type": tx_type,
                "category": infer_category(row.get("description", ""), source),
                "description": row.get("description", ""),
                "source": source,
            })
        except Exception:
            continue  # skip malformed rows

    return transactions


def infer_category(description: str, source: str) -> str:
    """
    Simple keyword-based category tagging.
    """
    desc = description.lower()
    if "gst" in desc or "tax" in desc:
        return "gst"
    if "salary" in desc or "payroll" in desc:
        return "salary"
    if "vendor" in desc or "supplier" in desc or "purchase" in desc:
        return "vendor"
    if "upi" in source.lower() or "upi" in desc:
        return "upi"
    return "client"


@router.post("/onboard")
def onboard(
    user_id: str = Form(...),
    business_name: str = Form(...),
    gst_number: str = Form(...),
    industry: str = Form(...),
    revenue_range: str = Form(...),
    bank: str = Form(...),
):
    """
    Saves new business details to Supabase and returns business_id.
    """
    try:
        result = supabase.table("businesses").insert({
            "user_id": user_id,
            "business_name": business_name,
            "gst_number": gst_number,
            "industry": industry,
            "revenue_range": revenue_range,
            "bank": bank,
        }).execute()

        business_id = result.data[0]["id"]
        return {"status": "success", "business_id": business_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ingest")
async def ingest(
    business_id: str = Form(...),
    bank_csv: UploadFile = File(None),
    upi_csv: UploadFile = File(None),
    gst_csv: UploadFile = File(None),
):
    """
    Accepts up to 3 CSV files (bank, UPI, GST).
    Parses and inserts all transactions into Supabase.
    Then triggers AI analysis via Person 2's module.
    """
    all_transactions = []

    for upload, source in [(bank_csv, "bank"), (upi_csv, "upi"), (gst_csv, "gst")]:
        if upload is not None:
            contents = await upload.read()
            parsed = parse_csv(contents, source)
            for tx in parsed:
                tx["business_id"] = business_id
            all_transactions.extend(parsed)

    if not all_transactions:
        raise HTTPException(status_code=400, detail="No valid transaction data found in uploaded files.")

    try:
        supabase.table("transactions").insert(all_transactions).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB insert failed: {e}")

    # Trigger AI analysis (Person 2's module runs separately on port 8001)
    # Fire-and-forget via n8n or direct HTTP call
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            await client.post(
                "http://localhost:8001/analyze",
                json={"business_id": business_id, "transactions": all_transactions},
                timeout=5,
            )
    except Exception:
        pass  # Don't block the response if AI service is down

    return {"status": "analysis triggered", "business_id": business_id, "rows_ingested": len(all_transactions)}