'use client';

import React from 'react';

export default function PupilsIllustration() {
  return (
    <div className="w-full max-w-sm mx-auto flex items-center justify-center select-none pt-2">
      <svg
        viewBox="0 0 320 180"
        className="w-full h-auto drop-shadow-sm overflow-visible select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Tint */}
        <ellipse cx="160" cy="140" rx="130" ry="24" fill="#dcfce7" opacity="0.6" />

        {/* --- PUPIL 1 (LEFT): Ginger Hair, Green Blazer --- */}
        <g transform="translate(42, 35)">
          {/* Hair Back */}
          <ellipse cx="40" cy="38" rx="26" ry="28" fill="#ea580c" />

          {/* Neck */}
          <rect x="34" y="58" width="12" height="15" fill="#fed7aa" />

          {/* Face */}
          <ellipse cx="40" cy="42" rx="20" ry="22" fill="#ffedd5" />

          {/* Hair Front / Fringe */}
          <path
            d="M20 35 C20 20, 40 16, 60 28 C56 22, 48 18, 38 18 C28 18, 22 24, 20 35 Z"
            fill="#ea580c"
          />
          <path d="M22 28 C28 24, 38 24, 45 30" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />

          {/* Eyes & Smile */}
          <circle cx="33" cy="42" r="2.5" fill="#1e293b" />
          <circle cx="47" cy="42" r="2.5" fill="#1e293b" />
          {/* Cheerful Smile */}
          <path d="M36 50 Q40 55 44 50" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Rosy Cheeks */}
          <ellipse cx="29" cy="47" rx="3.5" ry="2" fill="#fca5a5" opacity="0.6" />
          <ellipse cx="51" cy="47" rx="3.5" ry="2" fill="#fca5a5" opacity="0.6" />

          {/* Green School Blazer & White Collar */}
          <path
            d="M10 115 L20 70 L60 70 L70 115 Z"
            fill="#096556"
            stroke="#0c2340"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* White Shirt V */}
          <polygon points="34,70 46,70 40,86" fill="#ffffff" stroke="#0c2340" strokeWidth="1.5" />
          {/* Gold / Green School Tie */}
          <polygon points="38,73 42,73 44,98 40,102 36,98" fill="#15803d" stroke="#0c2340" strokeWidth="1.2" />
          <line x1="38" y1="80" x2="42" y2="80" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="37" y1="88" x2="43" y2="88" stroke="#ca8a04" strokeWidth="1.5" />

          {/* Blazer Lapels */}
          <path d="M20 70 L34 94 L40 94" stroke="#0c2340" strokeWidth="2" fill="#075145" />
          <path d="M60 70 L46 94 L40 94" stroke="#0c2340" strokeWidth="2" fill="#075145" />
        </g>

        {/* --- PUPIL 3 (RIGHT): Dark Hair, Green Blazer --- */}
        <g transform="translate(198, 35)">
          {/* Hair Back */}
          <ellipse cx="40" cy="38" rx="26" ry="28" fill="#1e293b" />

          {/* Neck */}
          <rect x="34" y="58" width="12" height="15" fill="#fcd34d" opacity="0.6" />

          {/* Face */}
          <ellipse cx="40" cy="42" rx="20" ry="22" fill="#fde68a" />

          {/* Hair Front */}
          <path
            d="M20 32 C22 18, 42 16, 60 26 C54 20, 44 18, 34 18 C26 18, 22 22, 20 32 Z"
            fill="#1e293b"
          />

          {/* Eyes & Smile */}
          <circle cx="33" cy="42" r="2.5" fill="#0f172a" />
          <circle cx="47" cy="42" r="2.5" fill="#0f172a" />
          <path d="M36 50 Q40 55 44 50" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Rosy Cheeks */}
          <ellipse cx="29" cy="47" rx="3.5" ry="2" fill="#fca5a5" opacity="0.5" />
          <ellipse cx="51" cy="47" rx="3.5" ry="2" fill="#fca5a5" opacity="0.5" />

          {/* Green School Blazer & White Collar */}
          <path
            d="M10 115 L20 70 L60 70 L70 115 Z"
            fill="#096556"
            stroke="#0c2340"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* White Shirt V */}
          <polygon points="34,70 46,70 40,86" fill="#ffffff" stroke="#0c2340" strokeWidth="1.5" />
          {/* Tie */}
          <polygon points="38,73 42,73 44,98 40,102 36,98" fill="#15803d" stroke="#0c2340" strokeWidth="1.2" />
          <line x1="38" y1="80" x2="42" y2="80" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="37" y1="88" x2="43" y2="88" stroke="#ca8a04" strokeWidth="1.5" />

          {/* Blazer Lapels */}
          <path d="M20 70 L34 94 L40 94" stroke="#0c2340" strokeWidth="2" fill="#075145" />
          <path d="M60 70 L46 94 L40 94" stroke="#0c2340" strokeWidth="2" fill="#075145" />
        </g>

        {/* --- PUPIL 2 (CENTER): Girl with Curly Dark Hair, Holding Orange Folder --- */}
        <g transform="translate(118, 28)">
          {/* Voluminous Curly Hair Backdrop */}
          <circle cx="24" cy="38" r="14" fill="#3f2b1d" />
          <circle cx="56" cy="38" r="14" fill="#3f2b1d" />
          <circle cx="40" cy="24" r="18" fill="#3f2b1d" />

          {/* Neck */}
          <rect x="34" y="62" width="12" height="15" fill="#a16207" opacity="0.4" />

          {/* Face */}
          <ellipse cx="40" cy="46" rx="21" ry="23" fill="#b45309" opacity="0.85" />

          {/* Curly Fringe */}
          <circle cx="28" cy="28" r="8" fill="#3f2b1d" />
          <circle cx="40" cy="26" r="8" fill="#3f2b1d" />
          <circle cx="52" cy="28" r="8" fill="#3f2b1d" />

          {/* Eyes & Smile */}
          <circle cx="33" cy="46" r="2.5" fill="#0f172a" />
          <circle cx="47" cy="46" r="2.5" fill="#0f172a" />
          <path d="M35 55 Q40 60 45 55" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Green School Blazer */}
          <path
            d="M8 122 L18 76 L62 76 L72 122 Z"
            fill="#096556"
            stroke="#0c2340"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* White Shirt V */}
          <polygon points="34,76 46,76 40,92" fill="#ffffff" stroke="#0c2340" strokeWidth="1.5" />
          <polygon points="38,79 42,79 44,98 40,102 36,98" fill="#15803d" stroke="#0c2340" strokeWidth="1.2" />

          {/* Lapels */}
          <path d="M18 76 L34 100 L40 100" stroke="#0c2340" strokeWidth="2" fill="#075145" />
          <path d="M62 76 L46 100 L40 100" stroke="#0c2340" strokeWidth="2" fill="#075145" />

          {/* Orange School Folder / Book Held in Arms */}
          <rect x="22" y="98" width="36" height="24" rx="3" fill="#ea580c" stroke="#0c2340" strokeWidth="2" />
          <line x1="28" y1="98" x2="28" y2="122" stroke="#ffffff" strokeWidth="1.5" />

          {/* Hands Holding Book */}
          <circle cx="20" cy="110" r="5" fill="#b45309" stroke="#0c2340" strokeWidth="1.5" />
          <circle cx="60" cy="110" r="5" fill="#b45309" stroke="#0c2340" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
