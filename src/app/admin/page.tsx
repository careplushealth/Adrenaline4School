'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Truck,
  FileText,
  AlertTriangle,
  BellRing,
  School,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [expiringSupplies, setExpiringSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setExpiringSupplies(data.expiringSupplies || []);
        }
      })
      .catch((err) => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
            Adrenaline4Schools Operating Portal
          </span>
          <h1 className="text-3xl font-black text-navy-950 mt-1">Pharmacy & Operations Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time school order queues, GPhC pharmacy verification, 30-day BACS invoices, and automated expiry tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy-800 hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Order Queue Metrics (Clickable filters per Section 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <Link
          href="/admin/orders"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-navy-950">{stats?.totalOrders ?? '—'}</div>
          <span className="text-[10px] text-slate-400 font-medium">All historical orders</span>
        </Link>

        {/* Awaiting Documentation */}
        <Link
          href="/admin/orders?status=awaiting_documentation"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Awaiting Docs</span>
            <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-600">{stats?.awaitingDocs ?? '—'}</div>
          <span className="text-[10px] text-slate-400 font-medium">Missing requisition</span>
        </Link>

        {/* Awaiting Pharmacy Approval */}
        <Link
          href="/admin/orders?status=awaiting_pharmacy_approval"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Pharmacy Queue</span>
            <ShieldCheck className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-sky-600">{stats?.awaitingPharmacy ?? '—'}</div>
          <span className="text-[10px] text-slate-400 font-medium">GPhC review needed</span>
        </Link>

        {/* Awaiting Payment */}
        <Link
          href="/admin/orders?status=awaiting_payment"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Awaiting BACS</span>
            <FileText className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-purple-600">{stats?.awaitingPayment ?? '—'}</div>
          <span className="text-[10px] text-slate-400 font-medium">Invoice issued</span>
        </Link>

        {/* Ready for Fulfilment */}
        <Link
          href="/admin/orders?status=approved_for_fulfilment"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Ready to Pack</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats?.readyForFulfilment ?? '—'}</div>
          <span className="text-[10px] text-slate-400 font-medium">Assign batches & ship</span>
        </Link>

        {/* Dispatched */}
        <Link
          href="/admin/orders?status=dispatched"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Dispatched</span>
            <Truck className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-navy-900">{stats?.dispatched ?? '—'}</div>
          <span className="text-[10px] text-slate-400 font-medium">Courier tracked</span>
        </Link>
      </div>

      {/* Financial & Expiry Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Outstanding Invoices */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-navy-900">BACS School Invoices</h3>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Unpaid Invoice Balance</p>
              <p className="text-2xl font-black text-navy-950">
                £{(stats?.outstandingInvoicesBalance ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">{stats?.outstandingInvoicesCount ?? 0} invoices issued</span>
              <span className="font-bold text-red-600">{stats?.overdueInvoices ?? 0} overdue</span>
            </div>
            <Link
              href="/admin/invoices"
              className="mt-2 block w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold text-center transition-colors"
            >
              Manage Invoices & Verify Transfers &rarr;
            </Link>
          </div>
        </div>

        {/* Approaching Expiry & Reminders */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-navy-900">Expiry Management Engine</h3>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <BellRing className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Supplies Expiring &le; 3 Months</p>
              <p className="text-2xl font-black text-amber-600">
                {stats?.approachingExpiry ?? 0} schools
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">{stats?.pendingReminders ?? 0} pending schedule</span>
              <span className="font-bold text-emerald-600">{stats?.sentReminders ?? 0} reminders sent</span>
            </div>
            <Link
              href="/admin/reminders"
              className="mt-2 block w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold text-center transition-colors"
            >
              Trigger Background Cron Sweep &rarr;
            </Link>
          </div>
        </div>

        {/* Schools & Training Completions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-navy-900">School Network & Training</h3>
            <span className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <School className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Registered Schools & MATs</p>
              <p className="text-2xl font-black text-navy-950">
                {stats?.totalSchools ?? 0} schools ({stats?.totalOrganisations ?? 0} trusts)
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">CPD Certificates Issued</span>
              <span className="font-bold text-brand-700">{stats?.totalCompletions ?? 0} staff passed</span>
            </div>
            <Link
              href="/admin/training"
              className="mt-2 block w-full py-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold text-center transition-colors"
            >
              View Learner Records & Certs &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-900">Recent School Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">No orders recorded.</p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-navy-900">{ord.order_reference}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                        ord.order_status === 'awaiting_payment' ? 'bg-purple-50 text-purple-700' :
                        ord.order_status === 'awaiting_pharmacy_approval' ? 'bg-sky-50 text-sky-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{ord.school_name || ord.delivery_school_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-navy-900 block">£{ord.total_amount?.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">{ord.payment_method}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stock Approaching Expiry */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-900">Stock Approaching Expiry (Priority Alert)</h3>
            <Link href="/admin/batches" className="text-xs font-bold text-brand-600 hover:underline">
              Batch Database &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {expiringSupplies.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">All school supplies are safely in-date.</p>
            ) : (
              expiringSupplies.map((sup) => (
                <div key={sup.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-navy-900">{sup.product_name}</span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {sup.batch_number}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{sup.school_name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold block ${
                      sup.days_remaining <= 30 ? 'text-red-600' :
                      sup.days_remaining <= 90 ? 'text-amber-600' : 'text-slate-700'
                    }`}>
                      {sup.days_remaining} days left
                    </span>
                    <span className="text-[10px] text-slate-400">Expires: {sup.expiry_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
