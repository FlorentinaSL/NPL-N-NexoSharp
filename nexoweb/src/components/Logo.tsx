import React from 'react';

export default function Logo({ size = 240 }: { size?: number | string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ userSelect: "none", filter: "drop-shadow(0 0 10px rgba(124, 58, 237, 0.4))" }}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <path 
        d="M50 5L88.9711 27.5V72.5L50 95L11.0289 72.5V27.5L50 5Z" 
        fill="url(#logo-grad)" 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="2" 
      />
      <text x="50" y="65" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="32" fill="white" textAnchor="middle">
        N#
      </text>
    </svg>
  );
}
