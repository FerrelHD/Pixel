import React, { useState } from 'react';
import { TopHud } from './components/TopHud';
import { HeroSection } from './components/HeroSection';

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
    <div className="relative min-h-screen bg-midnight-950 text-pixel-light flex flex-col overflow-x-hidden">
      {/* Top Retro HUD Navigation */}
      <TopHud
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isCrtOn={isCrtOn}
        onToggleCrt={handleToggleCrt}
        onSpideySenseTrigger={handleTriggerSense}
      />

      {/* Main RPG Hero Stage */}
      <main className="flex-1 flex flex-col">
        <HeroSection
          isMuted={isMuted}
          spiderSenseTriggered={spiderSenseTriggered}
        />
      </main>

      {/* CRT Scanline & Curved Vignette Overlay */}
      {isCrtOn && <div className="crt-overlay crt-flicker" aria-hidden="true" />}
    </div>
  );
};

export default App;
