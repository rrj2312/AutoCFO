export const mockDashboard = {
  healthScore: 67,
  highRisksCount: 2,
  cashFlow: {
    balance: 284500,
    trend: 'down',
    changePercent: -8.3,
    severity: 'warning',
  },
  gstStatus: {
    daysRemaining: 9,
    severity: 'danger',
    nextDeadline: '25 Apr 2026',
  },
  overdueInvoices: {
    count: 4,
    totalValue: 142000,
    severity: 'danger',
  },
  cashRunway: {
    days: 14,
    monthlyBurn: 203214,
    severity: 'warning',
  },
  recentActions: [
    {
      id: 'a1',
      icon: 'check',
      text: 'Sent payment reminder to Mehta Traders',
      time: '2h ago',
      type: 'success',
    },
    {
      id: 'a2',
      icon: 'warning',
      text: 'Flagged GST GSTR-3B deadline risk',
      time: '5h ago',
      type: 'warning',
    },
    {
      id: 'a3',
      icon: 'lightbulb',
      text: 'Suggested delaying Sharma Supplies payment by 7 days',
      time: '1d ago',
      type: 'info',
    },
  ],
};

export const mockRisks = [
  {
    id: 'r1',
    type: 'GST Compliance',
    severity: 'high',
    title: 'GSTR-3B Filing Due in 9 Days',
    description: 'Your GSTR-3B for March 2026 is due on Apr 25. Estimated liability: ₹38,200. Late filing attracts ₹50/day penalty.',
    actionTaken: 'AutoCFO has pre-filled your GSTR-3B draft and scheduled a reminder.',
    timestamp: '2 hours ago',
  },
  {
    id: 'r2',
    type: 'Cash Flow',
    severity: 'high',
    title: 'Cash Runway Below 30 Days',
    description: 'At current burn rate of ₹2.03L/month, your available cash covers only 14 days of operations.',
    actionTaken: 'AutoCFO flagged 3 deferrable vendor payments worth ₹61,000.',
    timestamp: '5 hours ago',
  },
  {
    id: 'r3',
    type: 'Receivables',
    severity: 'medium',
    title: '4 Invoices Overdue by 30+ Days',
    description: 'Clients: Mehta Traders (₹42K), R.K. Exports (₹38K), Patel Corp (₹31K), and 1 more.',
    actionTaken: 'Automated reminders sent to all 4 clients via email and WhatsApp.',
    timestamp: '1 day ago',
  },
  {
    id: 'r4',
    type: 'TDS Compliance',
    severity: 'low',
    title: 'TDS Deposit Due Next Month',
    description: 'Q4 TDS deposit of estimated ₹12,400 due by May 7. Currently sufficient balance available.',
    actionTaken: 'AutoCFO has marked this for review and set a 7-day advance reminder.',
    timestamp: '2 days ago',
  },
];

export const mockActions = [
  {
    id: 'act1',
    timestamp: 'Today, 10:42 AM',
    action: 'Sent WhatsApp payment reminder to Mehta Traders for Invoice #1042 (₹42,000)',
    status: 'completed',
    category: 'receivables',
  },
  {
    id: 'act2',
    timestamp: 'Today, 08:15 AM',
    action: 'Flagged GSTR-3B deadline risk — 9 days remaining',
    status: 'completed',
    category: 'gst',
  },
  {
    id: 'act3',
    timestamp: 'Yesterday, 6:00 PM',
    action: 'Generated daily financial health report — Score: 67/100',
    status: 'completed',
    category: 'report',
  },
  {
    id: 'act4',
    timestamp: 'Yesterday, 3:22 PM',
    action: 'Sent payment reminder to R.K. Exports for Invoice #0987 (₹38,000)',
    status: 'completed',
    category: 'receivables',
  },
  {
    id: 'act5',
    timestamp: 'Yesterday, 11:00 AM',
    action: 'Identified cash runway risk — recommending deferral of ₹61,000 in vendor payments',
    status: 'pending',
    category: 'cashflow',
  },
  {
    id: 'act6',
    timestamp: '2 days ago, 9:00 AM',
    action: 'Reconciled bank statement with 47 transactions — 2 discrepancies flagged',
    status: 'completed',
    category: 'reconciliation',
  },
  {
    id: 'act7',
    timestamp: '2 days ago, 6:00 PM',
    action: 'Generated daily financial health report — Score: 71/100',
    status: 'completed',
    category: 'report',
  },
];

export const mockWhatsAppMessages = [
  {
    id: 'w1',
    text: 'AutoCFO Daily Summary — Apr 16\n\nFixed 3 risks today:\n• Sent 2 payment reminders (₹80K)\n• Flagged GST deadline in 9 days\n• Optimized cash flow by ₹61K',
    time: '8:00 AM',
    isBot: true,
  },
  {
    id: 'w2',
    text: 'Your financial health score dropped from 71 to 67.\n\nMain reason: Cash runway is now 14 days. Action recommended.',
    time: '8:01 AM',
    isBot: true,
  },
  {
    id: 'w3',
    text: 'Reminder: GSTR-3B due Apr 25. Estimated liability ₹38,200. Reply "FILE NOW" to initiate.',
    time: '10:00 AM',
    isBot: true,
  },
];

export const mockExplanations: Record<string, string> = {
  r1: 'GSTR-3B is a monthly self-declaration return that must be filed by the 25th of the following month. AutoCFO detected that your March filing is pending and estimated tax liability of ₹38,200 based on your sales and purchase data. Missing this deadline attracts ₹50/day late fees plus 18% interest on outstanding tax.',
  r2: 'Your average monthly operating expenses are ₹2,03,214 based on the last 3 months of bank data. With current cash balance of ₹2,84,500, you have exactly 14 days of runway. AutoCFO flagged this because it falls below the 30-day safety threshold recommended for SMBs in your industry.',
  r3: 'These 4 invoices have exceeded your typical 30-day payment cycle by more than 15 days. Based on historical patterns, invoices unpaid beyond 45 days have a 34% higher default probability. AutoCFO triggered automated reminders to reduce this risk before it requires legal action.',
  r4: 'TDS (Tax Deducted at Source) must be deposited by the 7th of the following month. AutoCFO calculated your Q4 liability as ₹12,400 based on vendor payments made this quarter. While you have sufficient funds, early flagging ensures you do not accidentally deploy this cash elsewhere.',
};
