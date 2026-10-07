import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  Bell,
  Cpu,
  User as UserIcon,
  Search,
  BookOpen,
  HelpCircle,
  LogOut,
  ChevronDown,
  Bot,
  Film,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { SecurityAlert, SystemHealthMetrics } from '../../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  systemHealth: SystemHealthMetrics;
  alerts: SecurityAlert[];
  onOpenSimulator: () => void;
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  systemHealth,
  alerts,
  onOpenSimulator,
  userName = 'A3 SOC Analyst',
  userEmail = 'soc.analyst@aegis-x.internal',
  onLogout,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <header className="h-14 bg-black border-b border-zinc-800 px-3 md:px-6 flex items-center justify-between sticky top-0 z-40 text-zinc-300">
      {/* Left: Branding & Current Path */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold shadow-sm">
          <ShieldAlert className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs font-bold tracking-wider text-white uppercase font-mono leading-none">
              1ST-LAYER NIDPS
            </h1>
            <span className="text-[9px] bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-medium border border-zinc-700 leading-none hidden xs:inline">
              L3/L4 DEFENSE
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-mono tracking-tight mt-0.5 leading-none hidden sm:block">
            NETWORK & TRANSPORT LAYER
          </p>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800 mx-2 hidden md:block"></div>

        <div className="text-[11px] text-zinc-400 font-mono hidden md:flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
          <span className="text-zinc-600">view:</span>
          <span className="text-white font-medium">{currentPath}</span>
        </div>
      </div>

      {/* Center: First-Layer Defense Status Badges */}
      <div className="hidden lg:flex items-center gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-zinc-400 text-[11px]">1ST-LAYER SHIELD:</span>
          <span className="text-white font-bold text-[11px]">ACTIVE</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded">
          <span className="text-zinc-400 text-[11px]">THROUGHPUT:</span>
          <span className="text-white font-bold text-[11px]">{systemHealth.packetsPerSecond.toLocaleString()} pps</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded">
          <span className="text-zinc-400 text-[11px]">FOCUSED VECTORS:</span>
          <span className="text-emerald-400 font-bold text-[11px]">SYN FLOOD + PORT SCAN</span>
        </div>
      </div>

      {/* Right: Quick Action & User Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Simulate Attack Trigger Button */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded transition-colors cursor-pointer font-mono shadow-sm"
          title="Simulate 1st Layer Network Attack"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-black" />
          <span className="inline">Simulate Attack</span>
        </button>

        {/* Veo Video Studio & Background Animator */}
        <button
          onClick={() => onNavigate('/video/studio')}
          className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2 sm:px-2.5 py-1.5 rounded transition-colors cursor-pointer border ${
            currentPath === '/video/studio'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-zinc-900 hover:bg-zinc-850 text-emerald-300 border-emerald-900/60'
          }`}
          title="Animate images into video using Veo 3.1 & set website background"
        >
          <Film className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Animate Video</span>
        </button>

        {/* Gemini AI Copilot Button */}
        <button
          onClick={() => onNavigate('/ai/copilot')}
          className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1.5 rounded transition-colors cursor-pointer border ${
            currentPath === '/ai/copilot'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-zinc-900 hover:bg-zinc-850 text-white border-zinc-700'
          }`}
          title="Open Gemini Multi-Turn AI Copilot"
        >
          <Bot className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Gemini Copilot</span>
        </button>

        {/* Teacher Viva & Report Guide Link */}
        <button
          onClick={() => onNavigate('/management/reports')}
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold px-2.5 py-1.5 rounded transition-colors cursor-pointer"
          title="Open Teacher Presentation Guide & Reports"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Presentation Guide</span>
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded border border-zinc-800 transition-colors relative cursor-pointer"
            title="Threat Incident Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-black" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-3 z-50 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <span className="font-semibold text-white">Active Threat Incidents</span>
                <span className="bg-rose-950 text-rose-300 border border-rose-800/60 px-1.5 py-0.5 rounded text-[10px]">
                  {activeAlertsCount} Active
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {alerts.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('/detection/alerts');
                    }}
                    className="p-2.5 rounded bg-zinc-900 hover:bg-zinc-850 cursor-pointer transition-colors border border-zinc-800/80"
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-rose-400 text-[11px]">{a.title}</span>
                      <span className="text-[9px] text-zinc-500">{a.timestamp.slice(11, 19)}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 font-sans">{a.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/40">
                      <span>{a.srcIp} &rarr; :{a.dstPort}</span>
                      <span className="text-emerald-400 font-semibold">{a.mitigationStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('/detection/alerts');
                }}
                className="w-full mt-2 text-center text-xs text-zinc-400 hover:text-white pt-1"
              >
                Open Incident Queue &rarr;
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded transition-colors text-xs text-zinc-300 cursor-pointer font-mono"
          >
            <div className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-bold text-[10px]">
              A3
            </div>
            <span className="hidden sm:inline text-white font-medium text-[11px]">{userName}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-1.5 z-50 text-xs font-mono">
              <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                <p className="font-semibold text-white">{userName}</p>
                <p className="text-[10px] text-zinc-500">{userEmail}</p>
              </div>
              <button
                onClick={() => { setShowUserMenu(false); onNavigate('/profile'); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded hover:bg-zinc-900 text-zinc-300 text-left cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-zinc-500" />
                Profile & RBAC
              </button>
              <button
                onClick={() => { setShowUserMenu(false); onNavigate('/support'); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded hover:bg-zinc-900 text-zinc-300 text-left cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                Help & Operations
              </button>
              <button
                onClick={() => { setShowUserMenu(false); onNavigate('/change-password'); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded hover:bg-zinc-900 text-zinc-300 text-left cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                Security Credentials
              </button>
              <div className="border-t border-zinc-800 my-1"></div>
              <button
                onClick={() => { setShowUserMenu(false); onLogout(); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded hover:bg-rose-950 text-rose-400 text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
