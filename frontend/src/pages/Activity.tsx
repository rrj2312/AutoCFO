import { useEffect, useState } from 'react';
import { CheckCircle, Clock, RefreshCw, Receipt, BarChart2, FileSearch } from 'lucide-react';
import { getActions } from '../api/api';
import { mockWhatsAppMessages } from '../data/mockData';
import { Skeleton } from '../components/LoadingSkeleton';

interface Action {
  id: string;
  timestamp: string;
  action: string;
  status: 'completed' | 'pending';
  category: string;
}

const categoryIcon: Record<string, React.ReactNode> = {
  receivables: <Receipt size={14} className="text-[#00FF87]" />,
  gst: <FileSearch size={14} className="text-[#FFB800]" />,
  report: <BarChart2 size={14} className="text-blue-400" />,
  cashflow: <BarChart2 size={14} className="text-[#FFB800]" />,
  reconciliation: <RefreshCw size={14} className="text-[#9CA3AF]" />,
};

function groupByDate(actions: Action[]) {
  const groups: Record<string, Action[]> = {};
  actions.forEach((action) => {
    const key = action.timestamp.startsWith('Today')
      ? 'Today'
      : action.timestamp.startsWith('Yesterday')
      ? 'Yesterday'
      : '2 days ago';
    if (!groups[key]) groups[key] = [];
    groups[key].push(action);
  });
  return groups;
}

export default function Activity() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActions().then((data) => {
      setActions(data as Action[]);
      setLoading(false);
    });
  }, []);

  const grouped = groupByDate(actions);

  return (
    <div className="px-4 pt-5 pb-2 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#F9FAFB] font-heading">Activity Log</h1>
        <p className="text-[#6B7280] text-sm mt-0.5">Everything AutoCFO did for you</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-[#6B7280] tracking-widest uppercase font-mono">{date}</span>
                <div className="flex-1 h-px bg-[#1F2937]" />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[#1F2937]" />
                <div className="space-y-2">
                  {items.map((action) => (
                    <div key={action.id} className="flex gap-4 pl-1">
                      <div className="relative z-10 mt-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          action.status === 'completed'
                            ? 'bg-[#00FF87]/10 border-[#00FF87]/30'
                            : 'bg-[#FFB800]/10 border-[#FFB800]/30'
                        }`}>
                          {action.status === 'completed'
                            ? <CheckCircle size={12} className="text-[#00FF87]" />
                            : <Clock size={12} className="text-[#FFB800]" />
                          }
                        </div>
                      </div>
                      <div className="flex-1 bg-[#111827] rounded-xl border border-[#1F2937] px-3.5 py-3 hover:bg-[#1a2235] transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 shrink-0">
                              {categoryIcon[action.category] ?? <CheckCircle size={14} className="text-[#6B7280]" />}
                            </div>
                            <p className="text-[#E5E7EB] text-sm leading-snug">{action.action}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-[#4B5563] font-mono">
                            {action.timestamp.includes(',') ? action.timestamp.split(', ')[1] : action.timestamp}
                          </span>
                          <span className={`text-[10px] font-semibold tracking-wide font-mono ${
                            action.status === 'completed' ? 'text-[#00FF87]' : 'text-[#FFB800]'
                          }`}>
                            {action.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <WhatsAppPreview />
    </div>
  );
}

function WhatsAppPreview() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <WhatsAppIcon />
        <span className="text-sm font-semibold text-[#F9FAFB]">WhatsApp Summary</span>
        <span className="text-[10px] text-[#00FF87] font-mono font-semibold bg-[#00FF87]/10 px-2 py-0.5 rounded-full">LIVE</span>
      </div>

      <div className="bg-[#0B141A] rounded-2xl border border-[#1F2937] overflow-hidden">
        <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00FF87]/20 flex items-center justify-center">
            <span className="text-[#00FF87] text-xs font-bold">A</span>
          </div>
          <div>
            <p className="text-[#E9EDEF] text-sm font-medium">AutoCFO</p>
            <p className="text-[#8696A0] text-xs">online</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {mockWhatsAppMessages.map((msg) => (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-[#202C33] rounded-[12px_12px_12px_0] max-w-[85%] px-3.5 py-2.5 shadow-sm">
                <p className="text-[#E9EDEF] text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                <p className="text-[#8696A0] text-[10px] text-right mt-1 font-mono">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366" />
    </svg>
  );
}
