import React from 'react';
import db from '@/lib/db';
import { ShieldAlert, Clock, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminAuditPage() {
  const auditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all() as any[];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy-950">System Audit Log</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Immutable forensic log of all administrative actions, pharmacy approvals, BACS verifications, and batch allocations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 text-slate-500">{log.created_at}</td>
                  <td className="py-3.5 px-4 font-bold text-navy-950 font-sans">{log.user_name || 'System'}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-700">{log.entity_type} ({log.entity_id || 'system'})</td>
                  <td className="py-3.5 px-4 font-sans text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
