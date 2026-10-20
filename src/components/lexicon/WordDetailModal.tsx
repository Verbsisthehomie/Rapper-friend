import React from 'react';
import { WordEntry, LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { X, Copy, Bookmark, Send, Sparkles, BookOpen, Share2, Compass } from 'lucide-react';

interface WordDetailModalProps {
  word: WordEntry | null;
  onClose: () => void;
  currentEra: LcarsEra;
  onSendToAnalyzer?: (text: string) => void;
  onSaveToVault?: (word: WordEntry) => void;
  onSelectWord?: (wordId: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  currentEra,
  onSendToAnalyzer,
  onSaveToVault,
  onSelectWord,
}) => {
  if (!word) return null;
  const theme = LCARS_THEMES[currentEra];

  const handleCopy = () => {
    playLcarsChirp('ack');
    navigator.clipboard.writeText(word.word);
  };

  const handleSend = () => {
    playLcarsChirp('ack');
    if (onSendToAnalyzer) {
      onSendToAnalyzer(word.artRapSnippet || word.word);
    }
  };

  const handleSave = () => {
    playLcarsChirp('warp');
    if (onSaveToVault) {
      onSaveToVault(word);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full max-w-3xl rounded-3xl border-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-lcars animate-in fade-in zoom-in-95 duration-200"
        style={{
          borderColor: theme.primary,
          backgroundColor: theme.panelBg,
        }}
      >
        {/* Header Bar */}
        <div
          className="px-5 py-3 flex items-center justify-between text-black font-extrabold uppercase tracking-widest"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl tracking-tight">{word.word.toUpperCase()}</span>
            <span className="bg-black text-cyan-300 px-2.5 py-0.5 rounded-full text-xs font-sans tracking-normal border border-cyan-800/40">
              {word.ipa}
            </span>
            <span className="text-xs bg-black/20 px-2 py-0.5 rounded uppercase">
              {word.pos} • {word.syllables} {word.syllables === 1 ? 'SYLLABLE' : 'SYLLABLES'}
            </span>
          </div>

          <button
            onClick={() => {
              playLcarsChirp('tap');
              onClose();
            }}
            className="p-1 rounded-full bg-black/20 hover:bg-black text-black hover:text-white transition-colors"
            aria-label="Close word details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Definition Block */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] font-mono-tech uppercase font-bold tracking-wider mb-1" style={{ color: theme.secondary }}>
              // SEMANTIC MATRIX & DEFINITION
            </div>
            <p className="text-slate-200 leading-relaxed font-sans text-base">
              {word.definition}
            </p>
          </div>

          {/* Etymological Lineage & Linguistic Origins */}
          <div className="p-4 rounded-xl border border-slate-800 bg-black/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: theme.accent }}>
                <Compass className="w-4 h-4" />
                ETYMOLOGICAL RADIX & HISTORICAL GENEALOGY
              </span>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                ORIGIN: {word.etymology.originLanguage.toUpperCase()}
              </span>
            </div>

            {word.etymology.pieRoot && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono-tech px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                  PIE ROOT: {word.etymology.pieRoot}
                </span>
                <span className="text-slate-400">Deep Indo-European Ancestral Stem</span>
              </div>
            )}

            <p className="text-slate-300 leading-relaxed font-sans text-sm">
              {word.etymology.history}
            </p>

            {/* Linguistic Evolution Chain */}
            {word.etymology.evolutionChain && word.etymology.evolutionChain.length > 0 && (
              <div className="pt-2">
                <div className="text-[10px] font-mono-tech text-slate-400 uppercase mb-1">
                  Morphological Evolution Chain:
                </div>
                <div className="flex flex-wrap items-center gap-1.5 font-mono-tech text-xs">
                  {word.etymology.evolutionChain.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-1 rounded bg-slate-800/90 text-amber-200 border border-slate-700">
                        {step}
                      </span>
                      {idx < word.etymology.evolutionChain.length - 1 && (
                        <span className="text-slate-500 font-bold">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Cognates */}
            {word.etymology.cognates && word.etymology.cognates.length > 0 && (
              <div className="pt-2">
                <div className="text-[10px] font-mono-tech text-slate-400 uppercase mb-1">
                  Sister Cognates Across Languages:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {word.etymology.cognates.map((cog, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-mono-tech bg-slate-900 text-cyan-300 border border-cyan-900/40"
                    >
                      {cog}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rhyme Spectrum (Perfect, Slant, Multisyllabic) */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.secondary }}>
              // RHYME RESONANCE SPECTRUM ({word.rhymeFamilyLabel})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Perfect Rhymes */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-mono-tech text-amber-400 uppercase font-bold mb-1.5">
                  PERFECT RHYMES
                </div>
                <div className="flex flex-wrap gap-1">
                  {word.perfectRhymes.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectWord && onSelectWord(r)}
                      className="px-2 py-0.5 rounded text-xs bg-slate-800 hover:bg-amber-500 hover:text-black transition-colors cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slant / Half Rhymes */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-mono-tech text-purple-400 uppercase font-bold mb-1.5">
                  SLANT & ASSONANT
                </div>
                <div className="flex flex-wrap gap-1">
                  {word.slantRhymes.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectWord && onSelectWord(r)}
                      className="px-2 py-0.5 rounded text-xs bg-slate-800 hover:bg-purple-500 hover:text-black transition-colors cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multisyllable Rhymes */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-mono-tech text-cyan-400 uppercase font-bold mb-1.5">
                  MULTISYLLABIC (3+ SYL)
                </div>
                <div className="flex flex-wrap gap-1">
                  {word.multisyllableRhymes.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectWord && onSelectWord(r)}
                      className="px-2 py-0.5 rounded text-xs bg-slate-800 hover:bg-cyan-400 hover:text-black transition-colors cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Art-Rap Lyric Snippet */}
          {word.artRapSnippet && (
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="text-[10px] font-mono-tech uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ART-RAP CADENCE EXEMPLAR
              </div>
              <p className="italic text-amber-100 font-sans text-base">
                "{word.artRapSnippet}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Action Strip */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              COPY WORD
            </button>
            <button
              onClick={handleSend}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              style={{ color: theme.auxiliary }}
            >
              <Send className="w-3.5 h-3.5" />
              INSERT IN BAR ANALYZER
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full font-bold text-black uppercase tracking-wider text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
            style={{ backgroundColor: theme.primary }}
          >
            <Bookmark className="w-3.5 h-3.5" />
            SAVE ROOT TO VAULT
          </button>
        </div>
      </div>
    </div>
  );
};
