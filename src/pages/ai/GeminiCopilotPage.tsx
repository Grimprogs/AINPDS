import React from 'react';
import { Bot, Shield, Activity, Cpu, Sparkles, Terminal, Ban } from 'lucide-react';
import { GeminiChatbot } from '../../components/chat/GeminiChatbot';
import { SystemHealthMetrics, SecurityAlert, BlockedIpEntry } from '../../types';

interface GeminiCopilotPageProps {
  systemHealth: SystemHealthMetrics;
  alerts: SecurityAlert[];
  blockedIps: BlockedIpEntry[];
}

export const GeminiCopilotPage: React.FC<GeminiCopilotPageProps> = ({
  systemHealth,
  alerts,
  blockedIps
}) => {
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  return (
    <div className="space-y-4 text-zinc-300">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-xs font-mono shadow-sm">
              <Bot className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Gemini Multi-Turn Cyber Defense Copilot
              </h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono font-bold">
                1ST-LAYER AI GROUNDED
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time conversational cybersecurity intelligence with role-based system instructions and multi-model reasoning.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-black border border-zinc-800 px-3 py-1.5 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">STATUS:</span>
            <span className="text-white font-bold">COGNITIVE DEFENSE ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Context Sidebar + Interactive Gemini Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Side: Real-Time Context Snapshot (1 col) */}
        <div className="space-y-4 lg:col-span-1">
          {/* Live Telemetry Summary */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-white uppercase text-[11px]">System Snapshot</span>
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Throughput</span>
                <span className="text-white font-bold">{systemHealth.packetsPerSecond.toLocaleString()} pps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Protected Subnet</span>
                <span className="text-zinc-300">10.0.1.0/24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Active Threats</span>
                <span className={`font-bold ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeAlerts.length} Critical
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Auto-Blocked Hosts</span>
                <span className="text-white font-bold">{blockedIps.length} IPs</span>
              </div>
            </div>
          </div>

          {/* Model Selection Guide */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-2.5 font-mono text-xs shadow-sm">
            <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-800">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="font-bold text-white uppercase text-[11px]">Adaptive Model Tiering</span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-2 bg-black rounded border border-zinc-800">
                <div className="font-bold font-mono text-white text-[11px]">gemini-3.5-flash</div>
                <p className="text-zinc-400 text-[10px] mt-0.5">
                  General tasks, incident triage & network defense recommendations.
                </p>
              </div>

              <div className="p-2 bg-black rounded border border-zinc-800">
                <div className="font-bold font-mono text-white text-[11px]">gemini-3.1-pro-preview</div>
                <p className="text-zinc-400 text-[10px] mt-0.5">
                  Complex tasks, deep forensic reasoning, packet correlation & firewall architecture.
                </p>
              </div>

              <div className="p-2 bg-black rounded border border-zinc-800">
                <div className="font-bold font-mono text-white text-[11px]">gemini-3.1-flash-lite</div>
                <p className="text-zinc-400 text-[10px] mt-0.5">
                  Fast tasks, ultra-low latency lookups, quick IP checks & header summaries.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Active Threats */}
          {activeAlerts.length > 0 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-2 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase text-[11px] pb-1 border-b border-zinc-800">
                <Shield className="w-3.5 h-3.5" />
                <span>Active Attack Vectors</span>
              </div>
              {activeAlerts.slice(0, 3).map(a => (
                <div key={a.id} className="p-2 bg-black border border-zinc-800 rounded space-y-1">
                  <div className="font-bold text-white text-[11px] truncate">{a.title}</div>
                  <div className="text-[10px] text-zinc-400">{a.srcIp} &rarr; :{a.dstPort}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Multi-Turn Gemini Chatbot (3 cols) */}
        <div className="lg:col-span-3">
          <GeminiChatbot systemHealth={systemHealth} />
        </div>
      </div>
    </div>
  );
};
