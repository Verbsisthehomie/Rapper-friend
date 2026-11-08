/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NewLyricNoteModal: Allows users to create a new lyrical note
 * with optional cadence notes and an attached custom beat (MP3/WAV)
 * directly from the Favorites Vault.
 */

import React, { useState, useRef } from 'react';
import { AttachedBeat, LcarsEra, SavedPhrase } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { saveNoteBeat } from '../../utils/noteBeatsStorage';
import {
  Plus,
  X,
  Music,
  Upload,
  Sparkles,
  Disc,
  Play,
  Pause,
  FileAudio,
} from 'lucide-react';

interface NewLyricNoteModalProps {
  currentEra: LcarsEra;
  isOpen: boolean;
  onClose: () => void;
  onSavePhrase: (phrase: SavedPhrase) => void;
}

export const NewLyricNoteModal: React.FC<NewLyricNoteModalProps> = ({
  currentEra,
  isOpen,
  onClose,
  onSavePhrase,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const [phrase, setPhrase] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('Studio Session, Art-Rap');

  // Beat Attachment
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAlphIntroSelected, setIsAlphIntroSelected] = useState<boolean>(false);
  const [beatTitle, setBeatTitle] = useState<string>('');
  const [producer, setProducer] = useState<string>('');
  const [bpm, setBpm] = useState<number>(90);
  const [duration, setDuration] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playLcarsChirp('warp');
    setSelectedFile(file);
    setIsAlphIntroSelected(false);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    setBeatTitle(cleanName);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration)) {
        setDuration(tempAudio.duration);
      }
    };
  };

  const handleSelectAlphIntro = () => {
    playLcarsChirp('warp');
    setIsAlphIntroSelected(true);
    setSelectedFile(null);
    setBeatTitle('Intro');
    setProducer('Alph Tha Alien');
    setBpm(92);
    setDuration(191);
    setPreviewUrl('/assets/aistudio/10_Intro_9cb887a1.mp3');
  };

  const togglePreview = () => {
    playLcarsChirp('tap');
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
    } else {
      previewAudioRef.current.play().catch(e => console.warn(e));
    }
  };

  const cleanupAndClose = () => {
    if (previewAudioRef.current) previewAudioRef.current.pause();
    if (previewUrl && !isAlphIntroSelected) URL.revokeObjectURL(previewUrl);
    setPhrase('');
    setNotes('');
    setSelectedFile(null);
    setIsAlphIntroSelected(false);
    setPreviewUrl(null);
    setBeatTitle('');
    setProducer('');
    setIsPlayingPreview(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!phrase.trim()) return;

    playLcarsChirp('warp');
    setIsSubmitting(true);

    let attachedBeat: AttachedBeat | undefined = undefined;

    if (isAlphIntroSelected) {
      attachedBeat = {
        id: 'beat-alph-intro',
        name: 'Intro',
        fileName: '10_Intro_9cb887a1.mp3',
        fileSize: 3460300,
        duration: 191,
        producer: 'Alph Tha Alien',
        bpm: 92,
        uploadedAt: Date.now(),
        blobUrl: '/assets/aistudio/10_Intro_9cb887a1.mp3',
      };
    } else if (selectedFile) {
      const beatId = `beat-note-${Date.now()}`;
      await saveNoteBeat(
        beatId,
        {
          name: beatTitle || selectedFile.name.replace(/\.[^/.]+$/, ''),
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type || 'audio/mpeg',
          duration: duration || 0,
          producer: producer || undefined,
          bpm: bpm || undefined,
        },
        selectedFile
      );

      attachedBeat = {
        id: beatId,
        name: beatTitle || selectedFile.name.replace(/\.[^/.]+$/, ''),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        duration: duration,
        producer: producer || undefined,
        bpm: bpm || undefined,
        uploadedAt: Date.now(),
      };
    }

    const lines = phrase.split('\n').filter(l => l.trim().length > 0);
    const words = phrase.trim().split(/\s+/);

    const newPhrase: SavedPhrase = {
      id: `phrase-user-${Date.now()}`,
      phrase: phrase.trim(),
      createdAt: Date.now(),
      barCount: Math.max(1, lines.length),
      syllables: Math.round(words.length * 1.3),
      notes: notes.trim() || undefined,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      attachedRoots: [],
      attachedBeat,
    };

    onSavePhrase(newPhrase);
    cleanupAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-2xl border-2 p-5 font-mono text-xs shadow-2xl bg-neutral-950 space-y-4"
        style={{ borderColor: theme.primary }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between -m-5 mb-3 px-5 py-3 rounded-t-xl text-black font-black uppercase tracking-wider"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-black" />
            <span>CREATE NEW LYRIC NOTE & ATTACH BEAT</span>
          </div>
          <button onClick={cleanupAndClose} className="p-1 hover:bg-black/20 rounded cursor-pointer">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Lyrical Bars Textarea */}
        <div>
          <label className="text-[11px] font-mono-tech text-amber-400 uppercase font-bold block mb-1">
            LYRICS / BARS:
          </label>
          <textarea
            rows={4}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Write your bars, cadence scheme, or draft lyrics here..."
            className="w-full bg-black border border-neutral-700 rounded-lg p-2.5 text-xs text-white font-sans focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Cadence Notes */}
        <div>
          <label className="text-[11px] font-mono-tech text-cyan-300 uppercase font-bold block mb-1">
            LYRICIST CADENCE NOTES:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Pocket A+, rhyme family on -ight, 16th-note double-time"
            className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Beat Attachment Section */}
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              ATTACH BEAT AUDIO (MP3 / WAV / M4A):
            </span>
            {(selectedFile || isAlphIntroSelected) && (
              <button
                onClick={() => {
                  if (previewAudioRef.current) previewAudioRef.current.pause();
                  setSelectedFile(null);
                  setIsAlphIntroSelected(false);
                  setPreviewUrl(null);
                  setIsPlayingPreview(false);
                }}
                className="text-[10px] text-red-400 hover:text-red-300"
              >
                Clear Beat
              </button>
            )}
          </div>

          {!selectedFile && !isAlphIntroSelected ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleSelectAlphIntro}
                className="flex-1 p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/50 hover:bg-amber-950/70 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-white block uppercase">ATTACH "INTRO"</span>
                    <span className="text-[10px] text-amber-400">PROD. ALPH THA ALIEN • 92 BPM</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-black bg-amber-400 px-2 py-0.5 rounded">ATTACH</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-amber-400 text-neutral-200 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-white block uppercase">UPLOAD OWN BEAT</span>
                    <span className="text-[10px] text-neutral-400">MP3, WAV, M4A from device</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-cyan-300 bg-neutral-900 px-2 py-0.5 rounded">CHOOSE</span>
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-black/80 border border-amber-500/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-bold text-white text-xs block">
                      {isAlphIntroSelected ? 'Intro (Prod. Alph Tha Alien)' : (beatTitle || selectedFile?.name)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {isAlphIntroSelected ? '3.3 MB • 92 BPM • 03:11' : `${((selectedFile?.size || 0) / (1024*1024)).toFixed(1)} MB • ${Math.round(duration)}s`}
                    </span>
                  </div>
                </div>

                {previewUrl && (
                  <div className="flex items-center gap-2">
                    <audio
                      ref={previewAudioRef}
                      src={previewUrl}
                      onPlay={() => setIsPlayingPreview(true)}
                      onPause={() => setIsPlayingPreview(false)}
                      onEnded={() => setIsPlayingPreview(false)}
                    />
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="px-2.5 py-1 rounded bg-amber-400 text-black font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingPreview ? 'PAUSE' : 'AUDITION'}</span>
                    </button>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800">
                  <div>
                    <label className="text-[9px] text-neutral-400 block font-mono">BEAT TITLE</label>
                    <input
                      type="text"
                      value={beatTitle}
                      onChange={(e) => setBeatTitle(e.target.value)}
                      placeholder="Beat Title"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-neutral-400 block font-mono">PRODUCER</label>
                    <input
                      type="text"
                      value={producer}
                      onChange={(e) => setProducer(e.target.value)}
                      placeholder="e.g. Alph Tha Alien / Self"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
          <button
            onClick={cleanupAndClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={!phrase.trim() || isSubmitting}
            className="px-5 py-2 rounded-lg font-black text-black uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-md disabled:opacity-40"
            style={{ backgroundColor: theme.primary }}
          >
            {isSubmitting ? 'SAVING...' : 'PRESERVE NOTE & ATTACH BEAT'}
          </button>
        </div>
      </div>
    </div>
  );
};
