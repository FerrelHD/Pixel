import React, { useRef } from 'react';
import { Award, Shield, Backpack, Zap } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { SectionPixelBuilder } from '../builder/SectionPixelBuilder';

interface StatusSectionProps {
  isMuted?: boolean;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ isMuted = false }) => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="status"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Character Status"
    >
      {/* Scroll Pixel Builder Overlay */}
      <SectionPixelBuilder containerRef={sectionRef} isMuted={isMuted} />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div
          data-build="text"
          data-crew="status-hdr"
          className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-midnight-700"
        >
          <Award className="text-arcade-gold" size={24} />
          <div>
            <h2 className="font-pixel text-sm sm:text-lg text-white">
              CHARACTER STATUS // ABOUT ME
            </h2>
            <p className="font-sub text-base text-slate-400 mt-1">
              Player 01 stats, equipped inventory, and developer attributes.
            </p>
          </div>
        </div>

        {/* 16-Bit Character Profile Box */}
        <div
          data-build="box"
          data-crew="status-card"
          className="bg-midnight-900 border-4 border-slate-300 p-5 sm:p-8 shadow-pixel relative"
        >
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left: Pixel Portrait & Bio */}
            <div className="flex flex-col items-center bg-midnight-950 border-2 border-midnight-700 p-4 text-center">
              {/* Pixel Avatar Frame */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-midnight-900 border-2 border-spidey-crimson p-1 shadow-pixel-sm mb-3 relative group">
                <svg
                  viewBox="0 0 16 16"
                  className="w-full h-full pixel-crisp"
                  shapeRendering="crispEdges"
                >
                  <rect width="16" height="16" fill="#1e293b" />
                  {/* Spidey Head */}
                  <rect x="4" y="2" width="8" height="2" fill="#dc2626" />
                  <rect x="3" y="4" width="10" height="7" fill="#dc2626" />
                  <rect x="5" y="11" width="6" height="2" fill="#b91c1c" />
                  {/* Mask Eye Lenses */}
                  <rect x="4" y="6" width="3" height="3" fill="#000000" />
                  <rect x="5" y="6" width="2" height="2" fill="#ffffff" />
                  <rect x="9" y="6" width="3" height="3" fill="#000000" />
                  <rect x="9" y="6" width="2" height="2" fill="#ffffff" />
                  {/* Web lines */}
                  <rect x="7" y="2" width="2" height="6" fill="#7f1d1d" opacity="0.6" />
                  {/* Shoulders */}
                  <rect x="2" y="13" width="12" height="3" fill="#1e3a8a" />
                  <rect x="5" y="13" width="6" height="3" fill="#dc2626" />
                </svg>
                <div className="absolute -bottom-2 -right-2 bg-arcade-gold text-black font-pixel text-[8px] px-1.5 py-0.5 font-bold border border-black">
                  LV.99
                </div>
              </div>

              <h3 className="font-pixel text-xs sm:text-sm text-white">
                FERREL RASHAD
              </h3>
              <p className="font-sub text-base text-arcade-gold mt-1">
                Friendly Neighborhood Web &amp; Game Dev
              </p>
              <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 bg-midnight-900 border border-midnight-600">
                <Shield size={12} className="text-spidey-crimson" />
                <span className="font-pixel text-[8px] text-slate-300">
                  NEW YORK SECTOR
                </span>
              </div>
            </div>

            {/* Center: Attributes & Core Stats */}
            <div className="flex flex-col gap-3">
              <h4 className="font-pixel text-[10px] sm:text-xs text-arcade-gold uppercase border-b border-midnight-700 pb-1 flex items-center gap-1.5">
                <Zap size={14} /> ATTRIBUTES
              </h4>

              <div className="space-y-3 font-pixel text-[9px] sm:text-[10px]">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>AGILITY (REACT/VITE)</span>
                    <span className="text-arcade-gold">98/100</span>
                  </div>
                  <div className="w-full bg-midnight-950 border border-midnight-700 h-2.5 p-0.5">
                    <div className="bg-spidey-crimson h-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>WEB-SHOOTER (TYPESCRIPT)</span>
                    <span className="text-cyan-400">95/100</span>
                  </div>
                  <div className="w-full bg-midnight-950 border border-midnight-700 h-2.5 p-0.5">
                    <div className="bg-cyan-400 h-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>ENGINEERING (TAILWIND/CSS)</span>
                    <span className="text-emerald-400">94/100</span>
                  </div>
                  <div className="w-full bg-midnight-950 border border-midnight-700 h-2.5 p-0.5">
                    <div className="bg-emerald-400 h-full w-[94%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>AUDIO SYNTHESIS (WEB AUDIO)</span>
                    <span className="text-purple-400">88/100</span>
                  </div>
                  <div className="w-full bg-midnight-950 border border-midnight-700 h-2.5 p-0.5">
                    <div className="bg-purple-400 h-full w-[88%]" />
                  </div>
                </div>
              </div>

              {/* Special Ability */}
              <div className="mt-2 p-2.5 bg-midnight-950 border border-midnight-700">
                <span className="font-pixel text-[8px] text-spidey-crimson uppercase block font-bold">
                  PASSIVE SKILL: SPIDER-SENSE
                </span>
                <p className="font-sub text-sm text-slate-300 mt-0.5">
                  Detects UI layout bugs, unresponsive layouts, and accessibility flaws before shipping.
                </p>
              </div>
            </div>

            {/* Right: Equipped Inventory */}
            <div className="flex flex-col gap-3">
              <h4 className="font-pixel text-[10px] sm:text-xs text-arcade-gold uppercase border-b border-midnight-700 pb-1 flex items-center gap-1.5">
                <Backpack size={14} /> EQUIPPED GEAR
              </h4>

              <ul className="space-y-2 font-pixel text-[9px] text-slate-300">
                <li
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-2 bg-midnight-950 border border-midnight-700 hover:border-arcade-gold flex items-center gap-2 cursor-default transition-colors"
                >
                  <span className="text-arcade-gold">●</span>
                  <div>
                    <span className="text-white block">NANOTECH SUIT</span>
                    <span className="text-[8px] text-slate-400 font-sub text-xs">
                      React 19 + TypeScript + Tailwind v4
                    </span>
                  </div>
                </li>

                <li
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-2 bg-midnight-950 border border-midnight-700 hover:border-cyan-400 flex items-center gap-2 cursor-default transition-colors"
                >
                  <span className="text-cyan-400">●</span>
                  <div>
                    <span className="text-white block">WEB-SHOOTERS MK-II</span>
                    <span className="text-[8px] text-slate-400 font-sub text-xs">
                      HTML5 2D Canvas + Framer Motion
                    </span>
                  </div>
                </li>

                <li
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-2 bg-midnight-950 border border-midnight-700 hover:border-emerald-400 flex items-center gap-2 cursor-default transition-colors"
                >
                  <span className="text-emerald-400">●</span>
                  <div>
                    <span className="text-white block">CHIPTUNE SYNTH MODULE</span>
                    <span className="text-[8px] text-slate-400 font-sub text-xs">
                      Web Audio Oscillator API
                    </span>
                  </div>
                </li>

                <li
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-2 bg-midnight-950 border border-midnight-700 hover:border-spidey-crimson flex items-center gap-2 cursor-default transition-colors"
                >
                  <span className="text-spidey-crimson">●</span>
                  <div>
                    <span className="text-white block">SPIDER-BOT COMPANION</span>
                    <span className="text-[8px] text-slate-400 font-sub text-xs">
                      Airborne UI Builder Assistant
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
