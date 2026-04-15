from utils.gemini_client import call_ai

EXPLAIN_PROMPT = """You are AutoCFO explaining a financial risk to a small business owner in simple language.

Risk details: {risk}
Transaction context: {context}

Write exactly 2 sentences explaining:
1. What pattern in the data triggered this alert
2. Why this matters to the business right now

Use simple language. No jargon. Mention specific numbers.
Do not use bullet points. Return plain text only."""

def explain_risk(risk: dict, context: str = "") -> str:
    """Return a 2-sentence plain English explanation for a risk."""
    prompt = EXPLAIN_PROMPT.format(risk=str(risk), context=context)
    return call_ai(prompt)