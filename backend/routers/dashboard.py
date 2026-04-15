from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase
from datetime import date, timedelta

router = APIRouter()


def calc_health_score(risks: list) -> int:
    """
    Starts at 100. Deducts points per risk severity.
    high = -15, medium = -7, low = -3
    """
    score = 100
    deductions = {"high": 15, "medium": 7, "low": 3}
    for risk in risks:
        score -= deductions.get(risk.get("severity", "low"), 0)
    return max(0, score)


def calc_cash_runway(transactions: list) -> int:
    """
    cash_runway = current_balance / avg_daily_expense
    """
    credits = sum(t["amount"] for t in transactions if t["type"] == "credit")
    debits = sum(t["amount"] for t in transactions if t["type"] == "debit")
    balance = credits - debits

    daily_expenses = [t["amount"] for t in transactions if t["type"] == "debit"]
    avg_daily = (sum(daily_expenses) / 30) if daily_expenses else 1

    return max(0, int(balance / avg_daily))


def calc_gst_days_remaining(transactions: list) -> int:
    """
    Estimates days to next GSTR-3B deadline (20th of every month).
    """
    today = date.today()
    deadline_this_month = today.replace(day=20)
    if today >= deadline_this_month:
        # Next month's deadline
        if today.month == 12:
            deadline = deadline_this_month.replace(year=today.year + 1, month=1)
        else:
            deadline = deadline_this_month.replace(month=today.month + 1)
    else:
        deadline = deadline_this_month
    return (deadline - today).days


@router.get("/dashboard/{business_id}")
def get_dashboard(business_id: str):
    """
    Returns all KPIs needed for the dashboard:
    - health_score, balance, trend, cash_runway
    - gst_days_remaining, overdue_count, overdue_total
    - recent 3 risks
    """
    try:
        # Last 30 days of transactions
        since = (date.today() - timedelta(days=30)).isoformat()
        tx_res = supabase.table("transactions") \
            .select("*") \
            .eq("business_id", business_id) \
            .gte("date", since) \
            .execute()
        transactions = tx_res.data or []

        # Unresolved risks
        risk_res = supabase.table("risks") \
            .select("*") \
            .eq("business_id", business_id) \
            .eq("is_resolved", False) \
            .execute()
        risks = risk_res.data or []

        # Overdue invoices: client credits older than 30 days with no matching debit
        all_tx_res = supabase.table("transactions") \
            .select("*") \
            .eq("business_id", business_id) \
            .eq("category", "client") \
            .eq("type", "debit") \
            .execute()
        overdue_txs = [
            t for t in (all_tx_res.data or [])
            if (date.today() - date.fromisoformat(t["date"])).days > 30
        ]
        overdue_count = len(overdue_txs)
        overdue_total = sum(t["amount"] for t in overdue_txs)

        balance = sum(
            t["amount"] if t["type"] == "credit" else -t["amount"]
            for t in transactions
        )

        # Simple trend: compare first half vs second half of window
        mid = len(transactions) // 2
        first_half_net = sum(
            t["amount"] if t["type"] == "credit" else -t["amount"]
            for t in transactions[:mid]
        )
        second_half_net = sum(
            t["amount"] if t["type"] == "credit" else -t["amount"]
            for t in transactions[mid:]
        )
        trend = "improving" if second_half_net > first_half_net else \
                "declining" if second_half_net < first_half_net else "stable"

        return {
            "business_id": business_id,
            "balance": round(balance, 2),
            "health_score": calc_health_score(risks),
            "cash_runway": calc_cash_runway(transactions),
            "gst_days_remaining": calc_gst_days_remaining(transactions),
            "overdue_count": overdue_count,
            "overdue_total": round(overdue_total, 2),
            "trend": trend,
            "recent_risks": risks[:3],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))