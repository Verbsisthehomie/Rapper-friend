import React, { useState } from 'react';
import { LcarsEra, PieRootNode, WordEntry } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { PIE_ROOT_DATABASE } from '../../data/pieRootData';
import { LEXICON_DATABASE } from '../../data/lexiconData';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  GitFork,
  BookOpen,
  Send,
  Zap,
  Globe,
  ArrowRight,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

interface PieRootExplorerProps {
  currentEra: LcarsEra;
  onSelectWord: (word: WordEntry) => void;
  onSendToAnalyzer: (text: string) => void;
}

export const PieRootExplorer: React.FC<PieRootExplorerProps> = ({
  currentEra,
  onSelectWord,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [selectedRootId, setSelectedRootId] = useState<string>(PIE_ROOT_DATABASE[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeRoot: PieRootNode =
    PIE_ROOT_DATABASE.find((r) => r.id === selectedRootId) || PIE_ROOT_DATABASE[0];

  const filteredRoots = PIE_ROOT_DATABASE.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.root.toLowerCase().includes(q) ||
      r.protoMeaning.toLowerCase().includes(q) ||
      r.overview.toLowerCase().includes(q) ||
      r.branches.some((b) =>
        b.modernWords.some((w) => w.word.toLowerCase().includes(q))
      )
    );
  });

  const handleInspectWord = (wordStr: string) => {
    playLcarsChirp('tap');
    const match = LEXICON_DATABASE.find(
      (w) => w.word.toLowerCase() === wordStr.toLowerCase()
    );
    if (match) {
      onSelectWord(match);
    } else {
      // Create minimal word entry
      const syntheticWord: WordEntry = {
        id: wordStr.toLowerCase(),
        word: wordStr.toLowerCase(),
        syllables: 1,
        ipa: `/${wordStr}/`,
        stressPattern: '1',
        rhymeFamily: '-stem',
        rhymeFamilyLabel: `PIE Root ${activeRoot.root}`,
        pos: 'noun',
        definition: `Descendant of Proto-Indo-European root ${activeRoot.root} (${activeRoot.protoMeaning}).`,
        etymology: {
          pieRoot: activeRoot.root,
          originLanguage: 'Proto-Indo-European',
          history: activeRoot.overview,
          cognates: activeRoot.cognatePairs.map((c) => `${c.wordA} & ${c.wordB}`),
          evolutionChain: [activeRoot.root, activeRoot.protoMeaning, wordStr],
        },
        perfectRhymes: [],
        slantRhymes: [],
        multisyllableRhymes: [],
        tags: ['etymology', 'pie-root'],
      };
      onSelectWord(syntheticWord);
    }
  };

  const handleInjectCognateBar = (pair: { wordA: string; wordB: string; conceptHook: string }) => {
    playLcarsChirp('warp');
    const barText = `Carrying the ${pair.wordA} through the realm of ${pair.wordB}\nAncient frequency awakened on the microphone`;
    onSendToAnalyzer(barText);
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
              LCARS SUBSPACE RADIX 05-360
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              PROTO-INDO-EUROPEAN LINGUISTIC ANCESTRY TREE
            </span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white mt-1">
            PIE Roots & Linguistic Ancestry Subspace Map
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-tech">
            <span className="text-slate-400 mr-2">ANCESTRAL STEMS:</span>
            <span className="font-bold text-amber-400">
              {PIE_ROOT_DATABASE.length} PIE RADICES
            </span>
          </div>
        </div>
      </div>

      {/* Search & Root Quick Selector */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PIE root, meaning, or modern descendant word..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-sm font-mono-tech text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <span className="text-xs font-mono-tech text-slate-400">
            ROOT ORIGIN ERA: c. 4500–2500 BCE
          </span>
        </div>

        {/* Root Buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {filteredRoots.map((root) => {
            const isActive = root.id === selectedRootId;
            return (
              <button
                key={root.id}
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedRootId(root.id);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>{root.root}</span>
                <span className={`text-[10px] font-normal ${isActive ? 'text-black/80' : 'text-slate-400'}`}>
                  ({root.protoMeaning.split(',')[0]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Root Display */}
      {activeRoot && (
        <div className="space-y-4">
          {/* Root Profile Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider">
                  PROTO-INDO-EUROPEAN RADIX
                </span>
                <h3 className="text-3xl font-extrabold uppercase text-amber-400 tracking-wider">
                  {activeRoot.root}
                </h3>
                <div className="text-sm font-mono-tech text-slate-300 font-semibold mt-0.5">
                  Proto-Meaning: <span className="text-white">"{activeRoot.protoMeaning}"</span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-mono-tech">
                  ERA: {activeRoot.originEra}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-mono-tech leading-relaxed">
              {activeRoot.overview}
            </p>
          </div>

          {/* Lyrical Cognate Pairs for Art Rappers */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                LYRICAL COGNATE PAIRS // METAPHOR AMMUNITION
              </div>
              <span className="text-[11px] font-mono-tech text-slate-400">
                Unexpected twins sharing the same root
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeRoot.cognatePairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-black/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-amber-400 text-black font-extrabold text-sm uppercase">
                        {pair.wordA}
                      </span>
                      <span className="text-slate-500 font-mono-tech text-xs">← {activeRoot.root} →</span>
                      <span className="px-2.5 py-1 rounded bg-cyan-400 text-black font-extrabold text-sm uppercase">
                        {pair.wordB}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-mono-tech mt-1">
                      {pair.relationship}
                    </p>
                  </div>

                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-amber-300 font-mono-tech flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{pair.conceptHook}</span>
                    </div>
                    <button
                      onClick={() => handleInjectCognateBar(pair)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold bg-amber-400 hover:bg-amber-300 text-black shrink-0 transition-all cursor-pointer flex items-center gap-1"
                      title="Load bar template with this pair"
                    >
                      <Send className="w-2.5 h-2.5" /> BAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branching Language Families Tree */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="text-xs font-mono-tech uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              BRANCHING LANGUAGE FAMILIES & MODERN DESCENDANTS
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeRoot.branches.map((branch, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2.5"
                >
                  <div className="border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-bold text-white uppercase font-mono-tech tracking-wider">
                      {branch.languageFamily}
                    </span>
                    <div className="text-[10px] font-mono-tech text-slate-400 mt-0.5 truncate">
                      {branch.intermediateForms.join(' → ')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {branch.modernWords.map((wordObj, wIdx) => (
                      <div
                        key={wIdx}
                        className="p-2 rounded bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 text-sm font-mono-tech uppercase">
                            {wordObj.word}
                          </span>
                          <button
                            onClick={() => handleInspectWord(wordObj.word)}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono-tech uppercase bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-all cursor-pointer flex items-center gap-0.5"
                          >
                            <BookOpen className="w-2.5 h-2.5" /> Node
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 font-mono-tech">
                          {wordObj.definition}
                        </p>
                        <p className="text-[10px] text-slate-400 italic font-mono-tech">
                          Lyrical angle: {wordObj.poeticUsage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
