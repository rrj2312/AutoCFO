import os
import httpx
from dotenv import load_dotenv

load_dotenv()

N8N_WEBHOOK_RISK_ALERT = os.getenv("N8N_WEBHOOK_RISK_ALERT")


async def trigger_risk_alert_webhook(risk: dict):
    """
    Fires the n8n Risk Alert webhook when a HIGH severity risk is detected.
    n8n then sends a WhatsApp message via Twilio.
    """
    if not N8N_WEBHOOK_RISK_ALERT:
        print("[n8n] Webhook URL not configured — skipping trigger.")
        return

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(N8N_WEBHOOK_RISK_ALERT, json=risk, timeout=10)
            print(f"[n8n] Webhook fired. Status: {response.status_code}")
    except Exception as e:
        print(f"[n8n] Webhook trigger failed: {e}")