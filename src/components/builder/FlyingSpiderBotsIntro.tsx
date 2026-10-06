import React, { useEffect, useRef, useState } from 'react';
import { FlightEngine } from './FlyingSpiderBotEngine';
import { soundSynth } from '../../audio/soundEffects';

interface FlyingSpiderBotsIntroProps {
  onComplete: () => void;
  isMuted?: boolean;
}

export const FlyingSpiderBotsIntro: React.FC<FlyingSpiderBotsIntroProps> = ({
  onComplete,
  isMuted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FlightEngine | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStatus, setActiveStatus] = useState('SPIDER-BOTS AIRBORNE // COMMENCING FLIGHT BUILD');
  const isFinishedRef = useRef(false);

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    let placedCount = 0;
    const engine = new FlightEngine(width, height, () => {
      placedCount++;
      if (placedCount % 3 === 0) {
        soundSynth.playTypewriterBlip(isMuted);
      }
    });

    engine.initIntroCrew();
    engineRef.current = engine;

    let animId: number;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark atmospheric background with city stars
      ctx.fillStyle = 'rgba(5, 7, 16, 0.92)';
      ctx.fillRect(0, 0, width, height);

      // Render grid blueprint lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const done = engine.update();
      engine.render(ctx);

      // Calculate progress from bots waypoints
      let totalWaypoints = 0;
      let completedWaypoints = 0;
      for (const bot of engine.bots) {
        totalWaypoints += bot.waypoints.length;
        completedWaypoints += bot.currentWaypointIndex;
      }

      const calculatedProgress = Math.min(
        100,
        Math.floor((completedWaypoints / Math.max(1, totalWaypoints)) * 100)
      );
      setProgress(calculatedProgress);

      if (calculatedProgress < 35) {
        setActiveStatus('BOT-01 // WEAVING "FERREL RASHAD" PIXEL BLOCKS...');
      } else if (calculatedProgress < 75) {
        setActiveStatus('BOT-02 // WEAVING 16-BIT RPG DIALOGUE BOX PERIMETER...');
      } else if (calculatedProgress < 99) {
        setActiveStatus('BOT-03 // STAMPING COMMAND BUTTONS [STATUS, MISSIONS]...');
      } else {
        setActiveStatus('ALL SYSTEMS BUILT & WEB-LOCKED! READY!');
      }

      if (done || calculatedProgress >= 100) {
        setTimeout(handleFinish, 450);
        return;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [isMuted]);

  return (
    <div className="fixed inset-0 z-100 flex flex-col justify-between select-none overflow-hidden">
      {/* 2D Canvas for Flying Spider-Bots */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Top Bar with Skip Intro */}
      <div className="relative z-20 w-full p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-midnight-950/90 border border-midnight-700 px-3 py-1.5 shadow-pixel-sm">
          <span className="w-2 h-2 bg-spidey-crimson animate-ping" />
          <span className="font-pixel text-[9px] sm:text-[10px] text-white">
            SPIDER-BOTS FLIGHT ENGINE
          </span>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-midnight-900 hover:bg-midnight-800 border-2 border-slate-400 font-pixel text-[9px] sm:text-[10px] text-white shadow-pixel-sm active:translate-y-0.5"
        >
          <span>SKIP INTRO</span>
          <kbd className="px-1.5 py-0.5 bg-midnight-950 border border-slate-600 text-arcade-gold text-[8px]">
            ESC
          </kbd>
        </button>
      </div>

      {/* Bottom Diagnostic Console */}
      <div className="relative z-20 w-full max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-midnight-950/95 border-4 border-slate-300 p-4 sm:p-5 shadow-pixel">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold" />

          <div className="flex items-center justify-between pb-2 mb-2 border-b border-midnight-700">
            <span className="font-pixel text-[9px] sm:text-[10px] text-arcade-gold font-bold">
              CONSTRUCTING NYC ROOFTOP SECTOR
            </span>
            <span className="font-pixel text-[9px] text-white">
              {progress}%
            </span>
          </div>

          <p className="font-sub text-lg text-slate-200 tracking-wide min-h-[28px]">
            {activeStatus}
          </p>

          {/* Stepped Progress Bar */}
          <div className="w-full h-4 bg-midnight-900 border border-midnight-600 p-0.5 mt-2">
            <div
              className="h-full bg-linear-to-r from-spidey-crimson via-cyan-400 to-arcade-gold transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
