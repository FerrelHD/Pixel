import React, { useEffect, useRef, useState } from 'react';
import {
  piecesOf,
  drawSpiderBot,
  SpiderBotAgent,
  PixelPiece,
  BOT_SHADES,
} from '../../utils/pixelEngine';
import { soundSynth } from '../../audio/soundEffects';

interface SectionPixelBuilderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMuted?: boolean;
}

export const SectionPixelBuilder: React.FC<SectionPixelBuilderProps> = ({
  containerRef,
  isMuted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDone, setIsDone] = useState(false);
  const animFrameRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let lastTime = performance.now();

    const startBuild = async () => {
      if (hasTriggeredRef.current || destroyed) return;
      hasTriggeredRef.current = true;

      if (document.fonts) {
        await document.fonts.ready;
      }
      if (destroyed) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const containerRect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = containerRect.width;
      const height = containerRect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const buildElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-build]')
      );

      // If already solid, skip
      if (buildElements.length === 0 || buildElements.every((el) => el.hasAttribute('data-solid'))) {
        setIsDone(true);
        return;
      }

      const elementJobs = buildElements.map((el) => {
        const buildType = (el.dataset.build as 'text' | 'box' | 'ring') || 'text';
        const group = el.dataset.crew || el.dataset.build || 'default';
        const pieces = piecesOf(el, containerRect, buildType);
        return {
          el,
          group,
          pieces,
          isSolid: false,
        };
      });

      const groupMap = new Map<string, typeof elementJobs>();
      elementJobs.forEach((job) => {
        const list = groupMap.get(job.group) || [];
        list.push(job);
        groupMap.set(job.group, list);
      });

      const groups = Array.from(groupMap.keys());
      const agents: SpiderBotAgent[] = groups.map((grpName, idx) => {
        const groupJobs = groupMap.get(grpName) || [];
        const pieces = groupJobs.flatMap((j) => j.pieces);
        const shade = BOT_SHADES[(idx + 1) % BOT_SHADES.length];
        const startX = idx % 2 === 0 ? -40 : width + 40;
        const startY = 30 + (idx * height) / Math.max(1, groups.length);

        return {
          id: idx + 10,
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          face: startX < 0 ? 1 : -1,
          walk: 0,
          blink: 0,
          fly: true,
          job: pieces,
          t: 0,
          delay: 0.1 * idx,
          leaving: false,
          gone: false,
          primaryColor: shade.primary,
          eyeColor: shade.eye,
        };
      });

      let blipCounter = 0;

      const loop = (now: number) => {
        if (destroyed) return;
        const dt = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, width, height);

        agents.forEach((agent) => {
          if (agent.delay > 0) {
            agent.delay -= dt;
            return;
          }

          if (agent.leaving) {
            agent.vy -= 750 * dt;
            agent.vx += 150 * agent.face * dt;
            agent.x += agent.vx * dt;
            agent.y += agent.vy * dt;
            if (agent.y < -80 || agent.x < -80 || agent.x > width + 80) {
              agent.gone = true;
            }
          } else {
            agent.t += dt;
            const totalPieces = agent.job.length;
            const targetCount = Math.min(
              totalPieces,
              Math.ceil((agent.t / 1.2) * totalPieces)
            );

            let activePiece: PixelPiece | null = null;
            for (let i = 0; i < targetCount; i++) {
              const piece = agent.job[i];
              if (piece.state === 'waiting') {
                piece.state = 'flying';
                piece.f = 0;
                piece.ox = agent.x;
                piece.oy = agent.y;
                blipCounter++;
                if (blipCounter % 8 === 0 && !isMuted) {
                  soundSynth.playTypewriterBlip(isMuted);
                }
              }
              activePiece = piece;
            }

            if (activePiece) {
              const targetX = activePiece.tx;
              const targetY =
                activePiece.ty - 24 + Math.sin(now / 130 + agent.id) * 3;
              agent.vx += ((targetX - agent.x) * 230 - 25 * agent.vx) * dt;
              agent.vy += ((targetY - agent.y) * 230 - 25 * agent.vy) * dt;
              agent.x += agent.vx * dt;
              agent.y += agent.vy * dt;
              if (Math.abs(agent.vx) > 5) {
                agent.face = Math.sign(agent.vx);
              }
            }

            if (
              targetCount >= totalPieces &&
              agent.job.every(
                (p) => p.state === 'home' || p.state === 'fading' || p.state === 'gone'
              )
            ) {
              agent.leaving = true;
              agent.vy = -60;
            }
          }

          agent.job.forEach((piece) => {
            if (piece.state === 'flying') {
              piece.f = Math.min(1, piece.f + dt / 0.14);
              const ease = 1 - Math.pow(1 - piece.f, 3);
              piece.x = piece.ox + (piece.tx - piece.ox) * ease;
              piece.y = piece.oy + (piece.ty - piece.oy) * ease;
              if (piece.f >= 1) {
                piece.state = 'home';
                piece.x = piece.tx;
                piece.y = piece.ty;
              }
            } else if (piece.state === 'fading') {
              piece.f = Math.min(1, piece.f + dt / 0.16);
              if (piece.f >= 1) {
                piece.state = 'gone';
              }
            }
          });
        });

        elementJobs.forEach((job) => {
          if (!job.isSolid) {
            const allHome = job.pieces.every(
              (p) => p.state === 'home' || p.state === 'fading' || p.state === 'gone'
            );
            if (allHome && job.pieces.length > 0) {
              job.isSolid = true;
              job.el.setAttribute('data-solid', 'true');
              job.pieces.forEach((p) => {
                p.state = 'fading';
                p.f = 0;
              });
            }
          }
        });

        let lastColor = '';
        agents.forEach((agent) => {
          agent.job.forEach((piece) => {
            if (piece.state === 'waiting' || piece.state === 'gone') return;
            const alpha = piece.state === 'fading' ? 1 - piece.f : 1;
            ctx.globalAlpha = alpha;
            if (piece.color !== lastColor) {
              ctx.fillStyle = piece.color;
              lastColor = piece.color;
            }
            ctx.fillRect(piece.x, piece.y, piece.tw, piece.th);
          });
        });

        ctx.globalAlpha = 1.0;

        agents.forEach((agent) => {
          if (!agent.gone) {
            drawSpiderBot(ctx, agent, 2.5, now);
          }
        });

        const allSolid = elementJobs.every((j) => j.isSolid);
        const allBotsGone = agents.every((a) => a.gone);

        if (allSolid && allBotsGone) {
          ctx.clearRect(0, 0, width, height);
          setIsDone(true);
          return;
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

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
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, isMuted]);

  if (isDone) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
};
