import json
import re

def safe_parse_json(text: str) -> dict | list:
    """Strip markdown fences and parse JSON safely."""
    clean = re.sub(r"```json|```", "", text).strip()
    return json.loads(clean)

def format_transactions_for_prompt(transactions: list) -> str:
    """Convert transaction list to a readable string for prompts."""
    lines = []
    for t in transactions:
        lines.append(
            f"{t.get('date')} | {t.get('type','').upper()} | "
            f"₹{t.get('amount',0):,.0f} | {t.get('category','')} | {t.get('description','')}"
        )
    return "\n".join(lines)