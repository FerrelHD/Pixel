import React, { useEffect } from 'react';
import { X, Shield, ExternalLink, GitBranch } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { REAL_PROJECTS } from '../../data/projects';

interface MissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted?: boolean;
}

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
              ACTIVE MISSIONS &amp; GITHUB QUESTS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="p-1 text-pixel-muted hover:text-white hover:bg-midnight-800 border border-transparent hover:border-slate-500 cursor-pointer"
            aria-label="Close missions"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          {REAL_PROJECTS.map((mission) => (
            <article
              key={mission.id}
              className="p-3.5 bg-midnight-900 border-2 border-midnight-700 hover:border-cyan-400/80 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-midnight-950 border border-arcade-gold text-arcade-gold">
                    {mission.rank}
                  </span>
                  <h3 className="font-pixel text-xs text-cyan-300">
                    {mission.title}
                  </h3>
                </div>
                <span className="font-pixel text-[8px] text-emerald-400 px-1.5 py-0.5 bg-midnight-950 border border-emerald-600">
                  {mission.status}
                </span>
              </div>

              <p className="font-sub text-sm text-slate-300 mt-2 leading-relaxed">
                {mission.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {mission.tech.map((t) => (
                  <span
                    key={t}
                    className="font-pixel text-[7px] px-1.5 py-0.5 bg-midnight-950 border border-midnight-700 text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-3 pt-2 border-t border-midnight-800 text-[8px] font-pixel">
                <a
                  href={mission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundSynth.playButtonPress(isMuted)}
                  className="text-spidey-crimson hover:underline flex items-center gap-1"
                >
                  <GitBranch size={11} />
                  <span>GITHUB REPO</span>
                </a>

                {mission.demoUrl && (
                  <a
                    href={mission.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundSynth.playButtonPress(isMuted)}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={11} />
                    <span>LIVE DEMO ↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
