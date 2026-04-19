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

  (actions || []).forEach((action) => {
    const key = action.timestamp?.startsWith('Today')
      ? 'Today'
      : action.timestamp?.startsWith('Yesterday')
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
    getActions()
      .then((res) => {
        // ✅ FIX: normalize backend response
        const data = res?.data?.actions || res?.data || [];
        setActions(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
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
                <span className="text-xs font-semibold text-[#6B7280] tracking-widest uppercase font-mono">
                  {date}
                </span>
                <div className="flex-1 h-px bg-[#1F2937]" />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[#1F2937]" />

                <div className="space-y-2">
                  {items.map((action) => (
                    <div key={action.id} className="flex gap-4 pl-1">
                      <div className="relative z-10 mt-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            action.status === 'completed'
                              ? 'bg-[#00FF87]/10 border-[#00FF87]/30'
                              : 'bg-[#FFB800]/10 border-[#FFB800]/30'
                          }`}
                        >
                          {action.status === 'completed'
                            ? <CheckCircle size={12} className="text-[#00FF87]" />
                            : <Clock size={12} className="text-[#FFB800]" />
                          }
                        </div>
                      </div>

                      <div className="flex-1 bg-[#111827] rounded-xl border border-[#1F2937] px-3.5 py-3">
                        <p className="text-[#E5E7EB] text-sm">{action.action}</p>
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
      </div>

      <div className="bg-[#0B141A] rounded-2xl border border-[#1F2937] overflow-hidden">
        <div className="p-4 space-y-3">
          {mockWhatsAppMessages.map((msg) => (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-[#202C33] rounded-[12px_12px_12px_0] px-3.5 py-2.5">
                <p className="text-[#E9EDEF] text-sm">{msg.text}</p>
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
      <path
        d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.49 0 .16 5.34.16 11.93c0 2.09.54 4.14 1.58 5.94L0 24l6.32-1.66a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.92-5.34 11.92-11.93 0-3.18-1.24-6.17-3.48-8.4zM12.08 21.8a9.9 9.9 0 0 1-5.06-1.38l-.36-.21-3.75.98 1-3.65-.23-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.92-9.9a9.87 9.87 0 0 1 6.99 2.89 9.86 9.86 0 0 1 2.9 6.99c0 5.46-4.45 9.92-9.9 9.92zm5.42-7.4c-.3-.15-1.76-.88-2.04-.98-.27-.1-.47-.15-.67.15-.2.29-.76.97-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"
        fill="#25D366"
      />
    </svg>
  );
}
