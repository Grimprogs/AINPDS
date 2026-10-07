import React, { useState } from 'react';
import { FirewallRule } from '../../types';
import { ShieldCheck, Plus, Trash2, ToggleLeft, ToggleRight, Check, X } from 'lucide-react';
import { createFirewallRuleApi, toggleFirewallRuleApi, deleteFirewallRuleApi } from '../../services/api';

interface FirewallControlProps {
  rules: FirewallRule[];
  onRefresh: () => void;
}

export const FirewallControl: React.FC<FirewallControlProps> = ({ rules, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<'INBOUND' | 'OUTBOUND'>('INBOUND');
  const [action, setAction] = useState<'ALLOW' | 'DENY' | 'DROP' | 'REJECT'>('DROP');
  const [protocol, setProtocol] = useState<'ALL' | 'TCP' | 'UDP' | 'ICMP'>('TCP');
  const [sourceIp, setSourceIp] = useState('ANY');
  const [destPort, setDestPort] = useState('80');

  const handleToggle = async (id: string) => {
    await toggleFirewallRuleApi(id);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await deleteFirewallRuleApi(id);
    onRefresh();
  };

  const handleAddRule = async () => {
    if (!name) return;
    await createFirewallRuleApi({
      name,
      direction,
      action,
      protocol,
      sourceIp,
      sourcePort: '*',
      destIp: 'ANY',
      destPort,
      comment: 'Custom Administrator Rule'
    });
    setName('');
    setShowAddModal(false);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131316] border border-white/10 p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              Firewall Control Center & Access Control Lists
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Configure active stateful packet filtering, access control lists (ACLs), and drop policies
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-md transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Firewall Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-[#131316] border border-white/10 rounded-xl p-5 space-y-3 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-[#0A0A0B] text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3">Status</th>
                <th className="p-3">Rule Name</th>
                <th className="p-3">Direction</th>
                <th className="p-3">Action</th>
                <th className="p-3">Protocol</th>
                <th className="p-3">Source IP</th>
                <th className="p-3">Dst Port</th>
                <th className="p-3">Hits</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rules.map(rule => (
                <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className="cursor-pointer text-slate-400 hover:text-white"
                    >
                      {rule.enabled ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Disabled
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-3 font-bold text-white">{rule.name}</td>
                  <td className="p-3 text-slate-400">{rule.direction}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.action === 'ALLOW'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {rule.action}
                    </span>
                  </td>
                  <td className="p-3">{rule.protocol}</td>
                  <td className="p-3 text-slate-300 font-mono">{rule.sourceIp}</td>
                  <td className="p-3 font-mono">{rule.destPort}</td>
                  <td className="p-3 text-slate-400">{rule.hitsCount.toLocaleString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131316] border border-white/10 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Create New Firewall Rule</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Rule Name:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Block Suspicious Subnet"
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Action:</label>
                <select
                  value={action}
                  onChange={e => setAction(e.target.value as any)}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                >
                  <option value="DROP">DROP</option>
                  <option value="DENY">DENY</option>
                  <option value="REJECT">REJECT</option>
                  <option value="ALLOW">ALLOW</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Protocol:</label>
                <select
                  value={protocol}
                  onChange={e => setProtocol(e.target.value as any)}
                  className="w-full bg-[#0A0A0B] border border-white/10 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Source IP / CIDR:</label>
              <input
                type="text"
                value={sourceIp}
                onChange={e => setSourceIp(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Destination Port:</label>
              <input
                type="text"
                value={destPort}
                onChange={e => setDestPort(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-white/10 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
