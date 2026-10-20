'use client';

import React from 'react';

export default function HeroSceneIllustration() {
  return (
    <div className="relative w-full max-w-md sm:max-w-lg mx-auto flex items-center justify-center select-none">
      {/* Soft Blue Oval Background */}
      <div className="absolute inset-0 bg-[#e8f4f8] rounded-full scale-95 blur-2xl opacity-70 pointer-events-none" />

      <svg
        viewBox="35 15 500 405"
        className="w-full h-auto drop-shadow-md overflow-visible select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>

          {/* Roof Gradient */}
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Wall Gradient */}
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>

          {/* Tree Greens */}
          <linearGradient id="treeGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="treeGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>

        {/* --- 1. SKY & FLUFFY CLOUDS --- */}
        <g opacity="0.85">
          {/* Cloud 1 (Left Top) */}
          <path
            d="M80 80 C80 65, 100 55, 120 62 C130 50, 155 52, 165 65 C180 65, 190 78, 185 92 C185 95, 80 95, 80 80 Z"
            fill="#ffffff"
          />
          {/* Cloud 2 (Center High) */}
          <path
            d="M320 50 C320 38, 338 30, 355 36 C365 25, 388 28, 396 38 C410 38, 418 48, 414 60 C414 62, 320 62, 320 50 Z"
            fill="#ffffff"
          />
        </g>

        {/* --- 2. LUSH GREEN TREES (FLANKING THE SCHOOL) --- */}
        {/* Left Tree */}
        <g>
          {/* Trunk */}
          <rect x="135" y="160" width="16" height="50" rx="3" fill="#78350f" />
          {/* Foliage */}
          <circle cx="120" cy="140" r="34" fill="url(#treeGradLeft)" />
          <circle cx="150" cy="130" r="38" fill="#16a34a" />
          <circle cx="160" cy="155" r="28" fill="#15803d" />
        </g>

        {/* Right Tree */}
        <g>
          {/* Trunk */}
          <rect x="425" y="160" width="16" height="50" rx="3" fill="#78350f" />
          {/* Foliage */}
          <circle cx="430" cy="135" r="38" fill="url(#treeGradRight)" />
          <circle cx="455" cy="145" r="32" fill="#16a34a" />
          <circle cx="405" cy="150" r="26" fill="#15803d" />
        </g>

        {/* --- 3. SCHOOL BUILDING --- */}
        {/* Main Central Block */}
        <g>
          {/* School Foundation & Walls */}
          <rect x="160" y="125" width="250" height="95" rx="4" fill="url(#wallGrad)" stroke="#ea580c" strokeWidth="2.5" />

          {/* Roof Tiles */}
          <path
            d="M150 125 L165 95 L405 95 L420 125 Z"
            fill="url(#roofGrad)"
            stroke="#9a3412"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Central Clock Tower */}
          <rect x="250" y="55" width="70" height="70" rx="4" fill="url(#wallGrad)" stroke="#ea580c" strokeWidth="2.5" />
          {/* Tower Arched Roof */}
          <path
            d="M242 55 L285 24 L328 55 Z"
            fill="url(#roofGrad)"
            stroke="#9a3412"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Clock Dial */}
          <circle cx="285" cy="74" r="14" fill="#ffffff" stroke="#0c2340" strokeWidth="2.5" />
          {/* Clock Hands (Pointing at 9:00) */}
          <line x1="285" y1="74" x2="285" y2="65" stroke="#0c2340" strokeWidth="2" strokeLinecap="round" />
          <line x1="285" y1="74" x2="277" y2="74" stroke="#0c2340" strokeWidth="2" strokeLinecap="round" />
          <circle cx="285" cy="74" r="1.5" fill="#0c2340" />

          {/* SCHOOL Header Plaque */}
          <rect x="260" y="98" width="50" height="15" rx="3" fill="#ffffff" stroke="#0c2340" strokeWidth="1.5" />
          <text
            x="285"
            y="109"
            fill="#0c2340"
            fontSize="8"
            fontWeight="900"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.8"
          >
            SCHOOL
          </text>

          {/* Double Entrance Doors */}
          <rect x="270" y="170" width="30" height="50" rx="2" fill="#0284c7" stroke="#0c2340" strokeWidth="2" />
          <line x1="285" y1="170" x2="285" y2="220" stroke="#0c2340" strokeWidth="1.5" />
          <circle cx="282" cy="195" r="1.5" fill="#ffffff" />
          <circle cx="288" cy="195" r="1.5" fill="#ffffff" />

          {/* Left Wing Windows */}
          <rect x="180" y="140" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="191" y1="140" x2="191" y2="166" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="180" y1="153" x2="202" y2="153" stroke="#0284c7" strokeWidth="1.5" />

          <rect x="215" y="140" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="226" y1="140" x2="226" y2="166" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="215" y1="153" x2="237" y2="153" stroke="#0284c7" strokeWidth="1.5" />

          <rect x="180" y="178" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="191" y1="178" x2="191" y2="204" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="180" y1="191" x2="202" y2="191" stroke="#0284c7" strokeWidth="1.5" />

          <rect x="215" y="178" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="226" y1="178" x2="226" y2="204" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="215" y1="191" x2="237" y2="191" stroke="#0284c7" strokeWidth="1.5" />

          {/* Right Wing Windows */}
          <rect x="335" y="140" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="346" y1="140" x2="346" y2="166" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="335" y1="153" x2="357" y2="153" stroke="#0284c7" strokeWidth="1.5" />

          <rect x="370" y="140" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="381" y1="140" x2="381" y2="166" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="370" y1="153" x2="392" y2="153" stroke="#0284c7" strokeWidth="1.5" />

          <rect x="335" y="178" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="346" y1="178" x2="346" y2="204" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="335" y1="191" x2="357" y2="191" stroke="#0284c7" strokeWidth="1.5" />

          <rect x="370" y="178" width="22" height="26" rx="2" fill="#ffffff" stroke="#0c2340" strokeWidth="2" />
          <line x1="381" y1="178" x2="381" y2="204" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="370" y1="191" x2="392" y2="191" stroke="#0284c7" strokeWidth="1.5" />
        </g>

        {/* Ground Hill / Oval Base */}
        <ellipse cx="285" cy="225" rx="220" ry="28" fill="#e0f2fe" opacity="0.6" />

        {/* --- 4. FOREGROUND ICONIC AUTO-INJECTOR PENS (EPIPEN & JEXT) --- */}
        {/* Glow / Sparkle Behind Pens */}
        <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
          {/* Sparkles on Left Pen */}
          <line x1="355" y1="215" x2="340" y2="210" />
          <line x1="350" y1="230" x2="335" y2="235" />
          <line x1="358" y1="245" x2="342" y2="252" />
          {/* Sparkles on Right Pen */}
          <line x1="480" y1="225" x2="494" y2="220" />
          <line x1="484" y1="242" x2="498" y2="245" />
          <line x1="480" y1="258" x2="494" y2="263" />
        </g>

        {/* Left Device: EpiPen® 300mcg (Yellow Body, Blue Cap, Black Base) */}
        <g transform="translate(372, 160) rotate(4)">
          {/* Shadow */}
          <ellipse cx="28" cy="236" rx="26" ry="7" fill="#0c2340" fillOpacity="0.2" />

          {/* Blue Top Safety Cap */}
          <path d="M12 0 C12 -6, 44 -6, 44 0 L46 22 C46 25, 42 28, 38 28 L18 28 C14 28, 10 25, 10 22 Z" fill="#0284c7" stroke="#0c2340" strokeWidth="2.5" />

          {/* Yellow Main Pen Body */}
          <rect x="8" y="28" width="40" height="175" rx="6" fill="#facc15" stroke="#0c2340" strokeWidth="2.5" />

          {/* White Medicine Information Label */}
          <rect x="11" y="42" width="34" height="110" rx="3" fill="#ffffff" />
          <text x="28" y="62" fill="#0c2340" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            EpiPen®
          </text>
          <line x1="16" y1="70" x2="40" y2="70" stroke="#cbd5e1" strokeWidth="1" />

          {/* 300mcg Dose Indicator */}
          <rect x="11" y="105" width="34" height="42" fill="#facc15" />
          <text x="28" y="124" fill="#0c2340" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            300
          </text>
          <text x="28" y="136" fill="#0c2340" fontSize="5.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
            micrograms
          </text>

          {/* Black Needle Base Tip */}
          <path d="M10 203 L46 203 L42 232 C41 237, 36 240, 32 240 L24 240 C20 240, 15 237, 14 232 Z" fill="#1e293b" stroke="#0c2340" strokeWidth="2.5" />
        </g>

        {/* Right Device: Jext® 150mcg (Sky Blue Body, White Label, Dark Blue Tip) */}
        <g transform="translate(432, 172) rotate(6)">
          {/* Shadow */}
          <ellipse cx="28" cy="226" rx="24" ry="7" fill="#0c2340" fillOpacity="0.2" />

          {/* Dark Blue Safety Cap */}
          <path d="M12 0 C12 -5, 42 -5, 42 0 L44 20 C44 23, 40 26, 36 26 L18 26 C14 26, 10 23, 10 20 Z" fill="#0369a1" stroke="#0c2340" strokeWidth="2.5" />

          {/* Light Sky-Blue Main Pen Body */}
          <rect x="8" y="26" width="38" height="165" rx="6" fill="#38bdf8" stroke="#0c2340" strokeWidth="2.5" />

          {/* White Medicine Information Label */}
          <rect x="11" y="40" width="32" height="105" rx="3" fill="#ffffff" />
          <text x="27" y="60" fill="#0c2340" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            Jext®
          </text>
          <line x1="16" y1="68" x2="38" y2="68" stroke="#cbd5e1" strokeWidth="1" />

          {/* 150mcg Dose Indicator */}
          <rect x="11" y="100" width="32" height="40" fill="#0284c7" />
          <text x="27" y="119" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            150
          </text>
          <text x="27" y="131" fill="#ffffff" fontSize="5.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
            micrograms
          </text>

          {/* Dark Navy / Black Needle Base Tip */}
          <path d="M10 191 L44 191 L40 220 C39 224, 35 227, 31 227 L23 227 C19 227, 15 224, 14 220 Z" fill="#0f172a" stroke="#0c2340" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}
