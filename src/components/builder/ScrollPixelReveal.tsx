import React, { useState, useEffect, useRef } from 'react';
import { SpiderBotSprite } from './SpiderBotSprite';

interface ScrollPixelRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  showBotHelper?: boolean;
}

export const ScrollPixelReveal: React.FC<ScrollPixelRevealProps> = ({
  children,
  delay = 0,
  className = '',
  showBotHelper = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBotFlying, setIsBotFlying] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsBotFlying(true);
          setTimeout(() => setIsBotFlying(false), 1400);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
      {/* Flying Spider-Bot Swoop Pass across card during assembly */}
      {showBotHelper && isBotFlying && (
        <div
          className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-1000 ease-out flex items-center"
          style={{
            animation: 'flyAcross 1.2s forwards cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {/* Glowing Silk Jet */}
          <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-white shadow-[0_0_8px_#38bdf8]" />
          <SpiderBotSprite
            size={24}
            eyeColor="#38bdf8"
            hasWeb={false}
            isCrawling={true}
          />
        </div>
      )}

      {/* Stepped Pixel Build Container */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>

      <style>{`
        @keyframes flyAcross {
          0% {
            left: -60px;
            opacity: 0;
            transform: translateY(-50%) rotate(-15deg);
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 105%;
            opacity: 0;
            transform: translateY(-50%) rotate(15deg);
          }
        }
      `}</style>
    </div>
  );
};
