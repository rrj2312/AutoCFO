from utils.gemini_client import call_ai
from utils.data_formatter import safe_parse_json, format_transactions_for_prompt

CASHFLOW_PROMPT = """You are a financial forecasting engine.

Transaction history:
{transactions}

Current balance: ₹{balance}
Average monthly expense: ₹{avg_expense}

Return ONLY valid JSON:
{{
  "seven_day_forecast": [
    {{"day": 1, "projected_balance": 0}},
    {{"day": 2, "projected_balance": 0}},
    {{"day": 3, "projected_balance": 0}},
    {{"day": 4, "projected_balance": 0}},
    {{"day": 5, "projected_balance": 0}},
    {{"day": 6, "projected_balance": 0}},
    {{"day": 7, "projected_balance": 0}}
  ],
  "cash_runway_days": 0,
  "trend": "improving / stable / declining",
  "summary": "one sentence plain English"
}}
No markdown. No explanation."""

def predict_cash_flow(transactions: list, current_balance: float, avg_monthly_expense: float) -> dict:
    """Predict 7-day cash flow and runway days."""
    formatted = format_transactions_for_prompt(transactions)
    prompt = CASHFLOW_PROMPT.format(
        transactions=formatted,
        balance=f"{current_balance:,.0f}",
        avg_expense=f"{avg_monthly_expense:,.0f}"
    )
    raw = call_ai(prompt)
    return safe_parse_json(raw)