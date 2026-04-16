from fastapi import FastAPI
from analyzers.risk_detector import detect_risks
from analyzers.cash_flow_predictor import predict_cash_flow
from analyzers.gst_checker import check_gst_deadline
from analyzers.explainer import explain_risk
from datetime import date
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
N8N_URL = os.getenv("N8N_WEBHOOK_URL", "")


def post_to_backend(endpoint: str, data: dict):
    """Helper to POST data to Person 1's FastAPI backend."""
    try:
        requests.post(f"{BACKEND_URL}{endpoint}", json=data, timeout=5)
    except Exception as e:
        print(f"Backend post failed to {endpoint}: {e}")


def trigger_n8n_webhook(risk: dict, business_id: str):
    """Fire n8n webhook for HIGH severity risks."""
    if not N8N_URL:
        return
    try:
        requests.post(N8N_URL, json={**risk, "business_id": business_id}, timeout=5)
    except Exception as e:
        print(f"n8n trigger failed: {e}")


def run_full_analysis(business_id: str, transactions: list, industry: str = "wholesale"):
    """
    Master analysis function. Called after CSV ingestion.
    Runs all 4 modules and saves results to backend.
    """
    print(f"Starting analysis for business: {business_id}")

    # 1. Detect risks
    risks = detect_risks(transactions, industry)
    print(f"Found {len(risks)} risks")

    for risk in risks:
        # Save each risk to backend
        post_to_backend("/risks/save", {**risk, "business_id": business_id})
        # Fire WhatsApp alert for high severity
        if risk.get("severity") == "high":
            trigger_n8n_webhook(risk, business_id)

    # 2. Cash flow forecast
    credits = [t["amount"] for t in transactions if t.get("type") == "credit"]
    debits = [t["amount"] for t in transactions if t.get("type") == "debit"]
    current_balance = sum(credits) - sum(debits)
    avg_monthly_expense = sum(debits) if debits else 1

    forecast = predict_cash_flow(transactions, current_balance, avg_monthly_expense)
    post_to_backend("/dashboard/update", {**forecast, "business_id": business_id})

    # 3. GST check — use today minus 25 days as last filed (demo default)
    from datetime import timedelta
    last_filed = date.today() - timedelta(days=25)
    gst = check_gst_deadline(last_filed)
    if gst["severity"] in ("high", "medium"):
        post_to_backend("/risks/save", {**gst, "business_id": business_id})

    print("Analysis complete.")
    return {"risks": risks, "forecast": forecast, "gst": gst}


# --- HTTP endpoint so Person 1 can call this service ---
from fastapi import Body

@app.post("/analyze")
def analyze(payload: dict = Body(...)):
    business_id = payload.get("business_id", "demo_001")
    transactions = payload.get("transactions", [])
    industry = payload.get("industry", "wholesale")
    result = run_full_analysis(business_id, transactions, industry)
    return {"status": "done", "result": result}

@app.get("/explain/{risk_id}")
def explain(risk_id: str, risk_type: str = "", description: str = ""):
    risk = {"risk_id": risk_id, "risk_type": risk_type, "description": description}
    explanation = explain_risk(risk)
    return {"explanation": explanation}