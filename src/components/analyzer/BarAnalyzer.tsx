import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WordEntry, LcarsEra, SavedPhrase, BarAnalysisResult, SchemeAnalysis, SchemeSuggestion } from '../../types/lcars';
import { analyzeBars, analyzeRhymeSchemes, applySchemeReplacement } from '../../utils/rhymeEngine';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { LEXICON_DATABASE } from '../../data/lexiconData';
import { InstrumentalBeatDeck } from '../beats/InstrumentalBeatDeck';
import {
  Sparkles,
  Bookmark,
  Play,
  Square,
  Volume2,
  Sliders,
  Copy,
  Trash2,
  CheckCircle2,
  Activity,
  Layers,
  Flame,
  Zap,
  Wand2,
  GitCommit,
  Check,
  Repeat,
  ArrowRightLeft,
} from 'lucide-react';

interface BarAnalyzerProps {
  currentEra: LcarsEra;
  initialText?: string;
  onSaveToVault: (phrase: SavedPhrase) => void;
  onSelectWord: (word: WordEntry) => void;
}

const PRESET_BARS = [
  {
    title: 'VerBS Art-Rap Complex',
    text: `I drop the mic and ignite the light
Deep in the flight through the darkest night
Ancient wisdom carved in stone
The cyber soul upon the golden throne`,
  },
  {
    title: 'Multisyllabic Astrometric',
    text: `Atmospheric velocity breaking through the gravity
Lyrical acrobat escaping from the tragedy
Quantum calculation charting every trajectory
Galactic frequency expanding our telemetry`,
  },
  {
    title: 'Boom-Bap Classical',
    text: `Slick black cat stepping on the velvet mat
Sub-bass fat shaking up the habitat
Never leave the cadence flat, elevate above the trap
Heavy iron combat on top of the hi-hat`,
  },
];

