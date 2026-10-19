'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Calendar,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  School,
  X,
} from 'lucide-react';
import { BatchRecord, SchoolSupplyRecord, Product } from '@/lib/types';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [supplies, setSupplies] = useState<SchoolSupplyRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'supplies' | 'batches'>('supplies');
  const [expiryFilter, setExpiryFilter] = useState('all'); // 'all', '1m', '3m', '6m', '12m'
  const [search, setSearch] = useState('');

  // Add Batch Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    batchNumber: '',
    manufacturer: 'Viatris / Mylan UK',
    expiryDate: '',
    quantityReceived: 500,
    supplierRef: '',
    notes: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/batches').then((r) => r.json()),
      fetch('/api/reminders').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([batchesData, remindersData, productsData]) => {
        if (batchesData.batches) setBatches(batchesData.batches);
        if (remindersData.supplies) setSupplies(remindersData.supplies);
        if (productsData.products) {
          setProducts(productsData.products);
          if (!form.productId && productsData.products.length > 0) {
            setForm((f) => ({ ...f, productId: productsData.products[0].id }));
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setIsModalOpen(false);
      loadData();
    }
  };

  // Filter supplies based on expiry interval
  const filteredSupplies = supplies.filter((s) => {
    const days = s.days_remaining ?? 999;
    if (expiryFilter === '1m' && days > 30) return false;
    if (expiryFilter === '3m' && days > 90) return false;
    if (expiryFilter === '6m' && days > 180) return false;
    if (expiryFilter === '12m' && days > 365) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.school_name?.toLowerCase().includes(q) ||
        s.batch_number?.toLowerCase().includes(q) ||
        s.product_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Batch & Expiry Database</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track manufacturer lot numbers, stock allocations, and actual school pen expiration timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Pharmacy Batch</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('supplies')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'supplies'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          School-Level Active Expiry Register ({supplies.length})
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'batches'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Master Pharmacy Batches ({batches.length})
        </button>
      </div>

      {/* TAB 1: School-Level Active Expiries */}
      {activeTab === 'supplies' && (
        <div className="space-y-6">
          {/* Expiry Intervals Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search school, batch, pen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400">Expiring in:</span>
              {[
                { id: 'all', label: 'All Supplies' },
                { id: '1m', label: '≤ 1 Month' },
                { id: '3m', label: '≤ 3 Months' },
                { id: '6m', label: '≤ 6 Months' },
                { id: '12m', label: '≤ 12 Months' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setExpiryFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    expiryFilter === f.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* School Supplies Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">School & Site</th>
                    <th className="py-3.5 px-4">Supplied Auto-Injector</th>
                    <th className="py-3.5 px-4">Batch Number</th>
                    <th className="py-3.5 px-4">Supplied Date</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4">Days Left</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Reorder Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSupplies.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-navy-950">
                        {s.school_name}
                        <span className="block text-[10px] text-slate-400 font-normal">Order: {s.order_reference}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-navy-900">{s.product_name}</span>
                        <span className="block text-[10px] text-slate-500">Qty: {s.quantity_supplied} Pack(s)</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {s.batch_number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {s.supplied_date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-navy-950">
                        {s.expiry_date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded font-black text-[11px] ${
                          (s.days_remaining ?? 999) <= 30
                            ? 'bg-red-100 text-red-800'
                            : (s.days_remaining ?? 999) <= 90
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {s.days_remaining} days
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === 'approaching_expiry' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {s.reorder_token ? (
                          <a
                            href={`/reorder/${s.reorder_token}`}
                            target="_blank"
                            className="text-xs font-bold text-brand-600 hover:underline"
                          >
                            Open Link &nearr;
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Master Pharmacy Batches */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Batch / Lot</th>
                <th className="py-3.5 px-4">Product & Strength</th>
                <th className="py-3.5 px-4">Manufacturer</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4">Allocated</th>
                <th className="py-3.5 px-4">Remaining</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-navy-950">{b.batch_number}</td>
                  <td className="py-3.5 px-4 font-bold text-navy-900">{b.product_name} ({b.strength})</td>
                  <td className="py-3.5 px-4 text-slate-600">{b.manufacturer}</td>
                  <td className="py-3.5 px-4 font-bold text-red-600">{b.expiry_date}</td>
                  <td className="py-3.5 px-4 text-slate-700">{b.quantity_received}</td>
                  <td className="py-3.5 px-4 text-brand-700 font-semibold">{b.quantity_allocated}</td>
                  <td className="py-3.5 px-4 font-black text-navy-900">{b.quantity_remaining ?? (b.quantity_received - b.quantity_allocated)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record New Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-navy-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-navy-950 mb-1">Record Pharmacy Batch Stock</h2>
            <p className="text-xs text-slate-500 mb-6">Enter details of wholesale stock received from UK distributors.</p>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Product</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.strength})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Batch / Lot Number</label>
                  <input
                    required
                    placeholder="e.g. EP-39201-UK"
                    value={form.batchNumber}
                    onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Actual Expiry Date</label>
                  <input
                    required
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Manufacturer</label>
                  <input
                    value={form.manufacturer}
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    value={form.quantityReceived}
                    onChange={(e) => setForm({ ...form, quantityReceived: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
                >
                  Save Batch Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-6 rounded-xl border border-slate-200 text-navy-800 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
