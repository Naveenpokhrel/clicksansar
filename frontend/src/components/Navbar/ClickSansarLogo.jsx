import React from 'react';

// Official ClickSansar Emblem SVG
export const ClickSansarEmblem = ({ className = 'w-9 h-9' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for the 'C' arc: Sky Cyan to Electric Royal Blue */}
        <linearGradient id="csGradientC" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#00B8FF" />
          <stop offset="50%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#0052FF" />
        </linearGradient>

        {/* Gradient for cursor arrow */}
        <linearGradient id="csCursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A6FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
      </defs>

      {/* Main 'C' Shape */}
      <path
        d="M 57 20 
           A 33 33 0 1 0 54 81 
           L 49 67 
           A 19 19 0 1 1 50 34 
           L 57 20 Z"
        fill="url(#csGradientC)"
      />

      {/* 5 Digital Pixel Squares at Top Right */}
      {/* 1. Top cyan square */}
      <rect x="62" y="19" width="7" height="7" rx="1.2" fill="#0099FF" />

      {/* 2. Middle right blue square */}
      <rect x="71" y="25" width="7" height="7" rx="1.2" fill="#0070FF" />

      {/* 3. Middle left light cyan square */}
      <rect x="54" y="25" width="6.5" height="6.5" rx="1.2" fill="#00BFFF" />

      {/* 4. Lower middle dark navy square */}
      <rect x="63" y="30" width="7.5" height="7.5" rx="1.2" fill="#081832" />

      {/* 5. Lower left deep navy square */}
      <rect x="51" y="36" width="7" height="7" rx="1.2" fill="#040D1E" />

      {/* Mouse Pointer Arrow in Bottom Center pointing up-right */}
      <path
        d="M 40 44 
           L 70 52 
           L 54 59 
           L 50 73 
           Z"
        fill="url(#csCursorGrad)"
      />
    </svg>
  );
};

const ClickSansarLogo = ({ dark = false, size = 'default', showIconOnly = false }) => {
  const getIconSize = () => {
    if (size === 'small') return 'w-7 h-7';
    if (size === 'large') return 'w-12 h-12';
    return 'w-9 h-9';
  };

  const getTextSize = () => {
    if (size === 'small') return 'text-lg';
    if (size === 'large') return 'text-3xl';
    return 'text-[22px]';
  };

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Icon Emblem */}
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <ClickSansarEmblem className={getIconSize()} />
      </div>

      {/* Brand Text */}
      {!showIconOnly && (
        <div className={`font-bold tracking-tight leading-none ${getTextSize()}`}>
          <span className={dark ? 'text-white' : 'text-[#071630]'}>
            Click
          </span>
          <span className="text-[#0066FF]">
            Sansar
          </span>
        </div>
      )}
    </div>
  );
};

export default ClickSansarLogo;
