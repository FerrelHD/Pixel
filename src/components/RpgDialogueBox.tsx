import React, { useState, useEffect, useRef } from 'react';
import { soundSynth } from '../audio/soundEffects';

interface RpgDialogueBoxProps {
  isMuted?: boolean;
  onDialogueComplete?: () => void;
}

const FULL_TEXT = 'FERREL RASHAD // FRIENDLY NEIGHBORHOOD WEB & GAME DEV';
const SUB_LINE = 'Ready for action: crafting responsive pixel-perfect web apps and immersive games.';

export const RpgDialogueBox: React.FC<RpgDialogueBoxProps> = ({
  isMuted = false,
  onDialogueComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const textIndexRef = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingDone(false);
    textIndexRef.current = 0;

    const interval = setInterval(() => {
      if (textIndexRef.current < FULL_TEXT.length) {
        textIndexRef.current += 1;
        setDisplayedText(FULL_TEXT.slice(0, textIndexRef.current));
        // Trigger retro chiptune blip every 2nd character to keep cadence musical
        if (textIndexRef.current % 2 === 0) {
          soundSynth.playTypewriterBlip(isMuted);
        }
      } else {
        clearInterval(interval);
        setIsTypingDone(true);
        if (onDialogueComplete) onDialogueComplete();
      }
    }, 42);

    return () => clearInterval(interval);
  }, [isMuted, onDialogueComplete]);

  // Click or keydown to skip typewriter animation
  const handleSkipTyping = () => {
    if (!isTypingDone) {
      setDisplayedText(FULL_TEXT);
      setIsTypingDone(true);
      soundSynth.playButtonHover(isMuted);
      if (onDialogueComplete) onDialogueComplete();
    }
  };

  return (
    <div
      onClick={handleSkipTyping}
      className="relative w-full max-w-4xl mx-auto select-none cursor-pointer group"
      role="region"
      aria-label="RPG Dialogue Box"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSkipTyping();
        }
      }}
    >
      {/* Outer 16-Bit Beveled RPG Box Border */}
      <div className="relative bg-[#060914] border-4 border-slate-300 p-4 sm:p-6 shadow-pixel transition-transform group-hover:border-arcade-gold">
        {/* Pixel Corner Brackets (Classic JRPG Frame Detailing) */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold border border-black" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold border border-black" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold border border-black" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold border border-black" />

        {/* Character Speaker Nameplate */}
        <div className="absolute -top-4 left-6 sm:left-8 bg-spidey-crimson border-2 border-white px-3 py-0.5 shadow-pixel-sm">
          <span className="font-pixel text-[9px] sm:text-[10px] text-white font-bold tracking-wider">
            ★ SPIDEY TRANSMISSION ★
          </span>
        </div>

        {/* Inner Border Trim */}
        <div className="border border-midnight-700/80 p-3 sm:p-4 bg-midnight-950/80 min-h-[90px] sm:min-h-[105px] flex flex-col justify-between">
          {/* Main Dialogue Line */}
          <div>
            <h1 className="font-pixel text-xs sm:text-sm md:text-base text-white leading-relaxed tracking-wider">
              {displayedText}
              {!isTypingDone && (
                <span className="inline-block w-2.5 h-3.5 bg-arcade-gold ml-1 animate-pulse" />
              )}
            </h1>

            {/* Subtitle / Mission Lore revealed upon typewriter completion */}
            {isTypingDone && (
              <p className="font-sub text-lg sm:text-xl text-slate-300 mt-2 tracking-wide transition-opacity duration-300">
                {SUB_LINE}
              </p>
            )}
          </div>

          {/* Action indicator at bottom right */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-midnight-800">
            <span className="font-pixel text-[8px] sm:text-[9px] text-pixel-muted">
              {!isTypingDone ? '[CLICK TO SKIP]' : '[SELECT COMMAND BELOW]'}
            </span>

            {/* Classic Blinking Down Arrow ▼ */}
            {isTypingDone && (
              <div className="flex items-center gap-1.5">
                <span className="font-pixel text-[10px] text-arcade-gold animate-bounce">
                  ▼
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
