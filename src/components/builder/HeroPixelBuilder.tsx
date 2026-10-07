import React, { useEffect, useRef, useState } from 'react';
import { drawSpiderBot, SpiderBotAgent, BOT_SHADES, BuildStyle } from '../../utils/pixelEngine';
import { soundSynth } from '../../audio/soundEffects';
import {
  buildRate,
  createJobs,
  drawPieces,
  ElementJob,
  finishAll,
  stepBuilding,
  stepIdle,
  stepPieces,
  stepTimers,
} from './buildRuntime';

interface HeroPixelBuilderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMuted?: boolean;
  onComplete?: () => void;
}

const idleMode = (a: SpiderBotAgent) => (a.id === 2 ? 'perched' : 'floating');

export const HeroPixelBuilder: React.FC<HeroPixelBuilderProps> = ({
  containerRef,
  isMuted = false,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showSkip, setShowSkip] = useState(true);
  const animFrameRef = useRef<number>(0);
  const skipRef = useRef<() => void>(() => {});

  // Latest props in refs so changing them never restarts the build.
  const mutedRef = useRef(isMuted);
  const onCompleteRef = useRef(onComplete);
  mutedRef.current = isMuted;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let destroyed = false;
    let completed = false;
    let lastTime = performance.now();
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;
    let dpr = 1;
    let jobs: ElementJob[] = [];
    let agents: SpiderBotAgent[] = [];

    const mousePos = { x: -999, y: -999 };

    const complete = () => {
      if (completed) return;
      completed = true;
      setShowSkip(false);
      onCompleteRef.current?.();
    };

    // Pointer move listener on container to track cursor for interactive floating bots
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    // Pointer down listener to trigger stunt when clicking near a bot
    const handlePointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      agents.forEach((bot) => {
        if (Math.hypot(clickX - bot.x, clickY - bot.y) < 45 && bot.stuntAngle === 0) {
          bot.stuntAngle = 0.01;
          bot.emote = ['⚡', '!', '🕸️', '★'][Math.floor(Math.random() * 4)];
          bot.emoteTimer = 1.8;
          soundSynth.playButtonPress(mutedRef.current);
        }
      });
    };

    const handleSkip = () => {
      if (completed) return;
      finishAll(jobs, agents, idleMode);
      // Elements may not be measured yet (fonts loading) -> reveal them anyway.
      container.querySelectorAll<HTMLElement>('[data-build]').forEach((el) => el.setAttribute('data-solid', 'true'));
      complete();
    };
    skipRef.current = handleSkip;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };

    const sizeCanvas = () => {
      const containerRect = container.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      containerWidth = containerRect.width;
      containerHeight = containerRect.height;
      canvas.width = Math.round(containerWidth * dpr);
      canvas.height = Math.round(containerHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return containerRect;
    };

    // Compute idle home coordinates based on assigned elements
    const idleTarget = (groupJobs: ElementJob[], idx: number, containerRect: DOMRect) => {
      let x = containerWidth * (0.2 + 0.2 * idx);
      let y = containerHeight * 0.45;
      if (groupJobs.length > 0) {
        const r = groupJobs[0].el.getBoundingClientRect();
        x = r.left - containerRect.left + r.width + (idx % 2 === 0 ? 15 : -15);
        y = r.top - containerRect.top - 18;
      }
      // Keep inside screen
      return {
        x: Math.max(40, Math.min(containerWidth - 40, x)),
        y: Math.max(30, Math.min(containerHeight - 50, y)),
      };
    };

    let resizeTimer = 0;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (destroyed || agents.length === 0) return;
        // Layout changed -> targets are stale. Finish instantly and re-home the bots.
        finishAll(jobs, agents, idleMode);
        complete();
        const containerRect = sizeCanvas();
        const groups = Array.from(new Set(jobs.map((j) => j.group)));
        agents.forEach((a, idx) => {
          const t = idleTarget(jobs.filter((j) => j.group === groups[idx]), idx, containerRect);
          a.idleTargetX = t.x;
          a.idleTargetY = t.y;
        });
      }, 150);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    const initBuild = async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
      if (destroyed || completed) return;

      const containerRect = sizeCanvas();
      const buildElements = Array.from(container.querySelectorAll<HTMLElement>('[data-build]'));
      const isAlreadySolid =
        buildElements.length > 0 && buildElements.every((el) => el.hasAttribute('data-solid'));

      jobs = createJobs(container, containerRect, isAlreadySolid);

      // Group elements by crew
      const groups = Array.from(new Set(jobs.map((j) => j.group)));
      const styleList: BuildStyle[] = ['kinetic', 'scan', 'drop', 'flank'];

      // Spawn Spider-Bot Agents
      agents = groups.map((grpName, idx) => {
        const groupJobs = jobs.filter((j) => j.group === grpName);
        const pieces = groupJobs.flatMap((j) => j.pieces);
        const shade = BOT_SHADES[idx % BOT_SHADES.length];
        const startX = idx % 2 === 0 ? -40 : containerWidth + 40;
        const startY = 30 + (idx * containerHeight) / Math.max(1, groups.length);
        const idle = idleTarget(groupJobs, idx, containerRect);

        const agent: SpiderBotAgent = {
          id: idx,
          x: isAlreadySolid ? idle.x : startX,
          y: isAlreadySolid ? idle.y : startY,
          vx: 0,
          vy: 0,
          face: startX < 0 ? 1 : -1,
          walk: 0,
          blink: 0,
          fly: true,
          job: pieces,
          t: 0,
          delay: isAlreadySolid ? 0 : 0.08 * idx,
          leaving: false,
          gone: false,
          primaryColor: shade.primary,
          eyeColor: shade.eye,
          buildStyle: styleList[idx % styleList.length],
          mode: 'building',
          idleTargetX: idle.x,
          idleTargetY: idle.y,
          floatFreq: 1.8 + idx * 0.4,
          floatAmp: 4 + idx * 1.5,
          stuntAngle: 0,
          emote: null,
          emoteTimer: 0,
          sonarRadius: 0,
          sonarTimer: 3 + idx * 2,
          cursor: 0,
          rate: buildRate(pieces.length),
          landed: 0,
        };
        if (isAlreadySolid) agent.mode = idleMode(agent);
        return agent;
      });

      if (isAlreadySolid) complete();

      let blipCounter = 0;
      const onLaunch = () => {
        if (++blipCounter % 14 === 0 && !mutedRef.current) {
          soundSynth.playTypewriterBlip(mutedRef.current);
        }
      };

      const loop = (now: number) => {
        if (destroyed) return;
        const dt = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, containerWidth, containerHeight);

        agents.forEach((agent) => {
          stepTimers(agent, dt, 35);
          if (agent.mode === 'building') {
            if (stepBuilding(agent, dt, now, onLaunch)) {
              // Transition to persistent FLOATING or PERCHED mode! (DO NOT DISAPPEAR)
              agent.mode = idleMode(agent);
            }
          } else {
            stepIdle(agent, dt, now, mousePos);
          }
          stepPieces(agent, dt, jobs);
        });

        if (!completed && jobs.every((j) => j.isSolid)) complete();

        drawPieces(ctx, jobs, dpr);

        // Draw all persistent Spider-Bots (both building & floating/perched!)
        agents.forEach((agent) => drawSpiderBot(ctx, agent, 3, now));

        animFrameRef.current = requestAnimationFrame(loop);
      };

      lastTime = performance.now();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    initBuild();

    return () => {
      destroyed = true;
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-30 pointer-events-none w-full h-full"
        aria-hidden="true"
      />
      {showSkip && (
        <button
          type="button"
          onClick={() => skipRef.current()}
          className="absolute top-3 right-3 z-40 px-2.5 py-1 bg-midnight-900/90 border-2 border-slate-700 hover:border-arcade-gold text-[10px] sm:text-xs text-slate-300 hover:text-white font-pixel shadow-pixel-sm transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
        >
          <span>Skip build</span>
          <kbd className="px-1 py-0.5 bg-midnight-950 border border-slate-700 text-[9px] text-arcade-gold rounded-xs">
            Esc
          </kbd>
        </button>
      )}
    </>
  );
};
