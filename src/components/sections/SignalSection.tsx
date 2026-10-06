import React, { useState } from 'react';
import { Radio, Mail, Github, Linkedin, MessageSquare, Check, ArrowUp } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';

interface SignalSectionProps {
  isMuted?: boolean;
}

export const SignalSection: React.FC<SignalSectionProps> = ({ isMuted = false }) => {
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
      id="signal"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 bg-midnight-950 border-t-4 border-midnight-700 select-none scroll-mt-14"
      aria-label="Contact Signal"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-midnight-700">
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
        <div className="bg-midnight-900 border-4 border-spidey-crimson p-6 sm:p-8 shadow-pixel relative">
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
              className="flex items-center justify-between p-3.5 bg-midnight-950 border-2 border-midnight-700 hover:border-spidey-crimson text-left active:translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-spidey-crimson" />
                <span className="font-pixel text-[10px] text-white">
                  EMAIL DIRECT
                </span>
              </div>
              <span className="font-pixel text-[8px] text-arcade-gold">
                {copiedItem === 'email' ? 'COPIED!' : 'COPY'}
              </span>
            </button>

            <a
              href="https://github.com/FerrelHD"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              onClick={() => soundSynth.playButtonPress(isMuted)}
              className="flex items-center justify-between p-3.5 bg-midnight-950 border-2 border-midnight-700 hover:border-spidey-crimson active:translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <Github size={16} className="text-slate-300" />
                <span className="font-pixel text-[10px] text-white">GITHUB</span>
              </div>
              <span className="font-pixel text-[8px] text-pixel-muted">OPEN ↗</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              onClick={() => soundSynth.playButtonPress(isMuted)}
              className="flex items-center justify-between p-3.5 bg-midnight-950 border-2 border-midnight-700 hover:border-spidey-crimson active:translate-y-0.5 transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <Linkedin size={16} className="text-cyan-400" />
                <span className="font-pixel text-[10px] text-white">LINKEDIN</span>
              </div>
              <span className="font-pixel text-[8px] text-pixel-muted">OPEN ↗</span>
            </a>

            <div
              onMouseEnter={() => soundSynth.playButtonHover(isMuted)}
              className="flex items-center justify-between p-3.5 bg-midnight-950 border-2 border-midnight-700"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare size={16} className="text-emerald-400" />
                <span className="font-pixel text-[10px] text-white">DISCORD</span>
              </div>
              <span className="font-pixel text-[8px] text-emerald-400">@ferrel_dev</span>
            </div>
          </div>

          {/* Direct Frequency Broadcast Form */}
          <form
            onSubmit={handleSendSignal}
            className="p-4 bg-midnight-950 border-2 border-midnight-700"
          >
            <label
              htmlFor="broadcast-msg"
              className="block font-pixel text-[9px] sm:text-[10px] text-arcade-gold mb-2"
            >
              SEND FREQUENCY BROADCAST
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="broadcast-msg"
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type your message for Ferrel..."
                className="flex-1 bg-midnight-900 border border-midnight-600 px-3 py-2 font-sub text-lg text-white focus:outline-none focus:border-arcade-gold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-spidey-crimson hover:bg-red-700 border-2 border-white font-pixel text-[10px] text-white shadow-pixel-sm active:translate-y-0.5 transition-transform shrink-0"
              >
                BROADCAST
              </button>
            </div>
            {transmitted && (
              <div className="flex items-center gap-1.5 mt-2.5 text-emerald-400 font-pixel text-[9px]">
                <Check size={12} />
                <span>SIGNAL RECEIVED! I WILL RESPOND VIA WEB TRANSMISSION.</span>
              </div>
            )}
          </form>
        </div>

        {/* Retro Footer */}
        <footer className="mt-12 pt-6 border-t border-midnight-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-pixel text-[8px] sm:text-[9px] text-pixel-muted">
            FERREL RASHAD // FRIENDLY NEIGHBORHOOD WEB &amp; GAME DEV
          </p>
          <button
            type="button"
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight-900 hover:bg-midnight-800 border-2 border-slate-600 text-arcade-gold font-pixel text-[8px] sm:text-[9px] shadow-pixel-sm active:translate-y-0.5"
          >
            <ArrowUp size={11} />
            <span>TOP ROOFTOP</span>
          </button>
        </footer>
      </div>
    </section>
  );
};
