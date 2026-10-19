'use client';

import React from 'react';

interface DeviceVisualProps {
  type: 'epipen-300' | 'epipen-150' | 'jext-300' | 'jext-150' | 'wall-station' | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
}

export default function MedicalDeviceVisual({
  type,
  className = '',
  size = 'md',
  showShadow = true,
}: DeviceVisualProps) {
  // Sizing controls: pens are prominent, clearly visible, and well-proportioned
  const penSizeClasses = {
    sm: 'w-12 h-28 max-w-[50px]',
    md: 'w-22 h-52 max-w-[92px]',
    lg: 'w-28 h-64 max-w-[115px]',
    xl: 'w-32 h-72 max-w-[130px]',
  }[size] || 'w-22 h-52 max-w-[92px]';

  const stationSizeClasses = {
    sm: 'w-20 h-24 max-w-[85px]',
    md: 'w-40 h-52 max-w-[165px]',
    lg: 'w-52 h-64 max-w-[215px]',
    xl: 'w-60 h-72 max-w-[250px]',
  }[size] || 'w-40 h-52 max-w-[165px]';

  // Render Wall Station
  if (type.includes('wall') || type.includes('station') || type.includes('kit')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${stationSizeClasses} ${className}`}>
        <svg
          viewBox="-10 -10 260 340"
          className="w-full h-full object-contain drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="wallBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id="wallDoorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="15%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="85%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>
            <linearGradient id="metallicLatch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#047857" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Wall Station Outer Green Casing */}
          <rect x="25" y="20" width="190" height="280" rx="20" fill="url(#wallBoxGrad)" filter="url(#boxShadow)" />
          <rect x="27" y="22" width="186" height="276" rx="18" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Top Header Badge */}
          <rect x="40" y="36" width="160" height="42" rx="8" fill="#022c22" fillOpacity="0.75" />
          <rect x="52" y="47" width="20" height="20" rx="3" fill="#ffffff" />
          <path d="M62 49V65M54 57H70" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
          <text x="80" y="53" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.8">EMERGENCY</text>
          <text x="80" y="65" fill="#a7f3d0" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.5">ADRENALINE STATION</text>

          {/* Clear Viewing Window */}
          <rect x="40" y="88" width="160" height="182" rx="12" fill="#0f172a" fillOpacity="0.8" />
          <rect x="40" y="88" width="160" height="182" rx="12" fill="url(#wallDoorGrad)" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Interior Twin Pens Hanging on Backing Rack */}
          <g transform="translate(68, 102) scale(0.42)">
            <rect x="8" y="0" width="36" height="28" rx="6" fill="#0284c7" />
            <rect x="4" y="26" width="44" height="200" rx="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <rect x="12" y="80" width="28" height="50" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="16" y="92" width="20" height="24" rx="2" fill="#e0f2fe" opacity="0.8" />
            <text x="26" y="58" fill="#78350f" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">300</text>
            <rect x="6" y="224" width="40" height="34" rx="6" fill="#ea580c" />
          </g>

          <g transform="translate(122, 102) scale(0.42)">
            <rect x="8" y="0" width="36" height="28" rx="6" fill="#0284c7" />
            <rect x="4" y="26" width="44" height="200" rx="8" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <rect x="12" y="80" width="28" height="50" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="16" y="92" width="20" height="24" rx="2" fill="#e0f2fe" opacity="0.8" />
            <text x="26" y="58" fill="#14532d" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">150</text>
            <rect x="6" y="224" width="40" height="34" rx="6" fill="#ea580c" />
          </g>

          {/* Glass Specular Glare */}
          <path d="M42 90 L180 90 L75 265 L42 265 Z" fill="url(#wallDoorGrad)" opacity="0.5" />

          {/* Quick-Break Security Seal */}
          <circle cx="190" cy="180" r="10" fill="url(#metallicLatch)" stroke="#64748b" strokeWidth="1.5" />
          <rect x="188" y="174" width="4" height="12" rx="1.5" fill="#475569" />

          {/* Base Statutory Label */}
          <rect x="52" y="280" width="136" height="14" rx="4" fill="#022c22" />
          <text x="120" y="290" fill="#a7f3d0" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="0.4">
            BENEDICT&apos;S LAW COMPLIANT 2026
          </text>
        </svg>
      </div>
    );
  }

  const isEpiPen = type.includes('epipen');
  const is300 = type.includes('300');

  // Palette configs based on brand and dose
  const penConfig = isEpiPen
    ? {
        brand: 'EpiPen®',
        subBrand: is300 ? 'Auto-Injector 0.3mg' : 'Junior 0.15mg',
        strengthText: is300 ? '300' : '150',
        unitText: 'micrograms',
        capColor: '#0284c7', // Iconic blue safety release cap
        capHighlight: '#38bdf8',
        capShadow: '#0369a1',
        bodyGradStart: is300 ? '#fde047' : '#4ade80', // Yellow 300 vs Green 150
        bodyGradMid: is300 ? '#facc15' : '#22c55e',
        bodyGradEnd: is300 ? '#eab308' : '#16a34a',
        bodyBorder: is300 ? '#ca8a04' : '#15803d',
        textDark: is300 ? '#713f12' : '#052e16',
        tipColor: '#f97316', // Orange needle shield
        tipShadow: '#c2410c',
        labelBg: '#ffffff',
        accentRing: is300 ? '#854d0e' : '#14532d',
      }
    : {
        brand: 'Jext®',
        subBrand: is300 ? 'Adult 300mcg' : 'Junior 150mcg',
        strengthText: is300 ? '300' : '150',
        unitText: 'micrograms',
        capColor: is300 ? '#f59e0b' : '#38bdf8',
        capHighlight: is300 ? '#fbbf24' : '#7dd3fc',
        capShadow: is300 ? '#d97706' : '#0284c7',
        bodyGradStart: is300 ? '#ffffff' : '#f0fdf4',
        bodyGradMid: is300 ? '#f8fafc' : '#f0fdf4',
        bodyGradEnd: is300 ? '#e2e8f0' : '#e0f2fe',
        bodyBorder: '#cbd5e1',
        textDark: '#0f172a',
        tipColor: '#0f172a', // Black needle guard for Jext
        tipShadow: '#020617',
        labelBg: is300 ? '#fef3c7' : '#e0f2fe',
        accentRing: is300 ? '#f59e0b' : '#0284c7',
      };

  return (
    <div className={`relative flex items-center justify-center select-none ${penSizeClasses} ${className}`}>
      {/* 3D Realistic Auto-Injector Device Vector with safe padding viewBox */}
      <svg
        viewBox="-20 -10 200 405"
        className="w-full h-full object-contain drop-shadow-md select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`capGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={penConfig.capHighlight} />
            <stop offset="35%" stopColor={penConfig.capColor} />
            <stop offset="85%" stopColor={penConfig.capShadow} />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>

          <linearGradient id={`bodyGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="20%" stopColor={penConfig.bodyGradStart} />
            <stop offset="60%" stopColor={penConfig.bodyGradMid} />
            <stop offset="90%" stopColor={penConfig.bodyGradEnd} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="windowGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#e0f2fe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id={`tipGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="25%" stopColor={penConfig.tipColor} />
            <stop offset="80%" stopColor={penConfig.tipShadow} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="metalSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {showShadow && (
            <filter id={`softGlow-${type}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          )}
        </defs>

        {/* SECTION 1: TOP SAFETY CAP */}
        <path
          d="M52 14 C52 7, 108 7, 108 14 L114 44 C114 48, 110 52, 104 52 L56 52 C50 52, 46 48, 46 44 Z"
          fill={`url(#capGrad-${type})`}
          filter={showShadow ? `url(#softGlow-${type})` : undefined}
        />
        {/* Safety Cap Tactile Ridges */}
        <line x1="58" y1="20" x2="58" y2="46" stroke={penConfig.capHighlight} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="66" y1="18" x2="66" y2="48" stroke={penConfig.capHighlight} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="74" y1="17" x2="74" y2="48" stroke={penConfig.capHighlight} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="82" y1="17" x2="82" y2="48" stroke={penConfig.capHighlight} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="90" y1="18" x2="90" y2="48" stroke={penConfig.capHighlight} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="98" y1="20" x2="98" y2="46" stroke={penConfig.capHighlight} strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Safety Release Pull Ring / Lip */}
        <rect x="44" y="48" width="72" height="6" rx="3" fill="url(#metalSheen)" />

        {/* SECTION 2: MAIN CYLINDRICAL BARREL */}
        <rect
          x="42"
          y="54"
          width="76"
          height="240"
          rx="10"
          fill={`url(#bodyGrad-${type})`}
          stroke={penConfig.bodyBorder}
          strokeWidth="1.5"
        />

        {/* Light Reflection Strip on Left Cylinder Edge */}
        <rect x="46" y="56" width="6" height="236" rx="3" fill="#ffffff" fillOpacity="0.45" />

        {/* Clinical Brand Label Backplate */}
        <rect
          x="46"
          y="68"
          width="68"
          height="146"
          rx="6"
          fill={penConfig.labelBg}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Brand Typography */}
        <text
          x="80"
          y="92"
          fill={penConfig.textDark}
          fontSize="13"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.2"
        >
          {penConfig.brand}
        </text>

        <text
          x="80"
          y="104"
          fill="#475569"
          fontSize="6.5"
          fontWeight="700"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.3"
        >
          {penConfig.subBrand}
        </text>

        {/* Dose Callout Oval Badge */}
        <ellipse cx="80" cy="128" rx="26" ry="17" fill={penConfig.bodyGradMid} />
        <ellipse cx="80" cy="128" rx="24" ry="15" fill={penConfig.labelBg} />
        <text
          x="80"
          y="134"
          fill={penConfig.textDark}
          fontSize="16"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5"
        >
          {penConfig.strengthText}
        </text>
        <text
          x="80"
          y="143"
          fill={penConfig.textDark}
          fontSize="7"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.3"
        >
          {penConfig.unitText.toUpperCase()}
        </text>

        {/* Drug Viewing / Inspection Window */}
        <rect
          x="56"
          y="156"
          width="48"
          height="46"
          rx="8"
          fill="#0f172a"
          fillOpacity="0.08"
        />
        <rect
          x="58"
          y="158"
          width="44"
          height="42"
          rx="6"
          fill="url(#windowGlass)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />
        {/* Solution Meniscus Level */}
        <ellipse cx="80" cy="180" rx="14" ry="4" fill="#0284c7" fillOpacity="0.25" />
        <circle cx="76" cy="174" r="3.5" fill="#ffffff" fillOpacity="0.75" />
        <text
          x="80"
          y="196"
          fill="#0369a1"
          fontSize="5"
          fontWeight="800"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.4"
        >
          CLEAR & COLORLESS
        </text>

        {/* Administration Direction Indicator */}
        <g transform="translate(80, 240)">
          <path d="M0 -12 L0 10 M-5 5 L0 11 L5 5" stroke={penConfig.textDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="0" y="24" fill={penConfig.textDark} fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            PUSH TO THIGH
          </text>
        </g>

        {/* Calibration Rings */}
        <line x1="44" y1="274" x2="116" y2="274" stroke={penConfig.accentRing} strokeWidth="2" strokeOpacity="0.4" />
        <line x1="44" y1="280" x2="116" y2="280" stroke={penConfig.accentRing} strokeWidth="1" strokeOpacity="0.3" />

        {/* SECTION 3: NEEDLE GUARD TIP */}
        <path
          d="M48 294 L112 294 L106 348 C104 358, 96 364, 88 364 L72 364 C64 364, 56 358, 54 348 Z"
          fill={`url(#tipGrad-${type})`}
          stroke={penConfig.tipShadow}
          strokeWidth="1.5"
          filter={showShadow ? `url(#softGlow-${type})` : undefined}
        />

        {/* Tip Opening Bevel */}
        <rect x="68" y="360" width="24" height="6" rx="3" fill="#0f172a" />
        <text
          x="80"
          y="325"
          fill="#ffffff"
          fontSize="7"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.5"
        >
          NEEDLE END
        </text>
      </svg>
    </div>
  );
}
