import React, { useState, useMemo } from 'react';
import { LcarsEra, MultiRhymeMatch, WordEntry } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { MULTI_RHYME_DATABASE, MultiRhymeGroup } from '../../data/multiRhymesData';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  Sparkles,
  Search,
  Filter,
  Copy,
  Send,
  Zap,
  Layers,
  Check,
  Music,
} from 'lucide-react';

interface MultiRhymeEngineProps {
  currentEra: LcarsEra;
  onSendToAnalyzer: (text: string) => void;
  onSelectWord: (word: WordEntry) => void;
}

export const MultiRhymeEngine: React.FC<MultiRhymeEngineProps> = ({
  currentEra,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSyllables, setSelectedSyllables] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<MultiRhymeGroup>(MULTI_RHYME_DATABASE[0]);

  const filteredGroups = useMemo(() => {
    return MULTI_RHYME_DATABASE.filter((group) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        group.seedPhrase.toLowerCase().includes(q) ||
        group.vowelPattern.toLowerCase().includes(q) ||
        group.description.toLowerCase().includes(q) ||
        group.matches.some(
          (m) =>
            m.phrase.toLowerCase().includes(q) ||
            m.breakdown.toLowerCase().includes(q) ||
            (m.poeticNote && m.poeticNote.toLowerCase().includes(q))
        );

      const matchesSyllables =
        selectedSyllables === null || group.syllables === selectedSyllables;

      const matchesType =
        !selectedType || group.matches.some((m) => m.type === selectedType);

      return matchesSearch && matchesSyllables && matchesType;
    });
  }, [searchQuery, selectedSyllables, selectedType]);

  const handleCopyPair = (seed: string, match: string, id: string) => {
    playLcarsChirp('ack');
    navigator.clipboard.writeText(`${seed}\n${match}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendPairToAnalyzer = (seed: string, match: string) => {
    playLcarsChirp('warp');
    onSendToAnalyzer(`${seed}\n${match}`);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 pb-3" style={{ borderColor: theme.primary }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-black font-extrabold text-[11px] font-mono-tech tracking-wider uppercase" style={{ backgroundColor: theme.primary }}>
              LCARS SUB-HARMONICS 04-108
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              PHONEMIC COUPLING & COMPOUND RHYME ARRAY
            </span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white mt-1">
            Multisyllabic & Slant Rhyme Engine
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-tech">
            <span className="text-slate-400 mr-2">INDEXED MULTIS:</span>
            <span className="font-bold text-amber-400">{MULTI_RHYME_DATABASE.length} CHAINS</span>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search multisyllabic phrases, vowel patterns (e.g. 'aɪ', 'velocity', 'format')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm font-mono-tech text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Syllable Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono-tech text-slate-400 mr-1 uppercase flex items-center gap-1">
            <Filter className="w-3 h-3" /> Syllables:
          </span>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedSyllables(null);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer ${
              selectedSyllables === null
                ? 'bg-amber-400 text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {[3, 4, 7].map((syl) => (
            <button
              key={syl}
              onClick={() => {
                playLcarsChirp('tap');
                setSelectedSyllables(syl);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer ${
                selectedSyllables === syl
                  ? 'bg-amber-400 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {syl === 7 ? '5+ SYL' : `${syl} SYL`}
            </button>
          ))}
        </div>

        {/* Rhyme Type Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono-tech text-slate-400 mr-1 uppercase">Type:</span>
          {['compound', 'polysyllabic', 'slant', 'mosaic'].map((t) => (
            <button
              key={t}
              onClick={() => {
                playLcarsChirp('tap');
                setSelectedType(selectedType === t ? null : t);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold transition-all cursor-pointer ${
                selectedType === t
                  ? 'bg-cyan-400 text-black'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Selector List, Right Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Multisyllable Chains List */}
        <div className="lg:col-span-5 space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredGroups.map((group) => {
            const isSelected = selectedGroup.id === group.id;
            return (
              <div
                key={group.id}
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedGroup(group);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    "{group.seedPhrase}"
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase" style={{ backgroundColor: theme.secondary, color: '#000' }}>
                    {group.syllables} SYL
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs font-mono-tech">
                  <span className="text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    /{group.vowelPattern}/
                  </span>
                  <span className="text-slate-400 truncate">
                    {group.matches.length} matching couplets
                  </span>
                </div>
              </div>
            );
          })}

          {filteredGroups.length === 0 && (
            <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 font-mono-tech text-xs">
              NO MULTI-RHYME CHAINS MATCHED SEARCH QUERY
            </div>
          )}
        </div>

        {/* Right Column: Active Chain Deep Dive & Lyrical Couplet Cards */}
        <div className="lg:col-span-7 space-y-3">
          {selectedGroup && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              {/* Header Box */}
              <div className="p-3.5 rounded-lg bg-black/60 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-wider">
                    ACTIVE SEED CADENCE
                  </div>
                  <h3 className="text-xl font-bold uppercase text-white tracking-wide">
                    "{selectedGroup.seedPhrase}"
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-mono-tech">
                    {selectedGroup.description}
                  </p>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                  <span className="text-xs font-mono-tech text-cyan-300 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-700">
                    VOWELS: /{selectedGroup.vowelPattern}/
                  </span>
                  <span className="text-[11px] font-mono-tech text-slate-400">
                    {selectedGroup.syllables} Syllables
                  </span>
                </div>
              </div>

              {/* Subharmonic Couplet Matches */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono-tech uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  PHONEMIC COUPLING MATCHES ({selectedGroup.matches.length}):
                </div>

                {selectedGroup.matches.map((match, idx) => {
                  const matchKey = `${selectedGroup.id}-${idx}`;
                  const isCopied = copiedId === matchKey;
                  return (
                    <div
                      key={matchKey}
                      className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base tracking-wide">
                              "{match.phrase}"
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                              {match.type}
                            </span>
                            <span className="text-xs font-mono-tech text-emerald-400 font-bold">
                              {match.matchScore}% SYNC
                            </span>
                          </div>

                          <div className="text-xs font-mono-tech text-slate-400 mt-0.5">
                            Phonemic Breakdown: <span className="text-slate-200">{match.breakdown}</span> • Vowels: /{match.vowelChain.join(' - ')}/
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleCopyPair(selectedGroup.seedPhrase, match.phrase, matchKey)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-tech uppercase flex items-center gap-1 transition-all cursor-pointer"
                            title="Copy 2-bar couplet to clipboard"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'COPIED' : 'COPY'}
                          </button>
                          <button
                            onClick={() => handleSendPairToAnalyzer(selectedGroup.seedPhrase, match.phrase)}
                            className="px-2.5 py-1 rounded text-black font-extrabold text-xs font-mono-tech uppercase flex items-center gap-1 transition-all cursor-pointer"
                            style={{ backgroundColor: theme.primary }}
                            title="Inject couplet directly into Bar Analyzer"
                          >
                            <Send className="w-3 h-3" />
                            NOTEBOOK
                          </button>
                        </div>
                      </div>

                      {match.poeticNote && (
                        <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-xs text-amber-200/90 font-mono-tech flex items-start gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{match.poeticNote}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lyrical Scaffold Preview */}
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-2">
                <div className="text-xs font-mono-tech text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  LCARS COUPLET SCAFFOLD
                </div>
                <div className="font-mono-tech text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                  <p className="text-amber-300">// Bar 1:</p>
                  <p>In the quiet of the night we study <span className="text-amber-400 font-bold">{selectedGroup.seedPhrase}</span></p>
                  <p className="text-amber-300 mt-1">// Bar 2:</p>
                  <p>Rising up to manifest the <span className="text-cyan-400 font-bold">{selectedGroup.matches[0]?.phrase}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
