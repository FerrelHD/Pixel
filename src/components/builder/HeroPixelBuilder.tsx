import React, { useEffect, useRef, useState } from 'react';
import {
  piecesOf,
  drawSpiderBot,
  SpiderBotAgent,
  PixelPiece,
  BOT_SHADES,
  BuildStyle,
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
  const [showSkip, setShowSkip] = useState(true);
  const animFrameRef = useRef<number>(0);
  const isSkippedRef = useRef<boolean>(false);
  const agentsRef = useRef<SpiderBotAgent[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let destroyed = false;
    let lastTime = performance.now();
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;

    const mousePos = { x: -999, y: -999 };

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

      agentsRef.current.forEach((bot) => {
        const dist = Math.hypot(clickX - bot.x, clickY - bot.y);
        if (dist < 45) {
          bot.stuntTimer = 0.6;
          bot.stuntAngle = 10;
          bot.emote = ['⚡', '!', '🕸️', '★'][Math.floor(Math.random() * 4)];
          bot.emoteTimer = 1.8;
          soundSynth.playButtonPress(isMuted);
        }
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mousedown', handlePointerDown);

    const handleSkip = () => {
      if (isSkippedRef.current) return;
      isSkippedRef.current = true;

      // Make all DOM elements solid immediately
      const elements = container.querySelectorAll<HTMLElement>('[data-build]');
      elements.forEach((el) => {
        el.setAttribute('data-solid', 'true');
      });

      // Transition bots immediately to their floating/perched positions
      agentsRef.current.forEach((agent) => {
        agent.mode = agent.id === 2 ? 'perched' : 'floating';
        agent.x = agent.idleTargetX;
        agent.y = agent.idleTargetY;
        agent.job.forEach((p) => (p.state = 'gone'));
      });

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
      if (document.fonts) {
        await document.fonts.ready;
      }
      if (destroyed || isSkippedRef.current) return;

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

      // Extract pieces for each DOM element
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

      // Group elements by crew
      const groupMap = new Map<string, typeof elementJobs>();
      elementJobs.forEach((job) => {
        const list = groupMap.get(job.group) || [];
        list.push(job);
        groupMap.set(job.group, list);
      });

      const groups = Array.from(groupMap.keys());
      const styleList: BuildStyle[] = ['kinetic', 'scan', 'drop', 'flank'];

      // Spawn Spider-Bot Agents
      const agents: SpiderBotAgent[] = groups.map((grpName, idx) => {
        const groupJobs = groupMap.get(grpName) || [];
        const pieces = groupJobs.flatMap((j) => j.pieces);
        const shade = BOT_SHADES[idx % BOT_SHADES.length];
        const startX = idx % 2 === 0 ? -40 : containerWidth + 40;
        const startY = 30 + (idx * containerHeight) / Math.max(1, groups.length);

        // Compute idle home coordinates based on assigned elements
        let idleX = containerWidth * (0.2 + 0.2 * idx);
        let idleY = containerHeight * 0.45;
        if (groupJobs.length > 0) {
          const firstElemRect = groupJobs[0].el.getBoundingClientRect();
          idleX = firstElemRect.left - containerRect.left + firstElemRect.width + (idx % 2 === 0 ? 15 : -15);
          idleY = firstElemRect.top - containerRect.top - 18;
          // Keep inside screen
          idleX = Math.max(40, Math.min(containerWidth - 40, idleX));
          idleY = Math.max(30, Math.min(containerHeight - 50, idleY));
        }

        const buildStyle = styleList[idx % styleList.length];

        return {
          id: idx,
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
          mode: isAlreadySolid ? (idx === 2 ? 'perched' : 'floating') : 'building',
          idleTargetX: idleX,
          idleTargetY: idleY,
          floatFreq: 1.8 + idx * 0.4,
          floatAmp: 4 + idx * 1.5,
          stuntAngle: 0,
          stuntTimer: 0,
          emote: null,
          emoteTimer: 0,
          sonarRadius: 0,
          sonarTimer: 3 + idx * 2,
        };
      });

      agentsRef.current = agents;

      if (isAlreadySolid) {
        setShowSkip(false);
      }

      let blipCounter = 0;

      const loop = (now: number) => {
        if (destroyed) return;
        const dt = Math.min(1 / 30, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, containerWidth, containerHeight);

        // Update Agents
        agents.forEach((agent) => {
          // Timer countdowns
          if (agent.stuntTimer > 0) {
            agent.stuntTimer -= dt;
            agent.stuntAngle = (agent.stuntAngle + 720 * dt) % 360;
            if (agent.stuntTimer <= 0) agent.stuntAngle = 0;
          }

          if (agent.emoteTimer > 0) {
            agent.emoteTimer -= dt;
            if (agent.emoteTimer <= 0) agent.emote = null;
          }

          // Sonar radar pulse
          agent.sonarTimer -= dt;
          if (agent.sonarTimer <= 0) {
            agent.sonarRadius = 1;
            agent.sonarTimer = 6 + Math.random() * 5;
          }
          if (agent.sonarRadius > 0) {
            agent.sonarRadius += 35 * dt;
            if (agent.sonarRadius > 35) agent.sonarRadius = 0;
          }

          // Eye blinking
          agent.blink -= dt;
          if (agent.blink <= -3) {
            agent.blink = 0.15; // blink duration
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
              Math.ceil((agent.t / 1.3) * totalPieces)
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
                if (blipCounter % 14 === 0 && !isMuted) {
                  soundSynth.playTypewriterBlip(isMuted);
                }
              }
              activePiece = piece;
            }

            // Varied movement path based on buildStyle
            if (activePiece) {
              let targetX = activePiece.tx;
              let targetY = activePiece.ty - 24;

              if (agent.buildStyle === 'kinetic') {
                targetX += Math.cos(now / 140) * 8;
                targetY -= 6;
              } else if (agent.buildStyle === 'scan') {
                targetY = activePiece.ty - 34; // higher scan altitude
              } else if (agent.buildStyle === 'drop') {
                targetY = activePiece.ty - 20;
              }

              agent.vx += ((targetX - agent.x) * 240 - 26 * agent.vx) * dt;
              agent.vy += ((targetY - agent.y) * 240 - 26 * agent.vy) * dt;
              agent.x += agent.vx * dt;
              agent.y += agent.vy * dt;
              if (Math.abs(agent.vx) > 5) {
                agent.face = Math.sign(agent.vx);
              }
            }

            // Check if building complete for this agent
            if (
              targetCount >= totalPieces &&
              agent.job.every(
                (p) => p.state === 'home' || p.state === 'fading' || p.state === 'gone'
              )
            ) {
              // Transition to persistent FLOATING or PERCHED mode! (DO NOT DISAPPEAR)
              agent.mode = agent.id === 2 ? 'perched' : 'floating';
              agent.vx = 0;
              agent.vy = 0;
            }
          } else {
            // Mode: FLOATING or PERCHED
            // Smooth sine-wave hover calculation
            const hoverBob = Math.sin((now / 1000) * agent.floatFreq) * agent.floatAmp;
            let targetX = agent.idleTargetX;
            let targetY = agent.idleTargetY + hoverBob;

            // Interactive mouse tracking
            if (mousePos.x > 0 && mousePos.y > 0) {
              const dx = mousePos.x - agent.x;
              const dy = mousePos.y - agent.y;
              const dist = Math.hypot(dx, dy);

              // Look towards mouse
              agent.face = dx > 0 ? 1 : -1;

              // Gentle evasive float if mouse gets too close
              if (dist < 55) {
                targetX -= (dx / dist) * 16;
                targetY -= (dy / dist) * 16;
              }
            }

            // Patrol motion for Bot 3
            if (agent.id === 3 && agent.mode === 'floating') {
              targetX += Math.sin(now / 1600) * 80;
            }

            // Soft spring towards idle position
            agent.vx += ((targetX - agent.x) * 45 - 8 * agent.vx) * dt;
            agent.vy += ((targetY - agent.y) * 45 - 8 * agent.vy) * dt;
            agent.x += agent.vx * dt;
            agent.y += agent.vy * dt;
          }

          // Update pieces easing & trajectories
          agent.job.forEach((piece) => {
            if (piece.state === 'flying') {
              piece.f = Math.min(1, piece.f + dt / 0.15);
              const ease = 1 - Math.pow(1 - piece.f, 3);

              if (agent.buildStyle === 'kinetic') {
                // Curved swing trajectory
                const curveArc = Math.sin(piece.f * Math.PI) * 12;
                piece.x = piece.ox + (piece.tx - piece.ox) * ease;
                piece.y = piece.oy + (piece.ty - piece.oy) * ease - curveArc;
              } else if (agent.buildStyle === 'drop') {
                // Gravity acceleration drop with micro bounce
                const gravEase = Math.pow(piece.f, 2.2);
                piece.x = piece.ox + (piece.tx - piece.ox) * ease;
                piece.y = piece.oy + (piece.ty - piece.oy) * gravEase;
                if (piece.f > 0.85) {
                  piece.bounce = Math.sin((piece.f - 0.85) * 6.6 * Math.PI) * 2.5;
                  piece.y -= piece.bounce;
                }
              } else {
                piece.x = piece.ox + (piece.tx - piece.ox) * ease;
                piece.y = piece.oy + (piece.ty - piece.oy) * ease;
              }

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
              job.pieces.forEach((p) => {
                p.state = 'fading';
                p.f = 0;
              });
            }
          }
        });

        // Hide skip button once all solid
        if (showSkip && elementJobs.every((j) => j.isSolid)) {
          setShowSkip(false);
          if (onComplete) onComplete();
        }

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

        // Draw all persistent Spider-Bots (both building & floating/perched!)
        agents.forEach((agent) => {
          drawSpiderBot(ctx, agent, 3, now);
        });

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    };

    initBuild();

    return () => {
      destroyed = true;
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, isMuted, onComplete, showSkip]);

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
            agentsRef.current.forEach((agent) => {
              agent.mode = agent.id === 2 ? 'perched' : 'floating';
              agent.x = agent.idleTargetX;
              agent.y = agent.idleTargetY;
              agent.job.forEach((p) => (p.state = 'gone'));
            });
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
