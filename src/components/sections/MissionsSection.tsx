import React, { useState, useRef } from 'react';
import {
  Shield,
  GitBranch,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { SectionPixelBuilder } from '../builder/SectionPixelBuilder';
import { REAL_PROJECTS } from '../../data/projects';
import { ProjectQuest } from '../../types';

interface MissionsSectionProps {
  isMuted?: boolean;
}

export const MissionsSection: React.FC<MissionsSectionProps> = ({ isMuted = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'game' | 'ai'>('all');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [inspectedQuest, setInspectedQuest] = useState<ProjectQuest | null>(null);

  const filteredProjects = REAL_PROJECTS.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleCategoryChange = (cat: 'all' | 'web' | 'game' | 'ai') => {
    soundSynth.playButtonPress(isMuted);
    setActiveCategory(cat);
  };

  const handleInspectQuest = (project: ProjectQuest) => {
    soundSynth.playButtonPress(isMuted);
    setInspectedQuest(project);
  };

  const handleCloseInspect = () => {
    soundSynth.playCloseSound(isMuted);
    setInspectedQuest(null);
  };

  return (
    <section
      ref={sectionRef}
      id="missions"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Active Missions"
    >
      {/* Scroll Pixel Builder Overlay */}
      <SectionPixelBuilder containerRef={sectionRef} isMuted={isMuted} />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          data-build="text"
          data-crew="missions-hdr"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b-2 border-midnight-700"
        >
          <div className="flex items-center gap-3">
            <Shield className="text-cyan-400" size={26} />
            <div>
              <h2 className="font-pixel text-sm sm:text-lg text-white tracking-wide">
                ACTIVE MISSIONS // GITHUB QUEST DOSSIER
              </h2>
              <p className="font-sub text-base text-slate-400 mt-0.5">
                Real software engineering deployments from{' '}
                <a
                  href="https://github.com/FerrelHD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-arcade-gold hover:underline inline-flex items-center gap-1"
                >
                  @FerrelHD
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {(
              [
                { id: 'all', label: 'ALL MISSIONS' },
                { id: 'web', label: 'WEB / APPS' },
                { id: 'game', label: '3D & GAME' },
                { id: 'ai', label: 'AI & DATA' },
              ] as const
            ).map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`font-pixel text-[8px] sm:text-[9px] px-2.5 py-1.5 border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-pixel-sm'
                      : 'bg-midnight-900 border-midnight-700 text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Quests Grid (2 Cols on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isHovered = hoveredCardId === project.id;

            return (
              <article
                key={project.id}
                data-build="box"
                data-crew="missions-cards"
                onMouseEnter={() => {
                  setHoveredCardId(project.id);
                  soundSynth.playButtonHover(isMuted);
                }}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`relative bg-midnight-900 border-4 ${
                  isHovered ? 'border-arcade-gold' : 'border-midnight-700'
                } p-5 shadow-pixel transition-all duration-200 flex flex-col justify-between group h-full`}
              >
                {/* Pixel Corner Brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-arcade-gold border border-black" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-arcade-gold border border-black" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-arcade-gold border border-black" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-arcade-gold border border-black" />

                {/* Mini Drone Inspection on Hover */}
                {isHovered && (
                  <div className="absolute -top-6 -right-2 z-30 flex flex-col items-center pointer-events-none animate-in fade-in duration-150">
                    <div className="w-6 h-4 bg-spidey-crimson border border-white flex items-center justify-center shadow-pixel-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
                    </div>
                    {/* Cyan Laser Scan Beam */}
                    <div className="w-1 h-8 bg-cyan-400/50 shadow-[0_0_8px_#38bdf8]" />
                  </div>
                )}

                <div>
                  {/* Top Meta Bar: Rank & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`font-pixel text-[8px] px-2 py-0.5 border font-bold ${
                        project.rank === 'S-CLASS'
                          ? 'bg-amber-950/80 border-arcade-gold text-arcade-gold shadow-[0_0_6px_rgba(250,204,21,0.3)]'
                          : 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      }`}
                    >
                      ★ {project.rank}
                    </span>

                    <span className="font-pixel text-[7px] text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-midnight-950 border border-midnight-800">
                      {project.badge}
                    </span>
                  </div>

                  {/* Retro CRT Monitor Viewport */}
                  <div className="w-full h-32 bg-[#04060c] border-2 border-midnight-700 p-3 mb-4 relative overflow-hidden flex flex-col justify-between group-hover:border-slate-500 transition-colors">
                    {/* CRT Scanline & Radar Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:6px_6px] opacity-40 pointer-events-none" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />

                    {/* Telemetry Status Line */}
                    <div className="relative z-10 flex items-center justify-between text-[8px] font-pixel">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        LIVE TELEMETRY
                      </span>
                      <span className="text-slate-400">#0{filteredProjects.indexOf(project) + 1}</span>
                    </div>

                    {/* Middle Graphic Graphic / Radar Visual */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
                      <span className="font-pixel text-[11px] text-white tracking-wider group-hover:text-arcade-gold transition-colors">
                        {project.title}
                      </span>
                      <span className="font-sub text-xs text-slate-400 mt-0.5">
                        {project.subtitle}
                      </span>
                    </div>

                    {/* Bottom Status Pip */}
                    <div className="relative z-10 flex items-center justify-between pt-1 border-t border-midnight-800 text-[7px] font-pixel text-slate-400">
                      <span>STATUS: {project.status}</span>
                      <span className="text-cyan-400">{project.tech[0]}</span>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="font-sub text-sm text-slate-300 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack Matrix Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-pixel text-[7px] px-1.5 py-0.5 bg-midnight-950 border border-midnight-800 text-slate-400 group-hover:border-midnight-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-col gap-2 pt-3 border-t border-midnight-800">
                  <button
                    type="button"
                    onClick={() => handleInspectQuest(project)}
                    className="w-full py-1.5 px-3 bg-midnight-950 hover:bg-arcade-gold/20 border border-midnight-700 hover:border-arcade-gold font-pixel text-[8px] sm:text-[9px] text-arcade-gold hover:text-white text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Search size={11} />
                    <span>INSPECT QUEST DOSSIER</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundSynth.playButtonPress(isMuted)}
                      className="flex-1 py-1 px-2 bg-midnight-950 hover:bg-spidey-crimson/20 border border-midnight-700 hover:border-spidey-crimson font-pixel text-[8px] text-white text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <GitBranch size={11} className="text-spidey-crimson" />
                      <span>SOURCE</span>
                    </a>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundSynth.playButtonPress(isMuted)}
                        className="flex-1 py-1 px-2 bg-midnight-950 hover:bg-cyan-500/20 border border-midnight-700 hover:border-cyan-400 font-pixel text-[8px] text-cyan-300 hover:text-white text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink size={11} className="text-cyan-400" />
                        <span>TRANSMIT ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Interactive RPG Mission Dossier Modal */}
      {inspectedQuest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in duration-150"
          onClick={handleCloseInspect}
        >
          <div
            className="relative w-full max-w-2xl bg-[#070a14] border-4 border-arcade-gold p-6 sm:p-8 shadow-pixel animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quest-modal-title"
          >
            {/* Corner Brackets */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

            {/* Header Plate */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-midnight-700 mb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-arcade-gold" />
                <span className="font-pixel text-xs text-arcade-gold font-bold">
                  ★ CLASSIFIED MISSION DOSSIER // {inspectedQuest.rank} ★
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseInspect}
                className="w-6 h-6 bg-midnight-900 border border-slate-600 hover:border-spidey-crimson text-slate-300 hover:text-white font-pixel text-xs flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dossier"
              >
                <X size={14} />
              </button>
            </div>

            {/* Quest Details */}
            <div className="space-y-4">
              <div>
                <h3
                  id="quest-modal-title"
                  className="font-pixel text-sm sm:text-base text-white tracking-wide leading-relaxed"
                >
                  {inspectedQuest.title}
                </h3>
                <p className="font-sub text-base text-cyan-400 mt-1">
                  {inspectedQuest.subtitle}
                </p>
              </div>

              {/* Mission Lore Box */}
              <div className="p-3.5 bg-midnight-950 border-2 border-midnight-700 space-y-2">
                <span className="font-pixel text-[8px] text-arcade-gold block tracking-wider">
                  MISSION BRIEFING & ARCHITECTURE:
                </span>
                <p className="font-sub text-base text-slate-300 leading-relaxed">
                  {inspectedQuest.lore}
                </p>
              </div>

              {/* Technologies Deployed */}
              <div>
                <span className="font-pixel text-[8px] text-slate-400 block mb-2 tracking-wider">
                  SYSTEM MODULES & DEPENDENCIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {inspectedQuest.tech.map((t) => (
                    <span
                      key={t}
                      className="font-pixel text-[8px] px-2 py-1 bg-midnight-900 border border-cyan-500/50 text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-midnight-800">
                {inspectedQuest.demoUrl && (
                  <a
                    href={inspectedQuest.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundSynth.playButtonPress(isMuted)}
                    className="w-full sm:flex-1 py-2 px-4 bg-spidey-crimson hover:bg-red-700 border-2 border-white font-pixel text-[9px] text-white text-center flex items-center justify-center gap-2 shadow-pixel-sm transition-all"
                  >
                    <ExternalLink size={13} />
                    <span>LAUNCH LIVE TRANSMISSION</span>
                  </a>
                )}

                <a
                  href={inspectedQuest.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundSynth.playButtonPress(isMuted)}
                  className="w-full sm:flex-1 py-2 px-4 bg-midnight-950 hover:bg-midnight-900 border-2 border-slate-600 hover:border-arcade-gold font-pixel text-[9px] text-white text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <GitBranch size={13} className="text-arcade-gold" />
                  <span>VIEW REPO ON GITHUB</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
