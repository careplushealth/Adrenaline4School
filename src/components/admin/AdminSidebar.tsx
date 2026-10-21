'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  FileText,
  BellRing,
  GraduationCap,
  Building2,
  School,
  FileEdit,
  BarChart3,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'UK Schools Directory', href: '/admin/schools', icon: School },
    { name: 'Orders & Requisitions', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Batches & Expiry DB', href: '/admin/batches', icon: Layers },
    { name: 'Invoices & BACS Payments', href: '/admin/invoices', icon: FileText },
    { name: 'Expiry Reminders & Cron', href: '/admin/reminders', icon: BellRing },
    { name: 'Training & Learners', href: '/admin/training', icon: GraduationCap },
    { name: 'Schools & MAT Accounts', href: '/admin/customers', icon: Building2 },
    { name: 'Content Management (CMS)', href: '/admin/content', icon: FileEdit },
    { name: 'Reports & Exports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Audit Log', href: '/admin/audit', icon: ShieldAlert },
    { name: 'Pharmacy & System Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 rounded-xl bg-navy-900 text-white shadow-lg border border-navy-800"
          aria-label="Toggle Admin Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-navy-950 text-slate-300 flex flex-col border-r border-navy-800 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-navy-900 flex flex-col gap-2.5">
          <Link href="/admin" className="block">
            <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200/20 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Adrenaline4Schools"
                className="h-8 w-auto object-contain"
              />
            </div>
          </Link>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
              Admin Portal
            </span>
            <span className="text-[10px] text-slate-400 font-medium">GPhC Secure</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#096556] text-white shadow-md shadow-[#096556]/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-navy-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom links and user badge */}
        <div className="p-4 border-t border-navy-900 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-navy-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </span>
            <span className="text-[10px] bg-navy-800 px-2 py-0.5 rounded text-slate-300">Live</span>
          </Link>

          <div className="bg-navy-900/90 rounded-xl p-3 border border-navy-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <p className="text-[10px] text-slate-400 truncate">admin@adrenaline4schools.co.uk</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('a4s_admin_authenticated');
                window.location.href = '/admin';
              }}
              title="Lock Admin Portal & Sign Out"
              className="text-slate-400 hover:text-red-400 transition-colors p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
