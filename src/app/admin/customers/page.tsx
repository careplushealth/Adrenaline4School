'use client';

import React, { useState, useEffect } from 'react';
import { Building2, School, Search, Phone, Mail, MapPin, Plus, X, Download, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'directory'>('accounts');
  const [schools, setSchools] = useState<any[]>([]);
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [directorySchools, setDirectorySchools] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [directoryPhase, setDirectoryPhase] = useState('all');
  const [loading, setLoading] = useState(true);
  const [directoryLoading, setDirectoryLoading] = useState(false);
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

  const loadDirectory = () => {
    setDirectoryLoading(true);
    fetch(`/api/schools/search?q=${encodeURIComponent(search)}&phase=${directoryPhase}&limit=100`)
      .then((r) => r.json())
      .then((data) => {
        if (data.schools) setDirectorySchools(data.schools);
      })
      .finally(() => setDirectoryLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'directory') {
      const handler = setTimeout(() => {
        loadDirectory();
      }, 200);
      return () => clearTimeout(handler);
    }
  }, [activeTab, search, directoryPhase]);

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

  // Export CSV for marketing / flyer campaigns
  const handleExportCSV = () => {
    const list = activeTab === 'directory' ? directorySchools : schools;
    if (list.length === 0) return;

    const headers = ['URN', 'School Name', 'Phase', 'Type', 'Address', 'Town', 'Postcode', 'Telephone', 'Headteacher Name', 'Headteacher Email', 'Office Email'];
    const rows = list.map((s) => [
      `"${s.urn || ''}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${s.phase || ''}"`,
      `"${s.type || s.organisation_name || ''}"`,
      `"${(s.address_line1 || '').replace(/"/g, '""')}"`,
      `"${s.town_city || ''}"`,
      `"${s.postcode || ''}"`,
      `"${s.phone || ''}"`,
      `"${(s.headteacher_name || '').replace(/"/g, '""')}"`,
      `"${s.headteacher_email || ''}"`,
      `"${s.office_email || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `uk_schools_${activeTab}_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Schools & Institutional Leads</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of educational institutions, headteachers, procurement contacts, and UK school outreach leads.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-navy-900 text-xs font-bold shadow-2xs flex items-center gap-2 transition-colors"
            title="Download CSV for flyer outreach"
          >
            <Download className="w-4 h-4 text-brand-600" />
            <span>Export Leads CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add School Profile</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('accounts');
            setSearch('');
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'accounts'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-navy-950'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Active School Customers ({schools.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('directory');
            setSearch('');
          }}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'directory'
              ? 'border-brand-600 text-brand-700 bg-brand-50/50'
              : 'border-transparent text-slate-500 hover:text-navy-950'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#096556]" />
          <span>UK Schools Outreach Directory ({directorySchools.length || 34}+ Leads)</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'accounts'
                ? 'Search active schools, postcode, MAT trust...'
                : 'Search pre-populated UK schools by name, URN, town, postcode...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {activeTab === 'directory' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <select
              value={directoryPhase}
              onChange={(e) => setDirectoryPhase(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="all">All School Types</option>
              <option value="primary">Primary Schools</option>
              <option value="secondary">Secondary Academies</option>
              <option value="independent">Independent / Private</option>
              <option value="grammar">Grammar Schools</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Active School Customers */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((sch) => (
            <div key={sch.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {sch.phase || 'Primary'} School
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">URN: {sch.urn}</span>
                </div>

                <h3 className="font-bold text-base text-navy-950">{sch.name}</h3>
                <p className="text-xs font-semibold text-slate-500 mb-3">{sch.organisation_name || 'Independent Single School'}</p>

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
      )}

      {/* Tab 2: UK Schools Outreach Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold text-navy-950">Pre-populated UK Educational Institutions (GIAS / DfE Verified)</span>
            <span>Showing {directorySchools.length} leads</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">DfE URN</th>
                  <th className="py-3 px-4">School & Location</th>
                  <th className="py-3 px-4">Type & Phase</th>
                  <th className="py-3 px-4">Headteacher Contact</th>
                  <th className="py-3 px-4">Office Email & Phone</th>
                  <th className="py-3 px-4 text-right">Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {directorySchools.map((ds) => {
                  const isIndependent = ds.type?.toLowerCase().includes('independent');
                  const isGrammar = ds.type?.toLowerCase().includes('grammar');

                  return (
                    <tr key={ds.urn} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{ds.urn}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-navy-950 text-xs">{ds.name}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {ds.address_line1}, {ds.town_city} {ds.postcode}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 mr-1.5">
                          {ds.phase}
                        </span>
                        {isGrammar ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Grammar
                          </span>
                        ) : isIndependent ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                            Independent
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">{ds.type}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-navy-950">{ds.headteacher_name || 'Headteacher'}</p>
                        {ds.headteacher_email && (
                          <a href={`mailto:${ds.headteacher_email}`} className="text-[11px] text-brand-600 hover:underline flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {ds.headteacher_email}
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-[11px] text-slate-600">{ds.office_email || '—'}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ds.phone || '—'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`mailto:${ds.headteacher_email || ds.office_email}?subject=Emergency Adrenaline Auto-Injectors (Benedict's Law Compliance)&body=Dear ${ds.headteacher_name || 'Headteacher'},%0D%0A%0D%0AWe are reaching out from Adrenaline4Schools regarding emergency adrenaline auto-injector statutory guidance.`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[11px] transition-colors"
                        >
                          <Mail className="w-3 h-3" /> Flyer Email
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
