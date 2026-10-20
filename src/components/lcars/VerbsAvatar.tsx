import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from './LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { Sparkles, X, ZoomIn, CheckCircle2 } from 'lucide-react';

interface VerbsAvatarProps {
  currentEra: LcarsEra;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatusIndicator?: boolean;
}

// Exact uploaded authentic avatar file as is
export const VERBS_OFFICIAL_AVATAR = '/assets/aistudio/8531_nobg_1cc449d2.png';

export const VerbsAvatar: React.FC<VerbsAvatarProps> = ({
  currentEra,
  size = 'md',
  className = '',
  showStatusIndicator = true,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-verbs-avatar-deck', handleOpenModal);
    return () => window.removeEventListener('open-verbs-avatar-deck', handleOpenModal);
  }, []);

  const pxSize = size === 'sm' ? 44 : size === 'md' ? 56 : 80;

  return (
    <>
      {/* Static Top-Left Avatar Display Anchor */}
      <div
        onClick={() => {
          playLcarsChirp('input');
          setIsModalOpen(true);
        }}
        style={{ width: `${pxSize}px`, height: `${pxSize}px` }}
        className={`relative flex-shrink-0 group cursor-pointer ${className}`}
        title="VerBS Official Avatar // Click to View Full Size"
        aria-label="VerBS Artist Profile Avatar"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
      >
        {/* Outer LCARS Shield Halo */}
        <div
          className="relative w-full h-full rounded-full p-0.5 transition-transform duration-200 group-hover:scale-105 shadow-lg flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, #E11D48 50%, ${theme.accent} 100%)`,
            boxShadow: `0 0 16px ${theme.primary}60`,
          }}
        >
          {/* Inner circle hosting the authentic image as is */}
          <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center overflow-hidden relative">
            <img
              src={VERBS_OFFICIAL_AVATAR}
              alt="VerBS Official Avatar"
              className="w-full h-full object-contain p-0.5 transition-transform duration-200 group-hover:scale-110"
              loading="eager"
            />

            {/* Subtle Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-white drop-shadow" />
            </div>
          </div>
        </div>

        {/* Mini LCARS Active Status Blip */}
        {showStatusIndicator && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black flex items-center justify-center shadow-md animate-pulse"
            style={{ backgroundColor: theme.primary }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
          </span>
        )}
      </div>

      {/* --- LCARS OFFICIAL AVATAR MODAL (FULL RESOLUTION AS IS) --- */}
      {isModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative w-full max-w-lg bg-neutral-950 border-2 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ borderColor: theme.primary }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="px-5 py-3.5 flex items-center justify-between text-black font-bold tracking-widest text-sm sm:text-base uppercase"
                style={{ backgroundColor: theme.primary }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>VerBS // OFFICIAL ARTIST PROFILE</span>
                </div>
                <button
                  onClick={() => {
                    playLcarsChirp('tap');
                    setIsModalOpen(false);
                  }}
                  className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-black cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 text-neutral-200 text-sm flex flex-col items-center text-center">
                {/* Full Resolution Image Container */}
                <div
                  className="w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 flex items-center justify-center shadow-2xl relative"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, #E11D48, ${theme.accent})`,
                    boxShadow: `0 0 35px ${theme.primary}50`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-neutral-950/90 flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={VERBS_OFFICIAL_AVATAR}
                      alt="VerBS"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase text-black"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      AUTHENTIC UPLOAD
                    </span>
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% UNTOUCHED FIDELITY
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wider font-lcars uppercase">
                    VerBS with Red Beanie
                  </h3>
                  <div className="text-xs font-mono text-amber-400 font-bold tracking-widest lowercase">
                    stay beamed up
                  </div>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Official original artwork loaded as is across the LCARS Rapper Friend interface.
                  </p>

                  {/* VerBS Transmission Credits & Origin Dedication */}
                  <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-left space-y-2 mt-3">
                    <div className="flex items-center justify-between text-[10px] font-mono-tech text-amber-400 uppercase tracking-wider">
                      <span>// ORIGIN TRANSMISSION & CREDITS</span>
                      <span className="text-neutral-500">STARDATE CANON</span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-100 font-sans italic leading-relaxed border-l-2 border-amber-500 pl-3">
                      &ldquo;you know a nigga love rapping and you  knoooooooow a nigga be a star trek fan since I was 6 years old big shout out to my mother Ms. Belinda Jackson she put me in school and showed me star trek and a reluctant but needed only one time shout out to chris reifer for introducng me to underground rap&rdquo;
                    </p>
                    <div className="text-[10px] text-neutral-400 font-mono-tech flex items-center justify-between pt-1 border-t border-neutral-800">
                      <span className="text-white font-bold">— VerBS</span>
                      <span className="text-amber-400">stay beamed up</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] font-mono-tech text-neutral-500 uppercase">
                  LCARS AVATAR SUBSYSTEM ACTIVE
                </span>
                <button
                  onClick={() => {
                    playLcarsChirp('ack');
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-black shadow-md cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: theme.primary }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
