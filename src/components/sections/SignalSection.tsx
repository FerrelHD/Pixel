import React, { useState, useRef } from 'react';
import { Radio, Mail, Github, MessageSquare, Check, ArrowUp } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';
import { SectionPixelBuilder } from '../builder/SectionPixelBuilder';

interface SignalSectionProps {
  isMuted?: boolean;
}

export const SignalSection: React.FC<SignalSectionProps> = ({ isMuted = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [transmitted, setTransmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ferrelrashad@gmail.com').catch(() => {});
    setCopiedItem('email');
    soundSynth.playButtonPress(isMuted);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSendSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    soundSynth.playButtonPress(isMuted);
    setTransmitted(true);
    setTimeout(() => {
      setMsgInput('');
      setTransmitted(false);
    }, 3000);
  };

  const handleScrollToTop = () => {
    soundSynth.playButtonPress(isMuted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="signal"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Contact Signal"
    >
      {/* Scroll Pixel Builder Overlay */}
      <SectionPixelBuilder containerRef={sectionRef} isMuted={isMuted} />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div
          data-build="text"
          data-crew="signal-hdr"
          className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-midnight-700"
        >
          <Radio className="text-spidey-crimson animate-pulse" size={24} />
          <div>
            <h2 className="font-pixel text-sm sm:text-lg text-white">
              SPIDER-SIGNAL // CONTACT FREQUENCY
            </h2>
            <p className="font-sub text-base text-slate-400 mt-1">
              Transmit a direct frequency for web collaborations, game dev projects, or freelance inquiries.
            </p>
          </div>
        </div>

        {/* Contact Console Box */}
        <div
          data-build="box"
          data-crew="signal-card"
          className="bg-midnight-900 border-4 border-spidey-crimson p-6 sm:p-8 shadow-pixel relative"
        >
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

          {/* Quick Frequencies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            <button
              type="button"
              onClick={handleCopyEmail}
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              className="flex items-center justify-between p-3.5 bg-midnight-950 border-2 border-midnight-700 hover:border-arcade-gold transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-arcade-gold" />
                <div>
                  <span className="font-pixel text-[8px] text-slate-400 block">FREQUENCY 01</span>
                  <span className="font-pixel text-[10px] sm:text-xs text-white group-hover:text-arcade-gold">
                    ferrelrashad@gmail.com
                  </span>
                </div>
              </div>
              <span className="font-pixel text-[8px] text-arcade-gold px-1.5 py-0.5 bg-midnight-900 border border-midnight-700">
                {copiedItem === 'email' ? 'COPIED!' : 'COPY'}
              </span>
            </button>

            <a
              href="https://github.com/FerrelHD"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              onClick={() => soundSynth.playButtonPress(isMuted)}
              className="flex items-center justify-between p-3.5 bg-midnight-950 border-2 border-midnight-700 hover:border-cyan-400 transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <Github size={16} className="text-cyan-400" />
                <div>
                  <span className="font-pixel text-[8px] text-slate-400 block">FREQUENCY 02</span>
                  <span className="font-pixel text-[10px] sm:text-xs text-white group-hover:text-cyan-300">
                    github.com/FerrelHD
                  </span>
                </div>
              </div>
              <span className="font-pixel text-[8px] text-cyan-400 px-1.5 py-0.5 bg-midnight-900 border border-midnight-700">
                OPEN ↗
              </span>
            </a>
          </div>

          {/* Direct Radio Signal Form */}
          <form onSubmit={handleSendSignal} className="space-y-3">
            <label className="block font-pixel text-[9px] text-slate-300">
              DIRECT DISPATCH MESSAGE:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type your transmission here..."
                className="flex-1 bg-midnight-950 border-2 border-midnight-700 focus:border-arcade-gold px-3 py-2 font-pixel text-[10px] text-white focus:outline-none"
              />
              <button
                type="submit"
                onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
                className="px-4 py-2 bg-spidey-crimson hover:bg-red-700 border-2 border-white font-pixel text-[10px] text-white shadow-pixel-sm active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {transmitted ? (
                  <>
                    <Check size={12} />
                    <span>SENT!</span>
                  </>
                ) : (
                  <>
                    <MessageSquare size={12} />
                    <span>DISPATCH</span>
                  </>
                )}
              </button>
            </div>
            {transmitted && (
              <p className="font-pixel text-[8px] text-emerald-400 animate-pulse mt-1">
                ★ TRANSMISSION LOGGED: FREQUENCY RECEIVED OVER THE SPIDER-NETWORK ★
              </p>
            )}
          </form>

          {/* Return To Skyline Rooftop */}
          <div className="mt-8 pt-4 border-t border-midnight-800 flex justify-between items-center">
            <span className="font-pixel text-[8px] text-pixel-muted">
              © 2026 FERREL RASHAD // ALL RIGHTS RESERVED
            </span>
            <button
              type="button"
              onClick={handleScrollToTop}
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              className="flex items-center gap-1.5 font-pixel text-[8px] text-arcade-gold hover:text-white transition-colors cursor-pointer px-2 py-1 bg-midnight-950 border border-midnight-700"
            >
              <ArrowUp size={12} />
              <span>SKYLINE TOP</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
