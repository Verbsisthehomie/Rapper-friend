import React, { useState, useMemo } from 'react';
import { WordEntry, LcarsEra } from '../../types/lcars';
import { LEXICON_DATABASE } from '../../data/lexiconData';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { Search, Filter, Sparkles, BookOpen, Layers, Compass, ArrowUpRight } from 'lucide-react';

interface LexiconSearchProps {
  currentEra: LcarsEra;
  onSelectWord: (word: WordEntry) => void;
  onSendToAnalyzer: (text: string) => void;
}

export const LexiconSearch: React.FC<LexiconSearchProps> = ({
  currentEra,
  onSelectWord,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSyllable, setSelectedSyllable] = useState<number | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'rare-emotion' | 'rare-color' | 'pie-root'>('all');

  const originOptions = useMemo(() => {
    const set = new Set<string>();
    LEXICON_DATABASE.forEach(w => {
      if (w.etymology.originLanguage) {
        set.add(w.etymology.originLanguage.split('/')[0].trim());
      }
    });
    return Array.from(set);
  }, []);

  const filteredWords = useMemo(() => {
    return LEXICON_DATABASE.filter(w => {
      const matchSearch =
        !searchTerm ||
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.rhymeFamilyLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.etymology.history.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.etymology.pieRoot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSyllable = selectedSyllable === null || w.syllables === selectedSyllable;
      const matchOrigin =
        selectedOrigin === 'all' ||
        w.etymology.originLanguage.toLowerCase().includes(selectedOrigin.toLowerCase());

      const matchCategory =
        selectedCategoryFilter === 'all' ||
        (selectedCategoryFilter === 'rare-emotion' && w.tags.includes('rare-emotion')) ||
        (selectedCategoryFilter === 'rare-color' && w.tags.includes('rare-color')) ||
        (selectedCategoryFilter === 'pie-root' && Boolean(w.etymology.pieRoot));

      return matchSearch && matchSyllable && matchOrigin && matchCategory;
    });
  }, [searchTerm, selectedSyllable, selectedOrigin, selectedCategoryFilter]);

  return (
    <div className="flex-1 flex flex-col gap-4 font-lcars">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              SUBSPACE LEXICAL MATRIX
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              DATABASE: {LEXICON_DATABASE.length} ANCHOR WORDS • RHYME RADIX ONLINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Poetic Etymology & Rhyme Garden
          </h2>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search word, PIE root, phoneme (-at, -ight), or concept..."
            className="w-full bg-black border-2 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-mono-tech"
            style={{
              borderColor: theme.secondary,
            }}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-800/60">
          <span className="text-amber-400 font-mono-tech uppercase font-bold mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            SPECTRUM:
          </span>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedCategoryFilter('all');
            }}
            className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-300 hover:text-white bg-slate-800'
            }`}
          >
            ALL CANON
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedCategoryFilter('rare-emotion');
            }}
            className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategoryFilter === 'rare-emotion'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-rose-300 hover:text-white bg-rose-950/40 border border-rose-900/50'
            }`}
          >
            <span>💎</span>
            <span>RARE EMOTIONS ({LEXICON_DATABASE.filter(w => w.tags.includes('rare-emotion')).length})</span>
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedCategoryFilter('rare-color');
            }}
            className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategoryFilter === 'rare-color'
                ? 'bg-cyan-500 text-black shadow-md font-black'
                : 'text-cyan-300 hover:text-white bg-cyan-950/40 border border-cyan-900/50'
            }`}
          >
            <span>🎨</span>
            <span>RARE COLORS ({LEXICON_DATABASE.filter(w => w.tags.includes('rare-color')).length})</span>
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedCategoryFilter('pie-root');
            }}
            className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer ${
              selectedCategoryFilter === 'pie-root'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-purple-300 hover:text-white bg-purple-950/40 border border-purple-900/50'
            }`}
          >
            *PIE ANCESTRY ROOTS
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* Syllable filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-mono-tech uppercase font-bold mr-1">
              SYLLABLES:
            </span>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedSyllable(null);
            }}
            className={`px-2.5 py-1 rounded-full uppercase font-bold transition-all ${
              selectedSyllable === null
                ? 'text-black shadow-md'
                : 'text-slate-300 hover:text-white bg-slate-800'
            }`}
            style={selectedSyllable === null ? { backgroundColor: theme.primary } : {}}
          >
            ALL
          </button>
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => {
                playLcarsChirp('tap');
                setSelectedSyllable(selectedSyllable === s ? null : s);
              }}
              className={`px-2.5 py-1 rounded-full uppercase font-bold transition-all ${
                selectedSyllable === s
                  ? 'text-black shadow-md'
                  : 'text-slate-300 hover:text-white bg-slate-800'
              }`}
              style={selectedSyllable === s ? { backgroundColor: theme.secondary } : {}}
            >
              {s} {s === 1 ? 'SYL' : 'SYLS'}
            </button>
          ))}
        </div>

        {/* Origin language filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono-tech uppercase font-bold">
            LINGUISTIC ROOT:
          </span>
          <select
            value={selectedOrigin}
            onChange={(e) => {
              playLcarsChirp('tap');
              setSelectedOrigin(e.target.value);
            }}
            className="bg-black border border-slate-700 text-slate-200 text-xs rounded-md px-2.5 py-1 font-mono-tech focus:outline-none"
          >
            <option value="all">ALL ORIGINS</option>
            {originOptions.map((orig) => (
              <option key={orig} value={orig}>
                {orig.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      </div>

      {/* Lexicon Grid Results */}
      <div className="flex-1 overflow-y-auto">
        {filteredWords.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-mono-tech">
            <p className="text-lg uppercase">NO LEXICAL NODES LOCATED FOR "{searchTerm}"</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for phonetic rhymes (-at, -ight, -ain) or general concepts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredWords.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playLcarsChirp('tap');
                  onSelectWord(item);
                }}
                className="group p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative flex flex-col justify-between"
                style={{
                  backgroundColor: '#0c0e14',
                  borderColor: '#1e2433',
                }}
              >
                {/* Top card bar */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                        {item.word}
                      </span>
                      <span className="text-xs font-sans text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-cyan-900/40 tracking-normal">
                        {item.ipa}
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-black"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {item.syllables} {item.syllables === 1 ? 'SYL' : 'SYLS'}
                    </span>
                  </div>

                  {/* Definition */}
                  <p className="text-slate-300 text-xs line-clamp-2 font-sans mb-3 leading-relaxed">
                    {item.definition}
                  </p>

                  {/* Etymology Tag & PIE Root */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.etymology.originLanguage}
                    </span>
                    {item.etymology.pieRoot && (
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 font-bold">
                        {item.etymology.pieRoot}
                      </span>
                    )}
                  </div>

                  {/* Rhyme preview pills */}
                  <div className="text-[11px] font-mono-tech text-slate-400">
                    <span className="text-amber-400/90 font-bold mr-1">RHYMES:</span>
                    {item.perfectRhymes.slice(0, 4).join(', ')}
                    {item.perfectRhymes.length > 4 && '...'}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
                  <span className="group-hover:text-slate-300 transition-colors uppercase">
                    {item.rhymeFamilyLabel}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 opacity-80 group-hover:opacity-100">
                    INSPECT NODE <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
