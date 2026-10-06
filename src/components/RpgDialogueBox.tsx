import React from 'react';

interface RpgDialogueBoxProps {
  isMuted?: boolean;
}

const FULL_TEXT = 'FERREL RASHAD // FRIENDLY NEIGHBORHOOD WEB & GAME DEV';
const SUB_LINE = 'Ready for action: crafting responsive pixel-perfect web apps and immersive games.';

export const RpgDialogueBox: React.FC<RpgDialogueBoxProps> = () => {
  return (
    <div
      className="relative w-full max-w-4xl mx-auto select-none group"
      role="region"
      aria-label="RPG Dialogue Box"
      tabIndex={0}
    >
      {/* Outer 16-Bit Beveled RPG Box Border */}
      <div
        data-build="box"
        data-crew="dialogue"
        className="relative bg-[#060914] border-4 border-slate-300 p-4 sm:p-6 shadow-pixel transition-transform group-hover:border-arcade-gold"
      >
        {/* Pixel Corner Brackets (Classic JRPG Frame Detailing) */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold border border-black" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold border border-black" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold border border-black" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold border border-black" />

        {/* Character Speaker Nameplate */}
        <div
          data-build="box"
          data-crew="nameplate"
          className="absolute -top-4 left-6 sm:left-8 bg-spidey-crimson border-2 border-white px-3 py-0.5 shadow-pixel-sm"
        >
          <span className="font-pixel text-[9px] sm:text-[10px] text-white font-bold tracking-wider">
            ★ SPIDEY TRANSMISSION ★
          </span>
        </div>

        {/* Inner Border Trim */}
        <div className="border border-midnight-700/80 p-3 sm:p-4 bg-midnight-950/80 min-h-[90px] sm:min-h-[105px] flex flex-col justify-between">
          {/* Main Dialogue Line */}
          <div>
            <h1
              data-build="text"
              data-crew="name"
              className="font-pixel text-xs sm:text-sm md:text-base text-white leading-relaxed tracking-wider"
            >
              {FULL_TEXT.split('').map((char, i) => (
                <span
                  key={i}
                  className="pixel-letter"
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Subtitle / Mission Lore */}
            <p
              data-build="text"
              data-crew="lore"
              className="font-sub text-base sm:text-lg text-slate-300 mt-2 tracking-wide"
            >
              {SUB_LINE}
            </p>
          </div>

          {/* Action indicator at bottom right */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-midnight-800">
            <span className="font-pixel text-[8px] sm:text-[9px] text-pixel-muted">
              [SYSTEM: COMBAT & PORTFOLIO ENGINE READY]
            </span>

            {/* Classic Blinking Down Arrow ▼ */}
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[10px] text-arcade-gold animate-bounce">
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
