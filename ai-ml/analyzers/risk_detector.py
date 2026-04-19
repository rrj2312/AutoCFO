from prompts.utils.gemini_client import call_ai
from prompts.utils.data_formatter import safe_parse_json, format_transactions_for_prompt

RISK_PROMPT = """You are AutoCFO, an autonomous financial risk analyst for a small Indian business.

Business type: {industry}
Transaction data (last 30 days):
{transactions}

Analyze and identify up to 5 financial risks.
For each risk return ONLY valid JSON in this exact format:
[
  {{
    "risk_type": "Cash Crunch / Overdue Invoice / GST Deadline / Unusual Expense / Low Balance",
    "severity": "high / medium / low",
    "description": "one sentence, specific, include rupee amounts and dates",
    "recommended_action": "one sentence, specific action AutoCFO should take"
  }}
]
Return ONLY the JSON array. No explanation. No markdown."""

def detect_risks(transactions: list, industry: str = "wholesale") -> list:
    """Run risk detection on a transaction list. Returns list of risk dicts."""
    formatted = format_transactions_for_prompt(transactions)
    prompt = RISK_PROMPT.format(industry=industry, transactions=formatted)
    raw = call_ai(prompt)
    return safe_parse_json(raw)