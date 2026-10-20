import React from 'react';
import { LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { Command, X, Smartphone, Keyboard, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  currentEra: LcarsEra;
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  currentEra,
  isOpen,
  onClose,
}) => {
  const theme = LCARS_THEMES[currentEra];
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1', desc: 'Jump to Lexicon Matrix' },
    { key: '2', desc: 'Jump to Rhyme Families' },
    { key: '3', desc: 'Jump to Bar Analyzer (Real-time Syllables & Meter)' },
    { key: '4', desc: 'Jump to Song Anatomy Lab (Song/Link Deconstruction)' },
    { key: '5', desc: 'Jump to Multi-Rhyme Engine' },
    { key: '6', desc: 'Jump to PIE Roots & Etymology Subspace' },
    { key: '7', desc: 'Jump to Holodeck Rhyme Challenge' },
    { key: '8', desc: 'Jump to Rhetorical Devices Codex' },
    { key: '9', desc: 'Jump to 2D Rhyme Constellation' },
    { key: '0', desc: 'Jump to 3D Astrometric Graph' },
    { key: 'V', desc: 'Jump to Favorites Vault' },
    { key: 'D', desc: 'Toggle Quick Reference Devices Gallery' },
    { key: 'A', desc: 'Open VerBS Avatar Deck (Upload / Change Photo As Is)' },
    { key: 'M', desc: 'Toggle LCARS Audio Sound Effects (Mute / Unmute)' },
    { key: 'R', desc: 'Draw Random Rare Emotion or Rare Color Word' },
    { key: 'Space', desc: 'Play / Pause Song Audio or Metronome (when outside inputs)' },
    { key: '?', desc: 'Toggle this LCARS Keyboard Shortcuts & Mobile Guide' },
    { key: 'Esc', desc: 'Close any active modal or drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-2xl border-2 overflow-hidden shadow-2xl bg-neutral-950 font-mono"
        style={{ borderColor: theme.primary }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b text-black font-bold tracking-wider"
          style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-black" />
            <span className="text-base font-black tracking-widest uppercase">
              LCARS INTERFACE HOTKEYS & MOBILE GESTURES
            </span>
          </div>
          <button
            onClick={() => {
              playLcarsChirp('input');
              onClose();
            }}
            className="p-1 hover:bg-black/20 rounded-lg transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Keyboard Hotkeys Grid */}
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-3 flex items-center gap-2">
              <Command className="w-4 h-4" />
              <span>Keyboard Telemetry Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {shortcuts.map(sc => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between bg-neutral-900/80 border border-neutral-800 p-2.5 rounded-lg hover:border-neutral-700 transition"
                >
                  <span className="text-neutral-300 font-sans">{sc.desc}</span>
                  <kbd className="px-2 py-1 bg-black text-amber-300 border border-amber-900/50 rounded font-bold shadow-inner text-xs min-w-[28px] text-center">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* iOS & Android Compatibility Section */}
          <div className="bg-neutral-900/90 border border-cyan-900/60 p-4 rounded-xl space-y-3">
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>iOS & Android Mobile Operation Protocols</span>
            </div>
            <div className="text-xs text-neutral-300 space-y-2 leading-relaxed font-sans">
              <p>
                • <strong className="text-white">Responsive Touch Drawer:</strong> Tap the top-left menu pill on iPhone/Android to slide open the complete 11-module LCARS command deck.
              </p>
              <p>
                • <strong className="text-white">Direct Audio Upload:</strong> Tap "Upload Song / Audio File" to open native iOS Files / Android Document Picker with instant waveform decoding.
              </p>
              <p>
                • <strong className="text-white">Rhyme Family Tap-to-Inspect:</strong> Tap any rhyming syllable in Song Anatomy to instantly spotlight its matching rhyme family across the verse.
              </p>
              <p>
                • <strong className="text-white">Safe-Area Insets & 48px Touch Targets:</strong> Fully optimized for edge-to-edge iOS dynamic islands, Android navigation gestures, and thumb-friendly typing.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-900 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
          <span>Starfleet LCARS Cadence Telemetry v3.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold cursor-pointer"
          >
            Acknowledge [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};
