import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LcarsEra, SavedPhrase, WordEntry } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { HOLODECK_CHALLENGES } from '../../data/holodeckData';
import { analyzeBars, analyzeRhymeSchemes } from '../../utils/rhymeEngine';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bookmark,
  Award,
  Layers,
  Wand2,
} from 'lucide-react';

interface HolodeckChamberProps {
  currentEra: LcarsEra;
  onSaveToVault: (phrase: SavedPhrase) => void;
  onSelectWord: (word: WordEntry) => void;
}

export const HolodeckChamber: React.FC<HolodeckChamberProps> = ({
  currentEra,
  onSaveToVault,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    HOLODECK_CHALLENGES[0].id
  );
  const activeChallenge =
    HOLODECK_CHALLENGES.find((c) => c.id === selectedChallengeId) ||
    HOLODECK_CHALLENGES[0];

  const [lyrics, setLyrics] = useState<string>(activeChallenge.promptScaffold);
  const [timeLeft, setTimeLeft] = useState<number>(activeChallenge.timeLimitSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Sync lyrics & timer when challenge changes
  const handleSelectChallenge = (id: string) => {
    playLcarsChirp('tap');
    const chal = HOLODECK_CHALLENGES.find((c) => c.id === id);
    if (chal) {
      setSelectedChallengeId(chal.id);
      setLyrics(chal.promptScaffold);
      setTimeLeft(chal.timeLimitSeconds);
      setIsTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Timer Countdown Logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playLcarsChirp('alert');
            return 0;
          }
          if (prev === 10 || prev === 5) {
            playLcarsChirp('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    playLcarsChirp('tap');
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    playLcarsChirp('tap');
    setIsTimerRunning(false);
    setTimeLeft(activeChallenge.timeLimitSeconds);
  };

  // Real-time analysis of the current lyrics
  const barAnalysis = useMemo(() => {
    return analyzeBars(lyrics);
  }, [lyrics]);

  const schemeAnalysis = useMemo(() => {
    return analyzeRhymeSchemes(barAnalysis.lines);
  }, [barAnalysis.lines]);

  // Evaluate Holodeck Objectives
  const objectiveStatus = useMemo(() => {
    const textLower = lyrics.toLowerCase();

    // Check target words
    const wordsFound = activeChallenge.targetWords.map((word) => ({
      word,
      found: textLower.includes(word.toLowerCase()),
    }));

    // Check rhyme scheme
    const schemeMatch = schemeAnalysis.detectedPattern.includes(
      activeChallenge.rhymeScheme
    );

    // Check bar count (minimum 4 bars)
    const barCountMatch = barAnalysis.lines.length >= 4;

    // Check syllable constraint
    const avgSyllables = barAnalysis.avgSyllablesPerBar;
    const syllableOk = avgSyllables >= 8 && avgSyllables <= 16;

    const wordsScore =
      (wordsFound.filter((w) => w.found).length / wordsFound.length) * 40;
    const schemeScore = schemeMatch ? 30 : 10;
    const barScore = barCountMatch ? 15 : 5;
    const sylScore = syllableOk ? 15 : 5;

    const totalMastery = Math.min(100, Math.round(wordsScore + schemeScore + barScore + sylScore));

    return {
      wordsFound,
      allWordsFound: wordsFound.every((w) => w.found),
      schemeMatch,
      barCountMatch,
      syllableOk,
      totalMastery,
    };
  }, [lyrics, activeChallenge, barAnalysis, schemeAnalysis]);

  const handleSaveToVaultClick = () => {
    playLcarsChirp('warp');
    const newPhrase: SavedPhrase = {
      id: `holo-${Date.now()}`,
      phrase: lyrics,
      createdAt: Date.now(),
      barCount: barAnalysis.lines.length,
      syllables: barAnalysis.totalSyllables,
      notes: `Holodeck Drill: ${activeChallenge.title} (${activeChallenge.difficulty}) - Mastery ${objectiveStatus.totalMastery}%. Root: ${activeChallenge.targetRoot}`,
      tags: [
        `HOLODECK-${activeChallenge.theme}`,
        activeChallenge.difficulty,
        `Mastery ${objectiveStatus.totalMastery}%`,
      ],
      rhymeScheme: schemeAnalysis.detectedPattern,
      attachedRoots: [
        {
          word: activeChallenge.targetWords[0] || 'cadence',
          pieRoot: activeChallenge.targetRoot,
          origin: 'Proto-Indo-European / Holodeck',
          definition: activeChallenge.objective,
        },
      ],
    };
    onSaveToVault(newPhrase);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 pb-3"
        style={{ borderColor: theme.primary }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-black font-extrabold text-[11px] font-mono-tech tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              LCARS HOLODECK CADENCE PROTOCOL 06-742
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              SIMULATED CYPHER TRAINING CHAMBER
            </span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white mt-1">
            Holodeck Rhyme Challenge & Cypher Drill Simulator
          </h2>
        </div>

        {/* Timer Readout */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono-tech ${
              timeLeft <= 30 && timeLeft > 0
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            <span className="text-xs text-slate-400 uppercase">CHAMBER CLOCK:</span>
            <span className="text-xl font-extrabold">{formatTimer(timeLeft)}</span>
            <button
              onClick={toggleTimer}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 cursor-pointer ml-1"
              title={isTimerRunning ? 'Pause countdown' : 'Start countdown'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Challenge Selector Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="text-xs font-mono-tech uppercase font-bold text-slate-400">
          SELECT SIMULATION PROTOCOL ({HOLODECK_CHALLENGES.length} MODULES AVAILABLE):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {HOLODECK_CHALLENGES.map((chal) => {
            const isSelected = chal.id === selectedChallengeId;
            return (
              <button
                key={chal.id}
                onClick={() => handleSelectChallenge(chal.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-black/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech font-bold text-cyan-400">
                      {chal.code}
                    </span>
                    <span
                      className={`text-[9px] font-mono-tech font-bold px-1.5 py-0.2 rounded uppercase ${
                        chal.difficulty === 'FLEET CAPTAIN'
                          ? 'bg-rose-900 text-rose-300'
                          : chal.difficulty === 'COMMANDER'
                          ? 'bg-amber-900 text-amber-300'
                          : 'bg-emerald-900 text-emerald-300'
                      }`}
                    >
                      {chal.difficulty}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white uppercase mt-1 truncate">
                    {chal.title}
                  </div>
                </div>

                <div className="text-[10px] font-mono-tech text-slate-400 mt-2 flex items-center justify-between">
                  <span>{chal.rhymeScheme}</span>
                  <span>{chal.timeLimitSeconds}s</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Details & Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Challenge Mandate & Live Objective Checklist */}
        <div className="lg:col-span-5 space-y-3">
          {/* Mission Briefing */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                SIMULATION MANDATE
              </span>
              <span className="text-xs font-mono-tech text-cyan-300">
                THEME: {activeChallenge.theme}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white uppercase">
              {activeChallenge.title}
            </h3>
            <p className="text-xs text-slate-300 font-mono-tech leading-relaxed">
              {activeChallenge.objective}
            </p>

            {/* Target Specs Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech pt-1 border-t border-slate-800">
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Target Scheme:</div>
                <div className="font-bold text-amber-400">{activeChallenge.rhymeScheme}</div>
              </div>
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Target PIE Root:</div>
                <div className="font-bold text-cyan-400 truncate">{activeChallenge.targetRoot}</div>
              </div>
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Target Device:</div>
                <div className="font-bold text-amber-300 truncate">{activeChallenge.targetDevice}</div>
              </div>
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Syllable Goal:</div>
                <div className="font-bold text-white">{activeChallenge.syllableTarget}</div>
              </div>
            </div>
          </div>

          {/* Live Objective Validator */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tech font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                HOLODECK MASTERY RATING
              </span>
              <span className="text-sm font-bold font-mono-tech text-amber-400">
                {objectiveStatus.totalMastery}%
              </span>
            </div>

            {/* Mastery Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${objectiveStatus.totalMastery}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs font-mono-tech pt-1">
              {/* Words Check */}
              <div className="p-2 rounded bg-black/50 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 uppercase text-[10px]">
                  <span>MANDATORY TARGET WORDS ({objectiveStatus.wordsFound.filter(w => w.found).length}/{activeChallenge.targetWords.length}):</span>
                  {objectiveStatus.allWordsFound ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETE
                    </span>
                  ) : (
                    <span className="text-amber-400">IN PROGRESS</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {objectiveStatus.wordsFound.map((w, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase flex items-center gap-1 ${
                        w.found
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {w.found ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <XCircle className="w-2.5 h-2.5 opacity-40" />}
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scheme Check */}
              <div className="p-2 rounded bg-black/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">RHYME SCHEME LOCK:</span>
                  <div className="font-bold text-white">
                    Pattern: {schemeAnalysis.detectedPattern} (Required: {activeChallenge.rhymeScheme})
                  </div>
                </div>
                {objectiveStatus.schemeMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* 4 Bars Check */}
              <div className="p-2 rounded bg-black/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase">BAR QUANTITY:</span>
                  <div className="font-bold text-white">
                    {barAnalysis.lines.length} Bars Written (Minimum 4 required)
                  </div>
                </div>
                {objectiveStatus.barCountMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Cypher Buffer */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono-tech font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                CYPHER INPUT TERMINAL // 4-BAR BUFFER
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playLcarsChirp('tap');
                    setLyrics(activeChallenge.promptScaffold);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono-tech uppercase flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  RELOAD SCAFFOLD
                </button>
                <button
                  onClick={() => {
                    playLcarsChirp('tap');
                    setLyrics('');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-mono-tech uppercase transition-all cursor-pointer"
                >
                  CLEAR
                </button>
              </div>
            </div>

            {/* Lyric Textarea */}
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter your 4-bar challenge verse here... Weave the target words and match the cadence constraints."
              rows={6}
              className="w-full p-3.5 rounded-lg bg-black/80 border border-slate-700 text-white font-mono-tech text-sm leading-relaxed focus:outline-none focus:border-amber-400"
            />

            {/* Live Syllable / Bar Breakdown */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[10px] font-mono-tech text-slate-400 uppercase mb-1">
                BAR TELEMETRY READOUT:
              </div>
              {barAnalysis.lines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs font-mono-tech py-0.5 border-b border-slate-800/60 last:border-0"
                >
                  <span className="text-slate-400 w-12 font-bold">BAR {idx + 1}:</span>
                  <span className="text-slate-200 truncate flex-1 px-2">{line || '<empty>'}</span>
                  <span className="text-amber-400 font-bold ml-2">
                    {barAnalysis.lineSyllables[idx] || 0} SYL
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
              <div className="text-xs font-mono-tech text-slate-400">
                Avg Cadence: <span className="text-white font-bold">{barAnalysis.avgSyllablesPerBar} syl/bar</span> • Density: <span className="text-amber-400 font-bold">{barAnalysis.rhymeDensityScore}%</span>
              </div>

              <button
                onClick={handleSaveToVaultClick}
                className="px-4 py-2 rounded-lg text-black font-extrabold text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: theme.primary }}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {savedSuccess ? 'LOGGED TO VAULT!' : 'LOG CYPHER TO VAULT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
