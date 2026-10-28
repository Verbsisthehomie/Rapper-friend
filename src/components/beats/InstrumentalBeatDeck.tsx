import React, { useState, useEffect, useRef } from 'react';
import { LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  BUILTIN_INSTRUMENTAL_PRESETS,
  InstrumentalPreset,
  CustomUploadedBeat,
  beatSynth,
  getAllCustomUploadedBeats,
  saveCustomUploadedBeat,
  deleteCustomUploadedBeat,
} from '../../utils/instrumentalBeatEngine';
import {
  Play,
  Square,
  Upload,
  Trash2,
  Volume2,
  Sliders,
  Disc,
  Radio,
  Repeat,
  RotateCcw,
  Music,
  Zap,
  Layers,
} from 'lucide-react';

interface InstrumentalBeatDeckProps {
  currentEra: LcarsEra;
  initialPresetId?: string;
  compact?: boolean;
}

export const InstrumentalBeatDeck: React.FC<InstrumentalBeatDeckProps> = ({
  currentEra,
  initialPresetId,
  compact = false,
}) => {
  const theme = LCARS_THEMES[currentEra];

  // Mode: 'presets' (12 built-in styles), 'sequencer' (Flow Music Creator), 'uploads' (Custom MP3/WAV)
  const [deckMode, setDeckMode] = useState<'presets' | 'sequencer' | 'uploads'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<InstrumentalPreset>(
    () =>
      BUILTIN_INSTRUMENTAL_PRESETS.find((p) => p.id === initialPresetId) ||
      BUILTIN_INSTRUMENTAL_PRESETS[0]
  );

  // Playback state for procedural synthesizer
  const [isPlayingSynth, setIsPlayingSynth] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(selectedPreset.defaultBpm);
  const [swing, setSwing] = useState<number>(selectedPreset.swingFactor);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [barCounter, setBarCounter] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);

  // Stem Mutes
  const [muteDrums, setMuteDrums] = useState<boolean>(false);
  const [muteBass, setMuteBass] = useState<boolean>(false);
  const [muteChords, setMuteChords] = useState<boolean>(false);

  // Editable 16-step patterns for Flow Music Creator mode
  const [customKick, setCustomKick] = useState<number[]>([...selectedPreset.kickPattern]);
  const [customSnare, setCustomSnare] = useState<number[]>([...selectedPreset.snarePattern]);
  const [customHat, setCustomHat] = useState<number[]>([...selectedPreset.hatPattern]);

  // Custom Uploaded Audio Tracks
  const [uploadedBeats, setUploadedBeats] = useState<CustomUploadedBeat[]>([]);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [isPlayingUpload, setIsPlayingUpload] = useState<boolean>(false);
  const [uploadPlaybackRate, setUploadPlaybackRate] = useState<number>(1.0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadDuration, setUploadDuration] = useState<number>(0);
  const [uploadStyleTag, setUploadStyleTag] = useState<string>('Custom Instrumental');
  const [uploadBpmInput, setUploadBpmInput] = useState<number>(90);

  // Spectrum bars
  const [spectrumBars, setSpectrumBars] = useState<number[]>(new Array(16).fill(10));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentBlobUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved custom uploaded beats from IndexedDB on mount
  useEffect(() => {
    getAllCustomUploadedBeats().then((items) => {
      setUploadedBeats(items);
    });
  }, []);

  // Update preset when initialPresetId changes externally
  useEffect(() => {
    if (initialPresetId) {
      const found = BUILTIN_INSTRUMENTAL_PRESETS.find((p) => p.id === initialPresetId);
      if (found) {
        handleSelectPreset(found, false);
      }
    }
  }, [initialPresetId]);

  // Listen for global custom event to audition a specific instrumental preset
  useEffect(() => {
    const handleAuditionEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ presetId: string }>).detail;
      if (detail?.presetId) {
        const found = BUILTIN_INSTRUMENTAL_PRESETS.find((p) => p.id === detail.presetId);
        if (found) {
          stopUploadAudio();
          setDeckMode('presets');
          setSelectedPreset(found);
          setBpm(found.defaultBpm);
          setSwing(found.swingFactor);
          setCustomKick([...found.kickPattern]);
          setCustomSnare([...found.snarePattern]);
          setCustomHat([...found.hatPattern]);
          setCurrentStep(0);
          setBarCounter(1);
          setIsPlayingSynth(true);
        }
      }
    };
    window.addEventListener('audition-rapper-friend-beat', handleAuditionEvent);
    return () => window.removeEventListener('audition-rapper-friend-beat', handleAuditionEvent);
  }, []);

  const handleSelectPreset = (preset: InstrumentalPreset, autoPlay = false) => {
    playLcarsChirp('tap');
    stopUploadAudio();
    setSelectedPreset(preset);
    setBpm(preset.defaultBpm);
    setSwing(preset.swingFactor);
    setCustomKick([...preset.kickPattern]);
    setCustomSnare([...preset.snarePattern]);
    setCustomHat([...preset.hatPattern]);
    setCurrentStep(0);
    setBarCounter(1);
    if (autoPlay) {
      setIsPlayingSynth(true);
    }
  };

  // Sync stem mutes & volume with synthesizer singleton
  useEffect(() => {
    beatSynth.muteDrums = muteDrums;
    beatSynth.muteBass = muteBass;
    beatSynth.muteChords = muteChords;
  }, [muteDrums, muteBass, muteChords]);

  useEffect(() => {
    beatSynth.setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Real-time 16-step synthesizer loop with swing support
  useEffect(() => {
    if (!isPlayingSynth) {
      setCurrentStep(0);
      return;
    }

    let step = 0;
    let bar = 1;
    let timerId: number | null = null;
    let active = true;

    const scheduleNextStep = () => {
      if (!active) return;

      const livePreset: InstrumentalPreset = {
        ...selectedPreset,
        kickPattern: customKick,
        snarePattern: customSnare,
        hatPattern: customHat,
      };

      beatSynth.triggerStep(livePreset, step, bpm);
      setCurrentStep(step);
      setBarCounter(bar);
      setSpectrumBars(beatSynth.getFrequencyLevels());

      const baseStepMs = (60 / bpm / 4) * 1000;
      // Apply MPC swing to odd vs even 16th steps
      const swingOffset = step % 2 === 0 ? baseStepMs * swing : -baseStepMs * swing;
      const nextDelay = Math.max(25, baseStepMs + swingOffset);

      step = (step + 1) % 16;
      if (step === 0) {
        bar = (bar % 16) + 1;
      }

      timerId = window.setTimeout(scheduleNextStep, nextDelay);
    };

    scheduleNextStep();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [isPlayingSynth, bpm, swing, selectedPreset, customKick, customSnare, customHat]);

  // Uploaded audio playback handlers
  const stopUploadAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingUpload(false);
  };

  const handlePlayUploadedBeat = (beat: CustomUploadedBeat) => {
    playLcarsChirp('tap');
    setIsPlayingSynth(false);

    if (activeUploadId === beat.id && isPlayingUpload && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingUpload(false);
      return;
    }

    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
    }

    const url = URL.createObjectURL(beat.audioBlob);
    currentBlobUrlRef.current = url;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.src = url;
    audio.loop = true;
    audio.volume = volume;
    audio.playbackRate = uploadPlaybackRate;

    audio.ontimeupdate = () => {
      setUploadProgress(audio.currentTime);
      setUploadDuration(audio.duration || 0);
      // Animate spectrum bars during custom track playback
      setSpectrumBars(
        Array.from({ length: 16 }, (_, idx) =>
          Math.max(12, Math.min(98, Math.round(25 + Math.sin(audio.currentTime * 10 + idx) * 35 + Math.random() * 30)))
        )
      );
    };

    audio.play().then(() => {
      setActiveUploadId(beat.id);
      setIsPlayingUpload(true);
    }).catch((err) => {
      console.warn('Audio playback error:', err);
    });
  };

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    playLcarsChirp('warp');
    const newBeats: CustomUploadedBeat[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const newBeat: CustomUploadedBeat = {
        id: `custom-beat-${Date.now()}-${i}`,
        name: cleanName,
        fileName: file.name,
        estimatedBpm: uploadBpmInput || 90,
        styleTag: uploadStyleTag || 'Custom Instrumental',
        createdAt: Date.now(),
        audioBlob: file,
      };
      await saveCustomUploadedBeat(newBeat);
      newBeats.push(newBeat);
    }

    const all = await getAllCustomUploadedBeats();
    setUploadedBeats(all);
    if (newBeats.length > 0) {
      handlePlayUploadedBeat(newBeats[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteUploadedBeat = async (id: string) => {
    playLcarsChirp('tap');
    if (activeUploadId === id) {
      stopUploadAudio();
      setActiveUploadId(null);
    }
    await deleteCustomUploadedBeat(id);
    const all = await getAllCustomUploadedBeats();
    setUploadedBeats(all);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setUploadPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Toggle step in Flow Music Creator
  const toggleStepCell = (row: 'kick' | 'snare' | 'hat', stepIdx: number) => {
    playLcarsChirp('tap');
    if (row === 'kick') {
      setCustomKick((prev) => {
        const next = [...prev];
        next[stepIdx] = next[stepIdx] > 0 ? 0 : 1;
        return next;
      });
    } else if (row === 'snare') {
      setCustomSnare((prev) => {
        const next = [...prev];
        next[stepIdx] = next[stepIdx] > 0 ? 0 : 1;
        return next;
      });
    } else if (row === 'hat') {
      setCustomHat((prev) => {
        const next = [...prev];
        // Cycle: 0 (off) -> 1 (closed hat) -> 2 (open hat) -> 3 (triplet roll) -> 0
        next[stepIdx] = (next[stepIdx] + 1) % 4;
        return next;
      });
    }
  };

  return (
    <div
      className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3.5 font-lcars"
      style={{ borderColor: isPlayingSynth || isPlayingUpload ? theme.primary : '#1e293b' }}
    >
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Disc
            className={`w-4 h-4 text-amber-400 ${
              isPlayingSynth || isPlayingUpload ? 'animate-spin' : ''
            }`}
          />
          <div>
            <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 tracking-wider">
              LCARS INSTRUMENTAL BEAT DECK & FLOW STUDIO
            </div>
            <div className="text-[10px] font-mono-tech text-slate-400">
              {isPlayingSynth
                ? `PLAYING: ${selectedPreset.name.toUpperCase()} (${bpm} BPM • BAR ${barCounter}/16)`
                : isPlayingUpload
                ? `PLAYING CUSTOM UPLOAD (${uploadPlaybackRate}x SPEED)`
                : 'SELECT STYLE INSTRUMENTAL, BUILD A FLOW BEAT, OR UPLOAD MP3/WAV'}
            </div>
          </div>
        </div>

        {/* 3-Mode Pill Switcher */}
        <div className="flex rounded-full bg-black p-0.5 border border-slate-800 text-[10px] font-mono-tech shrink-0">
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setDeckMode('presets');
            }}
            className={`px-2.5 py-1 rounded-full font-bold uppercase transition-all cursor-pointer ${
              deckMode === 'presets'
                ? 'bg-amber-400 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            12 STYLE BEATS
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setDeckMode('sequencer');
            }}
            className={`px-2.5 py-1 rounded-full font-bold uppercase transition-all cursor-pointer ${
              deckMode === 'sequencer'
                ? 'bg-cyan-400 text-black'
                : 'text-cyan-300/80 hover:text-white'
            }`}
          >
            FLOW BEAT MAKER
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setDeckMode('uploads');
            }}
            className={`px-2.5 py-1 rounded-full font-bold uppercase transition-all cursor-pointer ${
              deckMode === 'uploads'
                ? 'bg-emerald-400 text-black'
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            UPLOAD BEATS ({uploadedBeats.length})
          </button>
        </div>
      </div>

      {/* Transport & Master Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-black/60 p-2.5 rounded-xl border border-slate-800/90">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              stopUploadAudio();
              setIsPlayingSynth((prev) => !prev);
            }}
            className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingSynth
                ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg'
                : 'bg-amber-400 hover:bg-amber-300 text-black shadow-md'
            }`}
          >
            {isPlayingSynth ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                STOP BEAT
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                PLAY INSTRUMENTAL
              </>
            )}
          </button>

          {/* Pirate Radio Reload / Wheel-Up Button */}
          <button
            onClick={() => {
              beatSynth.triggerReloadWheelUp();
              setCurrentStep(0);
              setBarCounter(1);
            }}
            className="px-2.5 py-1.5 rounded-full bg-purple-950/90 hover:bg-purple-800 text-purple-200 border border-purple-500/50 text-[10px] font-mono-tech font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
            title="Trigger Pirate Radio Reload Siren & Spin Back to Bar 1"
          >
            <RotateCcw className="w-3 h-3" />
            WHEEL-UP RELOAD!
          </button>
        </div>

        {/* BPM & Volume Controls */}
        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px] uppercase">TEMPO:</span>
            <span className="text-amber-400 font-bold w-14">{bpm} BPM</span>
            <input
              type="range"
              min={60}
              max={170}
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value, 10))}
              className="w-20 accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Stem Layer Toggles (Drums / 808 Sub-Bass / Chords) + Bar Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 uppercase font-bold mr-1">STEM MIXER:</span>
          <button
            onClick={() => setMuteDrums((m) => !m)}
            className={`px-2 py-0.5 rounded border uppercase font-bold cursor-pointer ${
              !muteDrums
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
            }`}
          >
            DRUMS {muteDrums ? 'OFF' : 'ON'}
          </button>
          <button
            onClick={() => setMuteBass((m) => !m)}
            className={`px-2 py-0.5 rounded border uppercase font-bold cursor-pointer ${
              !muteBass
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
            }`}
          >
            808 / SUB-BASS {muteBass ? 'OFF' : 'ON'}
          </button>
          <button
            onClick={() => setMuteChords((m) => !m)}
            className={`px-2 py-0.5 rounded border uppercase font-bold cursor-pointer ${
              !muteChords
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
            }`}
          >
            CHORDS / SYNTH {muteChords ? 'OFF' : 'ON'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">
            RALLY CYCLE:{' '}
            <strong className="text-amber-300">
              BAR {barCounter} OF 16 {barCounter === 8 || barCounter === 16 ? '⚡ RELOAD ZONE' : ''}
            </strong>
          </span>
        </div>
      </div>

      {/* MODE 1: 12 BUILT-IN REGIONAL & GLOBAL INSTRUMENTAL STYLES */}
      {deckMode === 'presets' && (
        <div className="space-y-2.5">
          <div
            className={`grid grid-cols-1 ${
              compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
            } gap-1.5 max-h-56 overflow-y-auto pr-1`}
          >
            {BUILTIN_INSTRUMENTAL_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPreset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset, true)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-800/95 border-amber-400 shadow-md'
                      : 'bg-black/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{preset.regionFlag}</span>
                      <span className="text-xs font-bold uppercase text-white truncate">
                        {preset.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono-tech text-cyan-300 truncate mt-0.5">
                      {preset.defaultBpm} BPM • {preset.subdivisionFeel.split('•')[0]}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono-tech font-bold uppercase shrink-0 ${
                      isSelected && isPlayingSynth
                        ? 'bg-amber-400 text-black'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {isSelected && isPlayingSynth ? 'LIVE' : 'LOAD'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-2 rounded-lg bg-black/50 border border-slate-800/80 text-[11px] font-sans text-slate-300">
            <strong className="text-amber-400 font-mono-tech uppercase mr-1.5">
              ACTIVE GROOVE PROFILE:
            </strong>
            {selectedPreset.description}
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE FLOW MUSIC CREATOR (16-STEP DRUM & SWING SEQUENCER) */}
      {deckMode === 'sequencer' && (
        <div className="space-y-2.5 bg-black/60 p-3 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono-tech text-cyan-300 font-bold uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              16-STEP FLOW BEAT MATRIX (CLICK CELLS TO SCULPT KICK, SNARE & TRIPLET HATS)
            </span>
            <div className="flex items-center gap-2 text-[10px] font-mono-tech">
              <span className="text-slate-400">MPC SWING: {Math.round(swing * 100)}%</span>
              <input
                type="range"
                min={0}
                max={35}
                value={Math.round(swing * 100)}
                onChange={(e) => setSwing(parseInt(e.target.value, 10) / 100)}
                className="w-20 accent-cyan-400 cursor-pointer"
              />
              <button
                onClick={() => {
                  playLcarsChirp('tap');
                  setCustomKick([...selectedPreset.kickPattern]);
                  setCustomSnare([...selectedPreset.snarePattern]);
                  setCustomHat([...selectedPreset.hatPattern]);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 uppercase cursor-pointer"
              >
                RESET PATTERN
              </button>
            </div>
          </div>

          {/* 3-Row Step Grid: Kick, Snare, Hat */}
          <div className="space-y-1.5 font-mono-tech text-[10px]">
            {/* KICK ROW */}
            <div className="flex items-center gap-1">
              <span className="w-12 text-amber-400 font-bold uppercase shrink-0">KICK</span>
              <div className="grid grid-cols-16 gap-1 flex-1">
                {customKick.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStepCell('kick', idx)}
                    className={`h-5 rounded-xs border transition-all cursor-pointer ${
                      val > 0
                        ? 'bg-amber-400 border-amber-300 text-black font-bold'
                        : idx % 4 === 0
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-900 border-slate-800'
                    } ${isPlayingSynth && currentStep === idx ? 'ring-2 ring-white' : ''}`}
                  >
                    {val > 0 ? 'K' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* SNARE ROW */}
            <div className="flex items-center gap-1">
              <span className="w-12 text-cyan-400 font-bold uppercase shrink-0">SNARE</span>
              <div className="grid grid-cols-16 gap-1 flex-1">
                {customSnare.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStepCell('snare', idx)}
                    className={`h-5 rounded-xs border transition-all cursor-pointer ${
                      val > 0
                        ? 'bg-cyan-400 border-cyan-300 text-black font-bold'
                        : idx % 4 === 0
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-900 border-slate-800'
                    } ${isPlayingSynth && currentStep === idx ? 'ring-2 ring-white' : ''}`}
                  >
                    {val > 0 ? 'S' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* HI-HAT ROW (1 = Closed, 2 = Open, 3 = Triplet Roll) */}
            <div className="flex items-center gap-1">
              <span className="w-12 text-emerald-400 font-bold uppercase shrink-0">HI-HAT</span>
              <div className="grid grid-cols-16 gap-1 flex-1">
                {customHat.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStepCell('hat', idx)}
                    className={`h-5 rounded-xs border transition-all cursor-pointer ${
                      val === 3
                        ? 'bg-purple-500 border-purple-300 text-white font-bold'
                        : val === 2
                        ? 'bg-emerald-300 border-emerald-200 text-black font-bold'
                        : val === 1
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-800'
                    } ${isPlayingSynth && currentStep === idx ? 'ring-2 ring-white' : ''}`}
                    title="Click to cycle: Off -> Closed Hat -> Open Hat -> Triplet Roll (3x)"
                  >
                    {val === 3 ? '3x' : val === 2 ? 'O' : val === 1 ? 'H' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: USER CUSTOM INSTRUMENTAL UPLOADER (MP3 / WAV / OGG / M4A) */}
      {deckMode === 'uploads' && (
        <div className="space-y-3 bg-black/60 p-3 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono-tech uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                UPLOAD YOUR OWN INSTRUMENTALS (MP3, WAV, OGG, M4A, FLAC)
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Tracks are stored locally in your browser’s IndexedDB vault so you can practice over your own beats anytime.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleUploadFiles}
                className="hidden"
                id="rapper-friend-beat-upload-input"
              />
              <label
                htmlFor="rapper-friend-beat-upload-input"
                className="px-3.5 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                SELECT AUDIO FILE(S)
              </label>
            </div>
          </div>

          {/* Optional Metadata Tagging before Upload + Speed/Screw Control */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[10px] font-mono-tech">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">TAG UPLOAD BPM:</span>
              <input
                type="number"
                min={50}
                max={200}
                value={uploadBpmInput}
                onChange={(e) => setUploadBpmInput(parseInt(e.target.value, 10) || 90)}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-white"
              />
              <input
                type="text"
                value={uploadStyleTag}
                onChange={(e) => setUploadStyleTag(e.target.value)}
                placeholder="Style tag (e.g. Grime Dubplate)"
                className="w-36 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-white"
              />
            </div>

            {/* Playback Speed / Chopped & Screwed Selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 uppercase mr-1">SPEED / PITCH:</span>
              {[
                { label: '0.75x SCREWED', rate: 0.75 },
                { label: '0.9x SLOW', rate: 0.9 },
                { label: '1.0x NORMAL', rate: 1.0 },
                { label: '1.15x FAST', rate: 1.15 },
              ].map((sp) => (
                <button
                  key={sp.rate}
                  onClick={() => handlePlaybackRateChange(sp.rate)}
                  className={`px-2 py-0.5 rounded uppercase font-bold cursor-pointer ${
                    uploadPlaybackRate === sp.rate
                      ? 'bg-amber-400 text-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Uploaded Tracks List */}
          {uploadedBeats.length === 0 ? (
            <div className="py-5 text-center text-xs font-mono-tech text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No custom instrumentals uploaded yet. Click "SELECT AUDIO FILE(S)" above to load your own MP3 or WAV beats.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {uploadedBeats.map((beat) => {
                const isActive = activeUploadId === beat.id && isPlayingUpload;
                return (
                  <div
                    key={beat.id}
                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-400'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => handlePlayUploadedBeat(beat)}
                        className={`p-1.5 rounded-full cursor-pointer ${
                          isActive ? 'bg-red-500 text-white' : 'bg-emerald-400 text-black'
                        }`}
                      >
                        {isActive ? (
                          <Square className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate uppercase">
                          {beat.name}
                        </div>
                        <div className="text-[10px] font-mono-tech text-emerald-300">
                          {beat.estimatedBpm} BPM • {beat.styleTag} • LOOP ON
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActive && uploadDuration > 0 && (
                        <span className="text-[10px] font-mono-tech text-amber-300">
                          {Math.floor(uploadProgress)}s / {Math.floor(uploadDuration)}s
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteUploadedBeat(beat.id)}
                        className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                        title="Delete Uploaded Instrumental"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Bottom 16-Step Visual Beat & Spectrum Telemetry Strip */}
      <div className="grid grid-cols-16 gap-1 pt-1">
        {Array.from({ length: 16 }).map((_, step) => {
          const isActive = isPlayingSynth && currentStep === step;
          const isDownbeat = step % 4 === 0;
          const hasKick = customKick[step] > 0;
          const hasSnare = customSnare[step] > 0;
          return (
            <div
              key={step}
              className={`h-6 rounded-xs transition-all flex flex-col items-center justify-center text-[9px] font-mono-tech font-bold ${
                isActive
                  ? 'bg-amber-400 text-black scale-105 shadow-md'
                  : isDownbeat
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-950 text-slate-500 border border-slate-800/70'
              }`}
            >
              <span>{step + 1}</span>
              <span className="text-[7px] leading-none">
                {hasKick ? 'K' : hasSnare ? 'S' : '·'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