export const BarAnalyzer: React.FC<BarAnalyzerProps> = ({
  currentEra,
  initialText,
  onSaveToVault,
  onSelectWord,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [lyrics, setLyrics] = useState<string>(
    initialText || PRESET_BARS[0].text
  );
  const [bpm, setBpm] = useState<number>(90);
  const [isPlayingMetronome, setIsPlayingMetronome] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [selectedSchemeTab, setSelectedSchemeTab] = useState<'AABB' | 'ABAB' | 'AAAA'>('AABB');
  const [schemeAppliedNotice, setSchemeAppliedNotice] = useState<string | null>(null);

  // Real-time Bar Analysis computation
  const analysis: BarAnalysisResult = useMemo(() => {
    return analyzeBars(lyrics);
  }, [lyrics]);

  // Automated Rhyme Scheme Pattern Analysis
  const schemeAnalysis: SchemeAnalysis = useMemo(() => {
    return analyzeRhymeSchemes(analysis.lines);
  }, [analysis.lines]);

  const handleApplyWord = (lineIndex: number, newWord: string) => {
    playLcarsChirp('ack');
    const updated = applySchemeReplacement(lyrics, lineIndex, newWord);
    setLyrics(updated);
    setSchemeAppliedNotice(`Replaced end word on Bar ${lineIndex + 1} with "${newWord}"`);
    setTimeout(() => setSchemeAppliedNotice(null), 2500);
  };

  const handleApplyTemplate = (pattern: 'AABB' | 'ABAB' | 'AAAA') => {
    playLcarsChirp('warp');
    if (pattern === 'AABB') {
      setLyrics(`I drop the mic and ignite the light\nDeep in the flight through the darkest night\nAncient wisdom carved in stone\nThe cyber soul upon the golden throne`);
    } else if (pattern === 'ABAB') {
      setLyrics(`I step into the darkest night\nAncient wisdom carved in stone\nIgniting every quantum light\nAscending to the golden throne`);
    } else if (pattern === 'AAAA') {
      setLyrics(`Slick black cat\nVelvet on the mat\nBass frequencies fat\nNever looking flat`);
    }
    setSchemeAppliedNotice(`Loaded ${pattern} exemplar template into notebook`);
    setTimeout(() => setSchemeAppliedNotice(null), 2500);
  };

  // Metronome timer ref
  const metronomeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlayingMetronome) {
      const stepDurationMs = (60 / bpm / 4) * 1000; // 16th note subdivision
      metronomeRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % 16;
          // Play tick on quarter note beats (steps 0, 4, 8, 12)
          if (next % 4 === 0) {
            playLcarsChirp('tick');
          }
          return next;
        });
      }, stepDurationMs);
    } else {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
      setCurrentStep(0);
    }
    return () => {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    };
  }, [isPlayingMetronome, bpm]);

  // Find root definitions for words contained in the written lyrics
  const detectedRootDefinitions = useMemo(() => {
    const tokens = lyrics.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    const uniqueTokens = Array.from(new Set(tokens));
    const roots: { word: string; pieRoot?: string; origin: string; definition: string }[] = [];

    uniqueTokens.forEach((t) => {
      const match = LEXICON_DATABASE.find((w) => w.word.toLowerCase() === t);
      if (match) {
        roots.push({
          word: match.word,
          pieRoot: match.etymology.pieRoot,
          origin: match.etymology.originLanguage,
          definition: match.definition,
        });
      }
    });

    return roots;
  }, [lyrics]);

  const handleSaveBar = () => {
    playLcarsChirp('warp');
    const newSavedPhrase: SavedPhrase = {
      id: `phrase-${Date.now()}`,
      phrase: lyrics,
      createdAt: Date.now(),
      barCount: analysis.lines.length,
      syllables: analysis.totalSyllables,
      notes: notes || undefined,
      tags: [analysis.cadenceGrade, `Density ${analysis.rhymeDensityScore}%`],
      rhymeScheme: `${analysis.lines.length} Bars`,
      attachedRoots: detectedRootDefinitions,
    };
    onSaveToVault(newSavedPhrase);
    setSaveModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const loadPreset = (presetText: string) => {
    playLcarsChirp('tap');
    setLyrics(presetText);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 font-lcars">
      
      {/* Header and Telemetry */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              HYPER-DETAIL BAR ANALYZER // VerBS CADENCE DECK
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              REAL-TIME PHONEMIC COMPILER
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Syllables, Rhyme Density & Literary Telemetry
          </h2>
        </div>

        {/* Preset Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono-tech text-slate-400 uppercase font-bold mr-1">
            CADENCE PRESETS:
          </span>
          {PRESET_BARS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(p.text)}
              className="px-2.5 py-1 rounded-md text-xs font-mono-tech uppercase bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Metric Readout Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Metric 1: Total Syllables & Avg Per Bar */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">
            // TOTAL SYLLABLES & CADENCE
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">
              {analysis.totalSyllables}
            </span>
            <span className="text-xs text-amber-400 font-mono-tech">
              ({analysis.avgSyllablesPerBar} / bar)
            </span>
          </div>
          <div className="text-[10px] font-mono-tech text-slate-500 mt-1">
            {analysis.lines.length} {analysis.lines.length === 1 ? 'BAR' : 'BARS'} MONITORED
          </div>
        </div>

        {/* Metric 2: Rhyme Density Score */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold flex items-center justify-between">
            <span>// RHYME DENSITY</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold" style={{ color: theme.secondary }}>
              {analysis.rhymeDensityScore}%
            </span>
            <span className="text-[10px] font-mono-tech text-slate-300">
              {analysis.rhymeDensityScore > 70 ? 'HIGH DENSITY' : analysis.rhymeDensityScore > 40 ? 'BALANCED' : 'LOW POCKET'}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${analysis.rhymeDensityScore}%`,
                backgroundColor: theme.secondary,
              }}
            />
          </div>
        </div>

        {/* Metric 3: Phonemic Complexity */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold flex items-center justify-between">
            <span>// PHONEMIC COMPLEXITY</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold" style={{ color: theme.auxiliary }}>
              {analysis.phonemicComplexityScore}
            </span>
            <span className="text-[10px] font-mono-tech text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${analysis.phonemicComplexityScore}%`,
                backgroundColor: theme.auxiliary,
              }}
            />
          </div>
        </div>

        {/* Metric 4: Cadence & Pocket Rating */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">
            // FLOW POCKET STATUS
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className="text-2xl font-extrabold tracking-wider"
              style={{
                color:
                  analysis.cadenceGrade.includes('S+')
                    ? '#00E5FF'
                    : analysis.cadenceGrade.includes('A')
                    ? '#FFCC00'
                    : '#FF9900',
              }}
            >
              {analysis.cadenceGrade}
            </span>
          </div>
          <div className="text-[10px] font-mono-tech text-slate-400 mt-1">
            {analysis.avgSyllablesPerBar >= 10 && analysis.avgSyllablesPerBar <= 16
              ? '4/4 METRIC EQUILIBRIUM'
              : 'SYNCOPATED / LOOSE METRIC'}
          </div>
        </div>
      </div>

      {/* Main Bar Editor + Side-by-Side Syllable Meter Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        
        {/* Editor Area (Left 2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-2 rounded-2xl bg-black/60 border border-slate-800 p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono-tech text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              LYRIC NOTEBOOK // BAR INPUT BUFFER
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playLcarsChirp('ack');
                  navigator.clipboard.writeText(lyrics);
                }}
                className="p-1 text-slate-400 hover:text-white"
                title="Copy Lyrics"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setLyrics('');
                }}
                className="p-1 text-slate-400 hover:text-red-400"
                title="Clear Notebook"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Write your bars here... Observe real-time syllables, rhyme density, and poetic devices updating automatically."
            rows={4}
            className="w-full min-h-[105px] max-h-[150px] bg-transparent border-0 text-slate-100 placeholder-slate-600 focus:outline-none font-mono-tech text-sm leading-relaxed resize-y p-1"
          />

          {/* Bar-by-Bar Syllable Breakdown Rail */}
          <div className="border-t border-slate-800/80 pt-3 space-y-1.5">
            <div className="text-[10px] font-mono-tech text-slate-400 uppercase font-bold">
              BAR CADENCE BREAKDOWN:
            </div>
            {analysis.lines.map((line, idx) => {
              const count = analysis.lineSyllables[idx] || 0;
              const meter = analysis.meterPattern[idx] || '';
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs font-mono-tech px-2 py-1 rounded bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 flex-1 truncate mr-2">
                    <span className="text-amber-400 font-bold w-12 text-[10px]">
                      BAR {idx + 1}:
                    </span>
                    <span className="text-slate-300 truncate font-sans text-xs">
                      {line}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-slate-500 hidden sm:inline tracking-widest">
                      {meter}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-black font-extrabold text-[11px]"
                      style={{
                        backgroundColor:
                          count >= 10 && count <= 16
                            ? theme.primary
                            : count < 10
                            ? theme.secondary
                            : theme.accent,
                      }}
                    >
                      {count} SYL
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- AUTOMATED RHYME SCHEME SUGGESTOR (AABB, ABAB, AAAA) --- */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            
            {/* Top Header & Detected Pattern Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-black font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-1.5"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Wand2 className="w-3 h-3" />
                  RHYME SCHEME SUGGESTOR
                </span>
                <span className="text-[10px] font-mono-tech text-slate-400">
                  END-WORD PHONEMES
                </span>
              </div>

              {/* Current Detected Pattern Pill */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono-tech text-slate-400 uppercase font-bold">
                  DETECTED:
                </span>
                <div className="flex items-center gap-1">
                  {schemeAnalysis.endWords.slice(0, 4).map((ew, idx) => {
                    const color =
                      ew.symbol === 'A'
                        ? '#FF9900'
                        : ew.symbol === 'B'
                        ? '#00E5FF'
                        : ew.symbol === 'C'
                        ? '#CC6699'
                        : '#FFCC00';
                    return (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono-tech font-extrabold text-black"
                        style={{ backgroundColor: color }}
                        title={`Bar ${idx + 1}: ${ew.word} (Rhyme Symbol ${ew.symbol})`}
                      >
                        {ew.symbol}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs font-mono-tech text-amber-300 font-bold ml-1">
                  {schemeAnalysis.detectedPattern || 'NONE'}
                </span>
              </div>
            </div>

            {/* Transient Flash Notice */}
            {schemeAppliedNotice && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono-tech flex items-center justify-between animate-in fade-in">
                <span className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {schemeAppliedNotice}
                </span>
                <span className="text-[9px] text-emerald-400/80">APPLIED</span>
              </div>
            )}

            {/* End-Word Phoneme Telemetry Grid */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 flex items-center gap-1">
                <GitCommit className="w-3 h-3 text-cyan-400" />
                END-WORD PHONEMIC BREAKDOWN:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {schemeAnalysis.endWords.slice(0, 4).map((ew) => {
                  const symbolColor =
                    ew.symbol === 'A'
                      ? '#FF9900'
                      : ew.symbol === 'B'
                      ? '#00E5FF'
                      : ew.symbol === 'C'
                      ? '#CC6699'
                      : '#FFCC00';
                  return (
                    <div
                      key={ew.lineIndex}
                      className="p-1.5 rounded-lg bg-black/60 border border-slate-800 flex items-center justify-between text-xs font-mono-tech"
                    >
                      <div className="truncate mr-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-slate-400 font-bold">
                            B{ew.lineIndex + 1}:
                          </span>
                          <span className="text-white font-bold uppercase truncate text-[11px]">
                            {ew.cleanWord || '—'}
                          </span>
                        </div>
                        <div className="text-[9px] text-cyan-300">
                          /{ew.rhymeTail}/ • {ew.syllables}S
                        </div>
                      </div>

                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-extrabold text-black flex-shrink-0"
                        style={{ backgroundColor: symbolColor }}
                      >
                        {ew.symbol}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Scheme Pattern Proposal Selector Tabs */}
            <div className="border-t border-slate-800 pt-2 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  PROPOSED SCHEMES:
                </span>

                {/* Scheme Tabs */}
                <div className="flex items-center gap-1 bg-black/80 p-0.5 rounded-full border border-slate-800">
                  {(['AABB', 'ABAB', 'AAAA'] as const).map((pattern) => {
                    const sugg = schemeAnalysis.suggestions.find((s) => s.targetPattern === pattern);
                    const score = sugg ? sugg.matchScore : 0;
                    const isSelected = selectedSchemeTab === pattern;
                    return (
                      <button
                        key={pattern}
                        onClick={() => {
                          playLcarsChirp('tap');
                          setSelectedSchemeTab(pattern);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'text-black shadow-md'
                            : 'text-slate-300 hover:text-white'
                        }`}
                        style={isSelected ? { backgroundColor: theme.primary } : {}}
                      >
                        <span>{pattern}</span>
                        <span
                          className={`text-[9px] px-1 rounded-full ${
                            isSelected ? 'bg-black text-amber-300' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {score}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Proposal Inspection Box */}
              {(() => {
                const currentSugg =
                  schemeAnalysis.suggestions.find((s) => s.targetPattern === selectedSchemeTab) ||
                  schemeAnalysis.suggestions[0];

                if (!currentSugg) return null;

                return (
                  <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold uppercase text-white font-mono-tech">
                          {currentSugg.title}
                        </span>
                        <span
                          className="text-[10px] font-mono-tech font-extrabold px-2 py-0.2 rounded-full"
                          style={{
                            backgroundColor:
                              currentSugg.matchScore === 100
                                ? '#00E5FF'
                                : currentSugg.matchScore >= 50
                                ? '#FF9900'
                                : '#CC6699',
                            color: '#000000',
                          }}
                        >
                          {currentSugg.matchScore}% MATCH
                        </span>
                      </div>

                      <button
                        onClick={() => handleApplyTemplate(currentSugg.targetPattern)}
                        className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 text-[10px] font-mono-tech uppercase font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                        LOAD TEMPLATE
                      </button>
                    </div>

                    {/* Match progress bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${currentSugg.matchScore}%`,
                          backgroundColor:
                            currentSugg.matchScore === 100
                              ? '#00E5FF'
                              : theme.primary,
                        }}
                      />
                    </div>

                    <p className="text-slate-400 text-[11px] font-sans">
                      {currentSugg.explanation}
                    </p>

                    <div className="text-[11px] font-mono-tech text-amber-300/90 font-bold">
                      // {currentSugg.description}
                    </div>

                    {/* Proposed End-Word Substitutions */}
                    {currentSugg.lineSuggestions.length > 0 ? (
                      <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                        <div className="text-[9px] font-mono-tech text-slate-400 uppercase font-bold">
                          SUGGESTED END-WORD REPLACEMENTS (CLICK TO APPLY):
                        </div>
                        <div className="space-y-1.5">
                          {currentSugg.lineSuggestions.map((ls, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono-tech"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.2 rounded text-black font-extrabold text-[10px]" style={{ backgroundColor: theme.secondary }}>
                                  BAR {ls.lineIndex + 1}
                                </span>
                                <span className="text-slate-300 text-[11px]">
                                  Swap <strong className="text-red-400 underline">"{ls.currentWord}"</strong> to match <strong className="text-amber-400">[{ls.targetSymbol}]</strong> (/{ls.targetRhymeTail}/):
                                </span>
                              </div>

                              {/* Candidate replacement words chips */}
                              <div className="flex flex-wrap items-center gap-1">
                                {ls.suggestedWords.length === 0 ? (
                                  <span className="text-slate-500 text-[10px]">
                                    No candidate in database
                                  </span>
                                ) : (
                                  ls.suggestedWords.map((candWord) => (
                                    <button
                                      key={candWord}
                                      onClick={() => handleApplyWord(ls.lineIndex, candWord)}
                                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-amber-400 hover:text-black text-cyan-300 border border-slate-700 hover:border-amber-500 font-bold uppercase transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                                      title={`Click to substitute "${candWord}" into Bar ${ls.lineIndex + 1}`}
                                    >
                                      <span>{candWord}</span>
                                      <Check className="w-2.5 h-2.5 opacity-60" />
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono-tech flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          SCHEME SYNCHRONIZED: Your bars fully conform to {currentSugg.targetPattern}!
                        </span>
                        <span className="text-[9px] text-emerald-400/80 uppercase">100% POCKET ACCURACY</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Save to Favorites Vault Action Strip */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-tech">
              {savedSuccess ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> BAR SAVED TO FAVORITES VAULT
                </span>
              ) : (
                <span className="text-slate-400">
                  {detectedRootDefinitions.length} LEXICAL ROOTS DETECTED IN THIS BAR
                </span>
              )}
            </div>

            <button
              onClick={() => {
                playLcarsChirp('tap');
                setSaveModalOpen(true);
              }}
              className="px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs text-black flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: theme.primary }}
            >
              <Bookmark className="w-3.5 h-3.5" />
              SAVE BAR & ATTACH ROOT DEFINITIONS
            </button>
          </div>
        </div>

        {/* Right Col: Multi-Style Instrumental Beat Deck & Literary Devices */}
        <div className="flex flex-col gap-4">
          <InstrumentalBeatDeck currentEra={currentEra} compact />

          {/* Real-time Detected Literary Devices */}
          <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 flex-1 flex flex-col overflow-hidden">
            <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 border-b border-slate-800 pb-2 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              DETECTED LITERARY DEVICES ({analysis.detectedDevices.length})
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {analysis.detectedDevices.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono-tech text-slate-500">
                  Write or paste lyrics to scan for alliteration, internal rhymes, anaphora, chiasmus, and polysyllabic chains.
                </div>
              ) : (
                analysis.detectedDevices.map((dev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono-tech"
                  >
                    <div className="flex items-center justify-between text-amber-300 font-bold uppercase">
                      <span>{dev.type}</span>
                      {dev.lineIndex !== undefined && (
                        <span className="text-[10px] text-slate-400">
                          BAR {dev.lineIndex + 1}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-[11px] font-sans mt-0.5">
                      {dev.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {dev.words.map((w, wIdx) => (
                        <span
                          key={wIdx}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Bar & Attached Roots Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-3xl border-2 p-5 font-lcars space-y-4"
            style={{
              borderColor: theme.primary,
              backgroundColor: theme.panelBg,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-lg font-bold uppercase text-white">
                SAVE PHRASE ALONGSIDE ROOT DEFINITIONS
              </h3>
              <button
                onClick={() => setSaveModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-tech text-amber-200">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                EXCERPT:
              </div>
              "{lyrics.slice(0, 150)}{lyrics.length > 150 ? '...' : ''}"
            </div>

            {/* Attached Roots Preview */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono-tech text-cyan-300 uppercase font-bold">
                ATTACHED ROOT DEFINITIONS ({detectedRootDefinitions.length} DETECTED):
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
                {detectedRootDefinitions.map((root, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-900/80 border border-slate-800 flex flex-col"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-400 font-mono-tech">
                      <span>{root.word.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400">
                        {root.pieRoot || root.origin}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-sans truncate">
                      {root.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Personal Lyricist Notes */}
            <div>
              <label className="text-xs font-mono-tech text-slate-400 uppercase font-bold block mb-1">
                OPTIONAL NOTES / INTENDED TRACK / RHYME SCHEME:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Verse 2 opening bar, internal multi on 'ignite'"
                className="w-full bg-black border border-slate-700 rounded-lg p-2 text-xs font-mono-tech text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Confirm Save Button */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-mono-tech text-slate-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveBar}
                className="px-5 py-2 rounded-full text-xs font-extrabold uppercase text-black"
                style={{ backgroundColor: theme.primary }}
              >
                CONFIRM & STORE TO VAULT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
