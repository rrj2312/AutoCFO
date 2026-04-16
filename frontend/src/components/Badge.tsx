interface BadgeProps {
  severity: 'high' | 'medium' | 'low' | 'success' | 'info';
  label?: string;
}

const config = {
  high: { bg: 'bg-[#FF4C4C]/10', text: 'text-[#FF4C4C]', border: 'border-[#FF4C4C]/20', label: 'HIGH' },
  medium: { bg: 'bg-[#FFB800]/10', text: 'text-[#FFB800]', border: 'border-[#FFB800]/20', label: 'MEDIUM' },
  low: { bg: 'bg-[#00FF87]/10', text: 'text-[#00FF87]', border: 'border-[#00FF87]/20', label: 'LOW' },
  success: { bg: 'bg-[#00FF87]/10', text: 'text-[#00FF87]', border: 'border-[#00FF87]/20', label: 'DONE' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'INFO' },
};

export function Badge({ severity, label }: BadgeProps) {
  const c = config[severity];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider font-mono border ${c.bg} ${c.text} ${c.border}`}>
      {label ?? c.label}
    </span>
  );
}
