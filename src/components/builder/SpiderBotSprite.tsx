import React from 'react';

interface SpiderBotSpriteProps {
  size?: number;
  eyeColor?: string;
  hasWeb?: boolean;
  webHeight?: number;
  className?: string;
  isCrawling?: boolean;
}

export const SpiderBotSprite: React.FC<SpiderBotSpriteProps> = ({
  size = 32,
  eyeColor = '#38bdf8',
  hasWeb = false,
  webHeight = 40,
  className = '',
  isCrawling = false,
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Web Strand */}
      {hasWeb && (
        <div
          className="w-0.5 bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          style={{ height: `${webHeight}px` }}
        />
      )}

      {/* Spider-Bot Body & Legs Matrix (16x16 Pixel Grid) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        className="pixel-crisp drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
        shapeRendering="crispEdges"
      >
        {/* LEGS (6 articulated mechanical spider legs) */}
        {/* Left Upper Leg */}
        <rect x="1" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="0" y="4" width="2" height="2" fill="#1e293b" />

        {/* Left Middle Leg */}
        <rect
          x="1"
          y="7"
          width="2"
          height="1"
          fill="#0f172a"
          className={isCrawling ? 'animate-pulse' : ''}
        />
        <rect x="0" y="8" width="2" height="2" fill="#1e293b" />

        {/* Left Lower Leg */}
        <rect x="1" y="11" width="2" height="1" fill="#0f172a" />
        <rect x="0" y="12" width="2" height="2" fill="#1e293b" />

        {/* Right Upper Leg */}
        <rect x="13" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="4" width="2" height="2" fill="#1e293b" />

        {/* Right Middle Leg */}
        <rect
          x="13"
          y="7"
          width="2"
          height="1"
          fill="#0f172a"
          className={isCrawling ? 'animate-pulse' : ''}
        />
        <rect x="14" y="8" width="2" height="2" fill="#1e293b" />

        {/* Right Lower Leg */}
        <rect x="13" y="11" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="12" width="2" height="2" fill="#1e293b" />

        {/* MAIN BODY (Red & Navy Dome Shell) */}
        {/* Outer Shadow Edge */}
        <rect x="4" y="3" width="8" height="1" fill="#991b1b" />
        <rect x="3" y="4" width="10" height="8" fill="#b91c1c" />
        <rect x="4" y="12" width="8" height="1" fill="#7f1d1d" />

        {/* Red Main Armor Shell */}
        <rect x="4" y="4" width="8" height="7" fill="#dc2626" />
        <rect x="5" y="4" width="6" height="1" fill="#ef4444" />

        {/* Center Blue Accents */}
        <rect x="6" y="6" width="4" height="4" fill="#1e3a8a" />
        <rect x="7" y="7" width="2" height="2" fill="#0f172a" />

        {/* DUAL GLOWING EYE LENSES */}
        {/* Left Eye */}
        <rect x="4" y="5" width="2" height="2" fill="#000000" />
        <rect x="4" y="5" width="1" height="1" fill={eyeColor} />
        <rect x="5" y="6" width="1" height="1" fill={eyeColor} />

        {/* Right Eye */}
        <rect x="10" y="5" width="2" height="2" fill="#000000" />
        <rect x="10" y="5" width="1" height="1" fill={eyeColor} />
        <rect x="11" y="6" width="1" height="1" fill={eyeColor} />

        {/* Web Nozzle / Tail */}
        <rect x="7" y="13" width="2" height="1" fill="#ffffff" />
      </svg>
    </div>
  );
};
