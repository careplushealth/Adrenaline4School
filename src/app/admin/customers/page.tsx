'use client';

import React, { useState, useEffect } from 'react';
import { Building2, School, Search, Phone, Mail, MapPin, Plus, X } from 'lucide-react';

export default function AdminCustomersPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    organisationId: '',
    name: '',
    urn: '',
    phase: 'Primary',
    addressLine1: '',
    townCity: '',
    postcode: '',
    headteacherName: '',
    headteacherEmail: '',
    phone: '',
  });

  const loadData = () => {
    setLoading(true);
    fetch('/api/schools')
      .then((r) => r.json())
      .then((data) => {
        if (data.schools) setSchools(data.schools);
        if (data.organisations) {
          setOrganisations(data.organisations);
          if (!form.organisationId && data.organisations.length > 0) {
            setForm((f) => ({ ...f, organisationId: data.organisations[0].id }));
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/schools', {
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

  const filteredSchools = schools.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.postcode.toLowerCase().includes(q) ||
      s.organisation_name?.toLowerCase().includes(q) ||
      s.headteacher_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Schools & Multi-Academy Trusts</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of registered educational institutions, headteachers, and active adrenaline supplies.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New School Profile</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search school name, postcode, MAT trust, headteacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Schools Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((sch) => (
          <div key={sch.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {sch.phase || 'Primary'} School
                </span>
                <span className="text-[10px] font-mono text-slate-400">URN: {sch.urn}</span>
              </div>

              <h3 className="font-bold text-base text-navy-950">{sch.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mb-3">{sch.organisation_name}</p>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sch.address_line1}, {sch.town_city} {sch.postcode}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Head: {sch.headteacher_name} ({sch.headteacher_email})</span>
                </p>
                {sch.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sch.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-navy-900">{sch.orders_count || 0} Orders</span>
              <span className="text-emerald-700">{sch.active_pens_count || 0} Registered Supplies</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create School Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-navy-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-navy-950 mb-1">Add School Profile</h2>
            <p className="text-xs text-slate-500 mb-4">Register a new school or MAT branch institution.</p>

            <form onSubmit={handleCreateSchool} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Organisation / Trust</label>
                <select
                  value={form.organisationId}
                  onChange={(e) => setForm({ ...form, organisationId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  {organisations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">School Full Name</label>
                <input
                  required
                  placeholder="e.g. Oakwood High Wycombe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">DfE URN</label>
                  <input
                    placeholder="e.g. 139102"
                    value={form.urn}
                    onChange={(e) => setForm({ ...form, urn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Postcode</label>
                  <input
                    required
                    placeholder="e.g. HP11 1AB"
                    value={form.postcode}
                    onChange={(e) => setForm({ ...form, postcode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Headteacher Name</label>
                  <input
                    required
                    placeholder="e.g. Mr. David Miller"
                    value={form.headteacherName}
                    onChange={(e) => setForm({ ...form, headteacherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Headteacher Email</label>
                  <input
                    required
                    type="email"
                    placeholder="head@school.org.uk"
                    value={form.headteacherEmail}
                    onChange={(e) => setForm({ ...form, headteacherEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-800 mb-1">Street Address</label>
                <input
                  required
                  placeholder="Main School Gate, Parkway Way"
                  value={form.addressLine1}
                  onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Town / City</label>
                  <input
                    required
                    placeholder="High Wycombe"
                    value={form.townCity}
                    onChange={(e) => setForm({ ...form, townCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-800 mb-1">Telephone</label>
                  <input
                    placeholder="01494 123456"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
                >
                  Create School Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-5 rounded-xl border border-slate-200 text-navy-800 font-bold text-xs hover:bg-slate-50"
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
