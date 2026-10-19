'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  Download,
  BellRing,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Building2,
} from 'lucide-react';
import MedicalDeviceVisual from '@/components/MedicalDeviceVisual';

export default function SchoolPortalPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('sch-1');
  const [orders, setOrders] = useState<any[]>([]);
  const [supplies, setSupplies] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/schools')
      .then((r) => r.json())
      .then((data) => {
        if (data.schools) {
          setSchools(data.schools);
          if (data.schools.length > 0) setSelectedSchoolId(data.schools[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedSchoolId) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/orders?schoolId=${selectedSchoolId}`).then((r) => r.json()),
      fetch('/api/reminders').then((r) => r.json()),
      fetch('/api/invoices').then((r) => r.json()),
    ])
      .then(([ordersData, remindersData, invoicesData]) => {
        if (ordersData.orders) setOrders(ordersData.orders);
        if (remindersData.supplies) {
          setSupplies(remindersData.supplies.filter((s: any) => s.school_id === selectedSchoolId));
        }
        if (invoicesData.invoices) {
          setInvoices(invoicesData.invoices.filter((i: any) => i.school_id === selectedSchoolId));
        }
      })
      .finally(() => setLoading(false));
  }, [selectedSchoolId]);

  const currentSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  return (
    <div className="min-h-screen bg-ivory text-forest-900 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & MAT Switcher */}
        <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-900 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                School Allergy Management Portal
              </span>
              <span className="text-xs text-stone-400 font-normal">• Multi-Academy Trust Enabled</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-forest-950">
              {currentSchool?.name || "St. Mary's CE Primary School"}
            </h1>
            <p className="text-xs text-stone-500">
              DfE URN: {currentSchool?.urn || '102941'} · Headteacher: {currentSchool?.headteacher_name || 'Mrs. Eleanor Clarke'} · {currentSchool?.town_city}
            </p>
          </div>

          {/* School Selector (Multi-School MAT support) */}
          <div className="bg-linen/40 rounded-2xl p-3 border border-stone-200/80 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-sage-700 shrink-0" />
            <div>
              <label className="block text-[10px] font-medium uppercase text-stone-400">Switch School / Site</label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-forest-950 focus:outline-none cursor-pointer"
              >
                {schools.map((sch) => (
                  <option key={sch.id} value={sch.id}>
                    {sch.name} ({sch.organisation_name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Registered Active Pens */}
        <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-sage-700" />
                <h2 className="text-lg font-serif font-medium text-forest-950">Registered Emergency Adrenaline Stock</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Current active auto-injectors registered at this school premises with automated expiry monitoring.
              </p>
            </div>

            <Link
              href="/order-pens"
              className="px-5 py-2 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Order Additional Pens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplies.length === 0 ? (
              <p className="col-span-3 text-xs text-stone-400 py-6 text-center">No active supplies registered for this site.</p>
            ) : (
              supplies.map((sup) => (
                <div key={sup.id} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-sage-400 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-medium bg-linen/50 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200">
                        Lot: {sup.batch_number}
                      </span>
                      <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                        sup.days_remaining <= 30 ? 'bg-red-50 text-red-800 border border-red-200' :
                        sup.days_remaining <= 90 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-sage-50 text-sage-800 border border-sage-200'
                      }`}>
                        {sup.days_remaining} days remaining
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-24 rounded-xl bg-linen/30 border border-stone-200/60 p-1 flex items-center justify-center shrink-0">
                        <MedicalDeviceVisual
                          type={
                            sup.product_name.includes('EpiPen')
                              ? sup.product_name.includes('300') ? 'epipen-300' : 'epipen-150'
                              : sup.product_name.includes('300') ? 'jext-300' : 'jext-150'
                          }
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-medium text-sm text-forest-950 leading-snug">{sup.product_name}</h3>
                        <p className="text-xs text-stone-500 mt-1">Supplied: {sup.supplied_date} · Qty: {sup.quantity_supplied} Twin Pack(s)</p>
                        <p className="text-xs font-semibold text-forest-950 mt-2">
                          Expiry: <span className="text-red-700 font-bold">{sup.expiry_date}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-sage-600" /> Monitored
                    </span>
                    {sup.reorder_token && (
                      <Link
                        href={`/reorder/${sup.reorder_token}`}
                        className="text-xs font-semibold text-forest-950 bg-gold-400 hover:bg-gold-300 px-3.5 py-1.5 rounded-full shadow-xs transition-colors"
                      >
                        1-Click Reorder &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Orders & Invoices Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders History */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <h2 className="font-serif font-medium text-lg text-forest-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-sage-700" />
              Recent School Orders
            </h2>
            <div className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <p className="py-8 text-xs text-stone-400 text-center">No orders placed yet.</p>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-medium text-forest-950">{ord.order_reference}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{ord.created_at?.split(' ')[0]} · £{ord.total_amount?.toFixed(2)}</p>
                      {ord.tracking_number && (
                        <p className="text-[10px] text-sage-800 font-medium mt-0.5">
                          {ord.courier_name}: {ord.tracking_number}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize ${
                      ord.order_status === 'delivered' ? 'bg-sage-50 text-sage-800 border border-sage-200' :
                      ord.order_status === 'awaiting_payment' ? 'bg-linen text-stone-700 border border-stone-200' : 'bg-gold-50 text-gold-900 border border-gold-200'
                    }`}>
                      {ord.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Invoices & BACS Remittance */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <h2 className="font-serif font-medium text-lg text-forest-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sage-700" />
              School Invoices (30-Day BACS)
            </h2>
            <div className="divide-y divide-stone-100">
              {invoices.length === 0 ? (
                <p className="py-8 text-xs text-stone-400 text-center">No invoices issued.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-medium text-forest-950">{inv.invoice_number}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">Due: {inv.due_date} · Total: £{inv.total_amount?.toFixed(2)}</p>
                      <p className="text-[10px] text-stone-400 font-mono">BACS Ref: {inv.bacs_reference}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        inv.status === 'paid' ? 'bg-sage-50 text-sage-800 border border-sage-200' : 'bg-linen text-stone-700 border border-stone-200'
                      }`}>
                        {inv.status.toUpperCase()}
                      </span>
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        target="_blank"
                        className="p-1.5 rounded-full bg-linen hover:bg-stone-200 text-forest-900 transition-colors"
                        title="Download Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Training Access Banner */}
        <div className="bg-forest-900 text-ivory rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-forest-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-ivory" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-normal">Staff Allergy CPD Training</h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                All school staff can access accredited anaphylaxis and auto-injector lessons with printable CPD certificates.
              </p>
            </div>
          </div>
          <Link
            href="/training"
            className="px-6 py-3 rounded-full bg-gold-400 hover:bg-gold-300 text-forest-950 font-semibold text-xs uppercase tracking-wider transition-all shrink-0"
          >
            Launch Staff Academy &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
