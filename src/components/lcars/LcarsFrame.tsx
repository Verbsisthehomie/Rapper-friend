import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ActiveTab, LcarsEra } from '../../types/lcars';
import { LCARS_THEMES, LcarsThemeConfig } from './LcarsTheme';
import { playLcarsChirp, toggleAudioMute, getAudioMutedState, setAudioEra } from '../../utils/lcarsAudio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  ListOrdered,
  BarChart2,
  Orbit,
  Globe2,
  Bookmark,
  GitFork,
  ShieldAlert,
  Layers,
  Music,
  Keyboard,
  Menu,
  X,
  Smartphone,
  Radio,
} from 'lucide-react';
import { VerbsAvatar } from './VerbsAvatar';

interface LcarsFrameProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentEra: LcarsEra;
  onSelectEra: (era: LcarsEra) => void;
  onOpenDevicesGallery?: () => void;
  onOpenShortcuts?: () => void;
  children: React.ReactNode;
}

export const LcarsFrame: React.FC<LcarsFrameProps> = ({
  currentTab,
  onSelectTab,
  currentEra,
  onSelectEra,
  onOpenDevicesGallery,
  onOpenShortcuts,
  children,
}) => {
  const theme: LcarsThemeConfig = LCARS_THEMES[currentEra];
  const [stardate, setStardate] = useState<string>('103829.4');
  const [isMuted, setIsMuted] = useState<boolean>(getAudioMutedState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Generate authentic stardate based on timestamp
    const now = new Date();
    const yearOffset = (now.getFullYear() - 2000) * 1000;
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const sd = (yearOffset + dayOfYear * 2.7 + now.getHours() * 0.1).toFixed(1);
    setStardate(sd);

    setAudioEra(currentEra);
    const interval = setInterval(() => {
      setStardate(prev => (parseFloat(prev) + 0.01).toFixed(2));
    }, 15000);
    return () => clearInterval(interval);
  }, [currentEra]);

  const handleTabClick = (tab: ActiveTab) => {
    playLcarsChirp('tap');
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleEraClick = (era: LcarsEra) => {
    setAudioEra(era);
    playLcarsChirp('warp');
    onSelectEra(era);
  };

  const handleMuteToggle = () => {
    const newState = toggleAudioMute();
    setIsMuted(newState);
    if (!newState) {
      playLcarsChirp('ack');
    }
  };

  const navItems: { id: ActiveTab; label: string; code: string; icon: React.ReactNode }[] = [
    { id: 'analyzer', label: 'BARS ANALYZER', code: '01-919', icon: <BarChart2 className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'song-anatomy', label: 'SONG ANATOMY LAB', code: '02-770', icon: <Music className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'multis', label: 'MULTI-RHYME ENGINE', code: '03-108', icon: <Sparkles className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'pieroot', label: 'PIE ROOT ANCESTRY', code: '04-360', icon: <GitFork className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'holodeck', label: 'HOLODECK CYPHER', code: '05-742', icon: <ShieldAlert className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'devices', label: 'DEVICES CODEX', code: '06-615', icon: <Layers className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'rhyme-evolutions', label: 'RHYME EVOLUTIONS', code: '07-140', icon: <Radio className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'lexicon', label: 'LEXICON MATRIX', code: '07-447', icon: <BookOpen className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'wordlists', label: 'RHYME FAMILIES', code: '08-882', icon: <ListOrdered className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'graph2d', label: '2D ASTROMETRICS', code: '09-320', icon: <Orbit className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'graph3d', label: '3D SUPER-GALAXY', code: '10-771', icon: <Globe2 className="w-3.5 h-3.5 inline mr-1" /> },
    { id: 'vault', label: 'FAVORITES VAULT', code: '11-508', icon: <Bookmark className="w-3.5 h-3.5 inline mr-1" /> },
  ];

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col transition-colors duration-300 font-lcars"
      style={{ backgroundColor: theme.bgDark }}
    >
      {/* --- TOP LCARS HEADER & HORIZONTAL RUNNER (STATIC TOP-LEFT ANCHOR) --- */}
      <header
        className="w-full pt-3 px-3 sm:px-6 sticky top-0 z-40 backdrop-blur-md"
        style={{ backgroundColor: `${theme.bgDark}F2` }}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 border-b-4 pb-2" style={{ borderColor: theme.primary }}>
          
          {/* Main Title Block with Static VerBS Picture in Top-Left */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Static Picture of VerBS with Red Beanie */}
            <VerbsAvatar currentEra={currentEra} size="md" />

            <div
              className="px-4 sm:px-5 py-1.5 rounded-l-full font-bold text-black flex flex-col justify-center shadow-md select-none"
              style={{ backgroundColor: theme.primary }}
            >
              <div className="flex items-center gap-2">
                <span className="tracking-widest text-base sm:text-2xl uppercase font-black leading-tight">
                  RAPPER FRIEND
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-normal bg-black text-amber-400 px-2 py-0.5 rounded-full font-mono-tech whitespace-nowrap">
                  BY VerBS
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest lowercase opacity-95 font-bold leading-none mt-0.5 text-black">
                stay beamed up
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2.5">
              <img
                src="/assets/lcars/sfcmd.png"
                alt="Starfleet Command"
                className="w-7 h-7 object-contain opacity-85 hover:opacity-100 transition-opacity drop-shadow flex-shrink-0"
                title="Starfleet Command Subspace Telemetry // thelcars.com canon"
              />
              <div className="text-xs uppercase tracking-wider font-mono-tech opacity-80">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-black font-bold text-[10px]" style={{ backgroundColor: theme.secondary }}>
                    LCARS {theme.subsystemCode}
                  </span>
                  <span>STARDATE {stardate}</span>
                </div>
                <div className="text-[11px] text-slate-400">POETIC FLOW & ETYMOLOGY SUBSPACE ARRAY</div>
              </div>
            </div>
          </div>

          {/* Action Tools, Era Selectors & Audio Control */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 self-end md:self-center">
            {/* Quick Ref Literary Devices Button */}
            {onOpenDevicesGallery && (
              <button
                onClick={() => {
                  playLcarsChirp('input');
                  onOpenDevicesGallery();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase font-bold tracking-wider rounded-md bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-amber-300 transition-all cursor-pointer shadow-sm"
                title="Open Rhetorical Devices Quick Gallery (Hotkey: D)"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>DEVICES</span>
                <span className="hidden sm:inline text-[9px] bg-black/40 px-1 rounded text-neutral-300">D</span>
              </button>
            )}

            {/* Keyboard Shortcuts Button */}
            {onOpenShortcuts && (
              <button
                onClick={() => {
                  playLcarsChirp('input');
                  onOpenShortcuts();
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-xs uppercase font-bold tracking-wider rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 transition-all cursor-pointer"
                title="Keyboard Shortcuts & Mobile Guide (Hotkey: ?)"
              >
                <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">HOTKEYS</span>
                <span className="text-[10px] bg-black px-1 rounded text-cyan-300 font-mono">?</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button (Visible on mobile screens) */}
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden flex items-center gap-1 px-3 py-1 text-xs uppercase font-bold tracking-wider rounded-md bg-neutral-800 border border-neutral-700 text-amber-400 cursor-pointer min-h-[36px]"
              aria-label="Toggle Mobile Navigation Deck"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>{mobileMenuOpen ? 'CLOSE' : 'MODULES'}</span>
            </button>

            {/* 6 Canon thelcars.com Era Selectors */}
            {([
              { id: 'tng', label: 'TNG 2360', title: 'Classic TNG 2360s (USS Enterprise-D)' },
              { id: 'voyager', label: 'VOY 2370', title: 'Voyager 2370s (USS Voyager)' },
              { id: 'nemesis', label: 'NEMESIS', title: 'Nemesis Blue 2379 (USS Enterprise-E)' },
              { id: 'lowerdecks', label: 'LOWER DECKS', title: 'Lower Decks (USS Cerritos)' },
              { id: 'ldpadd', label: 'LD PADD', title: 'Lower Decks PADD (Handheld Isolum)' },
              { id: 'picard', label: 'PICARD 2401', title: '25th Century Picard (USS Titan-A)' },
            ] as const).map(({ id, label, title }) => (
              <button
                key={id}
                onClick={() => handleEraClick(id)}
                title={title}
                className={`px-2 py-1 text-[11px] sm:text-xs uppercase font-bold tracking-wider rounded-md transition-all cursor-pointer ${
                  currentEra === id
                    ? 'text-black shadow-md scale-105'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-700'
                }`}
                style={currentEra === id ? { backgroundColor: theme.secondary } : {}}
              >
                {label}
              </button>
            ))}

            {/* Mute button */}
            <button
              onClick={handleMuteToggle}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 transition-colors ml-1 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={isMuted ? 'Audio Muted' : 'Audio Active'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- LCARS WORKSPACE LAYOUT WITH CLASSIC ELBOW SIDEBAR --- */}
      <div className="flex-1 flex flex-col md:flex-row px-3 sm:px-6 py-4 gap-4 max-w-[1920px] w-full mx-auto">
        
        {/* Left Side LCARS Navigation Column with Elbow Curve */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
          
          {/* Top Elbow Arch */}
          <div className="hidden md:flex flex-col">
            <div className="flex items-end">
              <div
                className="w-16 h-12 lcars-elbow-top-left"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="flex-1 h-5 rounded-r-full flex items-center px-3"
                style={{ backgroundColor: theme.primary }}
              >
                <span className="text-[10px] text-black font-bold uppercase font-mono-tech tracking-widest">
                  SYS.NAV 001
                </span>
              </div>
            </div>
            <div
              className="w-16 h-8"
              style={{ backgroundColor: theme.primary }}
            />
          </div>

          {/* Mobile Horizontal Quick Tabs (When mobile drawer is closed) */}
          <div className="flex md:hidden overflow-x-auto pb-1 gap-1.5 scrollbar-none">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap min-h-[44px] transition-all cursor-pointer ${
                    isActive
                      ? 'text-black font-extrabold shadow-md'
                      : 'text-neutral-300 bg-neutral-900 border border-neutral-800'
                  }`}
                  style={isActive ? { backgroundColor: theme.primary } : {}}
                >
                  {item.icon}
                  <span>{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Full Nav Buttons: Always visible on desktop (md:flex), toggleable on mobile */}
          <nav
            className={`${
              mobileMenuOpen ? 'flex' : 'hidden'
            } md:flex flex-col gap-2 transition-all`}
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-l-full md:rounded-l-full md:rounded-r-md transition-all text-sm font-bold uppercase tracking-wider text-left min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'text-black font-extrabold translate-x-1 shadow-lg'
                      : 'text-slate-300 hover:text-white bg-slate-900/90 border-l-4 hover:translate-x-0.5'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: theme.primary, borderLeftColor: theme.secondary }
                      : { borderLeftColor: theme.accent }
                  }
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono-tech ml-2 px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/30 text-black' : 'text-slate-400 bg-slate-800'
                    }`}
                  >
                    {item.code}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Subsystem Telemetry Readout Graphic */}
          <div
            className="hidden md:flex flex-col mt-4 p-3 rounded-lg border border-slate-800 font-mono-tech text-xs"
            style={{ backgroundColor: theme.panelBg }}
          >
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800" style={{ color: theme.secondary }}>
              <span className="font-bold">ISOLINEAR MEMORY</span>
              <span>100% ONLINE</span>
            </div>
            <div className="grid grid-cols-4 gap-1 my-2">
              {[47, 82, 19, 93, 31, 65, 42, 88].map((val, idx) => (
                <div
                  key={idx}
                  className="h-4 rounded flex items-center justify-center text-[9px] font-bold text-black"
                  style={{
                    backgroundColor: idx % 3 === 0 ? theme.primary : idx % 3 === 1 ? theme.accent : theme.auxiliary,
                  }}
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <div className="flex justify-between">
                <span>RHYME MATRIX:</span>
                <span className="text-emerald-400">OPTIMAL</span>
              </div>
              <div className="flex justify-between">
                <span>PHONEMIC CORE:</span>
                <span className="text-amber-400">UNRESTRICTED</span>
              </div>
              <div className="flex justify-between">
                <span>PIE ROOT RADIX:</span>
                <span style={{ color: theme.auxiliary }}>COGNATE LINKED</span>
              </div>
            </div>
          </div>

          {/* Bottom Elbow Curve (Decorative) */}
          <div className="hidden md:flex flex-col mt-auto pt-4">
            <div
              className="w-16 h-8"
              style={{ backgroundColor: theme.secondary }}
            />
            <div className="flex items-start">
              <div
                className="w-16 h-12 lcars-elbow-bottom-left"
                style={{ backgroundColor: theme.secondary }}
              />
              <div
                className="flex-1 h-5 rounded-r-full flex items-center px-3"
                style={{ backgroundColor: theme.secondary }}
              >
                <span className="text-[9px] text-black font-bold font-mono-tech">
                  VERBS-ENGINE READY
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Central Content Canvas */}
        <main
          className="flex-1 flex flex-col rounded-2xl border border-slate-800 p-3 sm:p-5 overflow-x-hidden min-h-[680px]"
          style={{ backgroundColor: theme.panelBg }}
        >
          {children}
        </main>
      </div>

      {/* --- LCARS BOTTOM STATUS STRIP --- */}
      <footer className="w-full px-3 sm:px-6 py-2 border-t border-slate-800 text-[11px] font-mono-tech text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
          <span>SUBPROCESS RAPPER-FRIEND // AUTHOR: VerBS // <span className="text-amber-400 font-bold">&ldquo;stay beamed up&rdquo;</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playLcarsChirp('ack');
              setIsCreditsOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-amber-500/60 text-amber-300 font-bold text-xs cursor-pointer transition-all hover:scale-105 shadow-sm"
            title="View Official VerBS Origin Credits & Dedication"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ORIGIN CREDITS</span>
          </button>
          <span className="hidden lg:inline text-slate-500">
            NO METAPHORICAL BOTANY • PURE SEMANTIC MATRIX
          </span>
          <span className="text-amber-500/80">WARP POCKET LOCKED</span>
        </div>
      </footer>

      {/* --- LCARS CREDITS & DEDICATION MODAL --- */}
      {isCreditsOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setIsCreditsOpen(false)}
          >
            <div
              className="relative w-full max-w-xl bg-neutral-950 border-2 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
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
                  <span>VerBS // TRANSMISSION CREDITS & DEDICATION</span>
                </div>
                <button
                  onClick={() => {
                    playLcarsChirp('tap');
                    setIsCreditsOpen(false);
                  }}
                  className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-black cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-neutral-200 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-black border-2 flex-shrink-0" style={{ borderColor: theme.secondary }}>
                    <img src="/assets/aistudio/8531_nobg_1cc449d2.png" alt="VerBS" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-xs text-amber-400 font-mono">STARFLEET SUBSPACE LOG // AUTHOR TRANSMISSION</div>
                    <h3 className="text-xl font-black text-white font-lcars uppercase">RAPPER FRIEND</h3>
                    <div className="text-xs font-mono text-neutral-400 font-bold lowercase">stay beamed up</div>
                  </div>
                </div>

                {/* The Exact User Quote */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative">
                  <div className="text-[11px] font-mono-tech text-amber-400 uppercase tracking-wider mb-2">
                    // OFFICIAL DEDICATION & ORIGIN TRANSMISSION:
                  </div>
                  <p className="text-sm sm:text-base text-neutral-100 font-sans leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
                    &ldquo;you know a nigga love rapping and you  knoooooooow a nigga be a star trek fan since I was 6 years old big shout out to my mother Ms. Belinda Jackson she put me in school and showed me star trek and a reluctant but needed only one time shout out to chris reifer for introducng me to underground rap&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-mono-tech text-neutral-400 pt-2 border-t border-neutral-800/80">
                    <span className="text-white font-bold">— VerBS</span>
                    <span className="text-amber-400 font-bold">stay beamed up 🖖</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] font-mono-tech text-neutral-500 uppercase">
                  LCARS ARCHIVAL LOG 26790 // ACKNOWLEDGED
                </span>
                <button
                  onClick={() => {
                    playLcarsChirp('ack');
                    setIsCreditsOpen(false);
                  }}
                  className="px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-black shadow-md cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: theme.primary }}
                >
                  CLOSE TRANSMISSION
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
