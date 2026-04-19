import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, FileText, CheckCircle, Lightbulb, Bell } from 'lucide-react';
import { getDashboard } from '../api/api';
import { Card } from '../components/Card';
import { DashboardSkeleton } from '../components/LoadingSkeleton';

interface DashboardData {
  healthScore: number;
  highRisksCount: number;
  cashFlow: { balance: number; trend: string; changePercent: number; severity: string };
  gstStatus: { daysRemaining: number; severity: string; nextDeadline: string };
  overdueInvoices: { count: number; totalValue: number; severity: string };
  cashRunway: { days: number; monthlyBurn: number; severity: string };
  recentActions: Array<{ id: string; icon: string; text: string; time: string; type: string }>;
}

function HealthGauge({ score }: { score: number }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const dashLength = circumference * 0.75;
  const offset = dashLength - (score / 100) * dashLength;
  const color = score >= 71 ? '#00FF87' : score >= 41 ? '#FFB800' : '#FF4C4C';
  const label = score >= 71 ? 'Healthy' : score >= 41 ? 'At Risk' : 'Critical';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#1F2937" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          />
          <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${dashLength - offset} ${circumference - (dashLength - offset)}`}
            style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-num text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[#6B7280] text-xs font-medium mt-0.5">/ 100</span>
          <span className="text-xs font-semibold mt-1 tracking-wide" style={{ color }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard().then((res) => {
      const d = res.data;

      setData({
        healthScore: d.health_score,
        highRisksCount: d.recent_risks?.length ?? 0,
        cashFlow: {
          balance: d.balance,
          trend: d.trend,
          changePercent: 0,
          severity: 'ok',
        },
        gstStatus: {
          daysRemaining: d.gst_days_remaining,
          severity: 'ok',
          nextDeadline: '',
        },
        overdueInvoices: {
          count: d.overdue_count,
          totalValue: d.overdue_total,
          severity: 'warning',
        },
        cashRunway: {
          days: d.cash_runway,
          monthlyBurn: 0,
          severity: 'ok',
        },
        recentActions: [],
      });

      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data) return null;

  const runwaySeverity = data.cashRunway.days < 7 ? 'danger' : data.cashRunway.days < 30 ? 'warning' : 'safe';
  const runwayColors = {
    danger: { bg: 'bg-[#FF4C4C]/10', border: 'border-[#FF4C4C]/30', text: 'text-[#FF4C4C]', glow: 'shadow-[0_0_24px_rgba(255,76,76,0.2)]' },
    warning: { bg: 'bg-[#FFB800]/10', border: 'border-[#FFB800]/30', text: 'text-[#FFB800]', glow: 'shadow-[0_0_24px_rgba(255,184,0,0.2)]' },
    safe: { bg: 'bg-[#00FF87]/10', border: 'border-[#00FF87]/30', text: 'text-[#00FF87]', glow: 'shadow-[0_0_24px_rgba(0,255,135,0.2)]' },
  };
  const rc = runwayColors[runwaySeverity];

  const statCards = [
    {
      label: 'Cash Flow',
      value: formatCurrency(data.cashFlow.balance),
      sub: `${data.cashFlow.changePercent > 0 ? '+' : ''}${data.cashFlow.changePercent}% this week`,
      icon: data.cashFlow.trend === 'down' ? <TrendingDown size={16} className="text-[#FF4C4C]" /> : <TrendingUp size={16} className="text-[#00FF87]" />,
      severity: data.cashFlow.severity,
    },
    {
      label: 'GST Due',
      value: `${data.gstStatus.daysRemaining}d`,
      sub: data.gstStatus.nextDeadline,
      icon: <Clock size={16} className="text-[#FFB800]" />,
      severity: data.gstStatus.severity,
    },
    {
      label: 'Overdue',
      value: `${data.overdueInvoices.count}`,
      sub: formatCurrency(data.overdueInvoices.totalValue),
      icon: <FileText size={16} className="text-[#FF4C4C]" />,
      severity: data.overdueInvoices.severity,
    },
  ];

  const severityBorder: Record<string, string> = {
    danger: 'border-[#FF4C4C]/30',
    warning: 'border-[#FFB800]/30',
    ok: 'border-[#1F2937]',
  };

  const actionIcons: Record<string, React.ReactNode> = {
    check: <CheckCircle size={16} className="text-[#00FF87] shrink-0" />,
    warning: <AlertTriangle size={16} className="text-[#FFB800] shrink-0" />,
    lightbulb: <Lightbulb size={16} className="text-blue-400 shrink-0" />,
  };

  return (
    <div className="px-4 pt-5 pb-2 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F9FAFB] font-heading">Good morning,</h1>
          <p className="text-[#6B7280] text-sm">Mehta Enterprises</p>
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center bg-[#111827] rounded-xl border border-[#1F2937] hover:bg-[#1a2235] transition-colors">
          <Bell size={17} className="text-[#9CA3AF]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4C4C] rounded-full border border-[#0A0F1E]" />
        </button>
      </div>

      <Card className="p-5">
        <div className="text-center mb-2">
          <span className="text-xs font-semibold tracking-widest text-[#6B7280] font-mono">FINANCIAL HEALTH SCORE</span>
        </div>
        <HealthGauge score={data.healthScore} />
        <div className="text-center mt-3">
          <span className="text-sm text-[#FFB800] font-medium">
            {data.highRisksCount} high risk{data.highRisksCount !== 1 ? 's' : ''} detected today
          </span>
          <br />
          <button
            onClick={() => navigate('/risks')}
            className="text-xs text-[#6B7280] mt-1 hover:text-[#9CA3AF] transition-colors underline underline-offset-2"
          >
            View all risks →
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-[#111827] rounded-2xl border ${severityBorder[card.severity] ?? 'border-[#1F2937]'} p-3 flex flex-col gap-2 transition-all hover:bg-[#1a2235]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#6B7280] tracking-wider uppercase">{card.label}</span>
              {card.icon}
            </div>
            <span className="font-mono-num text-lg font-bold text-[#F9FAFB] leading-none">{card.value}</span>
            <span className="text-[10px] text-[#6B7280] leading-tight">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border ${rc.border} ${rc.bg} ${rc.glow} p-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${runwaySeverity === 'danger' ? 'bg-[#FF4C4C]/20' : runwaySeverity === 'warning' ? 'bg-[#FFB800]/20' : 'bg-[#00FF87]/20'}`}>
            <AlertTriangle size={16} className={rc.text} />
          </div>
          <div className="flex-1">
            <span className={`text-[10px] font-bold tracking-widest font-mono ${rc.text}`}>CASH RUNWAY</span>
            <p className="text-[#F9FAFB] font-semibold text-sm mt-0.5 leading-snug">
              Your business can sustain current expenses for{' '}
              <span className={`font-mono-num font-bold ${rc.text}`}>{data.cashRunway.days} days</span>
            </p>
            <p className="text-[#6B7280] text-xs mt-1">
              Monthly burn: {formatCurrency(data.cashRunway.monthlyBurn)}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#F9FAFB] font-heading">Recent AI Actions</h2>
          <button
            onClick={() => navigate('/activity')}
            className="text-xs text-[#00FF87] hover:text-[#00e67a] transition-colors font-medium"
          >
            See all →
          </button>
        </div>
        <div className="space-y-2">
          {data.recentActions.map((action) => (
            <div key={action.id} className="flex items-start gap-3 bg-[#111827] rounded-xl border border-[#1F2937] px-4 py-3 hover:bg-[#1a2235] transition-colors">
              {actionIcons[action.icon]}
              <div className="flex-1 min-w-0">
                <p className="text-[#E5E7EB] text-sm leading-snug">{action.text}</p>
              </div>
              <span className="text-[11px] text-[#4B5563] font-mono shrink-0">{action.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
