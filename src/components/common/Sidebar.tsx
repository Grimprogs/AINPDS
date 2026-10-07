import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Activity,
  BarChart3,
  BrainCircuit,
  LayoutDashboard,
  Cpu,
  BookOpen,
  Ban,
  LogOut,
  Bot,
  Film,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  onLogout,
  isOpenOnMobile = false,
  onCloseMobile
}) => {
  // Simplified, high-impact modules essential for First-Layer Network Defense (Layer 3 & 4)
  const navItems = [
    {
      group: 'Core Operations',
      items: [
        {
          label: 'SOC Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
          badge: 'Live'
        },
        {
          label: 'Threat Alerts',
          path: '/detection/alerts',
          icon: ShieldAlert,
          badge: 'Layer 3/4'
        },
        {
          label: 'Live Packet Stream',
          path: '/detection/live-traffic',
          icon: Activity
        }
      ]
    },
    {
      group: 'Firewall & Prevention',
      items: [
        {
          label: 'Firewall Control',
          path: '/prevention/firewall',
          icon: ShieldCheck
        },
        {
          label: 'Blocked IP List',
          path: '/prevention/ip-mgmt',
          icon: Ban
        }
      ]
    },
    {
      group: 'AI & Intelligence',
      items: [
        {
          label: 'Animate to Video (Veo)',
          path: '/video/studio',
          icon: Film,
          badge: 'Veo 3.1'
        },
        {
          label: 'Gemini AI Copilot',
          path: '/ai/copilot',
          icon: Bot,
          badge: 'Gemini'
        },
        {
          label: 'ML Model Insights',
          path: '/ai/models',
          icon: BrainCircuit
        },
        {
          label: 'SHAP Feature Weights',
          path: '/ai/shap',
          icon: Cpu
        },
        {
          label: 'Traffic Analytics',
          path: '/analytics/attack',
          icon: BarChart3
        }
      ]
    },
    {
      group: 'Documentation & System',
      items: [
        {
          label: 'Teacher Defense Guide',
          path: '/management/reports',
          icon: BookOpen
        },
        {
          label: 'System Status',
          path: '/management/health',
          icon: Sliders
        }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop for Mobile & Tablet screens */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-14 bottom-0 left-0 z-40 w-64 lg:w-56 bg-zinc-950 lg:bg-black border-r border-zinc-800 flex flex-col h-[calc(100vh-3.5rem)] select-none shrink-0 overflow-hidden text-zinc-300 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 lg:hidden bg-black/90 shrink-0">
          <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
            Navigation Menu
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-xs font-mono">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const IconComp = item.icon;
                  const isActive = currentPath === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 sm:py-1.5 rounded text-left transition-colors cursor-pointer text-xs min-h-[40px] sm:min-h-0 ${
                        isActive
                          ? 'bg-white text-black font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ml-1 ${
                            isActive
                              ? 'bg-black text-white'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer System Status */}
        <div className="p-2.5 bg-black border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">1st-Layer IPS Active</span>
          </div>
          <button
            onClick={onLogout}
            className="text-zinc-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
