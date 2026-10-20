'use client';

import React from 'react';

export default function FourStepProcess() {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#096556] uppercase">
            A SIMPLE 4-STEP PROCESS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0c2340] tracking-tight leading-tight">
            Ordering your emergency pens is easy
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            We take care of the paperwork and pharmacy process, so you can focus on keeping your school safe.
          </p>
        </div>

        {/* 4 Illustrated Steps Grid with Flow Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative items-start">
          {/* STEP 1: Choose your pens */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative group">
            {/* Visual Stage */}
            <div className="w-full h-52 sm:h-56 flex items-center justify-center relative mb-6">
              {/* Soft Ice-Blue Aura Backdrop */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#e8f4f8] transition-transform duration-500 group-hover:scale-105 flex items-center justify-center relative p-3">
                {/* Animated Laptop & Pens Visual */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="-20 -15 280 210"
                    className="w-full h-full drop-shadow-sm select-none overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Laptop Screen Frame (Navy Bezel) */}
                    <rect x="24" y="20" width="192" height="120" rx="8" fill="#1e293b" />
                    <rect x="28" y="24" width="184" height="112" rx="6" fill="#f8fafc" />

                    {/* Browser Window Bar */}
                    <path d="M28 28C28 25.7909 29.7909 24 32 24H208C210.209 24 212 25.7909 212 28V40H28V28Z" fill="#38bdf8" fillOpacity="0.85" />
                    <circle cx="38" cy="32" r="2.5" fill="#ffffff" fillOpacity="0.8" />
                    <circle cx="46" cy="32" r="2.5" fill="#ffffff" fillOpacity="0.8" />
                    <circle cx="54" cy="32" r="2.5" fill="#ffffff" fillOpacity="0.8" />

                    {/* Screen Content Background */}
                    <rect x="34" y="44" width="172" height="86" rx="4" fill="#ffffff" />

                    {/* Pen 1 on Screen (Teal / Blue Junior Pen) */}
                    <g transform="translate(68, 52)">
                      <rect x="0" y="0" width="18" height="66" rx="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
                      <rect x="2" y="4" width="14" height="12" rx="2" fill="#0284c7" />
                      <rect x="4" y="22" width="10" height="24" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                      <line x1="6" y1="28" x2="12" y2="28" stroke="#096556" strokeWidth="1.5" />
                      <line x1="6" y1="34" x2="12" y2="34" stroke="#096556" strokeWidth="1.5" />
                      <rect x="2" y="52" width="14" height="12" rx="2" fill="#0284c7" />
                    </g>

                    {/* Pen 2 on Screen (Yellow / Orange Adult Pen) */}
                    <g transform="translate(104, 52)">
                      <rect x="0" y="0" width="18" height="66" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                      <rect x="2" y="4" width="14" height="12" rx="2" fill="#0284c7" />
                      <rect x="4" y="22" width="10" height="24" rx="1.5" fill="#ffffff" stroke="#ca8a04" strokeWidth="1" />
                      <text x="9" y="38" fill="#a16207" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">300</text>
                      <rect x="2" y="52" width="14" height="12" rx="2" fill="#ea580c" />
                    </g>

                    {/* Laptop Base & Keyboard Shelf */}
                    <path d="M10 140H230C233 140 235 142.5 233.5 145L224 156C223 157.5 221 158.5 219 158.5H21C19 158.5 17 157.5 16 156L6.5 145C5 142.5 7 140 10 140Z" fill="#334155" />
                    <rect x="96" y="141" width="48" height="4" rx="2" fill="#64748b" />

                    {/* Animated Clicking Cursor with Pulse */}
                    <g className="animate-cursor-click" transform="translate(142, 88)">
                      {/* Ripple on click */}
                      <circle cx="2" cy="2" r="14" fill="#096556" fillOpacity="0.25" className="animate-click-ripple origin-center" />
                      {/* Dark Teal Arrow Pointer */}
                      <path
                        d="M0 0L14 18L7 18L5 25L0 23L3 17L-5 17L0 0Z"
                        fill="#096556"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step Header with Circle Badge */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-[#096556] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                1
              </span>
              <h3 className="font-bold text-[#0c2340] text-lg tracking-tight">
                Choose your pens
              </h3>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed lg:pl-10 lg:pr-2">
              Select the brand, strength and quantity your school needs.
            </p>

            {/* Flow Arrow to Step 2 (Desktop only) */}
            <div className="hidden lg:flex absolute -right-4 top-24 z-20 items-center justify-center text-slate-300">
              <svg className="w-6 h-6 animate-flow-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* STEP 2: Sign your form */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative group">
            {/* Visual Stage */}
            <div className="w-full h-52 sm:h-56 flex items-center justify-center relative mb-6">
              {/* Soft Ice-Blue Aura Backdrop */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#e8f4f8] transition-transform duration-500 group-hover:scale-105 flex items-center justify-center relative p-3">
                {/* Animated Requisition Document & Pen Visual */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="-20 -15 260 230"
                    className="w-full h-full drop-shadow-sm select-none overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Requisition Document */}
                    <rect x="36" y="16" width="132" height="172" rx="10" fill="#ffffff" stroke="#0c2340" strokeWidth="3" />
                    
                    {/* Document Title */}
                    <text x="102" y="38" fill="#0c2340" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
                      REQUISITION
                    </text>
                    <text x="102" y="52" fill="#0c2340" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
                      FORM
                    </text>

                    {/* Form Lines */}
                    <line x1="52" y1="70" x2="152" y2="70" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <line x1="52" y1="84" x2="152" y2="84" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <line x1="52" y1="98" x2="136" y2="98" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <line x1="52" y1="112" x2="114" y2="112" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Signature Line */}
                    <line x1="52" y1="152" x2="124" y2="152" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Animated Signature Stroke */}
                    <path
                      d="M56 148 C 62 132, 68 156, 74 140 C 80 152, 88 144, 98 146 C 104 148, 110 142, 118 145"
                      stroke="#005eb8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />

                    {/* Sleek Fountain Pen with Glide Animation */}
                    <g className="animate-pen-sign origin-center" transform="translate(122, 106)">
                      {/* Pen Body (Glossy Royal Blue) */}
                      <path
                        d="M52 -10 L10 74 L-4 82 L0 68 L42 -16 Z"
                        fill="#0284c7"
                        stroke="#0c2340"
                        strokeWidth="2.5"
                      />
                      {/* Metallic Silver Grip */}
                      <polygon points="10,74 -4,82 0,68" fill="#e2e8f0" stroke="#0c2340" strokeWidth="2" />
                      {/* Silver/Chrome Nib */}
                      <polygon points="-4,82 -12,94 -6,90" fill="#cbd5e1" stroke="#0c2340" strokeWidth="1.5" />
                      {/* Pen Clip Accent */}
                      <line x1="44" y1="-8" x2="30" y2="18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step Header with Circle Badge */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-[#096556] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                2
              </span>
              <h3 className="font-bold text-[#0c2340] text-lg tracking-tight">
                Sign your form
              </h3>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed lg:pl-10 lg:pr-2">
              We provide a pre-filled requisition form for your headteacher to sign.
            </p>

            {/* Flow Arrow to Step 3 (Desktop only) */}
            <div className="hidden lg:flex absolute -right-4 top-24 z-20 items-center justify-center text-slate-300">
              <svg className="w-6 h-6 animate-flow-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* STEP 3: Upload and approve */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative group">
            {/* Visual Stage */}
            <div className="w-full h-52 sm:h-56 flex items-center justify-center relative mb-6">
              {/* Soft Ice-Blue Aura Backdrop */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#e8f4f8] transition-transform duration-500 group-hover:scale-105 flex items-center justify-center relative p-3">
                {/* Animated Document with Upload Badge Visual */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="-20 -15 240 230"
                    className="w-full h-full drop-shadow-sm select-none overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Clean Document with Folded Ear */}
                    <path
                      d="M48 24C48 19.5817 51.5817 16 56 16H120L152 48V160C152 164.418 148.418 168 144 168H56C51.5817 168 48 164.418 48 160V24Z"
                      fill="#ffffff"
                      stroke="#0c2340"
                      strokeWidth="3"
                    />
                    {/* Folded Ear Corner */}
                    <path d="M120 16V44C120 46.2091 121.791 48 124 48H152" fill="#e0f2fe" stroke="#0c2340" strokeWidth="3" strokeLinejoin="round" />

                    {/* Document Guidelines */}
                    <line x1="66" y1="64" x2="134" y2="64" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <line x1="66" y1="78" x2="134" y2="78" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <line x1="66" y1="92" x2="120" y2="92" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <line x1="66" y1="106" x2="134" y2="106" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Pulsing Upload Radar Wave */}
                    <g transform="translate(100, 142)">
                      <circle cx="0" cy="0" r="32" fill="#096556" fillOpacity="0.2" className="animate-radar-pulse origin-center" />
                    </g>

                    {/* Floating Green Upload Circle Button with Arrow */}
                    <g className="animate-upload-bounce" transform="translate(100, 142)">
                      <circle cx="0" cy="0" r="26" fill="#096556" stroke="#0c2340" strokeWidth="3" />
                      {/* White Upward Arrow */}
                      <path
                        d="M0 -12L-9 0H-4V11H4V0H9L0 -12Z"
                        fill="#ffffff"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step Header with Circle Badge */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-[#096556] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                3
              </span>
              <h3 className="font-bold text-[#0c2340] text-lg tracking-tight">
                Upload and approve
              </h3>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed lg:pl-10 lg:pr-2">
              Upload the signed form through our secure website for pharmacy approval.
            </p>

            {/* Flow Arrow to Step 4 (Desktop only) */}
            <div className="hidden lg:flex absolute -right-4 top-24 z-20 items-center justify-center text-slate-300">
              <svg className="w-6 h-6 animate-flow-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* STEP 4: We deliver */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative group">
            {/* Visual Stage */}
            <div className="w-full h-52 sm:h-56 flex items-center justify-center relative mb-6">
              {/* Soft Ice-Blue Aura Backdrop */}
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#e8f4f8] transition-transform duration-500 group-hover:scale-105 flex items-center justify-center relative p-3">
                {/* Animated NHS Medical Delivery Van Visual */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    viewBox="-35 0 310 190"
                    className="w-full h-full drop-shadow-sm select-none overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Road baseline */}
                    <line x1="5" y1="148" x2="255" y2="148" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                    {/* Animated Horizontal Motion / Speed Lines (ample clearance on left) */}
                    <g className="animate-speed-lines">
                      <line x1="18" y1="84" x2="48" y2="84" stroke="#0c2340" strokeWidth="3" strokeLinecap="round" />
                      <line x1="10" y1="98" x2="44" y2="98" stroke="#0c2340" strokeWidth="3" strokeLinecap="round" />
                      <line x1="16" y1="112" x2="42" y2="112" stroke="#0c2340" strokeWidth="3" strokeLinecap="round" />
                    </g>

                    {/* Driving Van Body (Bounces subtly with road motion) */}
                    <g className="animate-van-drive">
                      {/* Main Van Box Body (Light NHS Blue) */}
                      <path
                        d="M58 60C58 54.4772 62.4772 50 68 50H170V136H58V60Z"
                        fill="#7dd3fc"
                        stroke="#0c2340"
                        strokeWidth="3.5"
                      />

                      {/* Front Cab (Light NHS Blue) */}
                      <path
                        d="M170 66H192C198 66 204 70 208 76L224 100C226 103 227 107 227 111V136H170V66Z"
                        fill="#7dd3fc"
                        stroke="#0c2340"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />

                      {/* Cab Windshield / Window */}
                      <path
                        d="M176 74H190C194 74 198 76 201 81L214 99C215 101 216 103 216 105V106H176V74Z"
                        fill="#0c2340"
                      />

                      {/* Side Door / Cab Line */}
                      <line x1="170" y1="50" x2="170" y2="136" stroke="#0c2340" strokeWidth="3" />

                      {/* Medical Cross Sign on Box Body */}
                      <g transform="translate(114, 92)">
                        {/* White Cross on Light Blue Body */}
                        <path
                          d="M-6 -22H6V-6H22V6H6V22H-6V6H-22V-6H-6V-22Z"
                          fill="#ffffff"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </g>

                      {/* Headlight */}
                      <path d="M227 114H231V122H227V114Z" fill="#38bdf8" />

                      {/* Rear Wheel Arch & Wheel */}
                      <g transform="translate(86, 136)">
                        {/* Wheel Arch */}
                        <path d="M-22 0C-22 -14 22 -14 22 0" fill="#f8fafc" stroke="#0c2340" strokeWidth="3" />
                        {/* Dark Wheel Tyre */}
                        <circle cx="0" cy="0" r="17" fill="#0c2340" />
                        {/* Light Hub Rim */}
                        <circle cx="0" cy="0" r="8" fill="#cbd5e1" stroke="#0c2340" strokeWidth="2" />
                        <circle cx="0" cy="0" r="2.5" fill="#0c2340" />
                      </g>

                      {/* Front Wheel Arch & Wheel */}
                      <g transform="translate(196, 136)">
                        {/* Wheel Arch */}
                        <path d="M-22 0C-22 -14 22 -14 22 0" fill="#f8fafc" stroke="#0c2340" strokeWidth="3" />
                        {/* Dark Wheel Tyre */}
                        <circle cx="0" cy="0" r="17" fill="#0c2340" />
                        {/* Light Hub Rim */}
                        <circle cx="0" cy="0" r="8" fill="#cbd5e1" stroke="#0c2340" strokeWidth="2" />
                        <circle cx="0" cy="0" r="2.5" fill="#0c2340" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step Header with Circle Badge */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-[#096556] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                4
              </span>
              <h3 className="font-bold text-[#0c2340] text-lg tracking-tight">
                We deliver
              </h3>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed lg:pl-10 lg:pr-2">
              Your pens are dispatched next working day with tracked delivery from our GPhC registered pharmacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
