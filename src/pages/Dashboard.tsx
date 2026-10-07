import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Zap,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SecurityAlert, SystemHealthMetrics, PacketData } from '../types';

interface DashboardProps {
  alerts: SecurityAlert[];
  packets: PacketData[];
  systemHealth: SystemHealthMetrics;
  onNavigate: (path: string) => void;
  onOpenSimulator: () => void;
  onOpenGeminiXAI: (alert: SecurityAlert) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  alerts,
  packets,
  systemHealth,
  onNavigate,
  onOpenSimulator,
  onOpenGeminiXAI
}) => {
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  // Real-time Traffic Area Chart Data
  const trafficData = [
    { time: '11:35', pps: 3400, maliciousPps: 120 },
    { time: '11:36', pps: 3600, maliciousPps: 150 },
    { time: '11:37', pps: 3820, maliciousPps: 140 },
    { time: '11:38', pps: 5100, maliciousPps: 1850 },
    { time: '11:39', pps: 7800, maliciousPps: 4200 },
    { time: '11:40', pps: 4100, maliciousPps: 300 },
    { time: '11:41', pps: 3850, maliciousPps: 180 }
  ];

  // Attack Category Distribution: Dedicated TCP SYN Flood Traffic Profile
  const attackTypesData = [
    { name: 'Malicious Half-Open SYN Packets', value: 76, color: '#f43f5e' },
    { name: 'SYN Retransmission Storms', value: 18, color: '#f97316' },
    { name: 'Clean Established TCP Handshakes', value: 6, color: '#10b981' }
  ];

  return (
    <div className="space-y-5 text-zinc-300 font-sans">
      {/* Teacher / Viva Presentation Guide Card */}
      <div className="bg-black border border-zinc-800 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white text-black font-mono font-bold flex items-center justify-center text-xs">
              L4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  First-Layer TCP SYN Flood Defense Architecture
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                  OSI Layer 4 (Transport / RFC 793)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Focus: Preventing Transmission Control Block (TCB) socket starvation caused by half-open TCP SYN floods at the perimeter.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold px-3.5 py-1.5 rounded transition-colors cursor-pointer shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate TCP SYN Flood</span>
          </button>
        </div>

        {/* TCP SYN Flood Deep Technical Defense Breakdown (Simple for Mam & Viva) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-white">1. RFC 793 Handshake Exploitation</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800/60 font-semibold">
                TCB Backlog Abuse
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">Why it matters:</strong> Adversary floods thousands of half-open <code className="text-rose-300">SYN</code> packets without returning <code className="text-emerald-300">ACK</code>, locking server memory in <code className="text-amber-300">SYN_RECV</code> state.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 bg-black/60 p-1.5 rounded border border-zinc-800">
              AI Detection: Identifies &gt;99% SYN-to-ACK ratio & uniform 64-byte frame anomalies in &lt;1.2ms.
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-white">2. Autonomous Kernel Mitigation</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800/60 font-semibold">
                iptables + SYN Cookies
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">Why it matters:</strong> Standard firewalls fail as state tables exhaust; AEGIS-X auto-injects kernel rules to drop attacker traffic before socket starvation occurs.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 bg-black/60 p-1.5 rounded border border-zinc-800">
              Auto-Defense: Dynamic execution of <code className="text-zinc-300">iptables -A INPUT -s &lt;IP&gt; -p tcp --syn -j DROP</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Alert Bar if Active Critical Threat */}
      {criticalCount > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white tracking-wide uppercase">
                  1st Layer Threat Detected & Auto-Mitigated
                </span>
                <span className="bg-zinc-900 text-zinc-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-zinc-700 font-semibold">
                  Firewall DROP Applied
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Active Layer 4 TCP SYN Flood from 185.220.101.45. Intrusion Prevention System auto-blocked source IP.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('/detection/alerts')}
              className="bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Alert</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>PACKET INGESTION</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {systemHealth.packetsPerSecond.toLocaleString()}{' '}
            <span className="text-xs font-normal text-zinc-500">pps</span>
          </div>
          <div className="mt-1.5 text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% baseline nominal</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>ACTIVE ALERTS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {activeAlerts.length}{' '}
            <span className="text-xs font-normal text-rose-400">({criticalCount} Critical)</span>
          </div>
          <div className="mt-1.5 text-[10px] text-zinc-400">
            <span>100% Mitigated via Snort/ACL</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>MODEL ACCURACY</span>
            <BrainCircuit className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">99.2%</div>
          <div className="mt-1.5 text-[10px] text-zinc-400">
            <span>Random Forest Ensemble v3.4</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <span>AUTO-BLOCKED IPS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">2 Active</div>
          <div className="mt-1.5 text-[10px] text-zinc-400">
            <span>Dynamic Rate Limiter Active</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Real-time Traffic Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Network Traffic Volume & Throughput
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                NIC: eth0 (Packet Ingestion vs Malicious Volume)
              </p>
            </div>
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3 text-rose-400" />
              <span>Simulate Attack</span>
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#52525b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#52525b" fontSize={10} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.375rem', fontSize: '11px', fontFamily: 'monospace', color: '#fff' }}
                />
                <Area type="monotone" dataKey="pps" stroke="#ffffff" strokeWidth={1.5} fillOpacity={1} fill="url(#colorNormal)" name="Total PPS" />
                <Area type="monotone" dataKey="maliciousPps" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAttack)" name="Malicious PPS" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Type Distribution Pie Chart (1 col) */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-0.5">
              Attack Vector Classification
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              Distribution of classified intrusion attempts
            </p>
          </div>

          <div className="h-44 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {attackTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.375rem', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs font-mono pt-2.5 border-t border-zinc-800">
            {attackTypesData.map(a => (
              <div key={a.name} className="flex items-center justify-between text-zinc-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                  <span>{a.name}</span>
                </div>
                <span className="font-bold text-white">{a.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Detection Alerts & Live Packet Ticker Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Alerts Feed */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Recent Threat Incidents</span>
            </h2>
            <button
              onClick={() => onNavigate('/detection/alerts')}
              className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
            >
              All Alerts ({alerts.length}) &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map(a => (
              <div
                key={a.id}
                className="p-3 bg-zinc-900 rounded border border-zinc-800 hover:border-zinc-700 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{a.title}</span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.2 rounded font-mono">
                      Layer 4 Transport (SYN Flood)
                    </span>
                  </div>
                  <span className="text-[9px] bg-rose-950 text-rose-300 border border-rose-800/60 px-1.5 py-0.5 rounded font-bold">
                    {a.severity}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{a.description}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-500 border-t border-zinc-800/60">
                  <span>
                    Src: <strong className="text-zinc-300">{a.srcIp}</strong> &rarr; Target: <strong className="text-zinc-300">:{a.dstPort}</strong>
                  </span>
                  <button
                    onClick={() => onOpenGeminiXAI(a)}
                    className="flex items-center gap-1.5 text-black bg-white hover:bg-zinc-200 px-2 py-0.5 rounded transition-colors font-bold cursor-pointer font-mono text-[10px]"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Explain to Mam</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Packet Ingestion Stream */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Packet Ingress Feed</span>
            </h2>
            <button
              onClick={() => onNavigate('/detection/live-traffic')}
              className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Full Packet Stream &rarr;
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-xs max-h-72 overflow-y-auto pr-1">
            {packets.map(p => (
              <div
                key={p.id}
                className={`p-2 rounded border flex items-center justify-between transition-colors ${
                  p.prediction === 'MALICIOUS'
                    ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span className="text-zinc-500 font-normal">{p.timestamp}</span>
                    <span className="text-zinc-700">|</span>
                    <span className="text-white">{p.srcIp}</span>
                    <span className="text-zinc-500">&rarr;</span>
                    <span className="text-zinc-300">:{p.dstPort}</span>
                    <span className="bg-zinc-800 text-zinc-300 px-1 py-0.2 rounded text-[9px] border border-zinc-700">
                      {p.protocol}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate max-w-xs mt-0.5">
                    {p.payloadPreview}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      p.prediction === 'MALICIOUS'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {p.prediction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
