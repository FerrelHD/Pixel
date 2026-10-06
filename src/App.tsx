import React, { useState } from 'react';
import { TopHud } from './components/TopHud';
import { HeroSection } from './components/HeroSection';
import { StatusSection } from './components/sections/StatusSection';
import { MissionsSection } from './components/sections/MissionsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { SignalSection } from './components/sections/SignalSection';
import { FlyingSpiderBotCompanion } from './components/companion/FlyingSpiderBotCompanion';

export const App: React.FC = () => {
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
      {/* 1. Sticky Top Retro HUD Navigation */}
      <TopHud
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isCrtOn={isCrtOn}
        onToggleCrt={handleToggleCrt}
        onSpideySenseTrigger={handleTriggerSense}
      />

      {/* 2. Full-Page Scrollable Sections with In-Situ Pixel Build Engine */}
      <main className="flex-1 flex flex-col">
        {/* Section 1: Hero Skyline & Spidey Perch (In-Situ Pixel Build) */}
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

      {/* 3. Interactive Airborne Flying Spider-Bot Companion */}
      <FlyingSpiderBotCompanion isMuted={isMuted} />

      {/* 4. CRT Scanlines & Monitor Vignette Filter */}
      {isCrtOn && <div className="crt-overlay crt-flicker" aria-hidden="true" />}
    </div>
  );
};

export default App;
