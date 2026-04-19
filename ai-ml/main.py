from fastapi import FastAPI, Body
from analyzers.risk_detector import detect_risks
from analyzers.cash_flow_predictor import predict_cash_flow
from analyzers.gst_checker import check_gst_deadline
from analyzers.explainer import explain_risk
from datetime import date, timedelta
import requests
import httpx
import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
OWNER_WHATSAPP_NUMBER = os.getenv("OWNER_WHATSAPP_NUMBER")


def load_demo_data():
    """Loads fallback data from demo_data.json."""
    try:
        with open("demo_data.json", "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading demo data: {e}")
        return {"business": "Unknown", "transactions": [], "overdue_invoices": []}


def post_to_backend(endpoint: str, data: dict):
    """POST data to the FastAPI backend."""
    try:
        requests.post(f"{BACKEND_URL}{endpoint}", json=data, timeout=5)
    except Exception as e:
        print(f"Backend post failed to {endpoint}: {e}")


def send_whatsapp_alert(risk: dict):
    """
    Sends a WhatsApp message via Meta Cloud API for HIGH severity risks.
    Runs synchronously using requests (simpler inside a sync function).
    """
    if not WHATSAPP_PHONE_NUMBER_ID or not WHATSAPP_ACCESS_TOKEN:
        print("[WhatsApp] Credentials not configured — skipping alert.")
        return

    url = f"https://graph.facebook.com/v19.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    message = (
        f"🚨 AutoCFO Alert\n"
        f"Risk: {risk.get('risk_type', 'Unknown')}\n"
        f"{risk.get('description', '')}\n"
        f"Action: {risk.get('recommended_action', '')}"
    )
    payload = {
        "messaging_product": "whatsapp",
        "to": OWNER_WHATSAPP_NUMBER,
        "type": "text",
        "text": {"body": message},
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        print(f"[WhatsApp] Sent. Status: {response.status_code}")
    except Exception as e:
        print(f"[WhatsApp] Failed: {e}")


def run_full_analysis(business_id: str, transactions: list, industry: str = "wholesale", overdue_invoices: list = None):
    """
    Master analysis function. Called after CSV ingestion.
    Runs all 4 modules and saves results to backend.
    """
    print(f"Starting analysis for business: {business_id}")

    # 1. Detect risks
    risks = detect_risks(transactions, industry)
    print(f"Found {len(risks)} risks")

    for risk in risks:
        post_to_backend("/risks/save", {**risk, "business_id": business_id})
        # Directly alert via WhatsApp for high severity (no n8n needed)
        if risk.get("severity") == "high":
            send_whatsapp_alert(risk)

    # 2. Cash flow forecast
    credits = [t["amount"] for t in transactions if t.get("type") == "credit"]
    debits = [t["amount"] for t in transactions if t.get("type") == "debit"]
    current_balance = sum(credits) - sum(debits)
    avg_monthly_expense = sum(debits) if debits else 1

    forecast = predict_cash_flow(transactions, current_balance, avg_monthly_expense)
    post_to_backend("/dashboard/update", {**forecast, "business_id": business_id})

    # 3. GST check — use today minus 25 days as last filed (demo default)
    last_filed = date.today() - timedelta(days=25)
    gst = check_gst_deadline(last_filed)
    if gst["severity"] in ("high", "medium"):
        post_to_backend("/risks/save", {
            **gst,
            "business_id": business_id,
            "risk_type": "GST Deadline",
            "recommended_action": "File GSTR-3B before the deadline."
        })

    # 4. Handle overdue invoices (save as risks)
    if overdue_invoices:
        for inv in overdue_invoices:
            post_to_backend("/risks/save", {
                "business_id": business_id,
                "risk_type": "Overdue Invoice",
                "severity": "medium",
                "title": f"Overdue: {inv['client']}",
                "description": f"Invoice of ₹{inv['amount']} is {inv['due_days']} days overdue.",
                "recommended_action": "Follow up with client for payment."
            })

    print("Analysis complete.")
    return {"risks": risks, "forecast": forecast, "gst": gst}


@app.post("/analyze")
def analyze(payload: dict = Body(...)):
    business_id = payload.get("business_id", "demo_001")
    transactions = payload.get("transactions", [])
    overdue_invoices = payload.get("overdue_invoices", [])
    
    # Use demo data if payload is empty
    if not transactions and not overdue_invoices:
        demo_data = load_demo_data()
        transactions = demo_data["transactions"]
        overdue_invoices = demo_data["overdue_invoices"]
        print("Using fallback demo data")

    industry = payload.get("industry", "wholesale")
    result = run_full_analysis(business_id, transactions, industry, overdue_invoices)
    return {"status": "done", "result": result}


@app.get("/explain/{risk_id}")
def explain(risk_id: str, risk_type: str = "", description: str = ""):
    risk = {"risk_id": risk_id, "risk_type": risk_type, "description": description}
    explanation = explain_risk(risk)
    return {"explanation": explanation}