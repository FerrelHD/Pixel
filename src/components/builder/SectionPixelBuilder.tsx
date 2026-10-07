import React, { useEffect, useRef } from 'react';
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

interface SectionPixelBuilderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMuted?: boolean;
}

const idleMode = (a: SpiderBotAgent) => (a.id % 2 === 0 ? 'floating' : 'perched');

export const SectionPixelBuilder: React.FC<SectionPixelBuilderProps> = ({
  containerRef,
  isMuted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  // Latest mute state without restarting the build.
  const mutedRef = useRef(isMuted);
  mutedRef.current = isMuted;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let destroyed = false;
    let lastTime = performance.now();
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;
    let dpr = 1;
    let jobs: ElementJob[] = [];
    let agents: SpiderBotAgent[] = [];
    let ctx: CanvasRenderingContext2D | null = null;

    const mousePos = { x: -999, y: -999 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };

    const handlePointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      agents.forEach((bot) => {
        if (Math.hypot(clickX - bot.x, clickY - bot.y) < 40 && bot.stuntAngle === 0) {
          bot.stuntAngle = 0.01;
          bot.emote = ['⚡', '!', '★'][Math.floor(Math.random() * 3)];
          bot.emoteTimer = 1.8;
          soundSynth.playButtonPress(mutedRef.current);
        }
      });
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
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      return containerRect;
    };

    const idleTarget = (groupJobs: ElementJob[], idx: number, containerRect: DOMRect) => {
      let x = containerWidth - 45 - idx * 55;
      let y = 45;
      if (groupJobs.length > 0) {
        const r = groupJobs[0].el.getBoundingClientRect();
        x = r.right - containerRect.left + (idx === 0 ? 10 : -35);
        y = r.top - containerRect.top - 14;
      }
      return {
        x: Math.max(35, Math.min(containerWidth - 35, x)),
        y: Math.max(25, Math.min(containerHeight - 40, y)),
      };
    };

    let resizeTimer = 0;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (destroyed || agents.length === 0) return;
        finishAll(jobs, agents, idleMode);
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
    window.addEventListener('resize', handleResize);

    const startBuild = async () => {
      if (hasTriggeredRef.current || destroyed) return;
      hasTriggeredRef.current = true;

      if (document.fonts) {
        await document.fonts.ready;
      }
      if (destroyed) return;

      ctx = canvas.getContext('2d');
      if (!ctx) return;
      const c = ctx;

      const containerRect = sizeCanvas();
      const buildElements = Array.from(container.querySelectorAll<HTMLElement>('[data-build]'));
      const isAlreadySolid =
        buildElements.length > 0 && buildElements.every((el) => el.hasAttribute('data-solid'));

      jobs = createJobs(container, containerRect, isAlreadySolid);

      const groups = Array.from(new Set(jobs.map((j) => j.group)));
      const styleList: BuildStyle[] = ['scan', 'drop', 'kinetic'];

      agents = groups.map((grpName, idx) => {
        const groupJobs = jobs.filter((j) => j.group === grpName);
        const pieces = groupJobs.flatMap((j) => j.pieces);
        const shade = BOT_SHADES[(idx + 1) % BOT_SHADES.length];
        const startX = idx % 2 === 0 ? -40 : containerWidth + 40;
        const startY = 30 + (idx * containerHeight) / Math.max(1, groups.length);
        const idle = idleTarget(groupJobs, idx, containerRect);

        const agent: SpiderBotAgent = {
          id: idx + 20,
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
          floatFreq: 2.0 + idx * 0.5,
          floatAmp: 4 + idx * 1.2,
          stuntAngle: 0,
          emote: null,
          emoteTimer: 0,
          sonarRadius: 0,
          sonarTimer: 4 + idx * 3,
          cursor: 0,
          rate: buildRate(pieces.length),
          landed: 0,
        };
        if (isAlreadySolid) agent.mode = idleMode(agent);
        return agent;
      });

      let blipCounter = 0;
      const onLaunch = () => {
        if (++blipCounter % 16 === 0 && !mutedRef.current) {
          soundSynth.playTypewriterBlip(mutedRef.current);
        }
      };

      const loop = (now: number) => {
        if (destroyed) return;
        const dt = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        c.clearRect(0, 0, containerWidth, containerHeight);

        agents.forEach((agent) => {
          stepTimers(agent, dt, 30);
          if (agent.mode === 'building') {
            // Transition to persistent FLOATING or PERCHED mode! (DO NOT DISAPPEAR)
            if (stepBuilding(agent, dt, now, onLaunch)) agent.mode = idleMode(agent);
          } else {
            stepIdle(agent, dt, now, mousePos);
          }
          stepPieces(agent, dt, jobs);
        });

        drawPieces(c, jobs, dpr);
        agents.forEach((agent) => drawSpiderBot(c, agent, 2.5, now));

        animFrameRef.current = requestAnimationFrame(loop);
      };

      lastTime = performance.now();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startBuild();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => {
      destroyed = true;
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
};
