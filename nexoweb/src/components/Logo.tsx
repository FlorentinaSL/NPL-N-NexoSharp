import React from 'react';

export default function Logo({ size = 240 }: { size?: number | string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ userSelect: "none" }}
    >
      <text x="50" y="72" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="64" fill="#0d9488" textAnchor="middle" letterSpacing="-2">
        N#
      </text>
    </svg>
  );
}
