import React, { useState, useEffect, useRef } from 'react';
import { SpiderBotSprite } from './SpiderBotSprite';
import { soundSynth } from '../../audio/soundEffects';

interface SpiderBotsCrewIntroProps {
  onComplete: () => void;
  isMuted?: boolean;
}

export const SpiderBotsCrewIntro: React.FC<SpiderBotsCrewIntroProps> = ({
  onComplete,
  isMuted = false,
}) => {
  const [phase, setPhase] = useState<'descending' | 'building' | 'finished'>('descending');
  const [progress, setProgress] = useState(0);
  const [activeTask, setActiveTask] = useState('CREW DROPPING IN FROM WEB STRANDS...');
  const isCompletedRef = useRef(false);

  const handleFinish = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    soundSynth.playButtonPress(isMuted);
    onComplete();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Phase 1: Descend (0-600ms)
    const t1 = setTimeout(() => {
      setPhase('building');
      setActiveTask('BOT 01 & 02: ASSEMBLING PIXEL MATRIX...');
    }, 600);

    // Phase 2: Building progress steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;

        if (next === 24) {
          soundSynth.playTypewriterBlip(isMuted);
          setActiveTask('BOT 01: WEAVING "FERREL RASHAD" PIXEL BLOCKS...');
        } else if (next === 52) {
          soundSynth.playTypewriterBlip(isMuted);
          setActiveTask('BOT 02: CONSTRUCTING 16-BIT RPG DIALOGUE FRAME...');
        } else if (next === 76) {
          soundSynth.playTypewriterBlip(isMuted);
          setActiveTask('BOT 03: LOCKING COMMAND BUTTONS [STATUS, MISSIONS]...');
        } else if (next >= 100) {
          clearInterval(interval);
          setPhase('finished');
          setActiveTask('CREW: ALL SECTORS WEB-LOCKED & READY!');
          setTimeout(handleFinish, 400);
          return 100;
        }

        if (next % 12 === 0) {
          soundSynth.playButtonHover(isMuted);
        }

        return next;
      });
    }, 65);

    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, [isMuted]);

  return (
    <div className="fixed inset-0 z-100 flex flex-col justify-between bg-midnight-950/95 select-none overflow-hidden backdrop-blur-xs">
      {/* Skip Button (Top Right) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          type="button"
          onClick={handleFinish}
          className="flex items-center gap-2 px-3 py-1.5 bg-midnight-900 hover:bg-midnight-800 border-2 border-slate-500 font-pixel text-[9px] sm:text-[10px] text-white shadow-pixel-sm active:translate-y-0.5"
        >
          <span>SKIP INTRO</span>
          <kbd className="px-1 py-0.5 bg-midnight-950 border border-slate-600 text-arcade-gold text-[8px]">
            ESC
          </kbd>
        </button>
      </div>

      {/* Spider-Bots Crew Stage Area */}
      <div className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center p-4">
        {/* BOT 01 (Alpha - Top Left: Weaving Name) */}
        <div
          className={`absolute transition-all duration-700 ease-out flex flex-col items-center ${
            phase === 'descending'
              ? '-top-20 left-[20%]'
              : 'top-[22%] sm:top-[25%] left-[15%] sm:left-[22%]'
          }`}
        >
          <SpiderBotSprite
            size={36}
            eyeColor="#ef4444"
            hasWeb={true}
            webHeight={phase === 'descending' ? 20 : 75}
            isCrawling={true}
          />
          <div className="mt-1 px-2 py-0.5 bg-midnight-900 border border-red-500 shadow-pixel-sm font-pixel text-[7px] sm:text-[8px] text-red-400 animate-pulse">
            BOT-01 // WEAVING
          </div>
        </div>

        {/* BOT 02 (Beta - Center: Constructing Frame) */}
        <div
          className={`absolute transition-all duration-700 ease-out flex flex-col items-center ${
            phase === 'descending'
              ? '-top-20 left-[50%]'
              : 'top-[35%] sm:top-[38%] left-[45%] sm:left-[48%]'
          }`}
        >
          <SpiderBotSprite
            size={40}
            eyeColor="#38bdf8"
            hasWeb={true}
            webHeight={phase === 'descending' ? 30 : 90}
            isCrawling={true}
          />
          <div className="mt-1 px-2 py-0.5 bg-midnight-900 border border-cyan-400 shadow-pixel-sm font-pixel text-[7px] sm:text-[8px] text-cyan-300">
            BOT-02 // FRAME BUILD
          </div>
        </div>

        {/* BOT 03 (Gamma - Right: Assembling Buttons) */}
        <div
          className={`absolute transition-all duration-700 ease-out flex flex-col items-center ${
            phase === 'descending'
              ? '-top-20 right-[20%]'
              : 'top-[26%] sm:top-[28%] right-[15%] sm:right-[20%]'
          }`}
        >
          <SpiderBotSprite
            size={36}
            eyeColor="#facc15"
            hasWeb={true}
            webHeight={phase === 'descending' ? 25 : 80}
            isCrawling={true}
          />
          <div className="mt-1 px-2 py-0.5 bg-midnight-900 border border-arcade-gold shadow-pixel-sm font-pixel text-[7px] sm:text-[8px] text-arcade-gold animate-pulse">
            BOT-03 // DECK
          </div>
        </div>

        {/* Live Assembly Blueprint Grid */}
        <div className="relative z-10 w-full max-w-xl bg-midnight-900/90 border-4 border-slate-300 p-5 sm:p-7 shadow-pixel">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />

          {/* Diagnostic Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-midnight-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-spidey-crimson animate-ping" />
              <span className="font-pixel text-[10px] sm:text-xs text-white font-bold">
                SPIDER-BOTS CREW CONSTRUCT
              </span>
            </div>
            <span className="font-pixel text-[9px] text-arcade-gold font-bold">
              {progress}%
            </span>
          </div>

          {/* Active Construction Log */}
          <p className="font-sub text-lg sm:text-xl text-slate-200 min-h-[32px] tracking-wide">
            {activeTask}
          </p>

          {/* Segmented Progress Meter */}
          <div className="w-full h-5 bg-midnight-950 border-2 border-midnight-700 p-0.5 mt-3">
            <div
              className="h-full bg-linear-to-r from-spidey-crimson via-cyan-400 to-arcade-gold transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Micro Status Notes */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-midnight-800 text-[8px] font-pixel text-pixel-muted">
            <span>3 AGENTS ACTIVE</span>
            <span>LAYING PIXEL BLOCKS...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
