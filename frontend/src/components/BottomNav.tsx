import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Activity, Upload } from 'lucide-react';

const tabs = [
  { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/risks', label: 'Risks', Icon: AlertTriangle },
  { path: '/activity', label: 'Activity', Icon: Activity },
  { path: '/upload', label: 'Upload', Icon: Upload },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D1424] border-t border-[#1F2937] px-2 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-4 min-w-0 flex-1 transition-all duration-150 ${
                active ? 'text-[#00FF87]' : 'text-[#4B5563] hover:text-[#9CA3AF]'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'drop-shadow-[0_0_6px_rgba(0,255,135,0.5)]' : ''}
              />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-[#00FF87]' : ''}`}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[#00FF87] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
