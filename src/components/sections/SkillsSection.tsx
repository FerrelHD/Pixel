import React from 'react';
import { Zap, Code, Gamepad2, Server, Palette } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { ScrollPixelReveal } from '../builder/ScrollPixelReveal';

interface SkillsSectionProps {
  isMuted?: boolean;
}

interface SkillCluster {
  title: string;
  icon: React.ReactNode;
  accent: string;
  barColor: string;
  skills: { name: string; level: number }[];
}

const SKILL_CLUSTERS: SkillCluster[] = [
  {
    title: 'FRONTEND MASTERY',
    icon: <Code size={18} className="text-emerald-400" />,
    accent: 'border-emerald-500/80',
    barColor: 'bg-emerald-400',
    skills: [
      { name: 'React & Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Framer Motion', level: 85 },
    ],
  },
  {
    title: 'GAME & INTERACTIVE',
    icon: <Gamepad2 size={18} className="text-arcade-gold" />,
    accent: 'border-arcade-gold/80',
    barColor: 'bg-arcade-gold',
    skills: [
      { name: 'HTML5 Canvas API', level: 90 },
      { name: 'Phaser.js / 2D Engines', level: 85 },
      { name: 'Web Audio API Synth', level: 80 },
      { name: 'Game Loops & Physics', level: 85 },
    ],
  },
  {
    title: 'BACKEND ARCHITECTURE',
    icon: <Server size={18} className="text-cyan-400" />,
    accent: 'border-cyan-400/80',
    barColor: 'bg-cyan-400',
    skills: [
      { name: 'Node.js & Express', level: 85 },
      { name: 'REST & GraphQL APIs', level: 85 },
      { name: 'PostgreSQL / SQL', level: 80 },
      { name: 'Server State Management', level: 85 },
    ],
  },
  {
    title: 'RETRO CRAFT & UX',
    icon: <Palette size={18} className="text-spidey-crimson" />,
    accent: 'border-spidey-crimson/80',
    barColor: 'bg-spidey-crimson',
    skills: [
      { name: 'Pixel Art (Aseprite)', level: 85 },
      { name: 'Responsive Layouts', level: 95 },
      { name: 'Accessibility (WCAG AAA)', level: 90 },
      { name: 'Chiptune Sound Design', level: 80 },
    ],
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ isMuted = false }) => {
  return (
    <section
      id="skills"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Skill Tree"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-midnight-700">
          <Zap className="text-emerald-400" size={24} />
          <div>
            <h2 className="font-pixel text-sm sm:text-lg text-white">
              RPG SKILL TREE // TECH MATRIX
            </h2>
            <p className="font-sub text-base text-slate-400 mt-1">
              Proficiency levels across game systems, frontend, backend, and retro aesthetics.
            </p>
          </div>
        </div>

        {/* 4 Quadrants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_CLUSTERS.map((cluster, idx) => (
            <ScrollPixelReveal
              key={cluster.title}
              delay={idx * 120}
              showBotHelper={idx === 1}
            >
              <div
                onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                className={`p-5 bg-midnight-900 border-4 ${cluster.accent} shadow-pixel h-full`}
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-midnight-800">
                  {cluster.icon}
                  <h3 className="font-pixel text-[11px] sm:text-xs text-white font-bold">
                    {cluster.title}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {cluster.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center text-[9px] font-pixel mb-1.5">
                        <span className="text-slate-200">{skill.name}</span>
                        <span className="text-arcade-gold">{skill.level}%</span>
                      </div>
                      {/* Stepped retro meter */}
                      <div className="w-full h-3 bg-midnight-950 border border-midnight-700 p-0.5">
                        <div
                          className={`h-full ${cluster.barColor} transition-all duration-500`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollPixelReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
