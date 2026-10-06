import React, { useEffect } from 'react';
import { X, Shield, Award, Backpack, Zap } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted?: boolean;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  isMuted = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundSynth.playCloseSound(isMuted);
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isMuted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-2xl bg-midnight-950 border-4 border-arcade-gold p-4 sm:p-6 shadow-pixel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-title"
      >
        {/* Pixel Corners */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-midnight-700">
          <div className="flex items-center gap-2">
            <Award className="text-arcade-gold" size={20} />
            <h2 id="status-title" className="font-pixel text-sm sm:text-base text-white">
              CHARACTER STATUS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="p-1 text-pixel-muted hover:text-white hover:bg-midnight-800 border border-transparent hover:border-slate-500"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Main Character Header */}
          <div className="p-3 bg-midnight-900 border-2 border-midnight-700 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-pixel text-xs text-arcade-gold">FERREL RASHAD</p>
              <p className="font-sub text-lg text-slate-300">Class: Friendly Neighborhood Web &amp; Game Dev</p>
            </div>
            <div className="flex items-center gap-2 bg-midnight-950 px-2.5 py-1 border border-midnight-600">
              <Shield size={14} className="text-spidey-crimson" />
              <span className="font-pixel text-[10px] text-white">LVL 99 MASTER</span>
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-midnight-900 border border-midnight-700">
              <span className="font-pixel text-[9px] text-arcade-gold">CODE SPEED</span>
              <div className="w-full bg-midnight-950 h-3 border border-midnight-700 mt-1.5 p-0.5">
                <div className="w-[95%] h-full bg-arcade-gold" />
              </div>
            </div>
            <div className="p-3 bg-midnight-900 border border-midnight-700">
              <span className="font-pixel text-[9px] text-cyan-400">PIXEL ACCURACY</span>
              <div className="w-full bg-midnight-950 h-3 border border-midnight-700 mt-1.5 p-0.5">
                <div className="w-[98%] h-full bg-cyan-400" />
              </div>
            </div>
            <div className="p-3 bg-midnight-900 border border-midnight-700">
              <span className="font-pixel text-[9px] text-spidey-crimson">GAME PHYSICS</span>
              <div className="w-full bg-midnight-950 h-3 border border-midnight-700 mt-1.5 p-0.5">
                <div className="w-[90%] h-full bg-spidey-crimson" />
              </div>
            </div>
            <div className="p-3 bg-midnight-900 border border-midnight-700">
              <span className="font-pixel text-[9px] text-emerald-400">SYSTEM RESILIENCE</span>
              <div className="w-full bg-midnight-950 h-3 border border-midnight-700 mt-1.5 p-0.5">
                <div className="w-[92%] h-full bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="p-3 bg-midnight-900 border border-midnight-700">
            <div className="flex items-center gap-2 mb-2">
              <Backpack size={14} className="text-arcade-gold" />
              <span className="font-pixel text-[10px] text-white">EQUIPPED INVENTORY</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Phaser.js', 'Godot', 'Node.js', 'Web Audio API'].map((item) => (
                <span
                  key={item}
                  className="font-pixel text-[9px] px-2 py-1 bg-midnight-950 border border-midnight-600 text-slate-300"
                >
                  +{item}
                </span>
              ))}
            </div>
          </div>

          {/* Special Move */}
          <div className="p-3 bg-midnight-900 border border-midnight-700 flex items-start gap-3">
            <Zap size={18} className="text-arcade-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-pixel text-[9px] text-arcade-gold">SPECIAL MOVE</p>
              <p className="font-sub text-base text-slate-300 mt-0.5">
                Full-Stack Web Sling: Transforms complex monolithic requirements into lightweight, responsive, and tactile interactive web experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-midnight-700 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="px-4 py-2 bg-midnight-800 hover:bg-midnight-700 border-2 border-slate-400 font-pixel text-[10px] text-white shadow-pixel-sm active:translate-y-0.5"
          >
            [CLOSE ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
