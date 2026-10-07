import React, { useEffect, useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AttackSimulatorModal } from './components/common/AttackSimulatorModal';
import { GeminiXAIModal } from './components/common/GeminiXAIModal';

// Types & Services
import { SecurityAlert, PacketData, FirewallRule, BlockedIpEntry, SystemHealthMetrics, MLModelInfo } from './types';
import {
  fetchAlertsApi,
  fetchPacketsApi,
  fetchFirewallRulesApi,
  fetchBlockedIpsApi,
  fetchSystemHealthApi,
  fetchModelsApi
} from './services/api';

// Pages
import { Dashboard } from './pages/Dashboard';
import { AlertAnalysis } from './pages/detection/AlertAnalysis';
import { LiveTraffic } from './pages/detection/LiveTraffic';
import { AttackMap } from './pages/detection/AttackMap';
import { ThreatIntel } from './pages/detection/ThreatIntel';
import { Vulnerabilities } from './pages/detection/Vulnerabilities';

import { FirewallControl } from './pages/prevention/FirewallControl';
import { IpManagement } from './pages/prevention/IpManagement';
import { RulesEngine } from './pages/prevention/RulesEngine';
import { ResponseHistory } from './pages/prevention/ResponseHistory';
import { AutoBlocking } from './pages/prevention/AutoBlocking';

import { Reports } from './pages/management/Reports';
import { SystemHealth } from './pages/management/SystemHealth';
import { UsersRoles } from './pages/management/UsersRoles';
import { SettingsPage } from './pages/management/SettingsPage';
import { AuditLogs } from './pages/management/AuditLogs';

import { TrafficMonitor } from './pages/monitoring/TrafficMonitor';
import { SystemPerformance } from './pages/monitoring/SystemPerformance';
import { NetworkStatus } from './pages/monitoring/NetworkStatus';
import { SensorsStatus } from './pages/monitoring/SensorsStatus';

import { TrafficAnalytics } from './pages/analytics/TrafficAnalytics';
import { AttackAnalytics } from './pages/analytics/AttackAnalytics';
import { TopTalkers } from './pages/analytics/TopTalkers';
import { ProtocolAnalysis } from './pages/analytics/ProtocolAnalysis';
import { GeoAnalysis } from './pages/analytics/GeoAnalysis';

import { ModelOverview } from './pages/ai/ModelOverview';
import { ModelPerformance } from './pages/ai/ModelPerformance';
import { ShapAnalysis } from './pages/ai/ShapAnalysis';
import { Datasets } from './pages/ai/Datasets';
import { ModelTraining } from './pages/ai/ModelTraining';
import { GeminiCopilotPage } from './pages/ai/GeminiCopilotPage';
import { GeminiChatbot } from './components/chat/GeminiChatbot';
import { VeoVideoStudio } from './pages/video/VeoVideoStudio';
import { VeoBackgroundCanvas } from './components/video/VeoBackgroundCanvas';
import { Bot, X, Film, Layers, Sliders } from 'lucide-react';

