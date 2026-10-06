import React, { useEffect } from 'react';
import { X, Shield, ExternalLink, GitBranch } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { ProjectQuest } from '../../types';

interface MissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted?: boolean;
}

const MISSIONS: ProjectQuest[] = [
  {
    id: 'm1',
    title: 'SPIDEY PIXEL RETRO PORTFOLIO',
    category: 'Web',
    status: 'COMPLETED',
    description: '16-bit retro RPG portfolio featuring custom NYC skyline canvas, handcrafted pixel Spider-Man sprite, and procedural 8-bit sound synthesis.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
  },
  {
    id: 'm2',
    title: 'RETRO 2D PLATFORMER ENGINE',
    category: 'Game',
    status: 'IN_PROGRESS',
    description: 'Tile-based 2D physics engine with sprite-sheet animations, collision detection, and responsive keyboard controls.',
    tech: ['TypeScript', 'HTML5 Canvas', 'Game Loop', 'Web Audio API'],
  },
  {
    id: 'm3',
    title: 'DEV COMMAND CENTER',
    category: 'Engine',
    status: 'COMPLETED',
    description: 'Interactive dashboard for indie developers featuring project tracking, pixel-art metrics, and modular API endpoints.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
  },
];

export const MissionsModal: React.FC<MissionsModalProps> = ({
  isOpen,
  onClose,
  isMuted = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundSynth.playCloseSound(isMuted);
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isMuted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-2xl bg-midnight-950 border-4 border-cyan-400 p-4 sm:p-6 shadow-pixel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="missions-title"
      >
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        <div className="flex items-center justify-between pb-3 border-b-2 border-midnight-700">
          <div className="flex items-center gap-2">
            <Shield className="text-cyan-400" size={20} />
            <h2 id="missions-title" className="font-pixel text-sm sm:text-base text-white">
              ACTIVE MISSIONS &amp; QUESTS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="p-1 text-pixel-muted hover:text-white hover:bg-midnight-800 border border-transparent hover:border-slate-500"
            aria-label="Close missions"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          {MISSIONS.map((mission) => (
            <article
              key={mission.id}
              className="p-3.5 bg-midnight-900 border-2 border-midnight-700 hover:border-cyan-400/80 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-pixel text-xs text-cyan-300">
                  {mission.title}
                </h3>
                <span
                  className={`font-pixel text-[8px] px-2 py-0.5 border ${
                    mission.status === 'COMPLETED'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : 'bg-amber-950 border-amber-500 text-amber-400'
                  }`}
                >
                  [{mission.status}]
                </span>
              </div>

              <p className="font-sub text-base text-slate-300 mt-2 leading-relaxed">
                {mission.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-midnight-800">
                <div className="flex flex-wrap gap-1.5">
                  {mission.tech.map((t) => (
                    <span
                      key={t}
                      className="font-pixel text-[8px] px-2 py-0.5 bg-midnight-950 border border-midnight-700 text-pixel-muted"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-pixel text-[8px] text-cyan-400 hover:text-white px-2 py-1 bg-midnight-950 border border-midnight-700 active:translate-y-0.5"
                  >
                    <GitBranch size={10} />
                    <span>REPO</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1 font-pixel text-[8px] text-arcade-gold hover:text-white px-2 py-1 bg-midnight-950 border border-midnight-700 active:translate-y-0.5"
                  >
                    <ExternalLink size={10} />
                    <span>DEMO</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-midnight-700 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="px-4 py-2 bg-midnight-800 hover:bg-midnight-700 border-2 border-slate-400 font-pixel text-[10px] text-white shadow-pixel-sm active:translate-y-0.5"
          >
            [CLOSE ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
