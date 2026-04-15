import google.generativeai as genai
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-2.0-flash")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_gemini(prompt: str) -> str:
    """Primary AI call using Gemini 2.0 Flash."""
    response = gemini_model.generate_content(prompt)
    return response.text

def call_groq(prompt: str) -> str:
    """Fallback AI call using Groq LLaMA3."""
    response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def call_ai(prompt: str) -> str:
    """Call Gemini, fall back to Groq on failure."""
    try:
        return call_gemini(prompt)
    except Exception as e:
        print(f"Gemini failed: {e}. Falling back to Groq.")
        return call_groq(prompt)