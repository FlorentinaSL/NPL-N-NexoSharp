"use client";

import React, { useEffect, useRef, useState } from "react";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const secondaryCursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onHoverEnter = () => setIsHovering(true);
    const onHoverLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseleave", onMouseLeave);

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .nav-link, .primary-btn, .secondary-btn, .cozmoBtn');
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onHoverEnter);
      el.addEventListener("mouseleave", onHoverLeave);
    });

    const animate = () => {
      // Smooth interpolation (lerp)
      const lerp = (start: number, end: number, amount: number) => {
        return start + (end - start) * amount;
      };

      positionRef.current.x = lerp(positionRef.current.x, targetRef.current.x, 0.15);
      positionRef.current.y = lerp(positionRef.current.y, targetRef.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0)`;
      }

      if (secondaryCursorRef.current) {
        secondaryCursorRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Mutation observer to handle dynamic elements
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll('a, button, [role="button"], .nav-link, .primary-btn, .secondary-btn, .cozmoBtn');
      elements.forEach((el) => {
        el.addEventListener("mouseenter", onHoverEnter);
        el.addEventListener("mouseleave", onHoverLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor-dot ${isVisible ? "visible" : ""} ${isHovering ? "hover" : ""}`}
      />
      <div
        ref={secondaryCursorRef}
        className={`custom-cursor-ball ${isVisible ? "visible" : ""} ${isHovering ? "hover" : ""}`}
      />
    </>
  );
};

export default CustomCursor;
