/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SavedPhrase, LcarsEra, WordEntry, AttachedBeat } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { NoteBeatPlayerCard } from './NoteBeatPlayerCard';
import { AttachBeatModal } from './AttachBeatModal';
import { NewLyricNoteModal } from './NewLyricNoteModal';
import {
  Bookmark,
  Copy,
  Trash2,
  Download,
  BookOpen,
  Send,
  Sparkles,
  Music,
  Plus,
  Disc,
} from 'lucide-react';

interface FavoritesVaultProps {
  currentEra: LcarsEra;
  savedPhrases: SavedPhrase[];
  onDeletePhrase: (id: string) => void;
  onSendToAnalyzer: (text: string) => void;
  onSelectWord: (word: WordEntry) => void;
  onUpdatePhrase?: (updated: SavedPhrase) => void;
  onSavePhrase?: (newPhrase: SavedPhrase) => void;
}

export const FavoritesVault: React.FC<FavoritesVaultProps> = ({
  currentEra,
  savedPhrases,
  onDeletePhrase,
  onSendToAnalyzer,
  onSelectWord,
  onUpdatePhrase,
  onSavePhrase,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [filterTag, setFilterTag] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [attachBeatModalItem, setAttachBeatModalItem] = useState<SavedPhrase | null>(null);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState<boolean>(false);

  const handleCopy = (phrase: SavedPhrase) => {
    playLcarsChirp('ack');
    navigator.clipboard.writeText(phrase.phrase);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleAttachBeat = (beat: AttachedBeat) => {
    if (!attachBeatModalItem || !onUpdatePhrase) return;
    const updated: SavedPhrase = {
      ...attachBeatModalItem,
      attachedBeat: beat,
    };
    onUpdatePhrase(updated);
    setAttachBeatModalItem(null);
  };

  const handleDetachBeat = (phraseId: string) => {
    const target = savedPhrases.find(p => p.id === phraseId);
    if (!target || !onUpdatePhrase) return;
    const updated: SavedPhrase = {
      ...target,
      attachedBeat: undefined,
    };
    onUpdatePhrase(updated);
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
        const beatInfo = p.attachedBeat
          ? `ATTACHED BEAT: ${p.attachedBeat.name} (${p.attachedBeat.producer ? `Prod. ${p.attachedBeat.producer}` : 'Self'}, ${p.attachedBeat.bpm ? `${p.attachedBeat.bpm} BPM` : 'Unknown BPM'})`
          : 'ATTACHED BEAT: None';
        return `=== BARS #${i + 1} (${p.barCount} Bars, ${p.syllables} Syllables) ===\n${p.phrase}\n\n${beatInfo}\nATTACHED ROOTS:\n${roots}\nNOTES: ${p.notes || 'None'}\n\n`;
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
              FAVORITES VAULT & NOTE BEATS
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              {savedPhrases.length} PRESERVED PHRASE SECTORS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Lyrical Phrases Saved with Cadence Notes & Attached Beats
          </h2>
        </div>

        {/* Action Buttons: New Note, Export */}
        <div className="flex items-center flex-wrap gap-2">
          {onSavePhrase && (
            <button
              onClick={() => {
                playLcarsChirp('warp');
                setIsNewNoteModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full font-black uppercase text-xs text-black flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md"
              style={{ backgroundColor: theme.primary }}
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              <span>+ NEW NOTE & ATTACH BEAT</span>
            </button>
          )}

          <button
            onClick={() => handleExport('txt')}
            className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono-tech text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            EXPORT TXT
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
          <div className="text-center py-20 text-slate-500 font-mono-tech space-y-3">
            <Bookmark className="w-10 h-10 mx-auto opacity-40 text-amber-400" />
            <p className="text-base uppercase text-slate-300">VAULT CURRENTLY EMPTY</p>
            <p className="text-xs">
              Write bars in the Bar Analyzer and save them, or click "+ NEW NOTE & ATTACH BEAT" above to preserve lyrics and upload your beats.
            </p>
            {onSavePhrase && (
              <button
                onClick={() => setIsNewNoteModalOpen(true)}
                className="mt-3 px-4 py-2 rounded-full font-bold text-xs uppercase text-black"
                style={{ backgroundColor: theme.primary }}
              >
                + CREATE FIRST LYRIC NOTE & ATTACH BEAT
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {savedPhrases.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-3.5"
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
                    {item.attachedBeat && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-mono-tech font-bold flex items-center gap-1">
                        <Music className="w-3 h-3 text-emerald-400" />
                        BEAT ATTACHED
                      </span>
                    )}
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
                  <div className="text-xs font-mono-tech text-amber-300/80 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20">
                    <span className="font-bold text-amber-400 mr-1.5">LYRICIST NOTES:</span>
                    {item.notes}
                  </div>
                )}

                {/* Attached Beat Section (Player or Attach Button) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono-tech uppercase font-bold text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Music className="w-3 h-3 text-amber-400" />
                      NOTES ATTACHED BEAT:
                    </span>
                    {!item.attachedBeat && onUpdatePhrase && (
                      <button
                        onClick={() => {
                          playLcarsChirp('tap');
                          setAttachBeatModalItem(item);
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        + Attach Audio Beat
                      </button>
                    )}
                  </div>

                  {item.attachedBeat ? (
                    <NoteBeatPlayerCard
                      attachedBeat={item.attachedBeat}
                      currentEra={currentEra}
                      onRemoveBeat={() => handleDetachBeat(item.id)}
                      onFlowInAnalyzer={() => onSendToAnalyzer(item.phrase)}
                    />
                  ) : (
                    <div className="p-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Disc className="w-4 h-4 text-slate-500" />
                        <span className="text-xs text-slate-400 font-mono-tech">
                          No beat attached to this note yet.
                        </span>
                      </div>
                      {onUpdatePhrase && (
                        <button
                          onClick={() => {
                            playLcarsChirp('warp');
                            setAttachBeatModalItem(item);
                          }}
                          className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 cursor-pointer shadow"
                          style={{ backgroundColor: theme.primary }}
                        >
                          + ATTACH BEAT
                        </button>
                      )}
                    </div>
                  )}
                </div>

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

      {/* Attach Beat Modal */}
      {attachBeatModalItem && (
        <AttachBeatModal
          currentEra={currentEra}
          isOpen={!!attachBeatModalItem}
          onClose={() => setAttachBeatModalItem(null)}
          onAttachBeat={handleAttachBeat}
          noteTitle={attachBeatModalItem.phrase.slice(0, 60)}
        />
      )}

      {/* New Lyric Note Modal */}
      {isNewNoteModalOpen && onSavePhrase && (
        <NewLyricNoteModal
          currentEra={currentEra}
          isOpen={isNewNoteModalOpen}
          onClose={() => setIsNewNoteModalOpen(false)}
          onSavePhrase={(phrase) => {
            onSavePhrase(phrase);
            setIsNewNoteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
