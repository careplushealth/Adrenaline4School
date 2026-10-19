'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet, Calendar, TrendingUp } from 'lucide-react';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      });
  }, []);

  const triggerExport = (reportName: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,Metric,Value,Report Date\n' +
      `"Total Orders",${stats?.totalOrders || 0},${new Date().toISOString()}\n` +
      `"Awaiting Pharmacy Review",${stats?.awaitingPharmacy || 0},${new Date().toISOString()}\n` +
      `"Outstanding Invoices Balance (£)",${(stats?.outstandingInvoicesBalance || 0).toFixed(2)},${new Date().toISOString()}\n` +
      `"Supplies Approaching Expiry (≤3 Months)",${stats?.approachingExpiry || 0},${new Date().toISOString()}\n` +
      `"Staff CPD Completions",${stats?.totalCompletions || 0},${new Date().toISOString()}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy-950">Business Analytics & Compliance Reports</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Export executive CSV summaries for school business managers, MAT trustees, and pharmacy audit trails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-1">Executive Order & Revenue Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Comprehensive breakdown of all historical school orders, BACS payments, VAT treatment, and delivery status.
            </p>
          </div>
          <button
            onClick={() => triggerExport('executive-order-summary')}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-1">School Expiry Schedule Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Complete inventory of registered auto-injector batch numbers across all schools, days remaining, and reminder states.
            </p>
          </div>
          <button
            onClick={() => triggerExport('school-expiry-audit')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Expiry Audit CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-1">BACS Invoices & Debtor Aging</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Financial reconciliation of 30-day educational credit accounts, outstanding balances, and overdue invoices.
            </p>
          </div>
          <button
            onClick={() => triggerExport('bacs-debtor-aging')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Debtor Report CSV
          </button>
        </div>
      </div>
    </div>
  );
}
