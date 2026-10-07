import React from 'react';
import { SystemHealthMetrics } from '../../types';
import { Cpu, Activity, Server, Radio, ShieldCheck } from 'lucide-react';

interface SystemHealthProps {
  systemHealth: SystemHealthMetrics;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ systemHealth }) => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">3.2 System & Hardware Health Monitor</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Hardware resource allocation, packet capture engine status, and kernel ring buffer metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">CPU UTILIZATION</span>
          <div className="text-2xl font-bold text-slate-100">{systemHealth.cpuUsage.toFixed(1)}%</div>
          <div className="w-full bg-slate-950 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${systemHealth.cpuUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">MEMORY UTILIZATION</span>
          <div className="text-2xl font-bold text-slate-100">{systemHealth.memoryUsage.toFixed(1)}%</div>
          <div className="w-full bg-slate-950 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${systemHealth.memoryUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400">CAPTURE ENGINE STATUS</span>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span>{systemHealth.captureEngineStatus}</span>
          </div>
          <span className="text-[10px] text-slate-500">Zero packet drop in past 24 hrs</span>
        </div>
      </div>
    </div>
  );
};
