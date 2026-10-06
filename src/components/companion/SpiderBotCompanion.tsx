import React, { useState, useEffect } from 'react';
import { SpiderBotSprite } from '../builder/SpiderBotSprite';
import { soundSynth } from '../../audio/soundEffects';

interface SpiderBotCompanionProps {
  isMuted?: boolean;
}

const IDLE_LINES = [
  'Friendly neighborhood web & game dev!',
  'Rooftop sector 7 all clear!',
  'Need a fullstack builder? Ferrel is ready!',
  'All systems webbed up and bug-free!',
  'Click me to test spider-bot diagnostic!',
];

const CLICK_LINES = [
  'BEEP BOOP! Spider-Bot fully operational!',
  'Hey! Careful with the optics!',
  'Ready to sling clean code!',
  'Analyzing rooftop coordinates... perfect!',
  'Web shooter status: 100% charged!',
];

export const SpiderBotCompanion: React.FC<SpiderBotCompanionProps> = ({
  isMuted = false,
}) => {
  const [currentLine, setCurrentLine] = useState(IDLE_LINES[0]);
  const [isHopping, setIsHopping] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Rotate idle speech bubble lines
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLine = IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)];
      setCurrentLine(randomLine);
      setIsBubbleVisible(true);
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  // Listen to section scroll to give contextual dialogue
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = [
        { id: 'signal', line: 'Spider-signal frequency locked in!' },
        { id: 'skills', line: 'Full-stack RPG tech tree detected!' },
        { id: 'missions', line: 'Inspecting active mission logs!' },
        { id: 'status', line: 'Player 01 stats looking maxed out!' },
        { id: 'hero', line: 'Rooftop skyline sector 7!' },
      ];

      for (const sec of sections) {
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

  const handleCompanionClick = () => {
    soundSynth.playSpiderSense(isMuted);
    setIsHopping(true);
    const clickLine = CLICK_LINES[Math.floor(Math.random() * CLICK_LINES.length)];
    setCurrentLine(clickLine);
    setIsBubbleVisible(true);
    setTimeout(() => setIsHopping(false), 500);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end">
      {/* 16-Bit Pixel Speech Bubble */}
      {isBubbleVisible && !isMinimized && (
        <div className="mb-2 max-w-[220px] sm:max-w-[260px] bg-midnight-950 border-2 border-arcade-gold p-2.5 shadow-pixel-sm relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Pixel bubble tail pointing down to bot */}
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

      {/* Spider-Bot Companion Mascot Container */}
      <div className="flex items-center gap-2">
        {/* Minimize button */}
        <button
          type="button"
          onClick={() => setIsMinimized((prev) => !prev)}
          className="px-1.5 py-0.5 bg-midnight-950/80 border border-slate-700 text-pixel-muted font-pixel text-[7px] hover:text-white"
          title={isMinimized ? 'Expand companion' : 'Minimize companion'}
        >
          {isMinimized ? 'SPIDER-BOT ▲' : 'HIDE'}
        </button>

        {!isMinimized && (
          <div
            onClick={handleCompanionClick}
            className={`p-2 bg-midnight-950/90 border-2 border-slate-500 hover:border-arcade-gold shadow-pixel cursor-pointer transition-transform group ${
              isHopping ? '-translate-y-3 scale-110' : 'hover:-translate-y-1'
            }`}
            title="Click to interact with Spider-Bot companion!"
          >
            <SpiderBotSprite
              size={34}
              eyeColor="#38bdf8"
              isCrawling={true}
              hasWeb={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
