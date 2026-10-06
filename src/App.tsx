import React, { useState } from 'react';
import { TopHud } from './components/TopHud';
import { HeroSection } from './components/HeroSection';
import { StatusSection } from './components/sections/StatusSection';
import { MissionsSection } from './components/sections/MissionsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { SignalSection } from './components/sections/SignalSection';
import { SpiderBotsCrewIntro } from './components/builder/SpiderBotsCrewIntro';
import { SpiderBotCompanion } from './components/companion/SpiderBotCompanion';

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCrtOn, setIsCrtOn] = useState(true);
  const [spiderSenseTriggered, setSpiderSenseTriggered] = useState(false);

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleCrt = () => {
    setIsCrtOn((prev) => !prev);
  };

  const handleTriggerSense = () => {
    setSpiderSenseTriggered(true);
    setTimeout(() => setSpiderSenseTriggered(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-midnight-950 text-pixel-light flex flex-col overflow-x-hidden selection:bg-spidey-crimson selection:text-white">
      {/* 1. Spider-Bots Crew Build Intro Sequence */}
      {showIntro && (
        <SpiderBotsCrewIntro
          onComplete={() => setShowIntro(false)}
          isMuted={isMuted}
        />
      )}

      {/* 2. Sticky Top Retro HUD Navigation */}
      <TopHud
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isCrtOn={isCrtOn}
        onToggleCrt={handleToggleCrt}
        onSpideySenseTrigger={handleTriggerSense}
      />

      {/* 3. Full-Page Scrollable Sections */}
      <main className="flex-1 flex flex-col">
        {/* Section 1: Hero Skyline & Spidey Perch */}
        <HeroSection
          isMuted={isMuted}
          spiderSenseTriggered={spiderSenseTriggered}
        />

        {/* Section 2: Character Status (About) */}
        <StatusSection isMuted={isMuted} />

        {/* Section 3: Active Missions (Projects) */}
        <MissionsSection isMuted={isMuted} />

        {/* Section 4: RPG Skill Tree */}
        <SkillsSection isMuted={isMuted} />

        {/* Section 5: Spider-Signal (Contact & Footer) */}
        <SignalSection isMuted={isMuted} />
      </main>

      {/* 4. Interactive Spider-Bot Companion */}
      <SpiderBotCompanion isMuted={isMuted} />

      {/* 5. CRT Scanlines & Monitor Vignette Filter */}
      {isCrtOn && <div className="crt-overlay crt-flicker" aria-hidden="true" />}
    </div>
  );
};

export default App;
