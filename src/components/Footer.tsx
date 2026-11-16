'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Mail, Phone, MapPin, Award, FileCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="bg-[#062e1c] text-slate-300 text-sm border-t border-white/[0.08] pt-16 sm:pt-20 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Trust Columns — Apple Squircle Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-white/[0.08]">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5 hover:bg-white/[0.05] transition-colors">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-[14px] tracking-tight">GPhC Registered Pharmacy</h4>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Dispensed and verified exclusively by regulated UK community pharmacy partners.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5 hover:bg-white/[0.05] transition-colors">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
              <FileCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-[14px] tracking-tight">Headteacher Requisitions</h4>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Compliant with the Human Medicines (Amendment) Regulations 2017 for UK schools.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5 hover:bg-white/[0.05] transition-colors">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-[14px] tracking-tight">Benedict&apos;s Law Ready</h4>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Helping English schools meet upcoming 2026 statutory allergy safety preparedness standards.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5 hover:bg-white/[0.05] transition-colors">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-[14px] tracking-tight">Free Expiry Tracking</h4>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">Automated 12, 6, 3 and 1 month reorder reminders keep your pupils protected.</p>
            </div>
          </div>
        </div>

        {/* Main Links Grid — Apple Directory Style */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-14">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm inline-flex items-center">
              <img
                src="/logo.png"
                alt="Adrenaline4Schools"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <p className="text-[12px] text-slate-400 leading-relaxed pr-6">
              The premier UK school allergy safety and emergency auto-injector ordering platform. Supporting nursery, primary, secondary schools, MATs and independent education providers across England, Wales and Scotland.
            </p>
            <div className="pt-2 text-[12px] text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>UK Operations & Pharmacy Hub, London & Bristol</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:01619733552" className="hover:text-white transition-colors">
                  Dedicated School Support: 0161 973 3552
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@adrenaline4schools.co.uk</span>
              </p>
            </div>
          </div>

          {/* Col 2: Products & Orders */}
          <div>
            <h5 className="text-white font-semibold text-[12px] mb-4 tracking-wider uppercase">Emergency Supplies</h5>
            <ul className="space-y-2.5 text-[12px] text-slate-400">
              <li><Link href="/order-pens/epipen-300mcg" className="hover:text-white transition-colors">EpiPen® 300mcg (Pupils &gt;30kg)</Link></li>
              <li><Link href="/order-pens/epipen-150mcg" className="hover:text-white transition-colors">EpiPen® Junior 150mcg (Pupils 15–30kg)</Link></li>
              <li><Link href="/order-pens/jext-300mcg" className="hover:text-white transition-colors">Jext® 300mcg Auto-Injectors</Link></li>
              <li><Link href="/order-pens/jext-150mcg" className="hover:text-white transition-colors">Jext® 150mcg Auto-Injectors</Link></li>
              <li><Link href="/order-pens" className="text-emerald-300 font-semibold hover:text-white">View Full School Catalog &rarr;</Link></li>
            </ul>
          </div>

          {/* Col 3: School Safety & Guidance */}
          <div>
            <h5 className="text-white font-semibold text-[12px] mb-4 tracking-wider uppercase">Guidance & Compliance</h5>
            <ul className="space-y-2.5 text-[12px] text-slate-400">
              <li><Link href="/benedicts-law" className="hover:text-white transition-colors">Benedict&apos;s Law Overview</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">4-Step Requisition Process</Link></li>
              <li><Link href="/faqs" className="hover:text-white transition-colors">Requisition & BACS FAQs</Link></li>
              <li><a href="https://www.gov.uk/government/publications/using-emergency-adrenaline-auto-injectors-in-schools" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">Official UK Gov Guidance &nearr;</a></li>
            </ul>
          </div>

          {/* Col 4: Accounts & Legal */}
          <div>
            <h5 className="text-white font-semibold text-[12px] mb-4 tracking-wider uppercase">Portals & Legal</h5>
            <ul className="space-y-2.5 text-[12px] text-slate-400">
              <li><Link href="/portal" className="hover:text-white transition-colors">School Customer Portal</Link></li>
              <li><Link href="/portal/expiries" className="hover:text-white transition-colors">Registered School Stock</Link></li>
              <li><Link href="/portal/invoices" className="hover:text-white transition-colors">BACS Invoices & Remittance</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Internal Access</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Emergency Medical Warning Banner */}
        <div className="bg-white/[0.04] border border-emerald-500/30 rounded-2xl p-4 my-6 text-[12px] text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span className="leading-relaxed">
              <strong className="text-white">Emergency Medical Disclaimer:</strong> In a suspected anaphylaxis emergency in a school pupil, administer an adrenaline auto-injector into the outer thigh immediately and dial <strong className="text-emerald-300 font-semibold">999</strong> for blue-light emergency response.
            </span>
          </div>
        </div>

        {/* Bottom copyright and legal statement */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Adrenaline4Schools Ltd. All rights reserved. Registered in England & Wales.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Supply</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">BACS Payment Terms</Link>
            <span>•</span>
            <span className="text-slate-500">GPhC Pharmacy Registration #1092812</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
