import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SkylineBackground } from './SkylineBackground';
import { PixelSpidey } from './PixelSpidey';
import { RpgDialogueBox } from './RpgDialogueBox';
import { MenuBar } from './MenuBar';
import { StatusModal } from './modals/StatusModal';
import { MissionsModal } from './modals/MissionsModal';
import { SkillsModal } from './modals/SkillsModal';
import { SignalModal } from './modals/SignalModal';
import { ModalType, SpideySuit } from '../types';
import { HeroPixelBuilder } from './builder/HeroPixelBuilder';
import { soundSynth } from '../audio/soundEffects';

interface WebShot {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  suit: SpideySuit;
}

interface HeroSectionProps {
  isMuted: boolean;
  spiderSenseTriggered?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isMuted,
  spiderSenseTriggered = false,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const spideyRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentSuit, setCurrentSuit] = useState<SpideySuit>('classic');
  const [webShots, setWebShots] = useState<WebShot[]>([]);
  const [hasShotWeb, setHasShotWeb] = useState(false);

  const handleOpenModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLElement>) => {
    // Ignore clicks originating from interactive elements (buttons, inputs, modals, menu)
    if ((e.target as HTMLElement).closest('button, a, input, textarea, [role="dialog"], [role="menu"]')) {
      return;
    }

    const stageRect = heroRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    let startX = stageRect.width / 2;
    let startY = stageRect.height * 0.42;

    if (spideyRef.current) {
      const spideyRect = spideyRef.current.getBoundingClientRect();
      startX = spideyRect.left - stageRect.left + spideyRect.width / 2;
      startY = spideyRect.top - stageRect.top + spideyRect.height * 0.35;
    }

    const targetX = e.clientX - stageRect.left;
    const targetY = e.clientY - stageRect.top;

    const id = Date.now() + Math.random();
    setWebShots((prev) => [...prev.slice(-4), { id, startX, startY, targetX, targetY, suit: currentSuit }]);
    setHasShotWeb(true);
    soundSynth.playWebThwip(isMuted);

    setTimeout(() => {
      setWebShots((prev) => prev.filter((w) => w.id !== id));
    }, 850);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      onClick={handleStageClick}
      className="relative min-h-[calc(100vh-61px)] flex flex-col justify-between overflow-hidden select-none scroll-mt-14 cursor-crosshair"
      aria-label="Spidey Pixel Hero Section"
    >
      {/* 1. Layered Retro NYC Night Skyline */}
      <SkylineBackground />

      {/* In-Situ Authentic Pixel Builder Overlay (Samuel Rizzon mechanics) */}
      <HeroPixelBuilder containerRef={heroRef} isMuted={isMuted} />

      {/* Interactive Web Shooting Overlays */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full z-15">
        <defs>
          <filter id="web-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.8" />
          </filter>
        </defs>
        <AnimatePresence>
          {webShots.map((shot) => {
            const webColor =
              shot.suit === '2099'
                ? '#38bdf8'
                : shot.suit === 'symbiote'
                ? '#e2e8f0'
                : '#ffffff';

            return (
              <motion.g
                key={shot.id}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Dynamic Web Strand Line */}
                <motion.line
                  x1={shot.startX}
                  y1={shot.startY}
                  x2={shot.targetX}
                  y2={shot.targetY}
                  stroke={webColor}
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  filter="url(#web-glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.08, ease: 'easeOut' }}
                />

                {/* Web Impact Decal (Pixelated Radial Splat) */}
                <g transform={`translate(${shot.targetX}, ${shot.targetY})`}>
                  {/* Radiating Web Spokes */}
                  {[-45, -20, 0, 25, 60, 110, 160, 210].map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    const r = 14 + (i % 3) * 4;
                    return (
                      <line
                        key={deg}
                        x1={0}
                        y1={0}
                        x2={Math.cos(rad) * r}
                        y2={Math.sin(rad) * r}
                        stroke={webColor}
                        strokeWidth="1.5"
                        strokeDasharray="2 1"
                      />
                    );
                  })}
                  {/* Concentric Web Rings */}
                  <circle cx="0" cy="0" r="7" fill="none" stroke={webColor} strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx="0" cy="0" r="13" fill="none" stroke={webColor} strokeWidth="1" strokeDasharray="4 2" />
                  {/* Center Impact Core */}
                  <rect x="-2" y="-2" width="4" height="4" fill="#ffffff" />
                </g>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Floating THWIP! Comic Pop Text */}
      <AnimatePresence>
        {webShots.map((shot) => (
          <motion.div
            key={`pop-${shot.id}`}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: 1, scale: 1.15, y: -22 }}
            exit={{ opacity: 0, scale: 0.8, y: -35 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            style={{
              position: 'absolute',
              left: shot.targetX - 28,
              top: shot.targetY - 32,
              pointerEvents: 'none',
              zIndex: 25,
            }}
            className="font-pixel text-[11px] font-black px-1.5 py-0.5 rounded-xs tracking-widest shadow-lg border border-white/60 bg-midnight-950/90 text-spidey-crimson drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            THWIP!
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2. Character & Skyline Stage Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-4 sm:pt-8 pb-4">
        {/* Suit Switcher & Web Tip */}
        <div className="flex flex-col items-center gap-1.5 mb-2 z-20">
          <div className="flex items-center gap-2 px-3 py-1 bg-midnight-950/85 backdrop-blur-xs border-2 border-midnight-600 rounded-sm font-pixel text-[9px] sm:text-[10px] shadow-lg">
            <span className="text-arcade-gold flex items-center gap-1 font-bold">
              <Sparkles size={11} className="animate-pulse" /> SUIT:
            </span>
            {(
              [
                { id: 'classic', label: 'CLASSIC', activeBg: 'bg-spidey-crimson text-white border-red-400' },
                { id: 'symbiote', label: 'SYMBIOTE', activeBg: 'bg-slate-800 text-white border-slate-400' },
                { id: '2099', label: '2099', activeBg: 'bg-indigo-900 text-cyan-300 border-cyan-400' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundSynth.playButtonPress(isMuted);
                  setCurrentSuit(s.id);
                }}
                className={`px-2 py-0.5 uppercase tracking-wider rounded-xs transition-all border ${
                  currentSuit === s.id
                    ? `${s.activeBg} font-bold shadow-xs scale-105`
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-midnight-800'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {!hasShotWeb && (
            <span className="text-[9px] font-pixel text-cyan-400/80 animate-pulse tracking-wider">
              [ 💡 CLICK SKYLINE TO THWIP! WEB ]
            </span>
          )}
        </div>

        {/* Pixel Spider-Man Avatar */}
        <div ref={spideyRef} className="relative w-full max-w-4xl flex items-center justify-center my-auto">
          <PixelSpidey
            isMuted={isMuted}
            spiderSenseActive={spiderSenseTriggered}
            suit={currentSuit}
          />
        </div>
      </div>

      {/* 3. Bottom Retro RPG Console (Dialogue Box + Menu Bar) */}
      <div className="relative z-20 w-full px-3 sm:px-6 pb-6 pt-2 bg-linear-to-t from-midnight-950 via-midnight-950/95 to-transparent">
        {/* 16-Bit RPG Dialogue Box */}
        <RpgDialogueBox isMuted={isMuted} />

        {/* Command Menu Bar */}
        <MenuBar
          activeModal={activeModal}
          onOpenModal={handleOpenModal}
          isMuted={isMuted}
        />
      </div>

      {/* 4. Interactive RPG Modals */}
      <StatusModal
        isOpen={activeModal === 'status'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
      <MissionsModal
        isOpen={activeModal === 'missions'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
      <SkillsModal
        isOpen={activeModal === 'skills'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
      <SignalModal
        isOpen={activeModal === 'signal'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
    </section>
  );
};
