/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Persistent LCARS Background Beat Player
 * Features "Intro" produced by Alph Tha Alien (/assets/aistudio/10_Intro_9cb887a1.mp3)
 * Plays in the background across all 12 modules with loop, scrub, volume, and visualizer.
 */

import React, { useState, useEffect, useRef } from 'react';
import { LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Radio,
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  Disc,
} from 'lucide-react';

interface BackgroundBeatPlayerProps {
  currentEra: LcarsEra;
}

const BG_TRACK_PATH = '/assets/aistudio/10_Intro_9cb887a1.mp3';
const TRACK_TITLE = 'INTRO';
const TRACK_PRODUCER = 'ALPH THA ALIEN';
const TRACK_BPM = 92;

export const BackgroundBeatPlayer: React.FC<BackgroundBeatPlayerProps> = ({ currentEra }) => {
  const theme = LCARS_THEMES[currentEra];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(191); // ~3:11
  const [volume, setVolume] = useState<number>(0.45);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [spectrumBars, setSpectrumBars] = useState<number[]>(new Array(12).fill(12));

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio(BG_TRACK_PATH);
    audio.preload = 'metadata';
    audio.loop = isLooping;
    audio.volume = volume;
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setDuration(audio.duration);
      }
      // Generate dynamic equalizer bars based on playback
      if (!audio.paused) {
        setSpectrumBars(
          Array.from({ length: 12 }, (_, i) => {
            const val = 18 + Math.round(
              Math.sin(audio.currentTime * 8 + i * 0.9) * 28 +
              Math.cos(audio.currentTime * 14 + i * 1.4) * 20 +
              Math.random() * 22
            );
            return Math.max(12, Math.min(95, val));
          })
        );
      }
    };

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => {
      setIsPlaying(false);
      setSpectrumBars(new Array(12).fill(12));
    };
    audio.onended = () => {
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };

    // Global event listener to toggle background beat (e.g. from hotkey 'B')
    const handleToggleBgBeat = () => {
      if (audio.paused) {
        audio.play().catch(e => console.warn('Could not auto-play BG track:', e));
      } else {
        audio.pause();
      }
    };
    window.addEventListener('toggle-background-beat', handleToggleBgBeat);

    return () => {
      window.removeEventListener('toggle-background-beat', handleToggleBgBeat);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Sync loop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    playLcarsChirp('tap');
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.warn('Playback request failed:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative font-lcars">
      {/* Top Bar Compact Pill */}
      <div
        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full border transition-all cursor-pointer shadow-md select-none ${
          isPlaying
            ? 'bg-amber-950/80 border-amber-500 shadow-amber-500/20'
            : 'bg-neutral-900/90 border-neutral-700 hover:border-neutral-500 text-neutral-300'
        }`}
        style={isPlaying ? { borderColor: theme.primary } : {}}
      >
        {/* Play / Pause Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className={`p-1 rounded-full transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${
            isPlaying ? 'text-black' : 'text-amber-400 bg-black/50'
          }`}
          style={isPlaying ? { backgroundColor: theme.primary } : {}}
          title={isPlaying ? 'Pause Background Beat (Hotkey: B)' : 'Play Background Beat: Intro (Prod. Alph Tha Alien) (Hotkey: B)'}
          aria-label={isPlaying ? 'Pause Background Beat' : 'Play Background Beat'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
        </button>

        {/* Track Title & Producer Info */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col justify-center cursor-pointer max-w-[130px] sm:max-w-[200px]"
        >
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white truncate">
              {TRACK_TITLE}
            </span>
            <span
              className="text-[8px] sm:text-[9px] px-1 rounded font-mono font-bold uppercase truncate"
              style={{ backgroundColor: `${theme.secondary}40`, color: theme.secondary }}
            >
              PROD. ALPH THA ALIEN
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono text-neutral-400 leading-none">
            <span className="text-amber-400/90">{TRACK_BPM} BPM</span>
            <span>•</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>

        {/* Mini Spectrum Visualizer (Dancing when playing) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden sm:flex items-end gap-0.5 h-4 w-12 px-1 cursor-pointer"
          title="Click to expand full background audio deck"
        >
          {spectrumBars.slice(0, 8).map((height, idx) => (
            <div
              key={idx}
              className="w-1 rounded-t-xs transition-all duration-75"
              style={{
                height: `${height}%`,
                backgroundColor: isPlaying
                  ? idx % 2 === 0
                    ? theme.primary
                    : theme.secondary
                  : '#525252',
              }}
            />
          ))}
        </div>

        {/* Expand / Quick Volume Popover Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playLcarsChirp('tap');
            setIsExpanded(!isExpanded);
          }}
          className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          title="Toggle Full Background Beat Deck"
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Deck Dropdown / Floating PADD */}
      {isExpanded && (
        <div
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border-2 p-4 bg-neutral-950/95 backdrop-blur-md shadow-2xl z-50 space-y-3 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ borderColor: theme.primary }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Disc className={`w-4 h-4 ${isPlaying ? 'text-amber-400 animate-spin' : 'text-neutral-500'}`} />
              <div className="flex flex-col">
                <span className="font-black text-white text-xs tracking-wider uppercase">
                  BACKGROUND AUDIO DECK
                </span>
                <span className="text-[10px] text-amber-400">
                  {TRACK_TITLE} • PROD. {TRACK_PRODUCER}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-neutral-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
            >
              ✕
            </button>
          </div>

          {/* Spectrum Visualizer Full */}
          <div className="h-10 bg-neutral-900/90 rounded-lg p-1.5 flex items-end justify-between gap-1 border border-neutral-800">
            {spectrumBars.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-xs transition-all duration-75"
                style={{
                  height: `${height}%`,
                  backgroundColor: isPlaying
                    ? idx % 3 === 0
                      ? theme.primary
                      : idx % 3 === 1
                      ? theme.secondary
                      : theme.accent
                    : '#404040',
                }}
              />
            ))}
          </div>

          {/* Timeline Scrubber */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              title="Scrub timeline"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span className="text-amber-400 font-bold">PROD. ALPH THA ALIEN</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between pt-1">
            {/* Play/Pause Large */}
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-black uppercase tracking-wider text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: theme.primary }}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE BEAT</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY BEAT</span>
                </>
              )}
            </button>

            {/* Loop Toggle */}
            <button
              onClick={() => {
                playLcarsChirp('input');
                setIsLooping(!isLooping);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                isLooping
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle infinite loop"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>LOOP</span>
            </button>
          </div>

          {/* Volume Slider Row */}
          <div className="flex items-center gap-2.5 pt-1 border-t border-neutral-800">
            <button
              onClick={() => {
                playLcarsChirp('input');
                setIsMuted(!isMuted);
              }}
              className="text-neutral-400 hover:text-white cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
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
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            />
            <span className="text-[10px] text-neutral-400 w-8 text-right font-mono">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="text-[10px] text-neutral-400 bg-neutral-900 p-2 rounded border border-neutral-800 text-center">
            Press <kbd className="px-1 py-0.5 bg-black border border-neutral-700 rounded text-amber-300 font-bold">B</kbd> anywhere to toggle this background beat.
          </div>
        </div>
      )}
    </div>
  );
};
