/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NoteBeatPlayerCard: An interactive LCARS audio player deck
 * for user-uploaded beats attached to notes in FavoritesVault.
 */

import React, { useState, useEffect, useRef } from 'react';
import { AttachedBeat, LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { getNoteBeatBlobUrl, getNoteBeat } from '../../utils/noteBeatsStorage';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Download,
  Trash2,
  Send,
  Music,
  Disc,
  Radio,
  Sparkles,
} from 'lucide-react';

interface NoteBeatPlayerCardProps {
  attachedBeat: AttachedBeat;
  currentEra: LcarsEra;
  onRemoveBeat?: () => void;
  onFlowInAnalyzer?: () => void;
}

export const NoteBeatPlayerCard: React.FC<NoteBeatPlayerCardProps> = ({
  attachedBeat,
  currentEra,
  onRemoveBeat,
  onFlowInAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(attachedBeat.duration || 0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [spectrumBars, setSpectrumBars] = useState<number[]>(new Array(16).fill(8));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load audio source from IndexedDB or static assets
  useEffect(() => {
    let active = true;
    setIsLoading(true);

    getNoteBeatBlobUrl(attachedBeat.id, attachedBeat.blobUrl).then((url) => {
      if (!active) return;
      if (url) {
        setAudioUrl(url);
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [attachedBeat.id, attachedBeat.blobUrl]);

  // Handle Play/Pause
  const togglePlay = () => {
    playLcarsChirp('tap');
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn('Note beat playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);
    if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }

    // Dynamic frequency dancing bars
    if (!audioRef.current.paused) {
      setSpectrumBars(
        Array.from({ length: 16 }, (_, i) => {
          const val = 15 + Math.round(
            Math.sin(cur * 12 + i * 0.8) * 35 +
            Math.cos(cur * 18 + i * 1.5) * 25 +
            Math.random() * 25
          );
          return Math.max(10, Math.min(96, val));
        })
      );
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    playLcarsChirp('warp');
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = attachedBeat.fileName || `${attachedBeat.name}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="p-3.5 rounded-xl border font-mono text-xs flex flex-col gap-2.5 transition-all shadow-md select-none"
      style={{
        backgroundColor: `${theme.panelBg}FA`,
        borderColor: isPlaying ? theme.primary : '#334155',
      }}
    >
      {/* Hidden HTML5 Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop={isLooping}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => {
            setIsPlaying(false);
            setSpectrumBars(new Array(16).fill(8));
          }}
          onEnded={() => {
            if (!isLooping) setIsPlaying(false);
          }}
        />
      )}

      {/* Top Header Strip: Beat Name & Details */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg flex items-center justify-center ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{ backgroundColor: `${theme.primary}30`, color: theme.primary }}
          >
            <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white uppercase tracking-wider text-xs sm:text-sm">
                {attachedBeat.name}
              </span>
              {attachedBeat.producer && (
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-black uppercase"
                  style={{ backgroundColor: theme.primary }}
                >
                  PROD. {attachedBeat.producer}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span>{attachedBeat.fileName}</span>
              {attachedBeat.fileSize && <span>• {formatSize(attachedBeat.fileSize)}</span>}
              {attachedBeat.bpm && <span className="text-amber-400 font-bold">• {attachedBeat.bpm} BPM</span>}
              <span>• {formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Flow, Download, Remove */}
        <div className="flex items-center gap-1.5">
          {onFlowInAnalyzer && (
            <button
              onClick={onFlowInAnalyzer}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 text-black transition-all hover:scale-105 cursor-pointer shadow"
              style={{ backgroundColor: theme.secondary }}
              title="Open Bar Analyzer with this lyric note and play beat"
            >
              <Send className="w-3 h-3" />
              <span>FLOW IN ANALYZER</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Download Audio File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onRemoveBeat && (
            <button
              onClick={() => {
                playLcarsChirp('alert');
                onRemoveBeat();
              }}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Detach Beat from Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Spectrum Waveform Equalizer (Dancing to the Beat) */}
      <div className="h-7 bg-black/60 rounded-lg px-2 flex items-end justify-between gap-1 border border-slate-800/80">
        {spectrumBars.map((bar, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-xs transition-all duration-75"
            style={{
              height: `${bar}%`,
              backgroundColor: isPlaying
                ? i % 4 === 0
                  ? theme.primary
                  : i % 4 === 1
                  ? theme.secondary
                  : i % 4 === 2
                  ? theme.accent
                  : theme.auxiliary
                : '#334155',
            }}
          />
        ))}
      </div>

      {/* Timeline Scrubber */}
      <div className="space-y-0.5">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          disabled={isLoading || !audioUrl}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-amber-400/80 font-bold uppercase tracking-wider">
            {isPlaying ? 'PLAYING BEAT IN POCKET' : 'READY TO FLOW'}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading || !audioUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-black text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer shadow-md disabled:opacity-40"
            style={{ backgroundColor: theme.primary }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY BEAT</span>
              </>
            )}
          </button>

          {/* Loop Button */}
          <button
            onClick={() => {
              playLcarsChirp('input');
              setIsLooping(!isLooping);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              isLooping
                ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Loop Beat Continuously"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>LOOP</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 w-32 sm:w-40">
          <button
            onClick={() => {
              playLcarsChirp('input');
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              if (audioRef.current) {
                audioRef.current.volume = nextMute ? 0 : volume;
              }
            }}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              setIsMuted(false);
              if (audioRef.current) {
                audioRef.current.volume = val;
              }
            }}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
