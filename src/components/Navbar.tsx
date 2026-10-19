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
      <div className="bg-forest-950 text-stone-300 text-xs py-2.5 px-4 border-b border-forest-800/40 tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-sage-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              UK GPhC Registered Pharmacy Fulfilment
            </span>
            <span className="hidden md:inline text-forest-700">•</span>
            <span className="hidden md:inline text-stone-300">Next-Day Medical Courier</span>
            <span className="hidden md:inline text-forest-700">•</span>
            <span className="hidden md:inline text-gold-300 font-medium">12, 6, 3 & 1m Expiry Alerts</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:08001234567" className="hover:text-gold-300 transition-colors flex items-center gap-1 text-stone-300">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>0800 123 4567</span>
            </a>
            <span className="text-forest-800">|</span>
            <Link href="/portal" className="text-stone-300 hover:text-gold-300 flex items-center gap-1 font-medium transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-sage-300" />
              <span>School Portal</span>
            </Link>
            <span className="text-forest-800">|</span>
            <Link href="/admin" className="text-gold-300 hover:text-white flex items-center gap-1 font-bold transition-colors bg-gold-400/15 px-2 py-0.5 rounded-full border border-gold-400/30">
              <Lock className="w-3.5 h-3.5 text-gold-400" />
              <span>Staff Gateway</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-md border-b border-stone-200/60 shadow-[0_2px_15px_-3px_rgba(22,35,26,0.03)]">
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
                        ? 'text-forest-950 bg-sage-100/80 border border-sage-300/60 font-bold'
                        : 'text-stone-600 hover:text-forest-950 hover:bg-stone-100/60'
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
                className="relative px-3.5 py-2.5 rounded-full border border-stone-200/90 text-forest-900 bg-white/70 hover:bg-white hover:border-sage-400 transition-all flex items-center gap-2 group shadow-sm"
                aria-label="View Basket"
              >
                <ShoppingBag className="w-4 h-4 text-forest-800 group-hover:text-sage-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="bg-gold-400 text-forest-950 text-[11px] font-black w-4.5 h-4.5 px-1.5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
                <span className="text-xs font-semibold text-forest-900 hidden md:inline">Basket</span>
              </Link>

              {/* Order Now CTA — Wellness Primary Pill */}
              <Link
                href="/order-pens"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-ivory text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5 border border-forest-800"
              >
                <span>Order Now</span>
                <span className="text-gold-300 font-bold">&rarr;</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <Link href="/basket" className="relative p-2 text-forest-900">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-400 text-forest-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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
          <div className="sm:hidden border-t border-stone-200/80 bg-ivory px-5 pt-3 pb-6 shadow-xl animate-fade-in-up">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide ${
                    pathname === link.href ? 'text-forest-950 bg-sage-100/90 font-bold' : 'text-stone-700 hover:bg-stone-100/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-stone-200/60 mt-2 flex flex-col gap-2">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-stone-300/80 text-forest-900 font-semibold text-xs hover:bg-white"
                >
                  School Portal Sign In
                </Link>
                <Link
                  href="/order-pens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-forest-900 text-ivory font-bold text-xs tracking-wide shadow-sm"
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
