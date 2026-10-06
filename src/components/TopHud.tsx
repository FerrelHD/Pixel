import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Monitor, Sparkles } from 'lucide-react';
import { soundSynth } from '../audio/soundEffects';

interface TopHudProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isCrtOn: boolean;
  onToggleCrt: () => void;
  onSpideySenseTrigger?: () => void;
}

const NAV_LINKS = [
  { id: 'hero', label: 'HERO' },
  { id: 'status', label: 'STATUS' },
  { id: 'missions', label: 'MISSIONS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'signal', label: 'SIGNAL' },
];

export const TopHud: React.FC<TopHudProps> = ({
  isMuted,
  onToggleMute,
  isCrtOn,
  onToggleCrt,
  onSpideySenseTrigger,
}) => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = ['hero', 'status', 'missions', 'skills', 'signal'];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    soundSynth.playButtonPress(isMuted);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 w-full z-50 px-3 sm:px-6 py-2.5 border-b-4 border-midnight-700 bg-midnight-950/95 backdrop-blur-md select-none shadow-pixel-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player ID & Status Bars */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Level Badge */}
          <button
            type="button"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-1.5 bg-midnight-800 border-2 border-midnight-600 px-2 py-1 shadow-pixel-sm hover:border-arcade-gold active:translate-y-0.5"
          >
            <span className="font-pixel text-[9px] sm:text-[10px] text-arcade-gold font-bold">
              LV.99
            </span>
            <span className="font-pixel text-[9px] sm:text-[10px] text-white hidden xs:inline">
              FERREL
            </span>
          </button>

          {/* HP Bar */}
          <div className="flex items-center gap-1.5 bg-midnight-900 border-2 border-midnight-700 px-2 py-0.5 shadow-pixel-sm">
            <span className="font-pixel text-[8px] sm:text-[9px] text-spidey-crimson font-bold">
              HP
            </span>
            <div className="w-16 sm:w-20 h-3 bg-midnight-950 border border-midnight-600 p-0.5">
              <div className="h-full w-full bg-linear-to-r from-spidey-crimson to-red-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Center: Scroll Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`px-2 sm:px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] border transition-all ${
                  isActive
                    ? 'bg-spidey-crimson border-white text-white shadow-pixel-sm translate-y-0.5 font-bold'
                    : 'bg-midnight-900 border-midnight-700 text-pixel-muted hover:text-white hover:border-slate-500'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Spider-Sense */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playSpiderSense(isMuted);
              if (onSpideySenseTrigger) onSpideySenseTrigger();
            }}
            title="Spider-Sense"
            className="flex items-center gap-1 px-2 py-1 bg-midnight-800 hover:bg-midnight-700 border-2 border-midnight-600 text-arcade-amber font-pixel text-[8px] sm:text-[9px] shadow-pixel-sm active:translate-y-0.5"
          >
            <Sparkles size={11} className="animate-spin text-arcade-gold" />
            <span className="hidden sm:inline">SENSE</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextState = !isMuted;
              onToggleMute();
              soundSynth.playButtonPress(nextState);
            }}
            title={isMuted ? "Unmute" : "Mute"}
            className="flex items-center gap-1 px-2 py-1 bg-midnight-800 hover:bg-midnight-700 border-2 border-midnight-600 text-white font-pixel text-[8px] sm:text-[9px] shadow-pixel-sm active:translate-y-0.5"
          >
            {isMuted ? (
              <VolumeX size={11} className="text-red-400" />
            ) : (
              <Volume2 size={11} className="text-green-400" />
            )}
            <span className="hidden sm:inline">{isMuted ? 'MUTE' : 'SFX'}</span>
          </button>

          {/* CRT Toggle */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playButtonHover(isMuted);
              onToggleCrt();
            }}
            title="Toggle CRT"
            className={`flex items-center gap-1 px-2 py-1 border-2 font-pixel text-[8px] sm:text-[9px] shadow-pixel-sm active:translate-y-0.5 ${
              isCrtOn
                ? 'bg-midnight-700 border-arcade-gold text-arcade-gold'
                : 'bg-midnight-800 border-midnight-600 text-pixel-muted'
            }`}
          >
            <Monitor size={11} />
            <span className="hidden sm:inline">CRT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
