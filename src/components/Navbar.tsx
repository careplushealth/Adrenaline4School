'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  UserCheck, 
  Shield,
  CheckCircle
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
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Reassurance & Quick Access Bar — Brand Green as shown in website reference */}
      <div className="bg-[#09653d] text-white text-[11px] py-1.5 px-4 border-b border-black/[0.08]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/95 hidden sm:flex text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
            <span>UK GPhC Registered Pharmacy Fulfilment</span>
            <span className="text-white/40">•</span>
            <span>Next-Day Medical Courier</span>
            <span className="text-white/40">•</span>
            <span>12, 6, 3 &amp; 1m Expiry Alerts</span>
          </div>
          <div className="flex items-center gap-3.5 ml-auto text-white">
            <a href="tel:01619733552" className="hover:text-emerald-200 transition-colors flex items-center gap-1.5 text-[11px]">
              <Phone className="w-3 h-3 text-emerald-200" />
              <span className="font-semibold">0161 973 3552</span>
            </a>
            <span className="text-white/30">|</span>
            <Link href="/portal" className="text-white hover:text-emerald-200 flex items-center gap-1.5 font-semibold transition-colors text-[11px]">
              <UserCheck className="w-3 h-3 text-emerald-200" />
              <span>School Portal</span>
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/admin"
              className="text-white/80 hover:text-white hover:bg-white/10 p-0.5 rounded-full transition-colors flex items-center justify-center"
              title="Admin Portal Login"
              aria-label="Admin Portal Login"
            >
              <Shield className="w-3 h-3 text-emerald-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar — Apple Translucent Glass Chrome */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 sm:h-20">
            {/* Official Logo */}
            <Link href="/" className="flex items-center gap-3 group py-1">
              <img
                src="/logo.png"
                alt="Adrenaline4Schools"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links (Training removed) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-tight transition-all duration-200 ${
                      isActive
                        ? 'text-[#09653d] bg-[#09653d]/[0.08] font-semibold'
                        : 'text-[#424245] hover:text-[#09653d] hover:bg-black/[0.04]'
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
                className="relative px-3.5 py-2 rounded-full border border-black/[0.08] text-[#1d1d1f] bg-white hover:bg-[#f5f5f7] hover:border-black/[0.15] transition-all duration-200 flex items-center gap-2 group shadow-2xs apple-btn"
                aria-label="View Basket"
              >
                <ShoppingBag className="w-4 h-4 text-[#424245] group-hover:text-[#09653d] transition-colors" />
                {itemCount > 0 && (
                  <span className="bg-[#09653d] text-white text-[11px] font-bold w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
                <span className="text-[12px] font-medium text-[#1d1d1f] hidden md:inline">Basket</span>
              </Link>

              {/* Order Now CTA — Apple Signature Pill Button */}
              <Link
                href="/order-pens"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white text-[13px] font-semibold tracking-tight shadow-sm hover:shadow transition-all duration-200 apple-btn"
              >
                <span>Order Now</span>
                <span className="font-normal text-xs">&rarr;</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <Link href="/basket" className="relative p-2 text-[#1d1d1f] apple-btn">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#09653d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-[#1d1d1f] hover:bg-black/[0.05] transition-colors apple-btn"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu — Apple Sheet Styling */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-2xl px-5 pt-3 pb-6 shadow-xl animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-2xl text-[14px] font-medium tracking-tight transition-all ${
                      isActive
                        ? 'text-[#09653d] bg-[#09653d]/[0.08] font-semibold'
                        : 'text-[#1d1d1f] hover:bg-black/[0.04]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-black/[0.06] mt-2 flex flex-col gap-2.5">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-black/[0.08] text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] font-medium text-[13px] transition-colors apple-btn"
                >
                  School Portal Sign In
                </Link>
                <Link
                  href="/order-pens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full bg-[#09653d] hover:bg-[#064e2e] text-white font-semibold text-[13px] tracking-tight shadow-sm apple-btn"
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
