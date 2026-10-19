'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Mail, Phone, MapPin, Award, FileCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="bg-forest-950 text-stone-300 text-sm border-t border-forest-900/60 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Trust Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-14 border-b border-forest-900/80">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-forest-900/80 text-sage-300 border border-forest-800/50 shrink-0">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-ivory font-serif text-base font-semibold">GPhC Registered Pharmacy</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Dispensed and verified exclusively by regulated UK community pharmacy partners.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-forest-900/80 text-sage-300 border border-forest-800/50 shrink-0">
              <FileCheck className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-ivory font-serif text-base font-semibold">Headteacher Requisitions</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Compliant with the Human Medicines (Amendment) Regulations 2017 for UK schools.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-forest-900/80 text-sage-300 border border-forest-800/50 shrink-0">
              <Award className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-ivory font-serif text-base font-semibold">Benedict&apos;s Law Ready</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Helping English schools meet upcoming 2026 statutory allergy safety preparedness standards.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-forest-900/80 text-sage-300 border border-forest-800/50 shrink-0">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h4 className="text-ivory font-serif text-base font-semibold">Free Expiry Tracking</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Automated 12, 6, 3 and 1 month reorder reminders keep your pupils protected.</p>
            </div>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-14">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-md border border-stone-200/20 inline-flex items-center">
              <img
                src="/logo.png"
                alt="Adrenaline4School"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed pr-6">
              The premier UK school allergy safety and emergency auto-injector ordering platform. Supporting nursery, primary, secondary schools, MATs and independent education providers across England, Wales and Scotland.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sage-400" />
                UK Operations & Pharmacy Hub, London & Bristol
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sage-400" />
                Dedicated School Support: 0800 123 4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sage-400" />
                support@adrenaline4schools.co.uk
              </p>
            </div>
          </div>

          {/* Col 2: Products & Orders */}
          <div>
            <h5 className="text-ivory font-serif font-semibold text-sm mb-4 tracking-wide">Emergency Supplies</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="/order-pens/epipen-300mcg" className="hover:text-gold-300 transition-colors">EpiPen® 300mcg (Adult/Secondary)</Link></li>
              <li><Link href="/order-pens/epipen-150mcg" className="hover:text-gold-300 transition-colors">EpiPen® Junior 150mcg (Primary)</Link></li>
              <li><Link href="/order-pens/jext-300mcg" className="hover:text-gold-300 transition-colors">Jext® 300mcg Auto-Injectors</Link></li>
              <li><Link href="/order-pens/jext-150mcg" className="hover:text-gold-300 transition-colors">Jext® 150mcg Auto-Injectors</Link></li>
              <li><Link href="/order-pens/emergency-anaphylaxis-wall-station" className="hover:text-gold-300 transition-colors">Emergency Wall Stations & Kits</Link></li>
              <li><Link href="/order-pens" className="text-gold-300 font-semibold hover:text-gold-200">View Full School Catalog &rarr;</Link></li>
            </ul>
          </div>

          {/* Col 3: School Safety & Guidance */}
          <div>
            <h5 className="text-ivory font-serif font-semibold text-sm mb-4 tracking-wide">Guidance & Compliance</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="/benedicts-law" className="hover:text-gold-300 transition-colors">Benedict&apos;s Law Overview</Link></li>
              <li><Link href="/how-it-works" className="hover:text-gold-300 transition-colors">4-Step Requisition Process</Link></li>
              <li><Link href="/training" className="hover:text-gold-300 transition-colors">Staff CPD Allergy Training</Link></li>
              <li><Link href="/training/anaphylaxis-adrenaline-in-schools" className="hover:text-gold-300 transition-colors">Anaphylaxis Course & Quiz</Link></li>
              <li><Link href="/faqs" className="hover:text-gold-300 transition-colors">Requisition & BACS FAQs</Link></li>
              <li><a href="https://www.gov.uk/government/publications/using-emergency-adrenaline-auto-injectors-in-schools" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">Official UK Gov Guidance &nearr;</a></li>
            </ul>
          </div>

          {/* Col 4: Accounts & Legal */}
          <div>
            <h5 className="text-ivory font-serif font-semibold text-sm mb-4 tracking-wide">Portals & Legal</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="/portal" className="hover:text-gold-300 transition-colors">School Customer Portal</Link></li>
              <li><Link href="/portal/expiries" className="hover:text-gold-300 transition-colors">Registered School Stock</Link></li>
              <li><Link href="/portal/invoices" className="hover:text-gold-300 transition-colors">BACS Invoices & Remittance</Link></li>
              <li><Link href="/admin" className="text-gold-300 hover:text-white transition-colors">Staff Management Gateway</Link></li>
              <li><Link href="/contact" className="hover:text-gold-300 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Emergency Medical Warning Banner */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4 my-6 text-xs text-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="leading-relaxed">
              <strong className="text-amber-100">Emergency Medical Disclaimer:</strong> In a suspected anaphylaxis emergency in a school pupil or staff member, administer an adrenaline auto-injector into the outer thigh immediately and dial <strong>999</strong> for blue-light emergency response.
            </span>
          </div>
        </div>

        {/* Bottom copyright and legal statement */}
        <div className="pt-8 border-t border-forest-900/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Adrenaline4Schools Ltd. All rights reserved. Registered in England & Wales.</p>
          <div className="flex items-center gap-5 text-stone-400">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Supply</span>
            <span>•</span>
            <span>BACS Payment Terms</span>
            <span>•</span>
            <span>GPhC Pharmacy Registration #1092812</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
