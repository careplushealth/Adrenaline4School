'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  School,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  X,
  ShieldCheck,
  FileSpreadsheet,
  ArrowUpDown,
  RefreshCw,
  ShoppingBag,
  Info,
  AlertCircle,
} from 'lucide-react';

interface SchoolRecord {
  urn: string;
  name: string;
  phase: string;
  type: string;
  local_authority: string;
  address_line1: string;
  address_line2: string | null;
  town_city: string;
  postcode: string;
  phone: string;
  headteacher_name: string;
  headteacher_email: string | null;
  office_email: string | null;
  customer_school_id: string | null;
  account_status: string | null;
  orders_count: string | number;
}

interface SummaryStats {
  totalAll: number;
  totalPrimary: number;
  totalSecondary: number;
  totalAcademy: number;
  totalIndependent: number;
  totalCustomers: number;
}

export default function AdminSchoolsDirectoryPage() {
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'customer' | 'prospect'>('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryStats>({
    totalAll: 27180,
    totalPrimary: 0,
    totalSecondary: 0,
    totalAcademy: 0,
    totalIndependent: 0,
    totalCustomers: 0,
  });

  // Modal / Slide-over state
  const [selectedSchool, setSelectedSchool] = useState<SchoolRecord | null>(null);
  const [copiedUrn, setCopiedUrn] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  const handleFilterChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setPage(1);
  };

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        phase: phaseFilter,
        type: typeFilter,
        status: statusFilter,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/schools?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setSchools(data.schools || []);
        setTotalCount(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        if (data.summary) setSummary(data.summary);
        setApiError(null);
      } else {
        setApiError(data.error || 'Failed to query schools database.');
      }
    } catch (err: any) {
      console.error('Failed to load schools directory:', err);
      setApiError(err.message || 'Network error fetching schools directory.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, phaseFilter, typeFilter, statusFilter, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const copyToClipboard = (text: string, type: 'urn' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'urn') {
      setCopiedUrn(text);
      setTimeout(() => setCopiedUrn(null), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const exportCsvUrl = `/api/admin/schools?q=${encodeURIComponent(
    debouncedSearch
  )}&phase=${phaseFilter}&type=${typeFilter}&status=${statusFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}&format=csv`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <School className="w-4 h-4" />
                <span>Department for Education GIAS Database</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>UK Schools Directory</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  {summary.totalAll.toLocaleString()} Open Schools
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Comprehensive statutory directory of all registered educational establishments across England, Wales, Scotland, and Northern Ireland.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={exportCsvUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Filtered CSV</span>
              </a>
              <button
                onClick={fetchSchools}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
                title="Refresh Directory"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Database Connection Notice</span>
                </p>
                <p className="font-mono text-[11px] text-rose-300">{apiError}</p>
                <p className="text-slate-400 text-[11px]">
                  If running on a deployed host (e.g. Vercel), ensure <code className="bg-slate-800 text-emerald-400 px-1 py-0.5 rounded font-mono">DATABASE_URL</code> is added in your hosting dashboard under Environment Variables.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchSchools}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Open</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {summary.totalAll.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">UK DfE Registered</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Phase</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {summary.totalPrimary.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ages 4 &ndash; 11</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Secondary & 16+</div>
              <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
                {summary.totalSecondary.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ages 11 &ndash; 18+</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academies & MATs</div>
              <div className="text-xl sm:text-2xl font-black text-purple-400 mt-1">
                {summary.totalAcademy.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Trust Governed</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Independent</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                {summary.totalIndependent.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Private Schools</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customers</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 flex items-center gap-1.5">
                <span>{summary.totalCustomers.toLocaleString()}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <Link href="/admin/customers" className="text-[10px] text-emerald-400 hover:underline mt-0.5 inline-block">
                View Accounts &rarr;
              </Link>
            </div>
          </div>

          {/* Search, Filters, and Status Toggles */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by School Name, URN, Postcode, City, Headteacher, or Local Authority..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Pill Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 shrink-0 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleFilterChange(setStatusFilter, 'all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[#096556] text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Schools ({summary.totalAll.toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange(setStatusFilter, 'customer')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === 'customer'
                      ? 'bg-[#096556] text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Customers ({summary.totalCustomers})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange(setStatusFilter, 'prospect')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === 'prospect'
                      ? 'bg-[#096556] text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Prospects
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Phase</label>
                <select
                  value={phaseFilter}
                  onChange={(e) => handleFilterChange(setPhaseFilter, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Phases</option>
                  <option value="Primary">Primary (Ages 4-11)</option>
                  <option value="Secondary">Secondary (Ages 11-16)</option>
                  <option value="16 plus">16 Plus / Sixth Form</option>
                  <option value="All-through">All-through (Ages 4-18)</option>
                  <option value="Nursery">Nursery</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Establishment Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="Academy">Academies & Free Schools</option>
                  <option value="Community">Community / Maintained</option>
                  <option value="Voluntary">Voluntary Aided / Controlled</option>
                  <option value="Independent">Independent / Private</option>
                  <option value="Special">Special Needs Schools</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sort By</label>
                <div className="flex gap-1.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="name">School Name</option>
                    <option value="urn">URN Code</option>
                    <option value="town_city">Town / City</option>
                    <option value="postcode">Postcode</option>
                    <option value="phase">Phase</option>
                    <option value="type">Type</option>
                    <option value="local_authority">Local Authority</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Per Page</label>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                  <option value="200">200 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing{' '}
              <strong className="text-white">
                {totalCount === 0 ? 0 : (page - 1) * limit + 1}
              </strong>{' '}
              &ndash;{' '}
              <strong className="text-white">
                {Math.min(page * limit, totalCount)}
              </strong>{' '}
              of <strong className="text-white">{totalCount.toLocaleString()}</strong> schools
            </span>

            {loading && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying Neon PostgreSQL...
              </span>
            )}
          </div>

          {/* Directory Table */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4 w-28">URN</th>
                    <th className="py-3.5 px-4">School & Local Authority</th>
                    <th className="py-3.5 px-4">Phase & Type</th>
                    <th className="py-3.5 px-4">Headteacher & Contact</th>
                    <th className="py-3.5 px-4 w-32">Customer Status</th>
                    <th className="py-3.5 px-4 text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {loading && schools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
                        <p className="font-semibold text-sm">Searching official UK schools database...</p>
                      </td>
                    </tr>
                  ) : schools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400">
                        <Info className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                        <p className="font-bold text-white text-base">No schools found</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          No schools match your search query &ldquo;{debouncedSearch}&rdquo; with the selected filters.
                        </p>
                        <button
                          onClick={() => {
                            setSearch('');
                            setPhaseFilter('all');
                            setTypeFilter('all');
                            setStatusFilter('all');
                          }}
                          className="mt-4 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
                        >
                          Clear All Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    schools.map((s) => {
                      const isCustomer = Boolean(s.customer_school_id);
                      return (
                        <tr
                          key={s.urn}
                          className="hover:bg-slate-750/70 transition-colors group cursor-pointer"
                          onClick={() => setSelectedSchool(s)}
                        >
                          {/* URN */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                {s.urn}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(s.urn, 'urn');
                                }}
                                className="text-slate-500 hover:text-emerald-400 transition-colors"
                                title="Copy URN"
                              >
                                {copiedUrn === s.urn ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Name & Local Authority */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                              {s.name}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                              <span className="text-slate-300">{s.town_city}</span>
                              <span className="text-slate-500">&bull;</span>
                              <span className="font-mono text-slate-400">{s.postcode}</span>
                              {s.local_authority && (
                                <>
                                  <span className="text-slate-500">&bull;</span>
                                  <span className="text-slate-400 truncate max-w-[160px]">
                                    {s.local_authority}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Phase & Type */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  s.phase === 'Primary'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : s.phase === 'Secondary'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : s.phase === '16 plus'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {s.phase || 'Primary'}
                              </span>
                              <span className="text-slate-400 text-[11px] truncate max-w-[170px]" title={s.type}>
                                {s.type}
                              </span>
                            </div>
                          </td>

                          {/* Headteacher & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-200 font-semibold truncate max-w-[190px]">
                              {s.headteacher_name || 'Headteacher'}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              {s.phone && (
                                <a
                                  href={`tel:${s.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 hover:text-white"
                                  title={`Call ${s.phone}`}
                                >
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span>{s.phone}</span>
                                </a>
                              )}
                              {(s.headteacher_email || s.office_email) && (
                                <a
                                  href={`mailto:${s.headteacher_email || s.office_email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 hover:text-white"
                                  title={`Email: ${s.headteacher_email || s.office_email}`}
                                >
                                  <Mail className="w-3 h-3 text-blue-400" />
                                  <span>Email</span>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Customer Status */}
                          <td className="py-3.5 px-4">
                            {isCustomer ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Customer ({s.orders_count || 0})</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px]">
                                <span>Prospect</span>
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSchool(s);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-[#096556] text-slate-200 hover:text-white text-xs font-bold transition-all shadow-xs"
                            >
                              Dossier &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-slate-900/80 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{page}</strong> of{' '}
                  <strong className="text-white">{totalPages.toLocaleString()}</strong> ({totalCount.toLocaleString()} total schools)
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-200 font-mono font-bold">
                    {page} / {totalPages}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        {/* Slide-over School Detail Dossier Modal */}
        {selectedSchool && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-xl bg-slate-900 border-l border-slate-700 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
              <div className="space-y-6">
                {/* Modal Top Bar */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Official DfE GIAS School Record
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                      {selectedSchool.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-slate-400">
                        URN: <strong className="text-white">{selectedSchool.urn}</strong>
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedSchool.urn, 'urn')}
                        className="text-slate-500 hover:text-emerald-400 text-xs flex items-center gap-1 font-mono"
                      >
                        {copiedUrn === selectedSchool.urn ? (
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSchool(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Callout */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs sm:text-sm">
                        {selectedSchool.customer_school_id ? 'Registered Customer' : 'Statutory Educational Lead'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedSchool.customer_school_id
                          ? `Total orders placed: ${selectedSchool.orders_count || 0}`
                          : 'Eligible for 30-Day BACS Invoice & Auto-dispense'}
                      </p>
                    </div>
                  </div>
                  {selectedSchool.customer_school_id ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 font-semibold text-xs">
                      Prospect
                    </span>
                  )}
                </div>

                {/* Establishment Metadata Card */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Establishment Profile
                  </h3>
                  <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Phase of Education</span>
                      <strong className="text-white text-sm">{selectedSchool.phase}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Establishment Type</span>
                      <strong className="text-white text-sm">{selectedSchool.type}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Local Authority</span>
                      <strong className="text-white text-sm">{selectedSchool.local_authority || 'England'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Regulatory Eligibility</span>
                      <strong className="text-emerald-400 text-sm">Human Medicines Reg 2017</strong>
                    </div>
                  </div>
                </div>

                {/* Physical Delivery Address */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Official Delivery & Postal Address
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${selectedSchool.name}\n${selectedSchool.address_line1}\n${
                            selectedSchool.address_line2 ? selectedSchool.address_line2 + '\n' : ''
                          }${selectedSchool.town_city}\n${selectedSchool.postcode}`,
                          'address'
                        )
                      }
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied Mailing Label
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Postal Address
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5 text-slate-200">
                      <p className="font-bold text-white text-sm">{selectedSchool.address_line1}</p>
                      {selectedSchool.address_line2 && <p>{selectedSchool.address_line2}</p>}
                      <p>
                        {selectedSchool.town_city}, <span className="font-mono font-bold">{selectedSchool.postcode}</span>
                      </p>
                      <p className="text-slate-400 text-[11px] pt-1">United Kingdom</p>
                    </div>
                  </div>
                </div>

                {/* Leadership & Communications */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    School Leadership & Communications
                  </h3>
                  <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                      <span className="text-slate-400">Headteacher / Principal:</span>
                      <strong className="text-white">{selectedSchool.headteacher_name || 'Headteacher'}</strong>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                      <span className="text-slate-400">Telephone:</span>
                      {selectedSchool.phone ? (
                        <a
                          href={`tel:${selectedSchool.phone}`}
                          className="font-mono text-emerald-400 hover:underline font-bold"
                        >
                          {selectedSchool.phone}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not recorded</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                      <span className="text-slate-400">Headteacher Email:</span>
                      {selectedSchool.headteacher_email ? (
                        <a
                          href={`mailto:${selectedSchool.headteacher_email}`}
                          className="text-blue-400 hover:underline"
                        >
                          {selectedSchool.headteacher_email}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not recorded</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">School Office Email:</span>
                      {selectedSchool.office_email ? (
                        <a
                          href={`mailto:${selectedSchool.office_email}`}
                          className="text-blue-400 hover:underline"
                        >
                          {selectedSchool.office_email}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not recorded</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-800 mt-6 space-y-2.5">
                <Link
                  href={`/checkout?prefillSchool=${encodeURIComponent(
                    selectedSchool.name
                  )}&urn=${encodeURIComponent(selectedSchool.urn)}`}
                  className="w-full py-3.5 rounded-xl bg-[#096556] hover:bg-[#075246] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#096556]/20 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Create Order for this School &rarr;</span>
                </Link>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      selectedSchool.name + ' ' + selectedSchool.postcode
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-center font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Google Search
                  </a>
                  <a
                    href={`https://www.get-information-schools.service.gov.uk/Establishments/Establishment/Details/${selectedSchool.urn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-center font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" /> DfE GIAS Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
