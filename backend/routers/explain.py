import os
from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()


def call_gemini(prompt: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text


def call_groq(prompt: str) -> str:
    from groq import Groq
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


@router.get("/explain/{risk_id}")
def explain_risk(risk_id: str):
    """
    Fetches a risk from Supabase and returns a 2-sentence plain English explanation.
    Used when the judge or user clicks "Why did AutoCFO flag this?"
    """
    try:
        result = supabase.table("risks").select("*").eq("id", risk_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Risk not found")

        risk = result.data[0]

        prompt = f"""You are AutoCFO explaining a financial risk to a small business owner in simple language.

Risk type: {risk['risk_type']}
Severity: {risk['severity']}
Description: {risk['description']}
Recommended action: {risk['recommended_action']}

Write exactly 2 sentences:
1. What pattern in the data triggered this alert (mention specific numbers if available).
2. Why this matters to the business right now.

Use simple language. No jargon. No bullet points. Return plain text only."""

        try:
            explanation = call_gemini(prompt)
        except Exception:
            explanation = call_groq(prompt)

        return {"risk_id": risk_id, "explanation": explanation.strip()}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))