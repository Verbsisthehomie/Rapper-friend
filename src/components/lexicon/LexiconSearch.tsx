import React, { useState, useMemo, useEffect } from 'react';
import { WordEntry, LcarsEra } from '../../types/lcars';
import { LEXICON_DATABASE, GRIME_AND_GLOBAL_FLOW_BLUEPRINTS } from '../../data/lexiconData';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  searchUniversalDictionary,
  browseUniversalByLetter,
  getSavedCustomCanon,
  saveWordToCustomCanon,
  removeWordFromCustomCanon,
} from '../../utils/universalDictionaryEngine';
import {
  Search,
  Sparkles,
  ArrowUpRight,
  Globe,
  PlusCircle,
  Check,
  Loader2,
  Star,
  Trash2,
  Send,
  Zap,
  Radio,
} from 'lucide-react';

interface LexiconSearchProps {
  currentEra: LcarsEra;
  onSelectWord: (word: WordEntry) => void;
  onSendToAnalyzer: (text: string) => void;
}

type CategoryFilterType =
  | 'all'
  | 'idiom-proverb'
  | 'aave-slang'
  | 'uk-african-slang'
  | 'astrometric-quantum'
  | 'cypher-rhetoric'
  | 'occult-arcana'
  | 'poetic-sublime'
  | 'romantic-devotion'
  | 'obscure-curio'
  | 'rare-emotion'
  | 'rare-color'
  | 'pie-root'
  | 'saved-canon';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const LexiconSearch: React.FC<LexiconSearchProps> = ({
  currentEra,
  onSelectWord,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [searchTerm, setSearchTerm] = useState('');
  const [lexiconMode, setLexiconMode] = useState<'canon' | 'universal' | 'grime-lab'>('canon');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedSyllable, setSelectedSyllable] = useState<number | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryFilterType>('all');

  // User's custom pinned words from Universal Dictionary
  const [customCanonWords, setCustomCanonWords] = useState<WordEntry[]>(() => getSavedCustomCanon());

  // Live Universal Dictionary results (400,000+ words & idioms)
  const [universalResults, setUniversalResults] = useState<WordEntry[]>([]);
  const [isUniversalLoading, setIsUniversalLoading] = useState(false);

  // Combined Canon Database (Built-in 302 + User Pinned Canon)
  const fullCanonDatabase = useMemo(() => {
    const builtInIds = new Set(LEXICON_DATABASE.map(w => w.id.toLowerCase()));
    const uniqueCustom = customCanonWords.filter(w => !builtInIds.has(w.id.toLowerCase()));
    return [...uniqueCustom, ...LEXICON_DATABASE];
  }, [customCanonWords]);

  const originOptions = useMemo(() => {
    const set = new Set<string>();
    fullCanonDatabase.forEach(w => {
      if (w.etymology.originLanguage) {
        set.add(w.etymology.originLanguage.split('/')[0].trim());
      }
    });
    return Array.from(set);
  }, [fullCanonDatabase]);

  const categoryCounts = useMemo(() => {
    return {
      total: fullCanonDatabase.length,
      idiom: fullCanonDatabase.filter(w => w.tags.includes('idiom-proverb')).length,
      aave: fullCanonDatabase.filter(w => w.tags.includes('aave-slang')).length,
      ukAfrican: fullCanonDatabase.filter(w => w.tags.includes('uk-african-slang')).length,
      astrometric: fullCanonDatabase.filter(w => w.tags.includes('astrometric-quantum')).length,
      cypher: fullCanonDatabase.filter(w => w.tags.includes('cypher-rhetoric')).length,
      occult: fullCanonDatabase.filter(w => w.tags.includes('occult-arcana')).length,
      poetic: fullCanonDatabase.filter(w => w.tags.includes('poetic-sublime')).length,
      romantic: fullCanonDatabase.filter(w => w.tags.includes('romantic-devotion')).length,
      obscure: fullCanonDatabase.filter(w => w.tags.includes('obscure-curio')).length,
      emotion: fullCanonDatabase.filter(w => w.tags.includes('rare-emotion')).length,
      color: fullCanonDatabase.filter(w => w.tags.includes('rare-color')).length,
      pie: fullCanonDatabase.filter(w => Boolean(w.etymology.pieRoot)).length,
      saved: customCanonWords.length,
    };
  }, [fullCanonDatabase, customCanonWords]);

  const filteredCanonWords = useMemo(() => {
    return fullCanonDatabase.filter(w => {
      const matchSearch =
        !searchTerm ||
        w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.rhymeFamilyLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.etymology.history.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.etymology.pieRoot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchLetter =
        !selectedLetter || w.word.toUpperCase().startsWith(selectedLetter);

      const matchSyllable =
        selectedSyllable === null ||
        (selectedSyllable === 5 ? w.syllables >= 5 : w.syllables === selectedSyllable);

      const matchOrigin =
        selectedOrigin === 'all' ||
        w.etymology.originLanguage.toLowerCase().includes(selectedOrigin.toLowerCase());

      const matchCategory =
        selectedCategoryFilter === 'all' ||
        (selectedCategoryFilter === 'idiom-proverb' && w.tags.includes('idiom-proverb')) ||
        (selectedCategoryFilter === 'aave-slang' && w.tags.includes('aave-slang')) ||
        (selectedCategoryFilter === 'uk-african-slang' && w.tags.includes('uk-african-slang')) ||
        (selectedCategoryFilter === 'astrometric-quantum' && w.tags.includes('astrometric-quantum')) ||
        (selectedCategoryFilter === 'cypher-rhetoric' && w.tags.includes('cypher-rhetoric')) ||
        (selectedCategoryFilter === 'occult-arcana' && w.tags.includes('occult-arcana')) ||
        (selectedCategoryFilter === 'poetic-sublime' && w.tags.includes('poetic-sublime')) ||
        (selectedCategoryFilter === 'romantic-devotion' && w.tags.includes('romantic-devotion')) ||
        (selectedCategoryFilter === 'obscure-curio' && w.tags.includes('obscure-curio')) ||
        (selectedCategoryFilter === 'rare-emotion' && w.tags.includes('rare-emotion')) ||
        (selectedCategoryFilter === 'rare-color' && w.tags.includes('rare-color')) ||
        (selectedCategoryFilter === 'pie-root' && Boolean(w.etymology.pieRoot)) ||
        (selectedCategoryFilter === 'saved-canon' && w.tags.includes('saved-canon'));

      return matchSearch && matchLetter && matchSyllable && matchOrigin && matchCategory;
    });
  }, [fullCanonDatabase, searchTerm, selectedLetter, selectedSyllable, selectedOrigin, selectedCategoryFilter]);

  // Trigger Universal Dictionary search when typing a query or browsing by letter in Universal mode
  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed.length >= 2) {
      let active = true;
      setIsUniversalLoading(true);
      const timer = setTimeout(() => {
        searchUniversalDictionary(trimmed).then(results => {
          if (!active) return;
          const filtered = results.filter(w => {
            const matchSyl =
              selectedSyllable === null ||
              (selectedSyllable === 5 ? w.syllables >= 5 : w.syllables === selectedSyllable);
            return matchSyl;
          });
          setUniversalResults(filtered);
          setIsUniversalLoading(false);
        });
      }, 220);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }

    if (lexiconMode === 'universal') {
      const targetLetter = selectedLetter || 'A';
      let active = true;
      setIsUniversalLoading(true);
      browseUniversalByLetter(targetLetter).then(results => {
        if (!active) return;
        const filtered = results.filter(w => {
          const matchSyl =
            selectedSyllable === null ||
            (selectedSyllable === 5 ? w.syllables >= 5 : w.syllables === selectedSyllable);
          return matchSyl;
        });
        setUniversalResults(filtered);
        setIsUniversalLoading(false);
      });
      return () => {
        active = false;
      };
    }

    setUniversalResults([]);
    setIsUniversalLoading(false);
  }, [searchTerm, lexiconMode, selectedLetter, selectedSyllable]);

  const handlePinWord = (e: React.MouseEvent, item: WordEntry) => {
    e.stopPropagation();
    playLcarsChirp('warp');
    const updated = saveWordToCustomCanon(item);
    setCustomCanonWords(updated);
  };

  const handleUnpinWord = (e: React.MouseEvent, wordId: string) => {
    e.stopPropagation();
    playLcarsChirp('tap');
    const updated = removeWordFromCustomCanon(wordId);
    setCustomCanonWords(updated);
  };

  const isPinnedOrCanon = (wordId: string) => {
    const lower = wordId.toLowerCase();
    return fullCanonDatabase.some(w => w.id.toLowerCase() === lower || w.word.toLowerCase() === lower);
  };

  const renderWordCard = (item: WordEntry, isUniversalSection = false) => {
    const isCustomPinned = customCanonWords.some(w => w.id.toLowerCase() === item.id.toLowerCase());
    const alreadyInCanon = isPinnedOrCanon(item.id);
    const isIdiom = item.tags.includes('idiom-proverb');

    return (
      <div
        key={`${isUniversalSection ? 'uni' : 'can'}-${item.id}`}
        onClick={() => {
          playLcarsChirp('tap');
          onSelectWord(item);
        }}
        className="group p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative flex flex-col justify-between"
        style={{
          backgroundColor: '#0c0e14',
          borderColor: isUniversalSection ? '#164e63' : '#1e2433',
        }}
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-white group-hover:text-amber-400 transition-colors">
                {item.word}
              </span>
              <span className="text-xs font-sans text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-cyan-900/40 tracking-normal">
                {item.ipa}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isUniversalSection && !alreadyInCanon && (
                <button
                  onClick={(e) => handlePinWord(e, item)}
                  title="Pin word or saying to your personal LCARS Canon"
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-3 h-3" />
                  PIN
                </button>
              )}
              {isCustomPinned && (
                <button
                  onClick={(e) => handleUnpinWord(e, item.id)}
                  title="Remove from Pinned Canon"
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 hover:bg-rose-600/80 text-amber-300 hover:text-white border border-amber-500/40 flex items-center gap-1 transition-colors"
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  PINNED
                  <Trash2 className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                </button>
              )}
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-black"
                style={{ backgroundColor: theme.primary }}
              >
                {item.syllables} {item.syllables === 1 ? 'SYL' : 'SYLS'}
              </span>
            </div>
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
            {isIdiom && (
              <span className="px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-800/50 font-bold">
                🗣️ IDIOM / PROVERB
              </span>
            )}
            {item.etymology.pieRoot && (
              <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 font-bold">
                {item.etymology.pieRoot}
              </span>
            )}
            {isUniversalSection && (
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" />
                CMU / WIKTIONARY
              </span>
            )}
          </div>

          {/* Rhyme preview pills */}
          {item.perfectRhymes.length > 0 && (
            <div className="text-[11px] font-mono-tech text-slate-400">
              <span className="text-amber-400/90 font-bold mr-1">RHYMES:</span>
              {item.perfectRhymes.slice(0, 4).join(', ')}
              {item.perfectRhymes.length > 4 && '...'}
            </div>
          )}
        </div>

        {/* Bottom Card Footer */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
          <span className="group-hover:text-slate-300 transition-colors uppercase truncate max-w-[65%]">
            {item.rhymeFamilyLabel}
          </span>
          <span className="flex items-center gap-1 text-amber-400 opacity-80 group-hover:opacity-100 shrink-0">
            INSPECT NODE <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-4 font-lcars">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              SUBSPACE LEXICAL & VERNACULAR MATRIX
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              CANON: {fullCanonDatabase.length} NODES • UNIVERSAL DICTIONARY, IDIOMS, AAVE, UK GRIME & AFRICAN SLANG
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Lexicon, Idioms, Global Vernacular & UK Grime Flow Lab
          </h2>
        </div>

        {/* Mode Switcher + Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
          <div className="flex rounded-full bg-slate-900 p-1 border border-slate-800 text-xs shrink-0 flex-wrap">
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setLexiconMode('canon');
              }}
              className={`px-3 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                lexiconMode === 'canon'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              CANON ({fullCanonDatabase.length})
            </button>
            <button
              onClick={() => {
                playLcarsChirp('warp');
                setLexiconMode('universal');
              }}
              className={`px-3 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                lexiconMode === 'universal'
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-cyan-300/80 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              400K+ DICTIONARY & SAYINGS
            </button>
            <button
              onClick={() => {
                playLcarsChirp('warp');
                setLexiconMode('grime-lab');
              }}
              className={`px-3 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                lexiconMode === 'grime-lab'
                  ? 'bg-emerald-400 text-black shadow-md'
                  : 'text-emerald-300/80 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              🇬🇧🌍 UK GRIME & GLOBAL FLOWS
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80 lg:w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search word, saying ("it is what it is"), or slang...'
              className="w-full bg-black border-2 rounded-full py-2 pl-9 pr-14 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-mono-tech"
              style={{
                borderColor: lexiconMode === 'universal' ? '#22d3ee' : theme.secondary,
              }}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Chips & A-Z Index Deck (Shown in Canon & Universal Modes) */}
      {lexiconMode !== 'grime-lab' && (
        <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          {lexiconMode === 'canon' && (
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
                ALL CANON ({categoryCounts.total})
              </button>

              {/* Idioms, Proverbs & Sayings */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('idiom-proverb');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'idiom-proverb'
                    ? 'bg-orange-500 text-black font-black shadow-md'
                    : 'text-orange-300 hover:text-white bg-orange-950/40 border border-orange-800/60'
                }`}
              >
                <span>🗣️</span>
                <span>IDIOMS & SAYINGS ({categoryCounts.idiom})</span>
              </button>

              {/* AAVE & Americas Slang */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('aave-slang');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'aave-slang'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-blue-300 hover:text-white bg-blue-950/40 border border-blue-800/60'
                }`}
              >
                <span>🇺🇸</span>
                <span>AAVE & AMERICAS ({categoryCounts.aave})</span>
              </button>

              {/* UK Grime, MLE & African Slang */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('uk-african-slang');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'uk-african-slang'
                    ? 'bg-emerald-500 text-black font-black shadow-md'
                    : 'text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-800/60'
                }`}
              >
                <span>🇬🇧🌍</span>
                <span>UK GRIME & AFRICAN SLANG ({categoryCounts.ukAfrican})</span>
              </button>

              {/* Astrometric & Quantum */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('astrometric-quantum');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'astrometric-quantum'
                    ? 'bg-sky-500 text-black font-black shadow-md'
                    : 'text-sky-300 hover:text-white bg-sky-950/40 border border-sky-800/60'
                }`}
              >
                <span>🪐</span>
                <span>ASTROMETRIC & QUANTUM ({categoryCounts.astrometric})</span>
              </button>

              {/* Underground Cypher & Rhetoric */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('cypher-rhetoric');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'cypher-rhetoric'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-red-300 hover:text-white bg-red-950/40 border border-red-800/60'
                }`}
              >
                <span>⚔️</span>
                <span>CYPHER & RHETORIC ({categoryCounts.cypher})</span>
              </button>

              {/* Occult & Arcana */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('occult-arcana');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'occult-arcana'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white bg-purple-950/40 border border-purple-800/60'
                }`}
              >
                <span>🔮</span>
                <span>OCCULT & ARCANA ({categoryCounts.occult})</span>
              </button>

              {/* Poetic & Sublime */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('poetic-sublime');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'poetic-sublime'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-800/60'
                }`}
              >
                <span>🌌</span>
                <span>POETIC & SUBLIME ({categoryCounts.poetic})</span>
              </button>

              {/* Romance & Devotion */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('romantic-devotion');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'romantic-devotion'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-rose-300 hover:text-white bg-rose-950/40 border border-rose-800/60'
                }`}
              >
                <span>🌹</span>
                <span>ROMANCE & DEVOTION ({categoryCounts.romantic})</span>
              </button>

              {/* Obscure Curiosities */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('obscure-curio');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'obscure-curio'
                    ? 'bg-amber-600 text-black font-black shadow-md'
                    : 'text-amber-300 hover:text-white bg-amber-950/40 border border-amber-800/60'
                }`}
              >
                <span>📜</span>
                <span>OBSCURE CURIOSITIES ({categoryCounts.obscure})</span>
              </button>

              {/* Rare Emotions */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('rare-emotion');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'rare-emotion'
                    ? 'bg-fuchsia-600 text-white shadow-md'
                    : 'text-fuchsia-300 hover:text-white bg-fuchsia-950/40 border border-fuchsia-900/50'
                }`}
              >
                <span>💎</span>
                <span>RARE EMOTIONS ({categoryCounts.emotion})</span>
              </button>

              {/* Rare Colors */}
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
                <span>RARE COLORS ({categoryCounts.color})</span>
              </button>

              {/* PIE Roots */}
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedCategoryFilter('pie-root');
                }}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategoryFilter === 'pie-root'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-900/50'
                }`}
              >
                <span>🌿</span>
                <span>*PIE ROOTS ({categoryCounts.pie})</span>
              </button>

              {/* User Pinned Canon */}
              {categoryCounts.saved > 0 && (
                <button
                  onClick={() => {
                    playLcarsChirp('tap');
                    setSelectedCategoryFilter('saved-canon');
                  }}
                  className={`px-3 py-1 rounded-full uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategoryFilter === 'saved-canon'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'text-yellow-300 hover:text-white bg-yellow-950/40 border border-yellow-700/60'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>MY PINNED CANON ({categoryCounts.saved})</span>
                </button>
              )}
            </div>
          )}

          {/* A–Z Quick Alphabetical Subspace Index Bar */}
          <div className="flex items-center gap-1 flex-wrap pb-2 border-b border-slate-800/60">
            <span className="text-slate-400 font-mono-tech uppercase font-bold mr-1.5">
              INDEX:
            </span>
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setSelectedLetter(null);
              }}
              className={`px-2 py-0.5 rounded font-mono-tech font-bold uppercase transition-all cursor-pointer ${
                selectedLetter === null
                  ? 'bg-amber-400 text-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ALL
            </button>
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedLetter(selectedLetter === letter ? null : letter);
                }}
                className={`w-6 h-6 rounded font-mono-tech font-bold text-center transition-all cursor-pointer ${
                  selectedLetter === letter
                    ? 'bg-cyan-400 text-black shadow-sm'
                    : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Syllables & Linguistic Root Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-mono-tech uppercase font-bold mr-1">
                SYLLABLES:
              </span>
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedSyllable(null);
                }}
                className={`px-2.5 py-1 rounded-full uppercase font-bold transition-all cursor-pointer ${
                  selectedSyllable === null
                    ? 'text-black shadow-md'
                    : 'text-slate-300 hover:text-white bg-slate-800'
                }`}
                style={selectedSyllable === null ? { backgroundColor: theme.primary } : {}}
              >
                ALL
              </button>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    playLcarsChirp('tap');
                    setSelectedSyllable(selectedSyllable === s ? null : s);
                  }}
                  className={`px-2.5 py-1 rounded-full uppercase font-bold transition-all cursor-pointer ${
                    selectedSyllable === s
                      ? 'text-black shadow-md'
                      : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                  style={selectedSyllable === s ? { backgroundColor: theme.secondary } : {}}
                >
                  {s === 5 ? '5+ SYLS' : `${s} ${s === 1 ? 'SYL' : 'SYLS'}`}
                </button>
              ))}
            </div>

            {lexiconMode === 'canon' && (
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
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* MODE 3: UK GRIME, ROAD RAP & GLOBAL VERNACULAR FLOW ARCHITECTURES */}
        {lexiconMode === 'grime-lab' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono-tech text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  PIRATE RADIO & SUBSPACE ACOUSTIC CODEX // 140 BPM TO GLOBAL POLYRHYTHM
                </div>
                <h3 className="text-xl font-bold uppercase text-white mt-0.5">
                  UK Grime, Road Rap, US Regional AAVE & West African Flow Architectures
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-1">
                  Why UK Grime MCs formulate 8-bar and 16-bar reload bursts at 140 BPM differently from 90 BPM US Boom-Bap, how MLE glottal stops and non-rhotic vowels shift rhyme families, and how to test each cadence in the Bar Analyzer.
                </p>
              </div>
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setLexiconMode('canon');
                  setSelectedCategoryFilter('uk-african-slang');
                }}
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
              >
                BROWSE UK & AFRICAN SLANG NODES ({categoryCounts.ukAfrican})
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {GRIME_AND_GLOBAL_FLOW_BLUEPRINTS.map((bp) => (
                <div
                  key={bp.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{bp.regionFlag}</span>
                        <div>
                          <h4 className="text-lg font-bold uppercase text-amber-400 tracking-wide">
                            {bp.title}
                          </h4>
                          <div className="text-[11px] font-mono-tech text-cyan-300">
                            {bp.bpmRange} • {bp.originEra}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pioneers */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-tech">
                      <span className="text-slate-400 uppercase font-bold mr-1">ARCHITECTS:</span>
                      {bp.pioneers.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* Core Architecture */}
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {bp.coreArchitecture}
                    </p>

                    {/* Phonetic & Structural Rules */}
                    <div className="p-3 rounded-xl bg-black/50 border border-slate-800/80 space-y-1.5">
                      <div className="text-[10px] font-mono-tech uppercase font-bold text-emerald-400">
                        // PHONETIC & CADENCE RULES:
                      </div>
                      <ul className="space-y-1 text-xs font-sans text-slate-300 list-disc list-inside">
                        {bp.phoneticRules.map((rule, rIdx) => (
                          <li key={rIdx} className="leading-snug">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bar Formulation Secret */}
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-sans text-amber-200 flex items-start gap-2">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="uppercase font-mono-tech text-amber-400 mr-1">
                          MC FORMULATION SECRET:
                        </strong>
                        {bp.barFormulationSecret}
                      </span>
                    </div>

                    {/* 4-Bar Exemplar */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono-tech text-xs text-cyan-200 whitespace-pre-line leading-relaxed">
                      {bp.exemplarBars}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        playLcarsChirp('warp');
                        onSendToAnalyzer(bp.exemplarBars);
                      }}
                      className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      LOAD 4-BAR EXEMPLAR INTO BAR ANALYZER
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 1: Curated Canon Results */}
        {lexiconMode === 'canon' && (
          <div>
            {filteredCanonWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredCanonWords.map((item) => renderWordCard(item, false))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 font-mono-tech">
                <p className="text-sm uppercase text-amber-300">
                  "{searchTerm}" IS NOT IN YOUR {fullCanonDatabase.length} CURATED CANON NODES
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Scanning the 400,000+ Universal English Dictionary, Wiktionary Idioms & Proverb Matrix below...
                </p>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Universal Subspace Dictionary & Idiom Results */}
        {(lexiconMode === 'universal' || (lexiconMode === 'canon' && searchTerm.trim().length >= 2)) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-cyan-300">
                  {searchTerm.trim()
                    ? `UNIVERSAL DICTIONARY, IDIOMS & PHRASE MATCHES FOR "${searchTerm.toUpperCase()}"`
                    : `UNIVERSAL DICTIONARY INDEX — LETTER "${selectedLetter || 'A'}" (400,000+ WORDS & SAYINGS)`}
                </span>
              </div>
              {isUniversalLoading && (
                <span className="text-xs font-mono-tech text-cyan-400 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  SYNTHESIZING PHONEMES, IDIOMS & ETYMOLOGY...
                </span>
              )}
            </div>

            {universalResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {universalResults.map((item) => renderWordCard(item, true))}
              </div>
            ) : !isUniversalLoading ? (
              <div className="text-center py-10 text-slate-500 font-mono-tech text-xs uppercase">
                No matching nodes returned. Try another English word, saying, or root prefix.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
