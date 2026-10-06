import React, { useEffect } from 'react';
import { X, Zap, Code, Gamepad2, Server, Palette } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted?: boolean;
}

interface SkillGroup {
  category: string;
  icon: React.ReactNode;
  color: string;
  items: { name: string; level: number }[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'FRONTEND MASTERY',
    icon: <Code size={16} className="text-emerald-400" />,
    color: 'border-emerald-500/80',
    items: [
      { name: 'React & Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Framer Motion', level: 85 },
    ],
  },
  {
    category: 'GAME & INTERACTIVE',
    icon: <Gamepad2 size={16} className="text-arcade-gold" />,
    color: 'border-arcade-gold/80',
    items: [
      { name: 'HTML5 Canvas API', level: 90 },
      { name: 'Phaser.js / 2D Engines', level: 85 },
      { name: 'Web Audio API Synth', level: 80 },
      { name: 'Game Physics & Loops', level: 85 },
    ],
  },
  {
    category: 'BACKEND ARCHITECTURE',
    icon: <Server size={16} className="text-cyan-400" />,
    color: 'border-cyan-400/80',
    items: [
      { name: 'Node.js & Express', level: 85 },
      { name: 'REST & GraphQL APIs', level: 85 },
      { name: 'PostgreSQL / SQL', level: 80 },
    ],
  },
  {
    category: 'RETRO CRAFT & UX',
    icon: <Palette size={16} className="text-spidey-crimson" />,
    color: 'border-spidey-crimson/80',
    items: [
      { name: 'Pixel Art (Aseprite)', level: 85 },
      { name: 'Responsive Layouts', level: 95 },
      { name: 'Accessibility (WCAG)', level: 90 },
    ],
  },
];

export const SkillsModal: React.FC<SkillsModalProps> = ({
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
        className="relative w-full max-w-2xl bg-midnight-950 border-4 border-emerald-400 p-4 sm:p-6 shadow-pixel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skills-title"
      >
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        <div className="flex items-center justify-between pb-3 border-b-2 border-midnight-700">
          <div className="flex items-center gap-2">
            <Zap className="text-emerald-400" size={20} />
            <h2 id="skills-title" className="font-pixel text-sm sm:text-base text-white">
              RPG SKILL TREE
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="p-1 text-pixel-muted hover:text-white hover:bg-midnight-800 border border-transparent hover:border-slate-500"
            aria-label="Close skills"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[75vh] overflow-y-auto pr-1">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.category}
              className={`p-3.5 bg-midnight-900 border-2 ${group.color}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {group.icon}
                <h3 className="font-pixel text-[10px] text-white font-bold">
                  {group.category}
                </h3>
              </div>

              <div className="space-y-2.5">
                {group.items.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center text-[9px] font-pixel mb-1">
                      <span className="text-slate-200">{skill.name}</span>
                      <span className="text-arcade-gold">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-midnight-950 border border-midnight-700 p-0.5">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
