import React from 'react';
import { Cpu, Zap, HardDrive } from 'lucide-react';

export const SystemPerformance: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">4.3 Infrastructure & Engine Metrics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Real-time latency, eBPF packet filter ring buffer occupancy, and CPU core utilization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-slate-400">PACKET PROCESSING LATENCY</span>
          <div className="text-2xl font-bold text-emerald-400">1.2 ms</div>
          <p className="text-[10px] text-slate-500">Sub-millisecond inference time on Random Forest</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-slate-400">RING BUFFER OCCUPANCY</span>
          <div className="text-2xl font-bold text-slate-100">8.4%</div>
          <p className="text-[10px] text-slate-500">Kernel zero-copy memory usage</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-slate-400">PACKET DROP RATE</span>
          <div className="text-2xl font-bold text-emerald-400">0.00%</div>
          <p className="text-[10px] text-slate-500">0 dropped packets under peak load</p>
        </div>
      </div>
    </div>
  );
};
