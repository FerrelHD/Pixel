import React from 'react';
import { Shield, GitBranch, ExternalLink } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';

interface MissionsSectionProps {
  isMuted?: boolean;
}

interface ProjectCard {
  id: string;
  title: string;
  badge: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
  description: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
  accentColor: string;
}

const PROJECTS: ProjectCard[] = [
  {
    id: 'spidey-pixel',
    title: 'SPIDEY PIXEL RETRO PORTFOLIO',
    badge: 'WEB EXPERIENCE',
    status: 'COMPLETED',
    description: '16-bit retro RPG portfolio featuring custom NYC skyline canvas, handcrafted pixel Spider-Man sprite, typewriter dialogue, and procedural 8-bit sound synthesis.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
    repoUrl: 'https://github.com/FerrelHD/Pixel',
    demoUrl: '#hero',
    accentColor: 'border-spidey-crimson text-spidey-crimson',
  },
  {
    id: 'platformer-engine',
    title: 'RETRO 2D PLATFORMER ENGINE',
    badge: 'GAME DEV',
    status: 'IN_PROGRESS',
    description: 'Tile-based 2D physics engine featuring sprite-sheet animations, collision detection, smooth momentum jumps, and procedural audio synthesis.',
    tech: ['TypeScript', 'HTML5 Canvas', 'Game Physics', 'Web Audio API'],
    repoUrl: 'https://github.com/FerrelHD',
    accentColor: 'border-arcade-gold text-arcade-gold',
  },
  {
    id: 'dev-command-center',
    title: 'DEV COMMAND CENTER',
    badge: 'FULLSTACK ENGINE',
    status: 'COMPLETED',
    description: 'Interactive mission dashboard for indie developers featuring quest logs, pixel-art metrics, and modular API endpoints.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    repoUrl: 'https://github.com/FerrelHD',
    accentColor: 'border-cyan-400 text-cyan-400',
  },
];

export const MissionsSection: React.FC<MissionsSectionProps> = ({ isMuted = false }) => {
  return (
    <section
      id="missions"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Active Missions"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-midnight-700">
          <Shield className="text-cyan-400" size={24} />
          <div>
            <h2 className="font-pixel text-sm sm:text-lg text-white">
              ACTIVE MISSIONS // FEATURED QUESTS
            </h2>
            <p className="font-sub text-base text-slate-400 mt-1">
              Select a mission log to inspect source code and live transmissions.
            </p>
          </div>
        </div>

        {/* Project Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              className="bg-midnight-900 border-4 border-midnight-700 hover:border-cyan-400 p-5 shadow-pixel transition-all duration-150 flex flex-col justify-between group"
            >
              <div>
                {/* Card Screen Frame */}
                <div className="w-full h-32 bg-midnight-950 border-2 border-midnight-800 p-2 mb-4 relative overflow-hidden flex flex-col items-center justify-center">
                  {/* Subtle pixel grid texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />

                  {/* Icon representation */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="font-pixel text-[10px] text-white tracking-widest text-center px-2 py-1 bg-midnight-900/90 border border-midnight-600 mb-1">
                      {project.badge}
                    </span>
                    <span className="font-sub text-sm text-arcade-gold">
                      SECTOR ACTIVE
                    </span>
                  </div>

                  {/* Status Pip */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`font-pixel text-[7px] px-1.5 py-0.5 border ${
                        project.status === 'COMPLETED'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                          : 'bg-amber-950 border-amber-500 text-amber-400'
                      }`}
                    >
                      [{project.status}]
                    </span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="font-pixel text-xs text-white group-hover:text-cyan-300 transition-colors leading-relaxed">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="font-sub text-base text-slate-300 mt-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Card Footer: Tech tags and links */}
              <div className="mt-5 pt-3 border-t border-midnight-800">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="font-pixel text-[7px] px-1.5 py-0.5 bg-midnight-950 border border-midnight-700 text-pixel-muted"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundSynth.playButtonPress(isMuted)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-midnight-950 hover:bg-midnight-800 border-2 border-slate-600 text-slate-200 font-pixel text-[8px] active:translate-y-0.5 transition-transform"
                  >
                    <GitBranch size={11} />
                    <span>REPO</span>
                  </a>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      onClick={() => soundSynth.playButtonPress(isMuted)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-spidey-crimson hover:bg-red-700 border-2 border-white text-white font-pixel text-[8px] active:translate-y-0.5 transition-transform"
                    >
                      <ExternalLink size={11} />
                      <span>DEMO</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
