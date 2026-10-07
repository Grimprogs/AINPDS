import React from 'react';
import { mockUsers } from '../../data/mockData';
import { Users, UserPlus, Shield } from 'lucide-react';

export const UsersRoles: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">3.3 Access Control & RBAC User Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Role-Based Access Control (RBAC) permissions for Security Analysts, Incident Responders, and Auditors
          </p>
        </div>

        <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
          Add User Account
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Last Active</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {mockUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-950/50">
                <td className="p-3 font-bold text-slate-100">{u.name}</td>
                <td className="p-3 text-slate-400">{u.email}</td>
                <td className="p-3">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{u.lastActive}</td>
                <td className="p-3 text-emerald-400 font-bold">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
