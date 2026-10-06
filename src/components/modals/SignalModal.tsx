import React, { useState, useEffect } from 'react';
import { X, Radio, Mail, Github, Linkedin, MessageSquare, Check } from 'lucide-react';
import { soundSynth } from '../../audio/soundEffects';

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted?: boolean;
}

export const SignalModal: React.FC<SignalModalProps> = ({
  isOpen,
  onClose,
  isMuted = false,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [transmitted, setTransmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundSynth.playCloseSound(isMuted);
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isMuted]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div
        className="relative w-full max-w-xl bg-midnight-950 border-4 border-spidey-crimson p-4 sm:p-6 shadow-pixel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signal-title"
      >
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white" />
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white" />

        <div className="flex items-center justify-between pb-3 border-b-2 border-midnight-700">
          <div className="flex items-center gap-2">
            <Radio className="text-spidey-crimson animate-pulse" size={20} />
            <h2 id="signal-title" className="font-pixel text-sm sm:text-base text-white">
              SPIDER-SIGNAL TERMINAL
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="p-1 text-pixel-muted hover:text-white hover:bg-midnight-800 border border-transparent hover:border-slate-500"
            aria-label="Close terminal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <p className="font-sub text-lg text-slate-300">
            Transmit a direct frequency to Ferrel Rashad for web collaborations, game dev projects, or freelance inquiries:
          </p>

          {/* Quick Channels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="flex items-center justify-between p-3 bg-midnight-900 border-2 border-midnight-700 hover:border-spidey-crimson text-left active:translate-y-0.5"
            >
              <div className="flex items-center gap-2">
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
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-midnight-900 border-2 border-midnight-700 hover:border-spidey-crimson active:translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <Github size={16} className="text-slate-300" />
                <span className="font-pixel text-[10px] text-white">GITHUB</span>
              </div>
              <span className="font-pixel text-[8px] text-pixel-muted">OPEN ↗</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-midnight-900 border-2 border-midnight-700 hover:border-spidey-crimson active:translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <Linkedin size={16} className="text-cyan-400" />
                <span className="font-pixel text-[10px] text-white">LINKEDIN</span>
              </div>
              <span className="font-pixel text-[8px] text-pixel-muted">OPEN ↗</span>
            </a>

            <div className="flex items-center justify-between p-3 bg-midnight-900 border-2 border-midnight-700">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-400" />
                <span className="font-pixel text-[10px] text-white">DISCORD</span>
              </div>
              <span className="font-pixel text-[8px] text-emerald-400">@ferrel_dev</span>
            </div>
          </div>

          {/* Direct Frequency Broadcast Form */}
          <form onSubmit={handleSendSignal} className="p-3.5 bg-midnight-900 border-2 border-midnight-700">
            <label htmlFor="signal-input" className="block font-pixel text-[9px] text-arcade-gold mb-2">
              SEND QUICK FREQUENCY BROADCAST
            </label>
            <div className="flex gap-2">
              <input
                id="signal-input"
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type your transmission..."
                className="flex-1 bg-midnight-950 border border-midnight-600 px-3 py-2 font-sub text-lg text-white focus:outline-none focus:border-arcade-gold"
              />
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-spidey-crimson hover:bg-red-700 border-2 border-white font-pixel text-[9px] sm:text-[10px] text-white shadow-pixel-sm active:translate-y-0.5 shrink-0"
              >
                BROADCAST
              </button>
            </div>
            {transmitted && (
              <div className="flex items-center gap-1.5 mt-2 text-emerald-400 font-pixel text-[9px]">
                <Check size={12} />
                <span>SIGNAL RECEIVED! I WILL RESPOND VIA WEB TRANSMISSION.</span>
              </div>
            )}
          </form>
        </div>

        <div className="mt-4 pt-3 border-t border-midnight-700 flex justify-end">
          <button
            type="button"
            onClick={() => {
              soundSynth.playCloseSound(isMuted);
              onClose();
            }}
            className="px-4 py-2 bg-midnight-800 hover:bg-midnight-700 border-2 border-slate-400 font-pixel text-[10px] text-white shadow-pixel-sm active:translate-y-0.5"
          >
            [CLOSE ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
