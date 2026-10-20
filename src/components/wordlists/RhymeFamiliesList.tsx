import React, { useState } from 'react';
import { WordEntry, LcarsEra } from '../../types/lcars';
import { RHYME_FAMILIES, LEXICON_DATABASE } from '../../data/lexiconData';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { countSyllables } from '../../utils/rhymeEngine';
import { Copy, Plus, Sparkles, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

interface RhymeFamiliesListProps {
  currentEra: LcarsEra;
  onSelectWord: (word: WordEntry) => void;
  onSendToAnalyzer: (text: string) => void;
}

export const RhymeFamiliesList: React.FC<RhymeFamiliesListProps> = ({
  currentEra,
  onSelectWord,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('-æt');
  const [syllableFilter, setSyllableFilter] = useState<'all' | '1' | '2' | '3+'>('all');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  // Collect all unique words belonging to the selected family
  const currentFamilyWords = React.useMemo(() => {
    // Find all database entries in this family
    const dbWords = LEXICON_DATABASE.filter(w => w.rhymeFamily === selectedFamilyId);
    
    // Also extract all perfectRhymes lists for this family
    const wordSet = new Map<string, { syllables: number; inDb: boolean; dbEntry?: WordEntry }>();
    
    dbWords.forEach(w => {
      wordSet.set(w.word.toLowerCase(), { syllables: w.syllables, inDb: true, dbEntry: w });
      w.perfectRhymes.forEach(r => {
        const rLower = r.toLowerCase();
        if (!wordSet.has(rLower)) {
          const match = LEXICON_DATABASE.find(x => x.word.toLowerCase() === rLower);
          wordSet.set(rLower, {
            syllables: match ? match.syllables : countSyllables(rLower),
            inDb: !!match,
            dbEntry: match,
          });
        }
      });
    });

    let list = Array.from(wordSet.entries()).map(([word, meta]) => ({
      word,
      syllables: meta.syllables,
      inDb: meta.inDb,
      dbEntry: meta.dbEntry,
    }));

    if (syllableFilter === '1') {
      list = list.filter(w => w.syllables === 1);
    } else if (syllableFilter === '2') {
      list = list.filter(w => w.syllables === 2);
    } else if (syllableFilter === '3+') {
      list = list.filter(w => w.syllables >= 3);
    }

    // Sort by syllables ascending, then alphabetically
    return list.sort((a, b) => a.syllables - b.syllables || a.word.localeCompare(b.word));
  }, [selectedFamilyId, syllableFilter]);

  const activeFamily = RHYME_FAMILIES.find(f => f.id === selectedFamilyId) || RHYME_FAMILIES[0];

  const handleCopy = (w: string) => {
    playLcarsChirp('ack');
    navigator.clipboard.writeText(w);
    setCopiedWord(w);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const handleInsert = (w: string) => {
    playLcarsChirp('tap');
    onSendToAnalyzer(w);
  };

  const handleSelectWord = (item: { word: string; inDb: boolean; dbEntry?: WordEntry }) => {
    playLcarsChirp('tap');
    if (item.dbEntry) {
      onSelectWord(item.dbEntry);
    } else {
      // Find or construct transient entry
      const match = LEXICON_DATABASE.find(x => x.word.toLowerCase() === item.word.toLowerCase());
      if (match) {
        onSelectWord(match);
      } else {
        // Fallback to related family parent
        const parent = LEXICON_DATABASE.find(x => x.rhymeFamily === selectedFamilyId) || LEXICON_DATABASE[0];
        onSelectWord({
          ...parent,
          id: item.word,
          word: item.word,
          syllables: countSyllables(item.word),
          definition: `Associated member of the ${activeFamily.label} rhyme family.`,
        });
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 font-lcars">
      
      {/* Header Readout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.secondary }}
            >
              RHYME FAMILIES // DIRECT WORD LISTS
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              OKUDA CATALOG 02-882
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Phonetic Coda & Word Clustered Arrays
          </h2>
        </div>

        {/* Syllable Filter Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-full border border-slate-800 text-xs">
          <span className="px-2 text-slate-400 font-mono-tech uppercase font-bold text-[10px]">
            FILTER SYL:
          </span>
          {(['all', '1', '2', '3+'] as const).map((filterVal) => (
            <button
              key={filterVal}
              onClick={() => {
                playLcarsChirp('tap');
                setSyllableFilter(filterVal);
              }}
              className={`px-3 py-1 rounded-full font-bold uppercase transition-all ${
                syllableFilter === filterVal
                  ? 'text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={syllableFilter === filterVal ? { backgroundColor: theme.primary } : {}}
            >
              {filterVal === 'all' ? 'ALL' : filterVal === '3+' ? '3+ SYL' : `${filterVal} SYL`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Left = Family Selector Buttons, Right = Words Clustered Display */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Family Pill Selectors (LCARS horizontal-pill rack) */}
        <div className="w-full lg:w-80 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pr-1">
          {RHYME_FAMILIES.map((family) => {
            const isSelected = selectedFamilyId === family.id;
            return (
              <button
                key={family.id}
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedFamilyId(family.id);
                }}
                className={`p-3 rounded-xl transition-all text-left flex flex-col justify-between border ${
                  isSelected
                    ? 'text-black shadow-lg translate-x-1 border-white/40'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
                style={isSelected ? { backgroundColor: theme.primary } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold uppercase tracking-wide">
                    {family.label}
                  </span>
                  <span
                    className={`text-[10px] font-sans px-2 py-0.5 rounded ${
                      isSelected ? 'bg-black text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {family.id}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-mono-tech mt-1.5 truncate ${
                    isSelected ? 'text-black/80 font-bold' : 'text-slate-400'
                  }`}
                >
                  {family.examples}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Rhyme Family Words Canvas */}
        <div className="flex-1 rounded-2xl bg-black/60 border border-slate-800 p-4 sm:p-6 flex flex-col overflow-hidden">
          
          {/* Active Family Header */}
          <div className="pb-4 mb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono-tech text-amber-400 font-bold uppercase">
                ACTIVE RHYME POCKET // {activeFamily.id}
              </div>
              <h3 className="text-2xl font-bold uppercase text-white mt-0.5">
                {activeFamily.label} ({currentFamilyWords.length} Words Compiled)
              </h3>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                Example Articulations: {activeFamily.examples}
              </p>
            </div>

            <button
              onClick={() => {
                playLcarsChirp('ack');
                const allWordsStr = currentFamilyWords.map(w => w.word).join(', ');
                navigator.clipboard.writeText(allWordsStr);
                setCopiedWord('all');
                setTimeout(() => setCopiedWord(null), 1500);
              }}
              className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono-tech text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              {copiedWord === 'all' ? 'COPIED TO CLIPBOARD!' : 'COPY ENTIRE LIST'}
            </button>
          </div>

          {/* Word Pills Flow Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {currentFamilyWords.map((item) => (
                <div
                  key={item.word}
                  className="group relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span
                      onClick={() => handleSelectWord(item)}
                      className="text-base font-bold uppercase tracking-wide text-white group-hover:text-amber-400 cursor-pointer transition-colors"
                      title="Click to view etymology & definition"
                    >
                      {item.word}
                    </span>
                    <span
                      className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded text-black font-bold"
                      style={{
                        backgroundColor:
                          item.syllables === 1
                            ? theme.primary
                            : item.syllables === 2
                            ? theme.secondary
                            : theme.accent,
                      }}
                    >
                      {item.syllables}S
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                    <button
                      onClick={() => handleSelectWord(item)}
                      className="hover:text-cyan-300 text-[10px] uppercase font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      ROOT <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(item.word)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Copy word"
                        aria-label={`Copy word ${item.word}`}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleInsert(item.word)}
                        className="p-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300"
                        title="Insert into Bar Analyzer"
                        aria-label={`Insert ${item.word} into bar analyzer`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
