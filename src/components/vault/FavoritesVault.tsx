import React, { useState } from 'react';
import { SavedPhrase, LcarsEra, WordEntry } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  Bookmark,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  BookOpen,
  Send,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

interface FavoritesVaultProps {
  currentEra: LcarsEra;
  savedPhrases: SavedPhrase[];
  onDeletePhrase: (id: string) => void;
  onSendToAnalyzer: (text: string) => void;
  onSelectWord: (word: WordEntry) => void;
}

export const FavoritesVault: React.FC<FavoritesVaultProps> = ({
  currentEra,
  savedPhrases,
  onDeletePhrase,
  onSendToAnalyzer,
  onSelectWord,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [filterTag, setFilterTag] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (phrase: SavedPhrase) => {
    playLcarsChirp('ack');
    navigator.clipboard.writeText(phrase.phrase);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = (format: 'json' | 'txt') => {
    playLcarsChirp('warp');
    let dataStr = '';
    let fileName = `rapper-friend-vault-${Date.now()}`;

    if (format === 'json') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedPhrases, null, 2));
      fileName += '.json';
    } else {
      const textLines = savedPhrases.map((p, i) => {
        const roots = p.attachedRoots.map(r => `  - [${r.word.toUpperCase()}]: ${r.pieRoot || r.origin} - ${r.definition}`).join('\n');
        return `=== BARS #${i + 1} (${p.barCount} Bars, ${p.syllables} Syllables) ===\n${p.phrase}\n\nATTACHED ROOTS:\n${roots}\nNOTES: ${p.notes || 'None'}\n\n`;
      }).join('----------------------------------------\n\n');
      dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textLines);
      fileName += '.txt';
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col gap-4 font-lcars">
      
      {/* Header Readout & Export Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              FAVORITES VAULT & ROOT ANCHORS
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              {savedPhrases.length} PRESERVED PHRASE SECTORS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Lyrical Phrases Saved with Ancestral Roots
          </h2>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('txt')}
            className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono-tech text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            EXPORT AS TXT
          </button>
          <button
            onClick={() => handleExport('json')}
            className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono-tech text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            EXPORT JSON
          </button>
        </div>
      </div>

      {/* Phrases List Display */}
      <div className="flex-1 overflow-y-auto">
        {savedPhrases.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-mono-tech">
            <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-40 text-amber-400" />
            <p className="text-base uppercase text-slate-300">VAULT CURRENTLY EMPTY</p>
            <p className="text-xs mt-1">
              Go to the Bar Analyzer to write bars and click "Save Bar & Attach Root Definitions".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPhrases.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-3"
              >
                {/* Top strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-xs font-mono-tech font-bold text-black"
                      style={{ backgroundColor: theme.primary }}
                    >
                      #0{index + 1}
                    </span>
                    <span className="text-xs font-mono-tech text-amber-300 font-bold">
                      {item.barCount} BARS • {item.syllables} SYLLABLES
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playLcarsChirp('tap');
                        onSendToAnalyzer(item.phrase);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono-tech text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Load into Bar Analyzer"
                    >
                      <Send className="w-3 h-3" /> LOAD IN ANALYZER
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Copy Phrase"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        playLcarsChirp('alert');
                        onDeletePhrase(item.id);
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete from Vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Phrase Content (Pre-formatted lyric lines) */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-sans text-sm text-slate-100 whitespace-pre-line leading-relaxed italic">
                  "{item.phrase}"
                </div>

                {/* Optional Lyricist Notes */}
                {item.notes && (
                  <div className="text-xs font-mono-tech text-amber-300/80 bg-amber-500/5 p-2 rounded border border-amber-500/20">
                    <span className="font-bold text-amber-400 mr-1.5">NOTES:</span>
                    {item.notes}
                  </div>
                )}

                {/* Attached Root Definitions Section */}
                {item.attachedRoots && item.attachedRoots.length > 0 && (
                  <div className="mt-1 space-y-1.5">
                    <div className="text-[11px] font-mono-tech uppercase font-bold text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      ATTACHED ROOTS & ANCESTRAL DEFINITIONS:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {item.attachedRoots.map((root, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between font-mono-tech">
                            <span className="font-bold text-amber-400 uppercase">
                              {root.word}
                            </span>
                            <span className="text-[10px] text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-900/40">
                              {root.pieRoot || root.origin}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-sans mt-1 leading-snug line-clamp-2">
                            {root.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
