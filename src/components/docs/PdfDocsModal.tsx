import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  FileText,
  Download,
  X,
  Layers,
  Cpu,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Volume2,
  Database,
  Terminal,
} from 'lucide-react';

interface PdfDocsModalProps {
  currentEra: LcarsEra;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfDocsModal: React.FC<PdfDocsModalProps> = ({
  currentEra,
  isOpen,
  onClose,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [activeDocTab, setActiveDocTab] = useState<'pitch' | 'specs'>('pitch');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (filename: string, docType: string) => {
    playLcarsChirp('warp');
    const link = document.createElement('a');
    link.href = `/docs/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Downloaded ${docType} to your device`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto font-lcars animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-950 border-2 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ borderColor: theme.primary }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top LCARS Header */}
        <div
          className="px-5 py-3.5 flex items-center justify-between text-black font-bold tracking-widest text-sm sm:text-base uppercase"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>STARFLEET SUBSPACE DOCUMENTATION ARCHIVE // 07-PDF</span>
          </div>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-black cursor-pointer"
            title="Close Documentation Archive"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Document Switcher Bar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex rounded-full bg-black p-1 border border-slate-800 text-xs shrink-0 self-start">
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setActiveDocTab('pitch');
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDocTab === 'pitch'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              PITCH DECK PDF (5 PAGES)
            </button>
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setActiveDocTab('specs');
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDocTab === 'specs'
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-cyan-300/80 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              TECHNICAL SPECS PDF (5 PAGES)
            </button>
          </div>

          {/* Quick PDF Download Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {downloadSuccess && (
              <span className="text-xs text-emerald-400 font-mono-tech flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {downloadSuccess}
              </span>
            )}
            <button
              onClick={() =>
                handleDownload(
                  'Rapper_Friend_Pitch_Deck.pdf',
                  'Rapper Friend Pitch Deck PDF'
                )
              }
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD PITCH DECK
            </button>
            <button
              onClick={() =>
                handleDownload(
                  'Rapper_Friend_Technical_Specs.pdf',
                  'Technical Specs PDF'
                )
              }
              className="px-3 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-transform hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD TECH SPECS
            </button>
          </div>
        </div>

        {/* Scrollable Document Interactive Preview */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm font-sans flex-1">
          {/* ================================================================ */}
          {/* TAB 1: PITCH DECK INTERACTIVE PREVIEW */}
          {/* ================================================================ */}
          {activeDocTab === 'pitch' && (
            <div className="space-y-6 font-lcars">
              {/* Cover Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/50 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono-tech text-amber-400 font-bold uppercase mb-1">
                      EXECUTIVE PITCH DECK // 01-ALPHA
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-wider">
                      RAPPER FRIEND
                    </h2>
                    <div className="text-sm font-mono-tech text-cyan-300 font-bold mt-1">
                      STAY BEAMED UP // ART-RAP CADENCE COMPILER
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans mt-3 max-w-2xl leading-relaxed">
                      The premier Starfleet LCARS-26 Subspace Operating System for lyricists, MCs, and wordsmiths. Bridging Golden Era hip-hop craftsmanship, 12 divergent global rhyme traditions, real-time phonemic compilation, and zero-latency Web Audio beat production.
                    </p>
                  </div>
                  <img
                    src="/assets/aistudio/8531_nobg_1cc449d2.png"
                    alt="VerBS Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0 hidden sm:block"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[10px] font-mono-tech text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                    REACT 19 + TYPESCRIPT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold">
                    WEB AUDIO API PROCEDURAL ENGINE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-400/20 text-purple-300 font-bold">
                    12 RHYME DISCIPLINES
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">
                    400,000+ LEXICON
                  </span>
                </div>
              </div>

              {/* Slide 2: The Problem & Creative Void */}
              <div className="space-y-3">
                <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  SLIDE 02 // THE MARKET PROBLEM & THE CREATIVE VOID
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-bold text-xs uppercase font-mono-tech">
                      01. Flat Single-Syllable Tools
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Standard rhyming dictionaries only match the final terminal syllable (e.g. cat/hat), completely failing complex multisyllabic lyricism (e.g. "obsidian stone" ↔ "top of the throne").
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="text-cyan-400 font-bold text-xs uppercase font-mono-tech">
                      02. Monolithic Regional Bias
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Mainstream tools ignore London MLE glottal stops, UK Grime 140 BPM reload mechanics, Southern monophthong drawl, and West African tonal clavés.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="text-purple-400 font-bold text-xs uppercase font-mono-tech">
                      03. Fragmented Creative Workflow
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      MCs bounce between browser tabs, notes apps, metronomes, and YouTube beat streams, fragmenting the flow state and killing momentum.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide 3: The Solution */}
              <div className="space-y-3">
                <div className="text-xs font-mono-tech uppercase font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  SLIDE 03 // THE SOLUTION: SUBSPACE RHYME LABORATORY
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Rapper Friend unites real-time phonemic compilation, 12 regional rhyming traditions, 400,000+ words across Proto-Indo-European (PIE) etymology, and zero-latency Web Audio beat production into an integrated, beautiful LCARS interface.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs font-mono-tech">
                    <div className="p-2 rounded bg-black/60 border border-slate-800">
                      <div className="text-lg font-bold text-amber-400">12</div>
                      <div className="text-[10px] text-slate-400">BEAT STYLES</div>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-slate-800">
                      <div className="text-lg font-bold text-cyan-400">12</div>
                      <div className="text-[10px] text-slate-400">DISCIPLINES</div>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-slate-800">
                      <div className="text-lg font-bold text-emerald-400">400K+</div>
                      <div className="text-[10px] text-slate-400">DICTIONARY</div>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-slate-800">
                      <div className="text-lg font-bold text-purple-400">0ms</div>
                      <div className="text-[10px] text-slate-400">AUDIO LATENCY</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 4: 8 Flagship Subsystems */}
              <div className="space-y-3">
                <div className="text-xs font-mono-tech uppercase font-bold text-cyan-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  SLIDE 04 // 8 FLAGSHIP LCARS SUBSYSTEMS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-amber-400 block">01. BAR ANALYZER (01-942)</strong>
                    Real-time syllable counting, density scores, scheme wizard, and literary device scanner.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-cyan-400 block">02. RHYME EVOLUTIONS (07-140)</strong>
                    12 global disciplines, 16-step beat grids, forensic bar dissections, and IPA shift rules.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-emerald-400 block">03. BEAT DECK & FLOW STUDIO</strong>
                    12 procedural instrumentals, 16-step swing beat maker, and custom MP3/WAV uploader.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-purple-400 block">04. UNIVERSAL LEXICON (08-400)</strong>
                    301-entry curated canon + 400,000-word fallback dictionary and PIE root tree.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-amber-300 block">05. MULTISYLLABIC ENGINE (03-512)</strong>
                    Compound 3-to-6 syllable vowel chord matching across mosaic boundaries.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-sky-400 block">06. 2D & 3D FORCE GRAPHS (09/10)</strong>
                    Interactive Three.js WebGL and Canvas2D semantic graph visualizers.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-rose-400 block">07. SONG ANATOMY LAB (02-771)</strong>
                    16-bar verse, hook, bridge, and intro blueprint arranger.
                  </div>
                  <div className="p-3 rounded-lg bg-black/50 border border-slate-800">
                    <strong className="text-teal-400 block">08. FAVORITES VAULT</strong>
                    Offline persistent phrase storage linked with ancestral etymological roots.
                  </div>
                </div>
              </div>

              {/* Slide 5: Cultural Dedication */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                <div className="text-[11px] font-mono-tech text-amber-400 uppercase font-bold">
                  // OFFICIAL DEDICATION & ORIGIN TRANSMISSION:
                </div>
                <p className="text-xs sm:text-sm italic font-sans border-l-2 border-amber-400 pl-3 py-1">
                  &ldquo;you know a nigga love rapping and you knooooooow a nigga be a star trek fan since I was 6 years old big shout out to my mother Ms. Belinda Jackson she put me in school and showed me star trek and a reluctant but needed only one time shout out to chris reifer for introducng me to underground rap&rdquo;
                </p>
                <div className="text-[11px] font-mono-tech text-right text-amber-400 font-bold">
                  — VerBS // stay beamed up 🖖
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: TECHNICAL SPECIFICATIONS INTERACTIVE PREVIEW */}
          {/* ================================================================ */}
          {activeDocTab === 'specs' && (
            <div className="space-y-6 font-lcars">
              {/* Cover Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/50">
                <div className="text-xs font-mono-tech text-cyan-400 font-bold uppercase mb-1">
                  ENGINEERING SPECIFICATIONS // 01-SYS
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wider">
                  RAPPER FRIEND TECHNICAL SPECIFICATIONS
                </h2>
                <div className="text-xs font-mono-tech text-amber-300 font-bold mt-1">
                  SUBSYSTEM ARCHITECTURES, AUDIO TOPOLOGY, PHONEMIC AST & PERSISTENCE SCHEMAS
                </div>
                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  Comprehensive architectural breakdown of the client-side execution environment, Web Audio API procedural synthesis, phonemic AST compilation, IndexedDB schemas, and benchmark metrics.
                </p>
              </div>

              {/* Spec Section 1: System Stack */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  1. ARCHITECTURAL STACK & RUNTIME PROFILE
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
                    <thead className="bg-slate-900 text-amber-400 font-mono-tech uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Subsystem</th>
                        <th className="p-2.5">Technology</th>
                        <th className="p-2.5">Specification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold text-white">Frontend Runtime</td>
                        <td className="p-2 text-cyan-300 font-mono-tech">React 19.0.1 + Vite 8.3.0</td>
                        <td className="p-2">Zero-telemetry client SPA with fast HMR</td>
                      </tr>
                      <tr className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold text-white">Typing System</td>
                        <td className="p-2 text-cyan-300 font-mono-tech">TypeScript 7.0.2 (ESNext)</td>
                        <td className="p-2">Strict typing across phonemes, beats, and LCARS themes</td>
                      </tr>
                      <tr className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold text-white">Procedural Audio</td>
                        <td className="p-2 text-cyan-300 font-mono-tech">Native Web Audio API</td>
                        <td className="p-2">OscillatorNode, BiquadFilter, AnalyserNode, AudioBuffer</td>
                      </tr>
                      <tr className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold text-white">Local Persistence</td>
                        <td className="p-2 text-cyan-300 font-mono-tech">IndexedDB + LocalStorage</td>
                        <td className="p-2">Custom audio Blobs in IndexedDB; phrases in LocalStorage</td>
                      </tr>
                      <tr className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold text-white">3D Visualization</td>
                        <td className="p-2 text-cyan-300 font-mono-tech">Three.js 0.186.1 + WebGL</td>
                        <td className="p-2">Force-directed node graph with OrbitControls</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Spec Section 2: Audio Synthesizer Engineering */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono-tech uppercase font-bold text-cyan-400 flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5" />
                  2. PROCEDURAL WEB AUDIO SYNTHESIZER OSCILLATOR SPECS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <strong className="text-amber-400 font-mono-tech block uppercase">
                      Kick & 808 Sub-Bass
                    </strong>
                    <p className="text-slate-300 font-sans">
                      Sine wave oscillator at 145 Hz decaying exponentially to 42–48 Hz in 90ms, tailing to 32 Hz over 240–420ms. Portamento glide executed via exponentialRampToValueAtTime.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <strong className="text-cyan-400 font-mono-tech block uppercase">
                      Snare, Clap & Rimshot
                    </strong>
                    <p className="text-slate-300 font-sans">
                      White noise burst AudioBuffer passed through a BiquadFilter (highpass 750–1400 Hz) layered with an acoustic body triangle oscillator sweeping from 195 Hz down to 110 Hz.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <strong className="text-purple-400 font-mono-tech block uppercase">
                      Hi-Hats & 3x Triplet Rolls
                    </strong>
                    <p className="text-slate-300 font-sans">
                      Closed/open hats generated with exponential noise envelopes filtered at 6.8 kHz. Triplet rolls schedule 3 micro-bursts at t, t+0.33*step, and t+0.66*step.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 font-mono-tech block uppercase">
                      MPC Swing Mathematics
                    </strong>
                    <p className="text-slate-300 font-sans">
                      baseStepMs = (60/BPM/4)*1000. Odd 16th steps are shifted by +(baseStepMs * swingFactor) while even steps are compressed by -(baseStepMs * swingFactor).
                    </p>
                  </div>
                </div>
              </div>

              {/* Spec Section 3: IndexedDB Schema */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono-tech uppercase font-bold text-emerald-400 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  3. PERSISTENT STORAGE SCHEMAS (INDEXED-DB & LOCALSTORAGE)
                </div>
                <pre className="p-3.5 rounded-xl bg-black border border-slate-800 font-mono-tech text-xs text-cyan-300 overflow-x-auto">
{`Database: "rapper_friend_instrumentals_db" (v1)
ObjectStore: "custom_beats" (keyPath: "id")

interface CustomUploadedBeat {
  id: string;               // UUID format 'custom-beat-{timestamp}-{idx}'
  name: string;             // Sanitized user track title
  fileName: string;         // Original audio file name (e.g. 'grime_dub.wav')
  estimatedBpm: number;     // Configured playback tempo (60–200 BPM)
  styleTag: string;         // Descriptive style classification
  createdAt: number;        // Epoch timestamp
  audioBlob: Blob;          // Raw audio/mp3, audio/wav, or audio/ogg binary
}`}
                </pre>
              </div>

              {/* Spec Section 4: Performance Benchmarks */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono-tech uppercase font-bold text-purple-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  4. VERIFIED PERFORMANCE BENCHMARKS
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-tech">
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">BAR COMPILATION</span>
                    <span className="text-amber-400 font-bold text-base">&lt; 8 ms</span>
                    <span className="text-[10px] text-slate-500 block">Synchronous AST</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">AUDIO LATENCY</span>
                    <span className="text-cyan-400 font-bold text-base">&lt; 5 ms</span>
                    <span className="text-[10px] text-slate-500 block">Web Audio Hardware</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">STORAGE I/O</span>
                    <span className="text-emerald-400 font-bold text-base">&lt; 15 ms</span>
                    <span className="text-[10px] text-slate-500 block">IndexedDB Async</span>
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">BUNDLE SIZE</span>
                    <span className="text-purple-400 font-bold text-base">182 KB</span>
                    <span className="text-[10px] text-slate-500 block">Gzipped / Tree-Shaken</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono-tech text-slate-400">
            PDFS STORED IN <span className="text-amber-300">/public/docs/</span> • EXPORTABLE ANYTIME
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playLcarsChirp('ack');
                onClose();
              }}
              className="px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-black shadow-md cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: theme.primary }}
            >
              CLOSE ARCHIVE
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
