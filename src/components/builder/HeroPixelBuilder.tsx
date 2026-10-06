import React, { useEffect, useRef, useState } from 'react';
import {
  piecesOf,
  drawSpiderBot,
  SpiderBotAgent,
  PixelPiece,
  BOT_SHADES,
} from '../../utils/pixelEngine';
import { soundSynth } from '../../audio/soundEffects';

interface HeroPixelBuilderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isMuted?: boolean;
  onComplete?: () => void;
}

export const HeroPixelBuilder: React.FC<HeroPixelBuilderProps> = ({
  containerRef,
  isMuted = false,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [showSkip, setShowSkip] = useState(true);
  const animFrameRef = useRef<number>(0);
  const isSkippedRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let destroyed = false;
    let lastTime = performance.now();

    const handleSkip = () => {
      if (isSkippedRef.current) return;
      isSkippedRef.current = true;
      cancelAnimationFrame(animFrameRef.current);

      // Make all DOM elements solid immediately
      const elements = container.querySelectorAll<HTMLElement>('[data-build]');
      elements.forEach((el) => {
        el.setAttribute('data-solid', 'true');
      });

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setIsDone(true);
      setShowSkip(false);
      if (onComplete) onComplete();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const initBuild = async () => {
      // Wait for pixel fonts to be fully rendered
      if (document.fonts) {
        await document.fonts.ready;
      }
      if (destroyed || isSkippedRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = containerRect.width;
      const height = containerRect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Query all elements intended for in-situ build
      const buildElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-build]')
      );

      // If elements are already solid (e.g. from previous skip), mark done
      if (buildElements.every((el) => el.hasAttribute('data-solid'))) {
        setIsDone(true);
        setShowSkip(false);
        return;
      }

      // Extract pieces for each DOM element
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

      // Group elements by crew
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
        const shade = BOT_SHADES[idx % BOT_SHADES.length];
        const startX = idx % 2 === 0 ? -40 : width + 40;
        const startY = 40 + (idx * height) / Math.max(1, groups.length);

        return {
          id: idx,
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
          delay: 0.12 * idx,
          leaving: false,
          gone: false,
          primaryColor: shade.primary,
          eyeColor: shade.eye,
        };
      });

      let blipCounter = 0;

      const loop = (now: number) => {
        if (destroyed || isSkippedRef.current) return;
        const dt = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, width, height);

        // Update agents
        agents.forEach((agent) => {
          if (agent.delay > 0) {
            agent.delay -= dt;
            return;
          }

          if (agent.leaving) {
            agent.vy -= 800 * dt;
            agent.vx += 160 * agent.face * dt;
            agent.x += agent.vx * dt;
            agent.y += agent.vy * dt;
            if (agent.y < -80 || agent.x < -80 || agent.x > width + 80) {
              agent.gone = true;
            }
          } else {
            agent.t += dt;
            // Progressive emission of pieces
            const totalPieces = agent.job.length;
            const targetCount = Math.min(
              totalPieces,
              Math.ceil((agent.t / 1.35) * totalPieces)
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
                if (blipCounter % 6 === 0 && !isMuted) {
                  soundSynth.playTypewriterBlip(isMuted);
                }
              }
              activePiece = piece;
            }

            // Bot follows the active workhead
            if (activePiece) {
              const targetX = activePiece.tx;
              const targetY =
                activePiece.ty - 26 + Math.sin(now / 120 + agent.id) * 3;
              agent.vx += ((targetX - agent.x) * 240 - 26 * agent.vx) * dt;
              agent.vy += ((targetY - agent.y) * 240 - 26 * agent.vy) * dt;
              agent.x += agent.vx * dt;
              agent.y += agent.vy * dt;
              if (Math.abs(agent.vx) > 5) {
                agent.face = Math.sign(agent.vx);
              }
            }

            // Check if agent finished all pieces
            if (
              targetCount >= totalPieces &&
              agent.job.every((p) => p.state === 'home' || p.state === 'fading' || p.state === 'gone')
            ) {
              agent.leaving = true;
              agent.vy = -60;
            }
          }

          // Update pieces easing
          agent.job.forEach((piece) => {
            if (piece.state === 'flying') {
              piece.f = Math.min(1, piece.f + dt / 0.15);
              const ease = 1 - Math.pow(1 - piece.f, 3);
              piece.x = piece.ox + (piece.tx - piece.ox) * ease;
              piece.y = piece.oy + (piece.ty - piece.oy) * ease;
              if (piece.f >= 1) {
                piece.state = 'home';
                piece.x = piece.tx;
                piece.y = piece.ty;
              }
            } else if (piece.state === 'fading') {
              piece.f = Math.min(1, piece.f + dt / 0.18);
              if (piece.f >= 1) {
                piece.state = 'gone';
              }
            }
          });
        });

        // Check if individual elements are complete -> turn solid!
        elementJobs.forEach((job) => {
          if (!job.isSolid) {
            const allHome = job.pieces.every(
              (p) => p.state === 'home' || p.state === 'fading' || p.state === 'gone'
            );
            if (allHome && job.pieces.length > 0) {
              job.isSolid = true;
              job.el.setAttribute('data-solid', 'true');
              // Fade out canvas pieces so the crisp DOM element takes over cleanly
              job.pieces.forEach((p) => {
                p.state = 'fading';
                p.f = 0;
              });
            }
          }
        });

        // Draw settled and flying pieces on canvas
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

        // Draw Spider-Bots
        agents.forEach((agent) => {
          if (!agent.gone) {
            drawSpiderBot(ctx, agent, 3, now);
          }
        });

        // All done check
        const allSolid = elementJobs.every((j) => j.isSolid);
        const allBotsGone = agents.every((a) => a.gone);

        if (allSolid && allBotsGone) {
          ctx.clearRect(0, 0, width, height);
          setIsDone(true);
          setShowSkip(false);
          if (onComplete) onComplete();
          return;
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    };

    initBuild();

    return () => {
      destroyed = true;
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, isMuted, onComplete]);

  if (isDone) return null;

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
          onClick={() => {
            isSkippedRef.current = true;
            if (containerRef.current) {
              containerRef.current
                .querySelectorAll<HTMLElement>('[data-build]')
                .forEach((el) => el.setAttribute('data-solid', 'true'));
            }
            setIsDone(true);
            setShowSkip(false);
            if (onComplete) onComplete();
          }}
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
