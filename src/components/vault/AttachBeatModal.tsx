/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AttachBeatModal: Modal allowing users to upload or attach their own beat
 * (or select Alph Tha Alien's Intro) directly to any note or lyrical phrase.
 */

import React, { useState, useRef } from 'react';
import { AttachedBeat, LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { saveNoteBeat } from '../../utils/noteBeatsStorage';
import {
  Upload,
  Music,
  X,
  Play,
  Pause,
  Disc,
  Sparkles,
  Check,
  FileAudio,
} from 'lucide-react';

interface AttachBeatModalProps {
  currentEra: LcarsEra;
  isOpen: boolean;
  onClose: () => void;
  onAttachBeat: (beat: AttachedBeat) => void;
  noteTitle?: string;
}

export const AttachBeatModal: React.FC<AttachBeatModalProps> = ({
  currentEra,
  isOpen,
  onClose,
  onAttachBeat,
  noteTitle,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    setBeatTitle(cleanName);

    // Create preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Load duration
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration)) {
        setDuration(tempAudio.duration);
      }
    };
  };

  const handleAttachAlphIntro = () => {
    playLcarsChirp('warp');
    const alphBeat: AttachedBeat = {
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
    onAttachBeat(alphBeat);
    cleanupAndClose();
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
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setBeatTitle('');
    setProducer('');
    setIsPlayingPreview(false);
    onClose();
  };

  const handleSaveAndAttach = async () => {
    if (!selectedFile) return;

    playLcarsChirp('warp');
    setIsSubmitting(true);
    const beatId = `beat-note-${Date.now()}`;

    try {
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

      const attached: AttachedBeat = {
        id: beatId,
        name: beatTitle || selectedFile.name.replace(/\.[^/.]+$/, ''),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        duration: duration,
        producer: producer || undefined,
        bpm: bpm || undefined,
        uploadedAt: Date.now(),
      };

      onAttachBeat(attached);
      cleanupAndClose();
    } catch (err) {
      console.warn('Could not attach beat:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-2xl border-2 p-5 font-mono text-xs shadow-2xl bg-neutral-950 space-y-4"
        style={{ borderColor: theme.primary }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between -m-5 mb-3 px-5 py-3 rounded-t-xl text-black font-black uppercase tracking-wider"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-black" />
            <span>ATTACH BEAT TO LYRIC NOTES</span>
          </div>
          <button
            onClick={cleanupAndClose}
            className="p-1 hover:bg-black/20 rounded cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {noteTitle && (
          <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
            <span className="text-[10px] text-amber-400 uppercase font-bold block mb-0.5">TARGET NOTE SECTOR:</span>
            <span className="italic font-sans text-xs text-white">"{noteTitle}"</span>
          </div>
        )}

        {/* Option 1: Quick Attach "Intro" Prod. by Alph Tha Alien */}
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                INTRO (PROD. ALPH THA ALIEN)
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">
              Attach the official 92 BPM cosmic studio master track directly to this note.
            </p>
          </div>
          <button
            onClick={handleAttachAlphIntro}
            className="px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black transition-transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-md"
            style={{ backgroundColor: theme.primary }}
          >
            USE THIS BEAT
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-neutral-500">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-[10px] uppercase font-bold tracking-widest">OR UPLOAD YOUR OWN AUDIO</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Option 2: Upload User's Own Beat File */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-neutral-700 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-neutral-900/50 hover:bg-neutral-900"
            >
              <Upload className="w-8 h-8 text-amber-400 animate-bounce" />
              <span className="font-bold text-white uppercase tracking-wider">
                CHOOSE AUDIO FILE OR DRAG & DROP
              </span>
              <span className="text-[11px] text-neutral-400">
                Supports MP3, WAV, M4A, OGG, and FLAC (persisted securely in IndexedDB)
              </span>
            </div>
          ) : (
            <div className="space-y-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="font-bold text-white block">{selectedFile.name}</span>
                    <span className="text-[10px] text-neutral-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {Math.round(duration)}s
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Change File
                </button>
              </div>

              {/* Preview Player */}
              {previewUrl && (
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                  <audio
                    ref={previewAudioRef}
                    src={previewUrl}
                    onPlay={() => setIsPlayingPreview(true)}
                    onPause={() => setIsPlayingPreview(false)}
                    onEnded={() => setIsPlayingPreview(false)}
                  />
                  <button
                    onClick={togglePreview}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-black border border-neutral-700 text-amber-300 font-bold hover:border-amber-400 cursor-pointer"
                  >
                    {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingPreview ? 'PAUSE TEST' : 'AUDITION BEAT'}</span>
                  </button>
                  <span className="text-[10px] text-neutral-400">Audio ready for flow attachment</span>
                </div>
              )}

              {/* Editable Beat Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold block mb-1 uppercase">
                    BEAT TITLE
                  </label>
                  <input
                    type="text"
                    value={beatTitle}
                    onChange={(e) => setBeatTitle(e.target.value)}
                    placeholder="e.g. Grime 140 Reload"
                    className="w-full bg-black border border-neutral-700 rounded p-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold block mb-1 uppercase">
                    PRODUCER CREDIT
                  </label>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="e.g. Alph Tha Alien / Self"
                    className="w-full bg-black border border-neutral-700 rounded p-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 font-bold block mb-1 uppercase">
                    ESTIMATED BPM
                  </label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value) || 90)}
                    min={40}
                    max={220}
                    className="w-full bg-black border border-neutral-700 rounded p-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
          <button
            onClick={cleanupAndClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleSaveAndAttach}
            disabled={!selectedFile || isSubmitting}
            className="px-5 py-2 rounded-lg font-black text-black uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-md disabled:opacity-40"
            style={{ backgroundColor: theme.primary }}
          >
            {isSubmitting ? 'SAVING AUDIO...' : 'CONFIRM & ATTACH BEAT'}
          </button>
        </div>
      </div>
    </div>
  );
};
