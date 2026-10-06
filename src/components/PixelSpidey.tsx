import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundSynth } from '../audio/soundEffects';

interface PixelSpideyProps {
  isMuted?: boolean;
  spiderSenseActive?: boolean;
}

export const PixelSpidey: React.FC<PixelSpideyProps> = ({
  isMuted = false,
  spiderSenseActive = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showSense = spiderSenseActive || isHovered;

  const handleSpideyClick = () => {
    soundSynth.playSpiderSense(isMuted);
    setIsHovered(true);
    setTimeout(() => setIsHovered(false), 1200);
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none group cursor-pointer" onClick={handleSpideyClick}>
      {/* Spider-Sense Retro Warning Sparks */}
      {showSense && (
        <div className="absolute -top-10 sm:-top-14 flex items-center justify-center gap-4 z-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: [1, 0.4, 1], y: [0, -4, 0], scale: 1 }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-1.5 h-4 bg-arcade-gold shadow-[0_0_8px_#facc15] rotate-[-25deg]" />
            <div className="w-2 h-6 bg-red-500 shadow-[0_0_10px_#ef4444] rotate-[-15deg]" />
            <span className="font-pixel text-[10px] sm:text-xs text-arcade-gold font-bold px-1 bg-midnight-950/90 border border-arcade-gold shadow-pixel-sm">
              SENSE!
            </span>
            <div className="w-2 h-6 bg-red-500 shadow-[0_0_10px_#ef4444] rotate-[15deg]" />
            <div className="w-1.5 h-4 bg-arcade-gold shadow-[0_0_8px_#facc15] rotate-[25deg]" />
          </motion.div>
        </div>
      )}

      {/* Stepped Breathing / Idle Motion Container with In-Situ Pixel-Art Build */}
      <motion.div
        data-build="pixel-art"
        data-crew="spidey"
        animate={{
          y: [0, -6, 0, 3, 0],
          rotate: [-1, 1, -1],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Pixel Spider-Man SVG (Crisp 32x38 Grid Matrix) */}
        <svg
          viewBox="0 0 32 38"
          className="w-36 h-44 sm:w-48 sm:h-56 md:w-56 md:h-64 pixel-crisp drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          shapeRendering="crispEdges"
        >
          {/* DEFINITIONS & SHADOWS */}
          {/* HEAD (Red Mask) */}
          <rect x="10" y="2" width="12" height="2" fill="#b91c1c" />
          <rect x="8" y="4" width="16" height="8" fill="#dc2626" />
          <rect x="9" y="3" width="14" height="1" fill="#ef4444" />
          <rect x="9" y="12" width="14" height="2" fill="#b91c1c" />
          <rect x="11" y="14" width="10" height="1" fill="#991b1b" />

          {/* Webbing Lines on Mask */}
          <rect x="15" y="2" width="2" height="12" fill="#7f1d1d" opacity="0.6" />
          <rect x="9" y="7" width="14" height="1" fill="#7f1d1d" opacity="0.6" />
          <rect x="11" y="10" width="10" height="1" fill="#7f1d1d" opacity="0.6" />

          {/* Classic White Lenses with Black Outlines */}
          {/* Left Eye */}
          <rect x="10" y="6" width="4" height="3" fill="#000000" />
          <rect x="11" y="6" width="3" height="2" fill="#ffffff" />
          <rect x="12" y="7" width="2" height="2" fill="#ffffff" />
          <rect x="13" y="8" width="1" height="1" fill="#e2e8f0" />

          {/* Right Eye */}
          <rect x="18" y="6" width="4" height="3" fill="#000000" />
          <rect x="18" y="6" width="3" height="2" fill="#ffffff" />
          <rect x="18" y="7" width="2" height="2" fill="#ffffff" />
          <rect x="18" y="8" width="1" height="1" fill="#e2e8f0" />

          {/* TORSO & CHEST */}
          {/* Red Chest Base */}
          <rect x="11" y="15" width="10" height="9" fill="#dc2626" />
          <rect x="12" y="15" width="8" height="1" fill="#ef4444" />

          {/* Black Spider Insignia */}
          <rect x="15" y="17" width="2" height="4" fill="#050710" />
          <rect x="14" y="18" width="4" height="2" fill="#050710" />
          {/* Spider Legs */}
          <rect x="13" y="16" width="1" height="3" fill="#050710" />
          <rect x="18" y="16" width="1" height="3" fill="#050710" />
          <rect x="13" y="20" width="1" height="3" fill="#050710" />
          <rect x="18" y="20" width="1" height="3" fill="#050710" />

          {/* Blue Flanks (Sides of Torso) */}
          <rect x="9" y="16" width="2" height="7" fill="#1e3a8a" />
          <rect x="8" y="17" width="1" height="5" fill="#172554" />
          <rect x="21" y="16" width="2" height="7" fill="#1e3a8a" />
          <rect x="23" y="17" width="1" height="5" fill="#172554" />

          {/* Retro Red Belt */}
          <rect x="11" y="24" width="10" height="2" fill="#b91c1c" />

          {/* ARMS & GLOVES */}
          {/* Left Arm (Crouched / Web Shooter Pose) */}
          <rect x="6" y="16" width="3" height="4" fill="#1e3a8a" />
          <rect x="5" y="20" width="3" height="5" fill="#dc2626" />
          {/* Left Hand Web Shooter */}
          <rect x="4" y="24" width="3" height="3" fill="#b91c1c" />
          <rect x="3" y="25" width="1" height="1" fill="#ffffff" /> {/* Web nozzle sparkle */}

          {/* Right Arm */}
          <rect x="23" y="16" width="3" height="4" fill="#1e3a8a" />
          <rect x="24" y="20" width="3" height="5" fill="#dc2626" />
          {/* Right Hand */}
          <rect x="25" y="24" width="3" height="3" fill="#b91c1c" />

          {/* HIPS & LEGS (Dynamic Superhero Perch Stance) */}
          {/* Blue Pants */}
          <rect x="10" y="26" width="5" height="4" fill="#1e3a8a" />
          <rect x="17" y="26" width="5" height="4" fill="#1e3a8a" />
          <rect x="8" y="28" width="4" height="4" fill="#172554" />
          <rect x="20" y="28" width="4" height="4" fill="#172554" />

          {/* Red Boots */}
          {/* Left Boot */}
          <rect x="7" y="32" width="5" height="4" fill="#dc2626" />
          <rect x="6" y="35" width="6" height="2" fill="#991b1b" />
          {/* Right Boot */}
          <rect x="20" y="32" width="5" height="4" fill="#dc2626" />
          <rect x="20" y="35" width="6" height="2" fill="#991b1b" />

          {/* Web Lines on Suit */}
          <rect x="12" y="24" width="8" height="1" fill="#7f1d1d" opacity="0.6" />
          <rect x="8" y="34" width="3" height="1" fill="#7f1d1d" opacity="0.6" />
          <rect x="21" y="34" width="3" height="1" fill="#7f1d1d" opacity="0.6" />
        </svg>

        {/* Gargoyle Rooftop Perch Block */}
        <div className="w-32 sm:w-44 h-6 -mt-3 bg-midnight-800 border-2 border-midnight-600 shadow-pixel flex items-center justify-center">
          <span className="font-pixel text-[7px] sm:text-[8px] text-pixel-muted uppercase tracking-wider">
            NYC ROOFTOP SECTOR 7
          </span>
        </div>
      </motion.div>
    </div>
  );
};
