import React from 'react';
import { Volume2, VolumeX, Monitor, Sparkles } from 'lucide-react';
import { soundSynth } from '../audio/soundEffects';

interface TopHudProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isCrtOn: boolean;
  onToggleCrt: () => void;
  onSpideySenseTrigger?: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  isMuted,
  onToggleMute,
  isCrtOn,
  onToggleCrt,
  onSpideySenseTrigger,
}) => {
  return (
    <header className="w-full z-40 px-3 sm:px-6 py-3 border-b-4 border-midnight-700 bg-midnight-950/90 backdrop-blur-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player ID and Status Bars */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          {/* Level Badge */}
          <div className="flex items-center gap-2 bg-midnight-800 border-2 border-midnight-600 px-2.5 py-1 shadow-pixel-sm">
            <span className="font-pixel text-[10px] sm:text-xs text-arcade-gold font-bold tracking-wider">
              LV.99
            </span>
            <span className="font-pixel text-[10px] sm:text-xs text-white">
              FERREL
            </span>
          </div>

          {/* HP Bar */}
          <div className="flex items-center gap-2 bg-midnight-900 border-2 border-midnight-700 px-2 py-1 shadow-pixel-sm">
            <span className="font-pixel text-[9px] sm:text-[10px] text-spidey-crimson font-bold">
              HP
            </span>
            <div className="w-20 sm:w-28 h-3.5 bg-midnight-950 border border-midnight-600 p-0.5 flex gap-0.5">
              <div className="h-full w-full bg-linear-to-r from-spidey-crimson to-red-500 animate-pulse" />
            </div>
            <span className="font-pixel text-[8px] sm:text-[9px] text-pixel-muted">
              100/100
            </span>
          </div>

          {/* SP Bar (Web Fluid Meter) */}
          <div className="hidden md:flex items-center gap-2 bg-midnight-900 border-2 border-midnight-700 px-2 py-1 shadow-pixel-sm">
            <span className="font-pixel text-[9px] sm:text-[10px] text-cyan-400 font-bold">
              SP
            </span>
            <div className="w-16 sm:w-24 h-3.5 bg-midnight-950 border border-midnight-600 p-0.5 flex gap-0.5">
              <div className="h-full w-4/5 bg-cyan-400" />
            </div>
            <span className="font-pixel text-[8px] sm:text-[9px] text-pixel-muted">
              80/100
            </span>
          </div>
        </div>

        {/* Right: Quick Settings (Audio, CRT, Sense) */}
        <div className="flex items-center gap-2">
          {/* Spider-Sense Test Trigger */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playSpiderSense(isMuted);
              if (onSpideySenseTrigger) onSpideySenseTrigger();
            }}
            title="Trigger Spider-Sense test"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-midnight-800 hover:bg-midnight-700 border-2 border-midnight-600 text-arcade-amber font-pixel text-[9px] sm:text-[10px] shadow-pixel-sm active:translate-y-0.5 transition-transform"
          >
            <Sparkles size={12} className="animate-spin text-arcade-gold" />
            <span className="hidden sm:inline">SENSE</span>
          </button>

          {/* SFX Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextState = !isMuted;
              onToggleMute();
              soundSynth.playButtonPress(nextState);
            }}
            title={isMuted ? "Enable 8-bit sound" : "Mute sound"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-midnight-800 hover:bg-midnight-700 border-2 border-midnight-600 text-white font-pixel text-[9px] sm:text-[10px] shadow-pixel-sm active:translate-y-0.5 transition-transform"
          >
            {isMuted ? (
              <>
                <VolumeX size={12} className="text-red-400" />
                <span>SFX: OFF</span>
              </>
            ) : (
              <>
                <Volume2 size={12} className="text-green-400" />
                <span>SFX: ON</span>
              </>
            )}
          </button>

          {/* CRT Filter Toggle */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playButtonHover(isMuted);
              onToggleCrt();
            }}
            title="Toggle retro CRT scanlines"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border-2 font-pixel text-[9px] sm:text-[10px] shadow-pixel-sm active:translate-y-0.5 transition-transform ${
              isCrtOn
                ? 'bg-midnight-700 border-arcade-gold text-arcade-gold'
                : 'bg-midnight-800 border-midnight-600 text-pixel-muted'
            }`}
          >
            <Monitor size={12} />
            <span>{isCrtOn ? 'CRT: ON' : 'CRT: OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
