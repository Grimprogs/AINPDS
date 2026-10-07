import React from 'react';
import { ShieldAlert, Zap, Activity, CheckCircle, Flame } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export const AttackAnalytics: React.FC = () => {
  const attackData = [
    { type: 'Volumetric SYN (Port 80)', count: 6850 },
    { type: 'Secure HTTPS SYN (Port 443)', count: 4920 },
    { type: 'Distributed Spoofed SYN', count: 7240 },
    { type: 'High-Rate Burst SYN', count: 3410 },
    { type: 'Paced Stealth SYN', count: 1820 }
  ];

  const synTimelineData = [
    { time: '11:00', synPps: 1200, ackPps: 1180, droppedPps: 0 },
    { time: '11:10', synPps: 1450, ackPps: 1420, droppedPps: 0 },
    { time: '11:20', synPps: 16800, ackPps: 45, droppedPps: 16750 },
    { time: '11:30', synPps: 24200, ackPps: 60, droppedPps: 24140 },
    { time: '11:40', synPps: 3800, ackPps: 3750, droppedPps: 50 },
    { time: '11:50', synPps: 1350, ackPps: 1330, droppedPps: 0 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">5.2 TCP SYN Flood Pattern & Forensics Analysis</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Dedicated Layer 4 (Transport / RFC 793) volumetric telemetry, half-open socket backlog exhaustion & automated mitigation rates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Target Focus: <strong className="text-emerald-400">TCP SYN Flood Only</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400">Total SYN Floods Mitigated</span>
          <p className="text-2xl font-bold text-rose-400">24,240</p>
          <span className="text-[10px] text-emerald-400 font-sans">100% Kernel DROP enforcement</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400">Average SYN-to-ACK Anomaly</span>
          <p className="text-2xl font-bold text-amber-400">99.6%</p>
          <span className="text-[10px] text-slate-400 font-sans">Normal baseline: 49.8%</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400">Mean AI Inference Latency</span>
          <p className="text-2xl font-bold text-sky-400">1.18 ms</p>
          <span className="text-[10px] text-slate-400 font-sans">Random Forest 100 Trees</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-slate-400">TCB Backlog Protection</span>
          <p className="text-2xl font-bold text-emerald-400">Active</p>
          <span className="text-[10px] text-slate-400 font-sans">Zero socket starvation</span>
        </div>
      </div>

      {/* Breakdown by SYN Flood Variant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Mitigated Floods by TCP Vector & Target Port</span>
            </h3>
            <span className="text-[10px] text-slate-400">RFC 793 Transport</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackData}>
                <XAxis dataKey="type" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#f43f5e" radius={[8, 8, 0, 0]} name="Blocked Packets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>SYN vs ACK Packet Velocity Ratio Surge</span>
            </h3>
            <span className="text-[10px] text-rose-400 font-bold">Flood Surge & Drop</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={synTimelineData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
                <Area type="monotone" dataKey="synPps" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} name="TCP SYN Ingress (pps)" />
                <Area type="monotone" dataKey="droppedPps" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} name="Automated Dropped (pps)" />
                <Area type="monotone" dataKey="ackPps" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Normal ACK Returns (pps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
