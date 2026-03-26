import React from 'react';

export default function Logo({ size = 240 }: { size?: number | string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 240 240" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ filter: "drop-shadow(0 0 20px rgba(167, 139, 250, 0.4))", userSelect: "none" }}
    >
      {/* The pristine 'N' Shape */}
      <path d="M 85 160 L 85 80 L 155 160 L 155 80" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Subtle Glowing Aura around the N */}
      <path d="M 85 160 L 85 80 L 155 160 L 155 80" stroke="#c084fc" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "blur(8px)", opacity: 0.6 }} />

      {/* The Glowing Center Circle */}
      <circle cx="120" cy="120" r="22" fill="#93c5fd" />
      <circle cx="120" cy="120" r="22" fill="#93c5fd" style={{ filter: "blur(10px)", opacity: 0.9 }} />
    </svg>
  );
}
