import React, { useEffect, useRef } from 'react';
import {
  piecesOf,
  drawSpiderBot,
  SpiderBotAgent,
  PixelPiece,
  BOT_SHADES,
  BuildStyle,
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
  const animFrameRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);
  const agentsRef = useRef<SpiderBotAgent[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let destroyed = false;
    let lastTime = performance.now();
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;

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

      agentsRef.current.forEach((bot) => {
        const dist = Math.hypot(clickX - bot.x, clickY - bot.y);
        if (dist < 40) {
          bot.stuntTimer = 0.6;
          bot.stuntAngle = 10;
          bot.emote = ['⚡', '!', '★'][Math.floor(Math.random() * 3)];
          bot.emoteTimer = 1.8;
          soundSynth.playButtonPress(isMuted);
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mousedown', handlePointerDown);

    const startBuild = async () => {
      if (hasTriggeredRef.current || destroyed) return;
      hasTriggeredRef.current = true;

      if (document.fonts) {
        await document.fonts.ready;
      }
      if (destroyed) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const containerRect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      containerWidth = containerRect.width;
      containerHeight = containerRect.height;

      canvas.width = Math.round(containerWidth * dpr);
      canvas.height = Math.round(containerHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const buildElements = Array.from(
        container.querySelectorAll<HTMLElement>('[data-build]')
      );

      const isAlreadySolid =
        buildElements.length > 0 &&
        buildElements.every((el) => el.hasAttribute('data-solid'));

      const elementJobs = buildElements.map((el) => {
        const buildType = (el.dataset.build as 'pixel-art' | 'text' | 'box' | 'ring') || 'text';
        const group = el.dataset.crew || el.dataset.build || 'default';
        const pieces = piecesOf(el, containerRect, buildType);
        return {
          el,
          group,
          pieces,
          isSolid: isAlreadySolid,
        };
      });

      const groupMap = new Map<string, typeof elementJobs>();
      elementJobs.forEach((job) => {
        const list = groupMap.get(job.group) || [];
        list.push(job);
        groupMap.set(job.group, list);
      });

      const groups = Array.from(groupMap.keys());
      const styleList: BuildStyle[] = ['scan', 'drop', 'kinetic'];

      const agents: SpiderBotAgent[] = groups.map((grpName, idx) => {
        const groupJobs = groupMap.get(grpName) || [];
        const pieces = groupJobs.flatMap((j) => j.pieces);
        const shade = BOT_SHADES[(idx + 1) % BOT_SHADES.length];
        const startX = idx % 2 === 0 ? -40 : containerWidth + 40;
        const startY = 30 + (idx * containerHeight) / Math.max(1, groups.length);

        let idleX = containerWidth - 45 - idx * 55;
        let idleY = 45;
        if (groupJobs.length > 0) {
          const firstElemRect = groupJobs[0].el.getBoundingClientRect();
          idleX = firstElemRect.right - containerRect.left + (idx === 0 ? 10 : -35);
          idleY = firstElemRect.top - containerRect.top - 14;
          idleX = Math.max(35, Math.min(containerWidth - 35, idleX));
          idleY = Math.max(25, Math.min(containerHeight - 40, idleY));
        }

        const buildStyle = styleList[idx % styleList.length];

        return {
          id: idx + 20,
          x: isAlreadySolid ? idleX : startX,
          y: isAlreadySolid ? idleY : startY,
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
          buildStyle,
          mode: isAlreadySolid ? (idx === 1 ? 'perched' : 'floating') : 'building',
          idleTargetX: idleX,
          idleTargetY: idleY,
          floatFreq: 2.0 + idx * 0.5,
          floatAmp: 4 + idx * 1.2,
          stuntAngle: 0,
          stuntTimer: 0,
          emote: null,
          emoteTimer: 0,
          sonarRadius: 0,
          sonarTimer: 4 + idx * 3,
        };
      });

      agentsRef.current = agents;
      let blipCounter = 0;

      const loop = (now: number) => {
        if (destroyed) return;
        const dt = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, containerWidth, containerHeight);

        agents.forEach((agent) => {
          if (agent.stuntTimer > 0) {
            agent.stuntTimer -= dt;
            agent.stuntAngle = (agent.stuntAngle + 720 * dt) % 360;
            if (agent.stuntTimer <= 0) agent.stuntAngle = 0;
          }

          if (agent.emoteTimer > 0) {
            agent.emoteTimer -= dt;
            if (agent.emoteTimer <= 0) agent.emote = null;
          }

          agent.sonarTimer -= dt;
          if (agent.sonarTimer <= 0) {
            agent.sonarRadius = 1;
            agent.sonarTimer = 7 + Math.random() * 5;
          }
          if (agent.sonarRadius > 0) {
            agent.sonarRadius += 30 * dt;
            if (agent.sonarRadius > 30) agent.sonarRadius = 0;
          }

          agent.blink -= dt;
          if (agent.blink <= -3) {
            agent.blink = 0.15;
          }

          if (agent.mode === 'building') {
            if (agent.delay > 0) {
              agent.delay -= dt;
              return;
            }

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
              let targetX = activePiece.tx;
              let targetY = activePiece.ty - 22;

              if (agent.buildStyle === 'scan') {
                targetY = activePiece.ty - 30;
              }

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
              // Transition to persistent FLOATING or PERCHED mode! (DO NOT DISAPPEAR)
              agent.mode = agent.id % 2 === 0 ? 'floating' : 'perched';
              agent.vx = 0;
              agent.vy = 0;
            }
          } else {
            // FLOATING or PERCHED mode
            const hoverBob = Math.sin((now / 1000) * agent.floatFreq) * agent.floatAmp;
            let targetX = agent.idleTargetX;
            let targetY = agent.idleTargetY + hoverBob;

            if (mousePos.x > 0 && mousePos.y > 0) {
              const dx = mousePos.x - agent.x;
              const dy = mousePos.y - agent.y;
              const dist = Math.hypot(dx, dy);

              agent.face = dx > 0 ? 1 : -1;

              if (dist < 50) {
                targetX -= (dx / dist) * 14;
                targetY -= (dy / dist) * 14;
              }
            }

            agent.vx += ((targetX - agent.x) * 45 - 8 * agent.vx) * dt;
            agent.vy += ((targetY - agent.y) * 45 - 8 * agent.vy) * dt;
            agent.x += agent.vx * dt;
            agent.y += agent.vy * dt;
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
          drawSpiderBot(ctx, agent, 2.5, now);
        });

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
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, isMuted]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
};
