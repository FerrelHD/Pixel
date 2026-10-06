import React, { useState, useEffect, useRef } from 'react';
import { soundSynth } from '../audio/soundEffects';

interface PixelBuildIntroProps {
  onComplete: () => void;
  isMuted?: boolean;
}

export const PixelBuildIntro: React.FC<PixelBuildIntroProps> = ({
  onComplete,
  isMuted = false,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING SPIDEY OS...');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDoneRef = useRef(false);

  const handleFinish = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
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

  // Canvas pixel building particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const pixelSize = 16;
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);
    const blocks: { x: number; y: number; alpha: number; color: string }[] = [];

    // Pre-populate some grid blocks
    const colors = ['#dc2626', '#1e3a8a', '#facc15', '#0f172a', '#1e293b'];
    for (let i = 0; i < 90; i++) {
      blocks.push({
        x: Math.floor(Math.random() * cols) * pixelSize,
        y: Math.floor(Math.random() * rows) * pixelSize,
        alpha: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.fillStyle = '#050710';
      ctx.fillRect(0, 0, width, height);

      // Draw assembling pixel grid
      for (const block of blocks) {
        ctx.fillStyle = block.color;
        ctx.globalAlpha = block.alpha;
        ctx.fillRect(block.x, block.y, pixelSize - 1, pixelSize - 1);
        block.alpha -= 0.015;
        if (block.alpha <= 0) {
          block.x = Math.floor(Math.random() * cols) * pixelSize;
          block.y = Math.floor(Math.random() * rows) * pixelSize;
          block.alpha = Math.random() * 0.7 + 0.3;
        }
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Progress timer
  useEffect(() => {
    const statuses = [
      'INITIALIZING SPIDEY OS...',
      'CALIBRATING RETRO NYC CANVAS...',
      'RENDERING 16-BIT SKYLINE...',
      'SPIDER-SENSE ONLINE...',
      'ROOFTOP READY!',
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        const statusIdx = Math.min(
          Math.floor((next / 100) * statuses.length),
          statuses.length - 1
        );
        setStatusText(statuses[statusIdx]);

        if (next % 20 === 0) {
          soundSynth.playTypewriterBlip(isMuted);
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 350);
          return 100;
        }
        return next;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [isMuted]);

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-midnight-950 select-none overflow-hidden">
      {/* Background Pixel Animation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Skip Intro Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={handleFinish}
          className="flex items-center gap-2 px-3 py-1.5 bg-midnight-900 hover:bg-midnight-800 border-2 border-slate-500 font-pixel text-[9px] sm:text-[10px] text-white shadow-pixel-sm active:translate-y-0.5 transition-transform"
        >
          <span>SKIP INTRO</span>
          <kbd className="px-1 py-0.5 bg-midnight-950 border border-slate-600 text-arcade-gold text-[8px]">
            ESC
          </kbd>
        </button>
      </div>

      {/* Central Pixel Build Terminal Box */}
      <div className="relative z-10 w-11/12 max-w-lg bg-midnight-950/95 border-4 border-slate-300 p-6 sm:p-8 shadow-pixel">
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />

        {/* Title */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-midnight-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-spidey-crimson animate-ping" />
            <span className="font-pixel text-[10px] sm:text-xs text-white font-bold">
              BUILDING PAGE
            </span>
          </div>
          <span className="font-pixel text-[9px] text-arcade-gold">
            {progress}%
          </span>
        </div>

        {/* Status text */}
        <p className="font-sub text-lg sm:text-xl text-slate-300 min-h-[30px] tracking-wide">
          {statusText}
        </p>

        {/* Segmented Retro Progress Bar */}
        <div className="w-full h-5 bg-midnight-900 border-2 border-midnight-600 p-0.5 mt-4 flex gap-1">
          <div
            className="h-full bg-linear-to-r from-spidey-crimson via-red-500 to-arcade-gold transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Sub-notice */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-midnight-800 text-[8px] sm:text-[9px] font-pixel text-pixel-muted">
          <span>PIXEL ART RPG ENGINE</span>
          <span className="animate-pulse">HOLD ON...</span>
        </div>
      </div>
    </div>
  );
};
