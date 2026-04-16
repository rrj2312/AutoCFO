import os
import httpx
from dotenv import load_dotenv

load_dotenv()

PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
OWNER_NUMBER = os.getenv("OWNER_WHATSAPP_NUMBER")

API_URL = f"https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages"


async def send_whatsapp(message: str, to: str = None):
    """
    Sends a WhatsApp message via Meta Cloud API.
    `to` defaults to the business owner's number from .env.
    """
    recipient = to or OWNER_NUMBER

    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "text",
        "text": {"body": message},
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, json=payload, headers=headers, timeout=10)
            print(f"[WhatsApp] Status: {response.status_code} | {response.text}")
            return response.status_code == 200
    except Exception as e:
        print(f"[WhatsApp] Send failed: {e}")
        return False