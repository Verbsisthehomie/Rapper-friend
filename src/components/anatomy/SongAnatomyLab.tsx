import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LcarsEra, SavedPhrase, WordEntry } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  SHOWCASE_SONG_PRESETS,
  analyzeSongRhymeAnatomy,
  parseSongLink,
  SongPresetShowcase,
} from '../../utils/songAnatomyEngine';
import {
  Upload,
  Link2,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Music,
  Share2,
  Send,
  Copy,
  Check,
  Flame,
  Award,
  Layers,
  Activity,
  Info,
  ExternalLink,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface SongAnatomyLabProps {
  currentEra: LcarsEra;
  onSendToAnalyzer: (text: string) => void;
  onSaveToVault?: (phrase: SavedPhrase) => void;
  onSelectWord?: (word: WordEntry) => void;
}

type InputMode = 'preset' | 'upload' | 'link' | 'paste';

export const SongAnatomyLab: React.FC<SongAnatomyLabProps> = ({
  currentEra,
  onSendToAnalyzer,
  onSaveToVault,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [inputMode, setInputMode] = useState<InputMode>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('verbs-cipher');

  // Link input state
  const [pastedUrl, setPastedUrl] = useState<string>('');
  const [detectedLinkInfo, setDetectedLinkInfo] = useState<{
    platform: string;
    titleGuess: string;
    artistGuess: string;
  } | null>(null);

  // Raw lyrics state
  const [rawLyrics, setRawLyrics] = useState<string>(
    SHOWCASE_SONG_PRESETS[0].lyrics
  );
  const [songTitle, setSongTitle] = useState<string>(SHOWCASE_SONG_PRESETS[0].title);
  const [artistName, setArtistName] = useState<string>(SHOWCASE_SONG_PRESETS[0].artist);

  // Audio player state
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active view tab: 'anatomy' vs 'cleverness'
  const [activeViewTab, setActiveViewTab] = useState<'anatomy' | 'cleverness'>('anatomy');
  const [spotlightRhymeId, setSpotlightRhymeId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  // Run the full rhyme anatomy & cleverness analysis
  const anatomyResult = useMemo(() => {
    return analyzeSongRhymeAnatomy(rawLyrics, {
      title: songTitle,
      artist: artistName,
      sourceType:
        inputMode === 'upload'
          ? 'upload-audio'
          : inputMode === 'link'
          ? 'paste-link'
          : inputMode === 'paste'
          ? 'paste-lyrics'
          : 'preset',
      sourceUrlOrName: audioFileName || pastedUrl || songTitle,
      bpm: 88,
      audioDuration: audioDuration || 30,
    });
  }, [rawLyrics, songTitle, artistName, inputMode, audioFileName, pastedUrl, audioDuration]);

  // Audio playback handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration || 30);
    };
    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioFileUrl]);

  // Handle Preset selection
  const handleSelectPreset = (preset: SongPresetShowcase) => {
    playLcarsChirp('warp');
    setSelectedPresetId(preset.id);
    setSongTitle(preset.title);
    setArtistName(preset.artist);
    setRawLyrics(preset.lyrics);
    setPastedUrl(preset.sampleLink || '');
  };

  // Handle File Upload (Audio or Text)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playLcarsChirp('ack');
    setAudioFileName(file.name);

    if (file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioFileUrl(url);
      setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      setArtistName('Uploaded Audio Signal');
      setIsPlayingAudio(false);
      // Keep existing lyrics or give guidance
    } else {
      // Text file
      const reader = new FileReader();
      reader.onload = ev => {
        const text = ev.target?.result as string;
        if (text) {
          setRawLyrics(text);
          setSongTitle(file.name.replace(/\.[^/.]+$/, ''));
          setArtistName('Uploaded Lyrics Document');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle Link Paste
  const handleLinkAnalyze = () => {
    if (!pastedUrl) return;
    playLcarsChirp('warp');
    const info = parseSongLink(pastedUrl);
    setDetectedLinkInfo(info);
    setSongTitle(info.titleGuess);
    setArtistName(info.artistGuess);
  };

  const togglePlayAudio = () => {
    playLcarsChirp('input');
    if (!audioRef.current && !audioFileUrl) {
      // Synthesize synthetic metronome playback for presets
      setIsPlayingAudio(!isPlayingAudio);
      return;
    }
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlayingAudio(true);
      }
    }
  };

  const handleCopyReport = () => {
    playLcarsChirp('ack');
    const report = `=====================================================
LCARS RHYME ANATOMY REPORT: "${anatomyResult.title}" by ${anatomyResult.artist}
GENIUS RATING: ${anatomyResult.cleverness.overallScore}/100 [GRADE: ${anatomyResult.cleverness.cadenceGrade}]
=====================================================
RHYME DENSITY: ${anatomyResult.rhymeDensityScore}%
MULTISYLLABIC RATIO: ${anatomyResult.multisyllableRatio}%
DOMINANT SCHEME: ${anatomyResult.dominantScheme}
TOTAL BARS: ${anatomyResult.totalBars} | AVG SYLLABLES: ${anatomyResult.avgSyllablesPerBar}

EXECUTIVE CRAFT BREAKDOWN:
${anatomyResult.cleverness.executiveSummary}

FLOW POCKET & CADENCE TENSION:
${anatomyResult.cleverness.flowPocketDescription}

WHY IT'S CLEVER (SEMANTIC & MOSAIC INSIGHTS):
${anatomyResult.cleverness.semanticWordplayInsights
  .map(i => `• [${i.tag}] ${i.title}: ${i.summary}\n  Lyric: "${i.lyricQuote}"\n  Analysis: ${i.breakdown}`)
  .join('\n\n')}
=====================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleSendVerse = () => {
    playLcarsChirp('warp');
    onSendToAnalyzer(rawLyrics);
    setSentNotice('Verse transmitted to Bar Analyzer!');
    setTimeout(() => setSentNotice(null), 3000);
  };

  return (
    <div className="space-y-6 font-mono text-neutral-100">
      {/* Audio element for uploaded songs */}
      {audioFileUrl && <audio ref={audioRef} src={audioFileUrl} preload="auto" />}

      {/* Main LCARS Banner */}
      <div
        className="rounded-2xl p-4 sm:p-6 border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
        style={{ borderColor: theme.primary, backgroundColor: `${theme.primary}12` }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded text-xs font-black text-black uppercase tracking-widest"
              style={{ backgroundColor: theme.accent }}
            >
              MODULE 04 // DECONSTRUCTION LAB
            </span>
            <span className="text-xs text-neutral-400">
              AUDIO & LINK RHYME ANATOMY MATRIX
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            SONG RHYME ANATOMY & CRAFT DECONSTRUCTION
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-3xl leading-relaxed">
            Upload any audio file, paste a YouTube/Spotify/Genius link, or choose from masterwork presets. The engine maps every phonemic rhyme cluster, multisyllabic chain, and delivers a profound breakdown of <strong className="text-amber-400">why it's clever</strong>.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopyReport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-200 cursor-pointer"
          >
            {copiedReport ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Report Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-400" />
                <span>Copy Full Report</span>
              </>
            )}
          </button>
          <button
            onClick={handleSendVerse}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all text-black cursor-pointer shadow-lg"
            style={{ backgroundColor: theme.primary }}
          >
            <Send className="w-4 h-4 text-black" />
            <span>Send to Bar Analyzer</span>
          </button>
        </div>
      </div>

      {sentNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-xs text-emerald-300 font-mono flex items-center justify-between">
          <span>{sentNotice}</span>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Input Mode Switcher Header */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Select Ingestion Protocol</span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 overflow-x-auto max-w-full">
            <button
              onClick={() => {
                playLcarsChirp('input');
                setInputMode('preset');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-all cursor-pointer ${
                inputMode === 'preset'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Showcase Presets</span>
            </button>
            <button
              onClick={() => {
                playLcarsChirp('input');
                setInputMode('upload');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-all cursor-pointer ${
                inputMode === 'upload'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Audio / Lyrics</span>
            </button>
            <button
              onClick={() => {
                playLcarsChirp('input');
                setInputMode('link');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-all cursor-pointer ${
                inputMode === 'link'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Paste Song Link</span>
            </button>
            <button
              onClick={() => {
                playLcarsChirp('input');
                setInputMode('paste');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase font-bold transition-all cursor-pointer ${
                inputMode === 'paste'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Custom Lyrics</span>
            </button>
          </div>
        </div>

        {/* Input Controls Panel Based on Mode */}
        {inputMode === 'preset' && (
          <div className="space-y-3">
            <div className="text-xs text-neutral-400 font-sans">
              Choose an iconic lyricism masterpiece to deconstruct its multisyllables and cleverness:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SHOWCASE_SONG_PRESETS.map(preset => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 text-white shadow-lg'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-600 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-amber-300">{preset.artist}</span>
                      <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono">
                        {preset.bpm} BPM
                      </span>
                    </div>
                    <div className="text-xs font-bold text-neutral-100 mt-1">{preset.title}</div>
                    <div className="text-[11px] text-neutral-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.tags.map(t => (
                        <span
                          key={t}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 border border-neutral-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {inputMode === 'upload' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-neutral-700 hover:border-amber-400 rounded-2xl p-6 text-center bg-neutral-900/40 transition flex flex-col items-center justify-center space-y-3">
              <Upload className="w-10 h-10 text-amber-400" />
              <div>
                <div className="font-bold text-sm text-white">Upload Audio Track or Lyrics File</div>
                <div className="text-xs text-neutral-400 mt-1 font-sans">
                  Accepts .mp3, .wav, .m4a, .ogg, .txt, or .lrc
                </div>
              </div>
              <label className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase cursor-pointer transition shadow">
                Choose File
                <input
                  type="file"
                  accept="audio/*,.txt,.lrc"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {audioFileName && (
                <div className="text-xs text-emerald-400 font-mono mt-2 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800">
                  Loaded: {audioFileName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-400 uppercase font-bold flex items-center justify-between">
                <span>Lyrics for Uploaded Signal</span>
                <span className="text-[10px] text-neutral-500 font-normal">Edit or paste alongside track</span>
              </label>
              <textarea
                value={rawLyrics}
                onChange={e => setRawLyrics(e.target.value)}
                placeholder="Paste the song lyrics here if not embedded in file..."
                rows={6}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {inputMode === 'link' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={pastedUrl}
                  onChange={e => setPastedUrl(e.target.value)}
                  placeholder="Paste YouTube, Spotify, SoundCloud, or Genius URL..."
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                onClick={handleLinkAnalyze}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase transition shadow cursor-pointer whitespace-nowrap"
              >
                Inspect Link
              </button>
            </div>

            {detectedLinkInfo && (
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-amber-400 font-bold uppercase">
                    [{detectedLinkInfo.platform.toUpperCase()}]
                  </span>{' '}
                  <span className="text-white">{songTitle}</span> by{' '}
                  <span className="text-cyan-400">{artistName}</span>
                </div>
                <span className="text-[10px] text-neutral-400">Stream Metadata Recognized</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="text-xs text-neutral-400 uppercase font-bold">
                Song Lyrics for Deconstruction:
              </div>
              <textarea
                value={rawLyrics}
                onChange={e => setRawLyrics(e.target.value)}
                rows={5}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {inputMode === 'paste' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 uppercase">Song Title</label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={e => setSongTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 uppercase">Artist / MC</label>
                <input
                  type="text"
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 uppercase">Raw Lyrics (Line by Line)</label>
              <textarea
                value={rawLyrics}
                onChange={e => setRawLyrics(e.target.value)}
                rows={7}
                placeholder="Paste lyrics here..."
                className="w-full mt-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Audio Visualizer & Metronome Bar */}
        <div className="bg-neutral-900/90 rounded-xl p-3 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={togglePlayAudio}
              className={`p-2.5 rounded-xl font-bold transition shadow cursor-pointer ${
                isPlayingAudio ? 'bg-amber-400 text-black' : 'bg-neutral-800 hover:bg-neutral-700 text-amber-400'
              }`}
              title="Play / Pause Audio Preview"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="text-xs">
              <div className="font-bold text-white uppercase">{songTitle}</div>
              <div className="text-[10px] text-neutral-400">
                {audioFileName ? `File: ${audioFileName}` : `${artistName} // Cadence Velocity: 88 BPM`}
              </div>
            </div>
          </div>

          {/* Simulated Waveform Bar */}
          <div className="flex-1 w-full max-w-md flex items-center gap-1 h-6 px-2 bg-black rounded-lg border border-neutral-800">
            {Array.from({ length: 32 }).map((_, i) => {
              const heightPct = Math.sin((i / 32) * Math.PI * 4 + (isPlayingAudio ? Date.now() / 200 : 0)) * 40 + 50;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-150"
                  style={{
                    height: `${isPlayingAudio ? Math.max(15, heightPct) : 30}%`,
                    backgroundColor: i % 4 === 0 ? theme.primary : '#444444',
                  }}
                />
              );
            })}
          </div>

          <div className="text-xs font-mono text-neutral-400 whitespace-nowrap">
            {audioDuration ? `${Math.floor(audioCurrentTime)}s / ${Math.floor(audioDuration)}s` : 'CADENCE LOCK'}
          </div>
        </div>
      </div>

      {/* Analytics Summary Radar Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Genius Rating */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
            Genius Craft Rating
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-amber-400 font-mono">
              {anatomyResult.cleverness.overallScore}
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              [{anatomyResult.cleverness.cadenceGrade} TIER]
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 font-sans">
            Calculated across phonemic density, meter, & cadence
          </div>
        </div>

        {/* Rhyme Density */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
            Rhyme Density
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">
              {anatomyResult.rhymeDensityScore}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{ width: `${anatomyResult.rhymeDensityScore}%` }}
            />
          </div>
        </div>

        {/* Multisyllable Ratio */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
            Multisyllable Ratio
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-purple-400 font-mono">
              {anatomyResult.multisyllableRatio}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${anatomyResult.multisyllableRatio}%` }}
            />
          </div>
        </div>

        {/* Dominant Scheme */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
            Dominant Scheme
          </div>
          <div className="text-sm font-bold text-amber-300 font-mono my-2 line-clamp-2">
            {anatomyResult.dominantScheme}
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {anatomyResult.totalBars} Bars // {anatomyResult.avgSyllablesPerBar} Syllables/Bar
          </div>
        </div>
      </div>

      {/* Main Tabs: Anatomy vs Why It's Clever */}
      <div className="space-y-4">
        <div className="flex border-b border-neutral-800 gap-2">
          <button
            onClick={() => {
              playLcarsChirp('input');
              setActiveViewTab('anatomy');
            }}
            className={`px-5 py-3 font-mono text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'anatomy'
                ? 'border-amber-400 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Rhyme Anatomy & Phonemic Breakdown</span>
          </button>
          <button
            onClick={() => {
              playLcarsChirp('input');
              setActiveViewTab('cleverness');
            }}
            className={`px-5 py-3 font-mono text-xs uppercase font-bold tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'cleverness'
                ? 'border-amber-400 text-amber-400 bg-amber-950/20'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Why It's Clever (Linguistic & Craft Deconstruction)</span>
          </button>
        </div>

        {/* Tab 1: Interactive Rhyme Anatomy */}
        {activeViewTab === 'anatomy' && (
          <div className="space-y-6">
            {/* Rhyme Families Interactive Legend */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
              <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold flex items-center justify-between">
                <span>Detected Rhyme Families & Phonemic Coda Clusters</span>
                <span className="text-[10px] text-neutral-500 font-normal">
                  Tap any cluster to spotlight occurrences
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {anatomyResult.rhymeFamilies.map(rf => {
                  const isSpotlight = spotlightRhymeId === rf.id;
                  return (
                    <button
                      key={rf.id}
                      onClick={() => {
                        playLcarsChirp('input');
                        setSpotlightRhymeId(isSpotlight ? null : rf.id);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        isSpotlight
                          ? 'border-white bg-white/10 ring-2 ring-white/40'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-600'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: rf.color }}
                      />
                      <span className="font-bold text-white">{rf.vowelSound}</span>
                      <span className="text-[10px] text-neutral-400">
                        ({rf.occurrences.length}x)
                      </span>
                      <span className="text-[9px] uppercase px-1 rounded bg-black text-neutral-300">
                        {rf.type}
                      </span>
                    </button>
                  );
                })}
                {spotlightRhymeId && (
                  <button
                    onClick={() => setSpotlightRhymeId(null)}
                    className="text-xs text-neutral-400 hover:text-white px-2 py-1 underline font-mono cursor-pointer"
                  >
                    Clear spotlight
                  </button>
                )}
              </div>
            </div>

            {/* Bar by Bar Deconstruction Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>BAR-BY-BAR CADENCE & RHYME TELEMETRY</span>
                <span>{anatomyResult.bars.length} BARS TOTAL</span>
              </div>

              <div className="divide-y divide-neutral-900">
                {anatomyResult.bars.map((bar, barIdx) => {
                  const words = bar.rawText.split(/\s+/).filter(Boolean);
                  const isEndHighlighted =
                    spotlightRhymeId === null || spotlightRhymeId === bar.rhymeTagId;

                  return (
                    <div
                      key={bar.barNumber}
                      className={`p-4 transition-colors ${
                        barIdx % 2 === 0 ? 'bg-black/40' : 'bg-neutral-950'
                      } hover:bg-neutral-900/40`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-6 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold font-mono text-amber-400">
                            {String(bar.barNumber).padStart(2, '0')}
                          </span>
                          <span className="text-xs font-mono text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded">
                            {bar.syllableCount} syllables
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500 tracking-wider">
                            METER: {bar.meterPattern}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {bar.detectedDevices.map((d, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60"
                            >
                              {d.type}
                            </span>
                          ))}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400">
                            {bar.cadenceNote}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Bar Text with Colored Rhyme Highlights */}
                      <div className="text-base sm:text-lg font-mono tracking-wide leading-relaxed text-neutral-200 pl-10 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {words.map((word, wIdx) => {
                          const isLast = wIdx === words.length - 1;
                          const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');

                          // Check if internal rhyme matches
                          const internalMatch = bar.internalRhymes.find(
                            ir => ir.word.toLowerCase().replace(/[^a-z]/g, '') === cleanWord
                          );

                          if (isLast) {
                            return (
                              <span
                                key={wIdx}
                                onClick={() => {
                                  playLcarsChirp('input');
                                  setSpotlightRhymeId(
                                    spotlightRhymeId === bar.rhymeTagId ? null : bar.rhymeTagId
                                  );
                                }}
                                className="font-bold underline cursor-pointer px-1.5 py-0.5 rounded transition shadow"
                                style={{
                                  backgroundColor: isEndHighlighted
                                    ? `${bar.rhymeColor}33`
                                    : 'transparent',
                                  color: isEndHighlighted ? bar.rhymeColor : '#888888',
                                  borderColor: bar.rhymeColor,
                                }}
                                title={`Rhyme Coda: /${bar.rhymeTail}/ (Tap to spotlight)`}
                              >
                                {word}
                              </span>
                            );
                          }

                          if (internalMatch) {
                            const isMatchSpotlight =
                              spotlightRhymeId === null || spotlightRhymeId === internalMatch.rhymeTagId;
                            return (
                              <span
                                key={wIdx}
                                onClick={() => {
                                  playLcarsChirp('input');
                                  setSpotlightRhymeId(
                                    spotlightRhymeId === internalMatch.rhymeTagId
                                      ? null
                                      : internalMatch.rhymeTagId
                                  );
                                }}
                                className="px-1 py-0.5 rounded border border-dashed cursor-pointer transition text-xs font-bold"
                                style={{
                                  backgroundColor: isMatchSpotlight
                                    ? `${internalMatch.color}25`
                                    : 'transparent',
                                  color: isMatchSpotlight ? internalMatch.color : '#888888',
                                  borderColor: internalMatch.color,
                                }}
                                title="Internal Rhyme match"
                              >
                                {word}
                              </span>
                            );
                          }

                          return (
                            <span key={wIdx} className="text-neutral-300">
                              {word}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Why It's Clever Deconstruction */}
        {activeViewTab === 'cleverness' && (
          <div className="space-y-6">
            {/* Executive Craft Thesis Card */}
            <div className="bg-neutral-950 border border-amber-900/50 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-bold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Executive Lyrical Thesis & Mastery Grade</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white">
                Grade: {anatomyResult.cleverness.cadenceGrade} (Score: {anatomyResult.cleverness.overallScore}/100)
              </h2>
              <p className="text-sm sm:text-base text-neutral-200 font-sans leading-relaxed">
                {anatomyResult.cleverness.executiveSummary}
              </p>
            </div>

            {/* Deep Insight Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cadence & Flow Pocket */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Cadence Tension & Rhythmic Pocket</span>
                </div>
                <div className="text-sm text-neutral-200 font-sans leading-relaxed">
                  {anatomyResult.cleverness.flowPocketDescription}
                </div>
                <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800 text-xs font-mono text-cyan-200">
                  {anatomyResult.cleverness.breathAndPauseAnalysis}
                </div>
              </div>

              {/* Mosaic Rhymes & Compound Chains */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Mosaic & Multisyllable Alignment</span>
                </div>
                <div className="text-xs text-neutral-300 font-sans leading-relaxed">
                  How multi-word groups align phonemically across bar measures:
                </div>
                <div className="space-y-1.5">
                  {anatomyResult.cleverness.mosaicRhymesDeconstruction.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono bg-black/70 p-2.5 rounded-lg border border-neutral-800 text-purple-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specific Semantic & Rhetorical Wordplay Highlights */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                Linguistic & Rhetorical Dissections
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anatomyResult.cleverness.semanticWordplayInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-300 font-mono">
                        {insight.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase">
                        {insight.tag}
                      </span>
                    </div>

                    <blockquote className="border-l-2 border-amber-400 pl-3 py-1 font-mono text-xs text-amber-100 bg-neutral-900/40 rounded-r">
                      "{insight.lyricQuote}"
                    </blockquote>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {insight.breakdown}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
