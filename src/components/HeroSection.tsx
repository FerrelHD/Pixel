import React, { useState } from 'react';
import { SkylineBackground } from './SkylineBackground';
import { PixelSpidey } from './PixelSpidey';
import { RpgDialogueBox } from './RpgDialogueBox';
import { MenuBar } from './MenuBar';
import { StatusModal } from './modals/StatusModal';
import { MissionsModal } from './modals/MissionsModal';
import { SkillsModal } from './modals/SkillsModal';
import { SignalModal } from './modals/SignalModal';
import { ModalType } from '../types';

interface HeroSectionProps {
  isMuted: boolean;
  spiderSenseTriggered?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isMuted,
  spiderSenseTriggered = false,
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleOpenModal = (type: ModalType) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <section
      className="relative min-h-[calc(100vh-61px)] flex flex-col justify-between overflow-hidden select-none"
      aria-label="Spidey Pixel Hero Section"
    >
      {/* 1. Layered Retro NYC Night Skyline */}
      <SkylineBackground />

      {/* 2. Character & Skyline Stage Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-4 sm:pt-8 pb-4">
        {/* Pixel Spider-Man Avatar */}
        <div className="relative w-full max-w-4xl flex items-center justify-center my-auto">
          <PixelSpidey
            isMuted={isMuted}
            spiderSenseActive={spiderSenseTriggered}
          />
        </div>
      </div>

      {/* 3. Bottom Retro RPG Console (Dialogue Box + Menu Bar) */}
      <div className="relative z-20 w-full px-3 sm:px-6 pb-6 pt-2 bg-linear-to-t from-midnight-950 via-midnight-950/95 to-transparent">
        {/* 16-Bit RPG Dialogue Box */}
        <RpgDialogueBox isMuted={isMuted} />

        {/* Command Menu Bar */}
        <MenuBar
          activeModal={activeModal}
          onOpenModal={handleOpenModal}
          isMuted={isMuted}
        />
      </div>

      {/* 4. Interactive RPG Modals */}
      <StatusModal
        isOpen={activeModal === 'status'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
      <MissionsModal
        isOpen={activeModal === 'missions'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
      <SkillsModal
        isOpen={activeModal === 'skills'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
      <SignalModal
        isOpen={activeModal === 'signal'}
        onClose={handleCloseModal}
        isMuted={isMuted}
      />
    </section>
  );
};
