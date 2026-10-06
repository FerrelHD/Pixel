import React from 'react';
import { User, Shield, Zap, Radio } from 'lucide-react';
import { ModalType } from '../types';
import { soundSynth } from '../audio/soundEffects';

interface MenuBarProps {
  activeModal: ModalType;
  onOpenModal: (type: ModalType) => void;
  isMuted?: boolean;
}

interface MenuItem {
  id: ModalType;
  label: string;
  sub: string;
  icon: React.ReactNode;
  colorClass: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  activeModal,
  onOpenModal,
  isMuted = false,
}) => {
  const menuItems: MenuItem[] = [
    {
      id: 'status',
      label: 'STATUS',
      sub: 'DEV STATS',
      icon: <User size={15} className="text-arcade-gold" />,
      colorClass: 'border-arcade-gold/80 hover:bg-arcade-gold/15',
    },
    {
      id: 'missions',
      label: 'MISSIONS',
      sub: 'PROJECTS',
      icon: <Shield size={15} className="text-cyan-400" />,
      colorClass: 'border-cyan-400/80 hover:bg-cyan-400/15',
    },
    {
      id: 'skills',
      label: 'SKILLS',
      sub: 'TECH TREE',
      icon: <Zap size={15} className="text-emerald-400" />,
      colorClass: 'border-emerald-400/80 hover:bg-emerald-400/15',
    },
    {
      id: 'signal',
      label: 'SIGNAL',
      sub: 'CONTACT',
      icon: <Radio size={15} className="text-spidey-crimson" />,
      colorClass: 'border-spidey-crimson/80 hover:bg-spidey-crimson/15',
    },
  ];

  const handleClick = (id: ModalType) => {
    soundSynth.playButtonPress(isMuted);
    onOpenModal(id);
  };

  const handleMouseEnter = () => {
    soundSynth.playButtonHover(isMuted);
  };

  return (
    <nav
      className="w-full max-w-4xl mx-auto mt-4 sm:mt-6 select-none"
      aria-label="Retro Command Menu"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {menuItems.map((item) => {
          const isActive = activeModal === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              onMouseEnter={handleMouseEnter}
              className={`relative flex flex-col items-center justify-center p-3 sm:py-4 px-2 bg-midnight-900 border-3 ${item.colorClass} ${
                isActive
                  ? 'bg-midnight-800 translate-y-1 shadow-none border-white'
                  : 'shadow-pixel hover:-translate-y-0.5 active:translate-y-1 active:shadow-none'
              } transition-all duration-100 group min-h-[56px] focus-visible:outline-2 focus-visible:outline-arcade-gold`}
            >
              {/* Corner Pixel Notches */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-midnight-950" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-midnight-950" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-midnight-950" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-midnight-950" />

              {/* Icon & Label */}
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <span className="font-pixel text-[11px] sm:text-xs text-white font-bold tracking-wider group-hover:text-arcade-gold">
                  {item.label}
                </span>
              </div>

              {/* Sub-label */}
              <span className="font-pixel text-[8px] sm:text-[9px] text-pixel-muted">
                [{item.sub}]
              </span>

              {/* Active Pip Indicator */}
              {isActive && (
                <div className="absolute -bottom-1.5 w-3 h-1.5 bg-arcade-gold" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
