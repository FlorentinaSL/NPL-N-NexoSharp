"use client";

import React from "react";

interface ClientImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  fallbackSrc: string;
  className?: string;
}

export default function ClientImage({ src, alt, style, fallbackSrc, className }: ClientImageProps) {
  return (
    <img 
      src={src} 
      alt={alt} 
      style={style} 
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallbackSrc;
      }}
    />
  );
}
