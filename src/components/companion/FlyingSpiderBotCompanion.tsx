import React, { useState, useEffect } from 'react';
import { soundSynth } from '../../audio/soundEffects';

interface FlyingSpiderBotCompanionProps {
  isMuted?: boolean;
}

const IDLE_FLIGHT_LINES = [
  'Airborne Spider-Bot on patrol!',
  'Hovering over NYC rooftop sector 7!',
  'All thrusters & web shooters nominal!',
  'Need fullstack web or game dev? Ferrel is ready!',
  'Click me to trigger an aerial stunt!',
];

const STUNT_LINES = [
  'WOOHOO! 360° AERIAL WEB-SLING!',
  'SUPERIOR SPIDER-BOT MANEUVER!',
  'BARREL ROLL COMPLETE! OPTICS 100%!',
  'HIGH-ALTITUDE WEB DEV ACTIVATED!',
  'BEEP BOOP! FULL THROTTLE!',
];

export const FlyingSpiderBotCompanion: React.FC<FlyingSpiderBotCompanionProps> = ({
  isMuted = false,
}) => {
  const [currentLine, setCurrentLine] = useState(IDLE_FLIGHT_LINES[0]);
  const [isStunting, setIsStunting] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Rotate idle speech lines
  useEffect(() => {
    const interval = setInterval(() => {
      const line = IDLE_FLIGHT_LINES[Math.floor(Math.random() * IDLE_FLIGHT_LINES.length)];
      setCurrentLine(line);
      setIsBubbleVisible(true);
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll section to give flight reports
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectors = [
        { id: 'signal', line: 'Flying into Spider-Signal broadcast zone!' },
        { id: 'skills', line: 'Scanning RPG tech matrix from above!' },
        { id: 'missions', line: 'Aerial inspection of active quest logs!' },
        { id: 'status', line: 'Locking onto Player 01 master stats!' },
        { id: 'hero', line: 'Patrolling the midnight rooftop skyline!' },
      ];

      for (const sec of sectors) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop - 150;
          if (scrollY >= top && scrollY < top + el.offsetHeight) {
            setCurrentLine(sec.line);
            setIsBubbleVisible(true);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTriggerStunt = () => {
    soundSynth.playSpiderSense(isMuted);
    setIsStunting(true);
    const line = STUNT_LINES[Math.floor(Math.random() * STUNT_LINES.length)];
    setCurrentLine(line);
    setIsBubbleVisible(true);
    setTimeout(() => setIsStunting(false), 900);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end pointer-events-auto">
      {/* 16-Bit Speech Bubble */}
      {isBubbleVisible && !isMinimized && (
        <div className="mb-2 max-w-[210px] sm:max-w-[260px] bg-midnight-950 border-2 border-arcade-gold p-2.5 shadow-pixel-sm relative animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="absolute -bottom-1.5 right-6 w-2.5 h-2.5 bg-midnight-950 border-r-2 border-b-2 border-arcade-gold rotate-45" />

          <p className="font-pixel text-[8px] sm:text-[9px] text-white leading-relaxed">
            {currentLine}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsBubbleVisible(false);
            }}
            className="absolute -top-2 -left-2 w-4 h-4 bg-midnight-900 border border-slate-600 text-slate-300 font-pixel text-[7px] flex items-center justify-center hover:text-white"
            title="Dismiss speech"
          >
            ×
          </button>
        </div>
      )}

      {/* Flying Companion Controls & Mascot */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsMinimized((prev) => !prev)}
          className="px-1.5 py-0.5 bg-midnight-950/80 border border-slate-700 text-pixel-muted font-pixel text-[7px] hover:text-white"
          title={isMinimized ? 'Expand flying bot' : 'Hide flying bot'}
        >
          {isMinimized ? 'FLYING-BOT ▲' : 'HIDE'}
        </button>

        {!isMinimized && (
          <div
            onClick={handleTriggerStunt}
            className={`relative flex flex-col items-center p-2 bg-midnight-950/90 border-2 border-slate-500 hover:border-arcade-gold shadow-pixel cursor-pointer transition-all duration-300 group ${
              isStunting ? '-translate-y-8 rotate-[-360deg] scale-110' : 'hover:-translate-y-2'
            }`}
            title="Click to trigger flying loop-de-loop aerial stunt!"
          >
            {/* Trailing Web Filament */}
            <div className="w-0.5 h-4 bg-white/70 shadow-[0_0_4px_#38bdf8] -mt-2 mb-1" />

            {/* Flying Spider-Bot SVG with Active Thrusters */}
            <svg
              width={34}
              height={34}
              viewBox="0 0 16 16"
              className="pixel-crisp drop-shadow-[0_4px_8px_rgba(56,189,248,0.4)]"
              shapeRendering="crispEdges"
            >
              {/* Articulated Flight Legs */}
              <rect x="0" y="3" width="2" height="2" fill="#1e293b" />
              <rect x="1" y="6" width="2" height="2" fill="#0f172a" />
              <rect x="0" y="10" width="2" height="2" fill="#1e293b" />
              <rect x="14" y="3" width="2" height="2" fill="#1e293b" />
              <rect x="13" y="6" width="2" height="2" fill="#0f172a" />
              <rect x="14" y="10" width="2" height="2" fill="#1e293b" />

              {/* Main Shell Armor */}
              <rect x="4" y="2" width="8" height="10" fill="#dc2626" />
              <rect x="5" y="2" width="6" height="1" fill="#ef4444" />
              <rect x="6" y="5" width="4" height="4" fill="#1e3a8a" />

              {/* Glowing Cyan Optical Lenses */}
              <rect x="4" y="4" width="2" height="2" fill="#38bdf8" />
              <rect x="10" y="4" width="2" height="2" fill="#38bdf8" />

              {/* Micro Thruster Jet Flame */}
              <rect x="6" y="12" width="4" height="3" fill="#facc15" className="animate-pulse" />
              <rect x="7" y="14" width="2" height="2" fill="#ef4444" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
