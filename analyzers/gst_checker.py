from datetime import date, timedelta

def check_gst_deadline(last_filed: date) -> dict:
    """Pure Python GST deadline calculator. No AI needed."""
    # GSTR-3B is due on the 20th of the following month
    if last_filed.month == 12:
        next_deadline = date(last_filed.year + 1, 1, 20)
    else:
        next_deadline = date(last_filed.year, last_filed.month + 1, 20)

    days_remaining = (next_deadline - date.today()).days

    if days_remaining <= 3:
        severity = "high"
    elif days_remaining <= 7:
        severity = "medium"
    else:
        severity = "low"

    checklist = [
        "Download GSTR-1 from GST portal",
        "Reconcile sales invoices",
        "Match purchase invoices with GSTR-2A",
        "Calculate tax liability",
        "Make GST payment if outstanding",
        "File GSTR-3B before deadline"
    ]

    return {
        "days_remaining": days_remaining,
        "next_deadline": str(next_deadline),
        "severity": severity,
        "checklist": checklist,
        "risk_type": "GST Deadline",
        "description": f"GSTR-3B filing due in {days_remaining} days on {next_deadline}.",
        "recommended_action": "Complete reconciliation and file GSTR-3B immediately."
    }