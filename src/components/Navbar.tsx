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
      {/* Top Reassurance & Compliance Ticker */}
      <div className="bg-[#0c2340] text-slate-300 text-xs py-2.5 px-4 border-b border-slate-800 tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-teal-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              UK GPhC Registered Pharmacy Fulfilment
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-300">Next-Day Medical Courier</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-teal-300 font-medium">12, 6, 3 & 1m Expiry Alerts</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:08001234567" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>0800 123 4567</span>
            </a>
            <span className="text-slate-700">|</span>
            <Link href="/portal" className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>School Portal</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/admin" className="text-teal-300 hover:text-white flex items-center gap-1 font-bold transition-colors bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
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
                className="p-2 rounded-xl text-forest-900 hover:bg-stone-100"
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
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide ${
                    pathname === link.href ? 'text-[#005eb8] bg-[#f0f7fb] font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-200 mt-2 flex flex-col gap-2">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-slate-300 text-slate-800 font-semibold text-xs hover:bg-slate-50"
                >
                  School Portal Sign In
                </Link>
                <Link
                  href="/order-pens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-[#005eb8] hover:bg-[#004b93] text-white font-bold text-xs tracking-wide shadow-sm"
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
