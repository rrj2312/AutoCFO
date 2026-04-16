import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { getRisks, explainRisk } from '../api/api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { RisksSkeleton } from '../components/LoadingSkeleton';

interface Risk {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionTaken: string;
  timestamp: string;
}

function RiskCard({ risk }: { risk: Risk }) {
  const [expanded, setExpanded] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    if (explanation) {
      setExpanded((v) => !v);
      return;
    }
    setExpanded(true);
    setLoading(true);
    const text = await explainRisk(risk.id);
    setExplanation(text);
    setLoading(false);
  }

  const borderColor = {
    high: 'border-[#FF4C4C]/25',
    medium: 'border-[#FFB800]/25',
    low: 'border-[#1F2937]',
  }[risk.severity];

  const dotColor = {
    high: 'bg-[#FF4C4C]',
    medium: 'bg-[#FFB800]',
    low: 'bg-[#00FF87]',
  }[risk.severity];

  return (
    <Card className={`border ${borderColor} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 mt-0.5`} />
            <span className="text-[10px] font-semibold text-[#6B7280] tracking-widest uppercase font-mono">{risk.type}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge severity={risk.severity} />
            <span className="text-[10px] text-[#4B5563] font-mono">{risk.timestamp}</span>
          </div>
        </div>

        <h3 className="text-[#F9FAFB] font-semibold text-sm font-heading mb-2">{risk.title}</h3>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-3">{risk.description}</p>

        <div className="flex items-start gap-2 bg-[#00FF87]/5 border border-[#00FF87]/15 rounded-xl px-3 py-2.5 mb-3">
          <CheckCircle size={14} className="text-[#00FF87] shrink-0 mt-0.5" />
          <p className="text-[#00FF87] text-xs leading-relaxed">{risk.actionTaken}</p>
        </div>

        <button
          onClick={handleExplain}
          className="w-full flex items-center justify-between gap-2 bg-[#1F2937] hover:bg-[#374151] rounded-xl px-4 py-2.5 transition-all duration-150 group"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#FFB800] group-hover:text-[#FFD600] transition-colors" />
            <span className="text-sm font-medium text-[#E5E7EB] group-hover:text-[#F9FAFB] transition-colors">
              Why did AutoCFO flag this?
            </span>
          </div>
          {expanded ? <ChevronUp size={14} className="text-[#6B7280]" /> : <ChevronDown size={14} className="text-[#6B7280]" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-[#1F2937] bg-[#0D1424] px-4 py-4">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[#6B7280] text-sm">AutoCFO is reasoning...</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={12} className="text-[#FFB800]" />
              </div>
              <p className="text-[#D1D5DB] text-sm leading-relaxed">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function Risks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRisks().then((data) => {
      setRisks(data as Risk[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <RisksSkeleton />;

  const highCount = risks.filter((r) => r.severity === 'high').length;
  const medCount = risks.filter((r) => r.severity === 'medium').length;

  return (
    <div className="px-4 pt-5 pb-2 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#F9FAFB] font-heading">Active Risks</h1>
        <div className="flex items-center gap-3 mt-1.5">
          {highCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[#FF4C4C]" />
              <span className="text-xs text-[#FF4C4C] font-medium">{highCount} high severity</span>
            </div>
          )}
          {medCount > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[#FFB800]" />
              <span className="text-xs text-[#FFB800] font-medium">{medCount} medium</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {risks.map((risk) => (
          <RiskCard key={risk.id} risk={risk} />
        ))}
      </div>

      <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-4 text-center">
        <p className="text-[#4B5563] text-sm">AutoCFO monitors your finances 24/7</p>
        <p className="text-[#6B7280] text-xs mt-1">Last scanned: 2 minutes ago</p>
      </div>
    </div>
  );
}
