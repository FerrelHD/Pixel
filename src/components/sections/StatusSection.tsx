import React from 'react';
import { Shield, Award, Backpack, Zap } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { ScrollPixelReveal } from '../builder/ScrollPixelReveal';

interface StatusSectionProps {
  isMuted?: boolean;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ isMuted = false }) => {
  return (
    <section
      id="status"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Character Status"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-midnight-700">
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

        {/* 16-Bit Character Profile Box with Scroll Pixel Reveal */}
        <ScrollPixelReveal showBotHelper={true}>
          <div className="bg-midnight-900 border-4 border-slate-300 p-5 sm:p-8 shadow-pixel relative">
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

            {/* Middle: Attributes Progress Meters */}
            <div className="md:col-span-2 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-3 bg-midnight-950 border border-midnight-700 hover:border-arcade-gold transition-colors"
                >
                  <div className="flex justify-between items-center text-[9px] font-pixel mb-1.5">
                    <span className="text-arcade-gold">CODE SPEED</span>
                    <span className="text-white">95%</span>
                  </div>
                  <div className="w-full h-3 bg-midnight-900 border border-midnight-700 p-0.5">
                    <div className="w-[95%] h-full bg-arcade-gold" />
                  </div>
                </div>

                <div
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-3 bg-midnight-950 border border-midnight-700 hover:border-cyan-400 transition-colors"
                >
                  <div className="flex justify-between items-center text-[9px] font-pixel mb-1.5">
                    <span className="text-cyan-400">PIXEL ACCURACY</span>
                    <span className="text-white">98%</span>
                  </div>
                  <div className="w-full h-3 bg-midnight-900 border border-midnight-700 p-0.5">
                    <div className="w-[98%] h-full bg-cyan-400" />
                  </div>
                </div>

                <div
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-3 bg-midnight-950 border border-midnight-700 hover:border-spidey-crimson transition-colors"
                >
                  <div className="flex justify-between items-center text-[9px] font-pixel mb-1.5">
                    <span className="text-spidey-crimson">GAME PHYSICS</span>
                    <span className="text-white">90%</span>
                  </div>
                  <div className="w-full h-3 bg-midnight-900 border border-midnight-700 p-0.5">
                    <div className="w-[90%] h-full bg-spidey-crimson" />
                  </div>
                </div>

                <div
                  onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                  className="p-3 bg-midnight-950 border border-midnight-700 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex justify-between items-center text-[9px] font-pixel mb-1.5">
                    <span className="text-emerald-400">SYSTEM RESILIENCE</span>
                    <span className="text-white">92%</span>
                  </div>
                  <div className="w-full h-3 bg-midnight-900 border border-midnight-700 p-0.5">
                    <div className="w-[92%] h-full bg-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Equipped Inventory */}
              <div className="p-3.5 bg-midnight-950 border border-midnight-700">
                <div className="flex items-center gap-2 mb-2">
                  <Backpack size={14} className="text-arcade-gold" />
                  <span className="font-pixel text-[9px] sm:text-[10px] text-white">
                    EQUIPPED INVENTORY
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'React',
                    'TypeScript',
                    'Tailwind CSS',
                    'Framer Motion',
                    'Phaser.js',
                    'Godot',
                    'Node.js',
                    'Web Audio API',
                  ].map((item) => (
                    <span
                      key={item}
                      className="font-pixel text-[8px] sm:text-[9px] px-2 py-1 bg-midnight-900 border border-midnight-600 text-slate-300 hover:border-arcade-gold transition-colors"
                    >
                      +{item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Move */}
              <div className="p-3.5 bg-midnight-950 border border-midnight-700 flex items-start gap-3">
                <Zap size={18} className="text-arcade-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-pixel text-[9px] text-arcade-gold">SPECIAL MOVE</p>
                  <p className="font-sub text-base text-slate-300 mt-0.5">
                    Full-Stack Web Sling: Converts complex monolithic specifications into modular, responsive, and tactile interactive web experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollPixelReveal>
      </div>
    </section>
  );
};