import { Integrations } from './pages/system/Integrations';
import { BackupRestore } from './pages/system/BackupRestore';
import { Notifications } from './pages/system/Notifications';
import { ApiSettings } from './pages/system/ApiSettings';
import { Maintenance } from './pages/system/Maintenance';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // State Data
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIpEntry[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics>({
    cpuUsage: 24.5,
    memoryUsage: 48.2,
    diskUsage: 38.0,
    networkThroughputMbps: 124.5,
    packetsPerSecond: 3850,
    activeSensorsCount: 4,
    sensorHealthPercent: 100,
    uptimeSeconds: 86400,
    captureEngineStatus: 'RUNNING'
  });
  const [models, setModels] = useState<MLModelInfo[]>([]);

  // Modals
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedAlertForXAI, setSelectedAlertForXAI] = useState<SecurityAlert | null>(null);
  const [showCopilotDrawer, setShowCopilotDrawer] = useState(false);
  const [showBgSettings, setShowBgSettings] = useState(false);

  // Animated Background State (Persisted in localStorage)
  const [bgUrl, setBgUrl] = useState<string | null>(() => {
    return localStorage.getItem('nidps_bg_url') || '/assets/images/cyber_soc_center_1790016152073.jpg';
  });
  const [bgType, setBgType] = useState<'video' | 'image' | 'canvas'>(() => {
    return (localStorage.getItem('nidps_bg_type') as any) || 'image';
  });
  const [bgEnabled, setBgEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('nidps_bg_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [bgOpacity, setBgOpacity] = useState<number>(() => {
    const saved = localStorage.getItem('nidps_bg_opacity');
    return saved ? parseFloat(saved) : 0.22;
  });
  const [bgBlur, setBgBlur] = useState<number>(() => {
    const saved = localStorage.getItem('nidps_bg_blur');
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateBackground = (params: {
    url?: string | null;
    type?: 'video' | 'image' | 'canvas';
    enabled?: boolean;
    opacity?: number;
    blur?: number;
  }) => {
    if (params.url !== undefined) {
      setBgUrl(params.url);
      localStorage.setItem('nidps_bg_url', params.url || '');
    }
    if (params.type !== undefined) {
      setBgType(params.type);
      localStorage.setItem('nidps_bg_type', params.type);
    }
    if (params.enabled !== undefined) {
      setBgEnabled(params.enabled);
      localStorage.setItem('nidps_bg_enabled', String(params.enabled));
    }
    if (params.opacity !== undefined) {
      setBgOpacity(params.opacity);
      localStorage.setItem('nidps_bg_opacity', String(params.opacity));
    }
    if (params.blur !== undefined) {
      setBgBlur(params.blur);
      localStorage.setItem('nidps_bg_blur', String(params.blur));
    }
  };

  // Load All Data from Backend API
  const loadData = async () => {
    try {
      const [a, p, f, b, h, m] = await Promise.all([
        fetchAlertsApi(),
        fetchPacketsApi(),
        fetchFirewallRulesApi(),
        fetchBlockedIpsApi(),
        fetchSystemHealthApi(),
        fetchModelsApi()
      ]);
      setAlerts(a);
      setPackets(p);
      setFirewallRules(f);
      setBlockedIps(b);
      setSystemHealth(h);
      setModels(m);
    } catch (err) {
      console.error('Failed to load live data:', err);
    }
  };

  // Initial Load & Real-time Polling (every 3 seconds)
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // View Router Render Function
  const renderView = () => {
    switch (currentPath) {
      case '/dashboard':
        return (
          <Dashboard
            alerts={alerts}
            packets={packets}
            systemHealth={systemHealth}
            onNavigate={setCurrentPath}
            onOpenSimulator={() => setShowSimulator(true)}
            onOpenGeminiXAI={alert => setSelectedAlertForXAI(alert)}
          />
        );

      // 1. Detection Module
      case '/detection/alerts':
        return <AlertAnalysis alerts={alerts} onOpenGeminiXAI={alert => setSelectedAlertForXAI(alert)} onRefresh={loadData} />;
      case '/detection/live-traffic':
        return <LiveTraffic packets={packets} />;
      case '/detection/map':
        return <AttackMap />;
      case '/detection/threat-intel':
        return <ThreatIntel />;
      case '/detection/vulnerabilities':
        return <Vulnerabilities />;

      // 2. Prevention Module
      case '/prevention/firewall':
        return <FirewallControl rules={firewallRules} onRefresh={loadData} />;
      case '/prevention/ip-mgmt':
        return <IpManagement blockedIps={blockedIps} onRefresh={loadData} />;
      case '/prevention/rules-engine':
        return <RulesEngine />;
      case '/prevention/response-history':
        return <ResponseHistory />;
      case '/prevention/auto-blocking':
        return <AutoBlocking />;

      // 3. Management Module
      case '/management/reports':
        return <Reports />;
      case '/management/health':
        return <SystemHealth systemHealth={systemHealth} />;
      case '/management/users':
        return <UsersRoles />;
      case '/management/settings':
        return <SettingsPage />;
      case '/management/audit':
        return <AuditLogs />;

      // 4. Monitoring Module
      case '/monitoring/dashboard':
      case '/monitoring/traffic':
        return <TrafficMonitor />;
      case '/monitoring/performance':
        return <SystemPerformance />;
      case '/monitoring/network':
        return <NetworkStatus />;
      case '/monitoring/sensors':
        return <SensorsStatus />;

      // 5. Analytics Module
      case '/analytics/traffic':
        return <TrafficAnalytics />;
      case '/analytics/attack':
        return <AttackAnalytics />;
      case '/analytics/top-talkers':
        return <TopTalkers />;
      case '/analytics/protocol':
        return <ProtocolAnalysis />;
      case '/analytics/geo':
        return <GeoAnalysis />;

      // 6. AI / ML Module
      case '/ai/copilot':
      case '/ai/chat':
        return (
          <GeminiCopilotPage
            systemHealth={systemHealth}
            alerts={alerts}
            blockedIps={blockedIps}
          />
        );
      case '/ai/models':
        return <ModelOverview models={models} onRefresh={loadData} />;
      case '/ai/performance':
        return <ModelPerformance />;
      case '/ai/shap':
        return <ShapAnalysis />;
      case '/ai/datasets':
        return <Datasets />;
      case '/ai/training':
        return <ModelTraining onRefresh={loadData} />;

      // 7. System Module
      case '/system/integrations':
        return <Integrations />;
      case '/system/backup':
        return <BackupRestore />;
      case '/system/notifications':
        return <Notifications />;
      case '/system/api':
        return <ApiSettings />;
      case '/system/maintenance':
        return <Maintenance />;

      // 8. Veo Video Generation & Website Background Studio
      case '/video/studio':
      case '/video':
      case '/ai/video':
        return (
          <VeoVideoStudio
            currentBgUrl={bgUrl}
            currentBgType={bgType}
            bgOpacity={bgOpacity}
            bgBlur={bgBlur}
            bgEnabled={bgEnabled}
            onSetBackground={updateBackground}
          />
        );

      default:
        return (
          <Dashboard
            alerts={alerts}
            packets={packets}
            systemHealth={systemHealth}
            onNavigate={setCurrentPath}
            onOpenSimulator={() => setShowSimulator(true)}
            onOpenGeminiXAI={alert => setSelectedAlertForXAI(alert)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 flex flex-col font-sans selection:bg-indigo-600 selection:text-white overflow-hidden relative">
      {/* Living Animated Video Background Layer */}
      <VeoBackgroundCanvas
        videoUrl={bgType === 'video' ? bgUrl : null}
        imageUrl={bgType === 'image' ? bgUrl : null}
        opacity={bgOpacity}
        blurPx={bgBlur}
        enabled={bgEnabled}
      />

      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={path => {
          setCurrentPath(path);
          setMobileMenuOpen(false);
        }}
        systemHealth={systemHealth}
        alerts={alerts}
        onOpenSimulator={() => setShowSimulator(true)}
        onLogout={() => setCurrentPath('/login')}
        isMobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Navigation Tree Sidebar */}
        <Sidebar
          currentPath={currentPath}
          onNavigate={path => {
            setCurrentPath(path);
            setMobileMenuOpen(false);
          }}
          onLogout={() => setCurrentPath('/login')}
          isOpenOnMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Main Workspace View with ambient transparency */}
        <main className="flex-1 overflow-y-auto bg-black/40 backdrop-blur-[2px] p-3 sm:p-4 md:p-6 relative">
          {renderView()}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-auto sm:h-8 py-1.5 sm:py-0 bg-[#0E0E10] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 shrink-0 z-30 gap-1 text-center sm:text-left">
        <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase truncate max-w-full">
          Architecture: Micro-Services | L3/L4 Network IPS | Real-Time ML Inference
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 shrink-0">
          FYP-FY2026-ENG-082 // UNIVERSITY SUBMISSION READY
        </div>
      </footer>

      {/* Attack Simulator Modal */}
      {showSimulator && (
        <AttackSimulatorModal
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
          onAttackTriggered={() => {
            loadData();
          }}
        />
      )}

      {/* Gemini XAI Threat Analysis Modal */}
      {selectedAlertForXAI && (
        <GeminiXAIModal
          isOpen={!!selectedAlertForXAI}
          alert={selectedAlertForXAI}
          onClose={() => setSelectedAlertForXAI(null)}
        />
      )}

      {/* Floating Copilot Launcher Button (visible on all pages except full copilot page) */}
      {currentPath !== '/ai/copilot' && !showCopilotDrawer && (
        <button
          onClick={() => setShowCopilotDrawer(true)}
          className="fixed bottom-10 right-3 sm:bottom-12 sm:right-6 z-30 bg-white hover:bg-zinc-200 text-black px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-1.5 sm:gap-2 border border-zinc-300 font-mono text-[11px] sm:text-xs font-bold transition-transform hover:scale-105 cursor-pointer"
          title="Open Gemini Cyber Copilot Drawer"
        >
          <Bot className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden xs:inline sm:inline">Ask Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </button>
      )}

      {/* Slide-over Copilot Drawer */}
      {showCopilotDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
          <div className="w-full sm:max-w-xl bg-zinc-950 h-full border-l border-zinc-800 flex flex-col shadow-2xl p-3 sm:p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800 shrink-0 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-white" />
                <span className="font-bold text-white uppercase truncate">Gemini Copilot</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowCopilotDrawer(false);
                    setCurrentPath('/ai/copilot');
                  }}
                  className="text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] cursor-pointer"
                >
                  Full View &rarr;
                </button>
                <button
                  onClick={() => setShowCopilotDrawer(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <GeminiChatbot
                compact={true}
                systemHealth={systemHealth}
                onClose={() => setShowCopilotDrawer(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Website Background Settings Controller */}
      <div className="fixed bottom-10 left-3 sm:bottom-12 sm:left-6 z-30">
        <button
          onClick={() => setShowBgSettings(!showBgSettings)}
          className="bg-black/90 hover:bg-zinc-900 text-white border border-zinc-700 hover:border-zinc-500 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-2xl flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs cursor-pointer backdrop-blur-md transition-transform hover:scale-105"
          title="Website Background Controls"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold">
            BG: {bgEnabled ? `${Math.round(bgOpacity * 100)}%` : 'OFF'}
          </span>
        </button>

        {showBgSettings && (
          <div className="absolute bottom-12 left-0 w-72 max-w-[calc(100vw-24px)] bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 shadow-2xl space-y-3 font-mono text-xs z-50">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-emerald-400" />
                <span>Background Controls</span>
              </span>
              <button
                onClick={() => setShowBgSettings(false)}
                className="text-zinc-400 hover:text-white p-0.5 rounded hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-[11px]">Website Background</span>
              <button
                onClick={() => updateBackground({ enabled: !bgEnabled })}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  bgEnabled ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                {bgEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-zinc-400">Opacity</span>
                <span className="text-white font-bold">{Math.round(bgOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.75"
                step="0.05"
                value={bgOpacity}
                onChange={e => updateBackground({ opacity: parseFloat(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            <div className="space-y-1 pt-1 border-t border-zinc-800/80">
              <span className="text-[10px] text-zinc-500 uppercase">Presets:</span>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => updateBackground({ url: '/assets/images/cyber_soc_center_1790016152073.jpg', type: 'image', enabled: true })}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 rounded text-left truncate cursor-pointer"
                >
                  SOC Center
                </button>
                <button
                  onClick={() => updateBackground({ url: '/assets/images/perimeter_firewall_grid_1790016177500.jpg', type: 'image', enabled: true })}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 rounded text-left truncate cursor-pointer"
                >
                  Firewall Grid
                </button>
                <button
                  onClick={() => updateBackground({ url: null, type: 'canvas', enabled: true })}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 rounded text-left truncate cursor-pointer"
                >
                  Cyber Matrix
                </button>
                <button
                  onClick={() => {
                    setShowBgSettings(false);
                    setCurrentPath('/video/studio');
                  }}
                  className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/80 text-[10px] text-emerald-300 rounded text-left font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>Veo Studio</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowBgSettings(false);
                setCurrentPath('/video/studio');
              }}
              className="w-full py-1.5 bg-white text-black hover:bg-zinc-200 text-[10px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
            >
              <Film className="w-3 h-3" />
              <span>Open Veo 3.1 Studio</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
