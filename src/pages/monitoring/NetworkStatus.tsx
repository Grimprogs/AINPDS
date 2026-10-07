import React from 'react';
import { Network, Server, ShieldCheck, Cpu } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">4.4 Enterprise Network Topology</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Visual topology map of protected DMZ subnets, internal VLANs, and firewall ingress gateways
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <Server className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">External WAN Ingress</h3>
            <p className="text-[11px] text-slate-400">Untrusted Public Gateway (0.0.0.0/0)</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border-2 border-emerald-500 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-400">NIDPS Firewall & ML Core</h3>
            <p className="text-[11px] text-slate-400">eBPF Packet Inspection Node (10.0.1.1)</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
            <Cpu className="w-8 h-8 text-blue-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">Protected DMZ & Database VLAN</h3>
            <p className="text-[11px] text-slate-400">Internal Subnet (10.0.10.0/24)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
