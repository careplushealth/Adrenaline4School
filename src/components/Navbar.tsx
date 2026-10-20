'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Phone, 
  FileText, 
  UserCheck, 
  LayoutDashboard,
  Lock
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin portal, navbar is handled by admin layout
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Order Pens', href: '/order-pens' },
    { name: "Benedict's Law", href: '/benedicts-law' },
    { name: 'Training', href: '/training' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Reassurance & Compliance Announcement Bar */}
      <div className="bg-[#096556] text-white text-xs py-2.5 px-4 tracking-wide shadow-xs border-b border-[#075145]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-emerald-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              UK GPhC Registered Pharmacy Fulfilment
            </span>
            <span className="hidden md:inline text-emerald-300/50">•</span>
            <span className="hidden md:inline text-white/90">Next-Day Medical Courier</span>
            <span className="hidden md:inline text-emerald-300/50">•</span>
            <span className="hidden md:inline text-emerald-100 font-medium">12, 6, 3 & 1m Expiry Alerts</span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <a href="tel:08001234567" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-200" />
              <span>0800 123 4567</span>
            </a>
            <span className="text-emerald-300/40">|</span>
            <Link href="/portal" className="text-white hover:text-emerald-100 flex items-center gap-1 font-medium transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>School Portal</span>
            </Link>
            <span className="text-emerald-300/40">|</span>
            <Link href="/admin" className="text-white hover:bg-white/20 flex items-center gap-1 font-bold transition-colors bg-white/10 px-2.5 py-0.5 rounded-full border border-white/25">
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>Staff Gateway</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_2px_15px_-3px_rgba(12,35,64,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Official Logo */}
            <Link href="/" className="flex items-center gap-3 group py-1">
              <img
                src="/logo.png"
                alt="Adrenaline4School"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-[#096556] bg-[#f0faf7] border border-[#c6eee3] font-bold'
                        : 'text-slate-600 hover:text-[#0c2340] hover:bg-slate-100/70'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Basket Button */}
              <Link
                href="/basket"
                className="relative px-3.5 py-2.5 rounded-full border border-slate-200 text-slate-800 bg-white hover:bg-slate-50 hover:border-[#096556] transition-all flex items-center gap-2 group shadow-sm"
                aria-label="View Basket"
              >
                <ShoppingBag className="w-4 h-4 text-slate-600 group-hover:text-[#096556] transition-colors" />
                {itemCount > 0 && (
                  <span className="bg-[#096556] text-white text-[11px] font-black w-4.5 h-4.5 px-1.5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-800 hidden md:inline">Basket</span>
              </Link>

              {/* Order Now CTA — Deep Pine Teal Button */}
              <Link
                href="/order-pens"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#096556] hover:bg-[#075145] text-white text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5 border border-[#096556]"
              >
                <span>Order Now</span>
                <span className="font-bold">&rarr;</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <Link href="/basket" className="relative p-2 text-slate-800">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#096556] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-[#0c2340] hover:text-[#096556] hover:bg-[#f0faf7] transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-5 pt-3 pb-6 shadow-xl animate-fade-in-up">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-[#096556] bg-[#f0faf7] border border-[#c6eee3] font-bold'
                        : 'text-slate-700 hover:text-[#096556] hover:bg-[#f0faf7]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col gap-2">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-[#c6eee3] text-[#096556] bg-[#f0faf7] hover:bg-[#e6f5f1] font-semibold text-xs transition-colors"
                >
                  School Portal Sign In
                </Link>
                <Link
                  href="/order-pens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-[#096556] hover:bg-[#075145] text-white font-bold text-xs tracking-wide shadow-sm"
                >
                  Order Emergency Pens Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
