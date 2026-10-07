import React from 'react';
import { BlockedIpEntry } from '../../types';
import { ShieldCheck, Ban, Trash2, ShieldAlert } from 'lucide-react';
import { unblockIpApi } from '../../services/api';

interface IpManagementProps {
  blockedIps: BlockedIpEntry[];
  onRefresh: () => void;
}

export const IpManagement: React.FC<IpManagementProps> = ({ blockedIps, onRefresh }) => {
  const handleUnblock = async (ip: string) => {
    await unblockIpApi(ip);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Ban className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">2.2 IP Management & Blacklist Control</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Manage active IP drop lists, subnet bans, and automated IPS lockout expirations
          </p>
        </div>
      </div>

      {/* Blocked IP Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 font-mono">
          Currently Blocked Offending IP Addresses ({blockedIps.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Blocked IP</th>
                <th className="p-3">Country</th>
                <th className="p-3">Reason / Trigger</th>
                <th className="p-3">Blocked At</th>
                <th className="p-3">Expires At</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {blockedIps.map(entry => (
                <tr key={entry.ip} className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-rose-400">{entry.ip}</td>
                  <td className="p-3 text-slate-300">{entry.country}</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{entry.reason}</td>
                  <td className="p-3 text-slate-400">{entry.blockedAt.slice(11, 19)}</td>
                  <td className="p-3 text-slate-400">{entry.expiresAt.slice(11, 19)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleUnblock(entry.ip)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer"
                    >
                      Unblock IP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
