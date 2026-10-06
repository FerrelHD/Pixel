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
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
    <div ref={elementRef} className={`relative ${className}`}>
      {/* Mini Spider-Bot Helper Web drop on reveal */}
      {showBotHelper && isVisible && (
        <div className="absolute -top-6 right-4 sm:right-8 z-20 pointer-events-none animate-in fade-in duration-500">
          <SpiderBotSprite
            size={20}
            eyeColor="#facc15"
            hasWeb={true}
            webHeight={24}
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
    </div>
  );
};
