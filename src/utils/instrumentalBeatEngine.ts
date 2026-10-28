// ============================================================================
// RAPPER FRIEND // LCARS-26 MULTI-STYLE INSTRUMENTAL BEAT ENGINE & CUSTOM AUDIO DB
// Synthesizes 12 authentic regional & global instrumental styles in real time
// via Web Audio API + manages user-uploaded audio tracks in IndexedDB.
// ============================================================================

export interface InstrumentalPreset {
  id: string;
  name: string;
  regionFlag: string;
  styleCategory: 'us-east' | 'us-south' | 'us-west-midwest' | 'uk' | 'global';
  defaultBpm: number;
  swingFactor: number; // 0 = straight, 0.15 - 0.35 = MPC boom-bap swing
  subdivisionFeel: string;
  description: string;
  recommendedDisciplineId: string;
  bassFreqs: number[]; // 16-step bass frequency sequence (0 = rest)
  bassGlide?: boolean;
  chordNotes: number[][]; // 4 chords (1 per beat or 1 per half-bar)
  synthWave: OscillatorType;
  kickPattern: number[]; // 16 steps: 1 = hard, 0.6 = ghost, 0 = rest
  snarePattern: number[]; // 16 steps: 1 = snare/clap, 0.5 = rim, 0 = rest
  hatPattern: number[]; // 16 steps: 1 = closed, 2 = open, 3 = triplet roll
  clavePattern?: number[]; // 16 steps for Afro/Dancehall/Drill clave/stab
}

export interface CustomUploadedBeat {
  id: string;
  name: string;
  fileName: string;
  estimatedBpm: number;
  styleTag: string;
  createdAt: number;
  audioBlob: Blob;
}

export const BUILTIN_INSTRUMENTAL_PRESETS: InstrumentalPreset[] = [
  {
    id: 'ny-boombap-90',
    name: 'NY Golden Era Boom-Bap (SP-1200 Jazz Chop)',
    regionFlag: '🇺🇸',
    styleCategory: 'us-east',
    defaultBpm: 90,
    swingFactor: 0.24,
    subdivisionFeel: '16th-Note MPC60 Swing (62%) • Behind-the-Snare Pocket',
    description:
      'Dusty Queensbridge/Brooklyn SP-1200 kick & crisp snare on 2 & 4 with warm minor-9th Fender Rhodes jazz chords and upright walking sub-bass.',
    recommendedDisciplineId: 'us-ny-golden-compound',
    bassFreqs: [55, 0, 55, 65.41, 0, 0, 73.42, 0, 82.41, 0, 73.42, 0, 65.41, 0, 61.74, 0],
    chordNotes: [
      [220, 261.63, 329.63, 392.0], // Am7
      [220, 261.63, 329.63, 392.0],
      [196.0, 233.08, 293.66, 349.23], // Gm7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
    ],
    synthWave: 'triangle',
    kickPattern: [1, 0, 0, 0.7, 0, 0, 0, 0, 1, 0, 0.8, 0, 0, 0, 0, 0.5],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0, 1, 0, 0, 0],
    hatPattern: [1, 0, 1, 0, 1, 0, 1, 0.6, 1, 0, 1, 0, 1, 0, 2, 0],
  },
  {
    id: 'abstract-drumless-80',
    name: 'Abstract Underground / Drumless Chamber Loop',
    regionFlag: '🇺🇸',
    styleCategory: 'us-east',
    defaultBpm: 80,
    swingFactor: 0.28,
    subdivisionFeel: 'Hypnotic Chamber Rubato • Minimal Ghost Rimshot',
    description:
      'Haunting nocturnal minor celesta/electric piano loop with warm vinyl sub-swell and whisper-quiet ghost rimshots—built for MF DOOM, Ka, Roc Marciano, and Aesop Rock dense internal webs.',
    recommendedDisciplineId: 'us-abstract-mosaic-doom',
    bassFreqs: [55, 0, 0, 0, 0, 0, 0, 0, 51.91, 0, 0, 0, 49.0, 0, 0, 0],
    chordNotes: [
      [220, 261.63, 329.63, 415.3],
      [207.65, 261.63, 329.63, 392.0],
      [196.0, 246.94, 311.13, 369.99],
      [185.0, 233.08, 293.66, 349.23],
    ],
    synthWave: 'sine',
    kickPattern: [0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    snarePattern: [0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0],
    hatPattern: [0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 0, 0, 0],
  },
  {
    id: 'uk-grime-140',
    name: 'UK Grime 140 BPM Pirate Radio Eskibeat',
    regionFlag: '🇬🇧',
    styleCategory: 'uk',
    defaultBpm: 140,
    swingFactor: 0.04,
    subdivisionFeel: '140 BPM Crisp 16th Grid • Square-Wave Bass Stabs',
    description:
      'Bow E3 Pirate Radio clash riddim with sub-zero square-wave Eskibeat bass stabs, skippy off-beat snares, and sharp 140 BPM hi-hats for 8-bar reload rallies.',
    recommendedDisciplineId: 'uk-grime-140-engine',
    bassFreqs: [55, 0, 110, 110, 0, 0, 98, 0, 0, 0, 0, 55, 116.54, 116.54, 0, 0],
    chordNotes: [
      [220, 293.66, 440],
      [0, 0, 0],
      [233.08, 311.13, 466.16],
      [0, 0, 0],
    ],
    synthWave: 'square',
    kickPattern: [1, 0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    snarePattern: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.8, 0],
    hatPattern: [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 3, 3, 1, 0],
    clavePattern: [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  },
  {
    id: 'uk-drill-142',
    name: 'UK Road Rap & Sliding 808 Drill (3+3+2 Pocket)',
    regionFlag: '🇬🇧',
    styleCategory: 'uk',
    defaultBpm: 142,
    swingFactor: 0.02,
    subdivisionFeel: '3+3+2 Tresillo Counter-Hi-Hats • Octave 808 Glides',
    description:
      'South/West London Road Rap & Drill instrumental featuring the signature 3+3+2 hi-hat bounce, delayed Beat-3/Beat-4 snare, and menacing octave-sliding 808 sub-bass.',
    recommendedDisciplineId: 'uk-road-rap-drill-engine',
    bassFreqs: [55, 55, 0, 0, 0, 0, 65.41, 0, 0, 110, 130.81, 0, 98, 146.83, 55, 0],
    bassGlide: true,
    chordNotes: [
      [220, 261.63, 329.63],
      [220, 261.63, 329.63],
      [207.65, 246.94, 329.63],
      [196.0, 246.94, 293.66],
    ],
    synthWave: 'sawtooth',
    kickPattern: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 1, 0, 0],
    snarePattern: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hatPattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 3, 1],
    clavePattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  },
  {
    id: 'memphis-triplet-138',
    name: 'Memphis 12/8 Triplet Phonk & Cowbell 808',
    regionFlag: '🇺🇸',
    styleCategory: 'us-south',
    defaultBpm: 138,
    swingFactor: 0.0,
    subdivisionFeel: '12/8 Rolling Triplet Grid (1-trip-let 2-trip-let)',
    description:
      'Dark 1990s Memphis tape distortion, TR-808 cowbell melody, booming trunk sub-bass, and machine-gun triplet hi-hat rolls.',
    recommendedDisciplineId: 'us-south-memphis-atlanta-texas',
    bassFreqs: [55, 55, 0, 0, 58.27, 0, 0, 0, 55, 0, 65.41, 0, 51.91, 0, 0, 0],
    chordNotes: [
      [220, 261.63, 311.13],
      [233.08, 277.18, 329.63],
      [220, 261.63, 311.13],
      [207.65, 246.94, 293.66],
    ],
    synthWave: 'square',
    kickPattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0.8, 0],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hatPattern: [3, 3, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 3, 3, 3],
    clavePattern: [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  },
  {
    id: 'texas-screwed-68',
    name: 'Texas Chopped & Screwed Syrup Slab (68 BPM)',
    regionFlag: '🇺🇸',
    styleCategory: 'us-south',
    defaultBpm: 68,
    swingFactor: 0.22,
    subdivisionFeel: 'Slowed Gulf Coast Drawl • Wide Vowel Sustain Pocket',
    description:
      'Houston / Port Arthur ultra-heavy 68 BPM trunk rattler with warm Southern organ chords and deep sub-bass for stretching monophthong vowels.',
    recommendedDisciplineId: 'us-south-memphis-atlanta-texas',
    bassFreqs: [49.0, 0, 49.0, 55.0, 0, 0, 58.27, 0, 65.41, 0, 58.27, 0, 55.0, 0, 49.0, 0],
    chordNotes: [
      [196.0, 233.08, 293.66, 349.23],
      [196.0, 233.08, 293.66, 349.23],
      [174.61, 220.0, 261.63, 329.63],
      [164.81, 207.65, 246.94, 311.13],
    ],
    synthWave: 'triangle',
    kickPattern: [1, 0, 0, 0.8, 0, 0, 0, 1, 1, 0, 0.7, 0, 0, 0, 0, 0],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0.5],
    hatPattern: [1, 1, 3, 1, 1, 1, 2, 1, 1, 1, 3, 1, 1, 1, 2, 1],
  },
  {
    id: 'westcoast-gfunk-94',
    name: 'West Coast G-Funk Synth Lead & Vallejo Bounce',
    regionFlag: '🇺🇸',
    styleCategory: 'us-west-midwest',
    defaultBpm: 94,
    swingFactor: 0.18,
    subdivisionFeel: 'Laid-Back California Bounce & Bay Area Elastic Pocket',
    description:
      'Long Beach / Compton / Vallejo G-Funk groove with portamento high sine-whistle lead, P-Funk synth bass, and crisp handclap snares.',
    recommendedDisciplineId: 'us-west-coast-gfunk-blowed',
    bassFreqs: [55, 0, 55, 65.41, 73.42, 0, 82.41, 0, 55, 0, 98.0, 82.41, 73.42, 0, 65.41, 0],
    bassGlide: true,
    chordNotes: [
      [440, 523.25, 659.25],
      [392.0, 493.88, 587.33],
      [349.23, 440.0, 523.25],
      [329.63, 415.3, 493.88],
    ],
    synthWave: 'sine',
    kickPattern: [1, 0, 0, 0.8, 0, 0, 1, 0, 1, 0, 0, 0.7, 0, 0, 0.9, 0],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hatPattern: [1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0],
  },
  {
    id: 'midwest-chopper-148',
    name: 'Midwest Double-Time Chopper Artillery (148 BPM)',
    regionFlag: '🇺🇸',
    styleCategory: 'us-west-midwest',
    defaultBpm: 148,
    swingFactor: 0.02,
    subdivisionFeel: '32nd-Note Precision Double-Tonguing Grid',
    description:
      'Cleveland / Chicago / Kansas City high-velocity 148 BPM chopper instrumental with rapid acoustic-style hi-hats, dramatic minor strings, and relentless double-time pulse.',
    recommendedDisciplineId: 'us-midwest-chopper-precision',
    bassFreqs: [55, 0, 55, 0, 65.41, 0, 65.41, 0, 73.42, 0, 73.42, 0, 61.74, 0, 61.74, 0],
    chordNotes: [
      [220, 261.63, 329.63],
      [246.94, 293.66, 369.99],
      [261.63, 311.13, 392.0],
      [246.94, 293.66, 369.99],
    ],
    synthWave: 'sawtooth',
    kickPattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0.6],
    hatPattern: [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 1],
  },
  {
    id: 'detroit-flint-106',
    name: 'Detroit & Flint Nervous Piano Off-Beat Bounce',
    regionFlag: '🇺🇸',
    styleCategory: 'us-west-midwest',
    defaultBpm: 106,
    swingFactor: 0.0,
    subdivisionFeel: 'Urgent Straight 16th Piano Stabs • Off-Beat Talk-Rap Pocket',
    description:
      'Signature Michigan dark menacing piano loop at 106 BPM with punchy syncopated bass stabs and rapid snare rolls—built for punch-in run-on flows.',
    recommendedDisciplineId: 'us-detroit-flint-offbeat',
    bassFreqs: [55, 0, 0, 55, 0, 0, 65.41, 0, 58.27, 0, 0, 58.27, 0, 51.91, 0, 0],
    chordNotes: [
      [220, 233.08, 329.63],
      [220, 233.08, 329.63],
      [207.65, 220.0, 311.13],
      [196.0, 220.0, 293.66],
    ],
    synthWave: 'triangle',
    kickPattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, 0.6, 0],
    hatPattern: [1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1],
    clavePattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  },
  {
    id: 'uk-garage-jungle-134',
    name: 'UK Garage 2-Step & Bassline Skippy Pocket (134 BPM)',
    regionFlag: '🇬🇧',
    styleCategory: 'uk',
    defaultBpm: 134,
    swingFactor: 0.26,
    subdivisionFeel: 'Swung 2-Step Shuffling Kick • Sub-Bass Wobble',
    description:
      'Classic London 2-Step UK Garage & Sheffield Bassline groove where the four-on-the-floor kick is replaced by a shuffling syncopated skip.',
    recommendedDisciplineId: 'uk-garage-jungle-fastchat',
    bassFreqs: [55, 0, 0, 65.41, 0, 0, 73.42, 65.41, 55, 0, 0, 82.41, 73.42, 0, 65.41, 0],
    chordNotes: [
      [261.63, 311.13, 392.0, 466.16],
      [233.08, 293.66, 349.23, 440.0],
      [220.0, 261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66, 369.99],
    ],
    synthWave: 'triangle',
    kickPattern: [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    snarePattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0.6, 0],
    hatPattern: [1, 0, 2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1, 0, 2, 1],
  },
  {
    id: 'afro-amapiano-112',
    name: 'West African Afro-Polyrhythm & Amapiano Log-Drum',
    regionFlag: '🌍',
    styleCategory: 'global',
    defaultBpm: 112,
    swingFactor: 0.16,
    subdivisionFeel: '3-2 Clavé Bell Timeline • Resonant Log-Drum Sub-Bass',
    description:
      'Lagos / Accra / Johannesburg polyrhythmic fusion combining the traditional 3-2 West African bell clavé with deep Amapiano log-drum bass syncopation.',
    recommendedDisciplineId: 'west-african-afro-polyrhythm',
    bassFreqs: [55, 0, 0, 65.41, 0, 0, 73.42, 0, 55, 0, 82.41, 0, 73.42, 65.41, 55, 0],
    chordNotes: [
      [220, 261.63, 329.63, 392.0],
      [220, 261.63, 329.63, 392.0],
      [196.0, 246.94, 293.66, 369.99],
      [174.61, 220.0, 261.63, 329.63],
    ],
    synthWave: 'sine',
    kickPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snarePattern: [0, 0, 0, 0.6, 0, 0, 0.7, 0, 0, 0, 0, 0.6, 0, 0, 0.8, 0],
    hatPattern: [1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    clavePattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
  },
  {
    id: 'dancehall-riddim-98',
    name: 'Kingston Sound System Dancehall Riddim (98 BPM)',
    regionFlag: '🇯🇲',
    styleCategory: 'global',
    defaultBpm: 98,
    swingFactor: 0.08,
    subdivisionFeel: '3+3+2 Steely & Clevie Dembow Riddim • Dub Sub-Bass',
    description:
      'Jamaican Sound System digital dancehall riddim with heavy dub sub-bass and crisp 3+3+2 snare counteraction for Patois toasting and fast-chat.',
    recommendedDisciplineId: 'jamaican-dancehall-toasting',
    bassFreqs: [55, 0, 0, 55, 0, 0, 73.42, 0, 65.41, 0, 0, 65.41, 0, 0, 49.0, 0],
    chordNotes: [
      [220, 261.63, 329.63],
      [0, 0, 0],
      [196.0, 246.94, 293.66],
      [0, 0, 0],
    ],
    synthWave: 'triangle',
    kickPattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snarePattern: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    hatPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0],
    clavePattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  },
];

// ============================================================================
// WEB AUDIO API REAL-TIME PROCEDURAL INSTRUMENTAL SYNTHESIZER
// ============================================================================

class ProceduralBeatSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  public muteDrums = false;
  public muteBass = false;
  public muteChords = false;
  public masterVolume = 0.8;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getFrequencyLevels(): number[] {
    if (!this.analyser) return new Array(16).fill(8);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    const bars: number[] = [];
    for (let i = 0; i < 16; i++) {
      bars.push(Math.max(6, Math.round((data[i] / 255) * 100)));
    }
    return bars;
  }

  public triggerStep(preset: InstrumentalPreset, stepIndex: number, bpm: number) {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;
    const now = ctx.currentTime;
    const stepDur = 60 / bpm / 4;

    // 1. KICK DRUM
    const kickVel = preset.kickPattern[stepIndex] || 0;
    if (!this.muteDrums && kickVel > 0) {
      this.playKick(ctx, now, kickVel, preset.id.includes('808') || preset.id.includes('drill') || preset.id.includes('memphis'));
    }

    // 2. SNARE / CLAP / RIMSHOT
    const snareVel = preset.snarePattern[stepIndex] || 0;
    if (!this.muteDrums && snareVel > 0) {
      this.playSnare(ctx, now, snareVel);
    }

    // 3. HI-HATS (Closed, Open, or Triplet Roll)
    const hatCode = preset.hatPattern[stepIndex] || 0;
    if (!this.muteDrums && hatCode > 0) {
      if (hatCode === 3) {
        // Rapid triplet hi-hat roll across this 16th step
        this.playHiHat(ctx, now, false, 0.35);
        this.playHiHat(ctx, now + stepDur * 0.33, false, 0.28);
        this.playHiHat(ctx, now + stepDur * 0.66, false, 0.32);
      } else {
        this.playHiHat(ctx, now, hatCode === 2, 0.32);
      }
    }

    // 4. CLAVÉ / ESKIBEAT STAB / COWBELL
    const claveVel = preset.clavePattern ? preset.clavePattern[stepIndex] : 0;
    if (!this.muteDrums && claveVel && claveVel > 0) {
      this.playClaveOrStab(ctx, now, preset);
    }

    // 5. SUB-BASS / SLIDING 808 / LOG-DRUM
    const bassFreq = preset.bassFreqs[stepIndex] || 0;
    if (!this.muteBass && bassFreq > 0) {
      const nextStepFreq = preset.bassFreqs[(stepIndex + 1) % 16] || bassFreq;
      this.playBass(ctx, now, bassFreq, nextStepFreq, stepDur * 1.9, preset);
    }

    // 6. CHORDS / SYNTH PAD / PIANO LOOP (Triggered on quarter notes: steps 0, 4, 8, 12)
    if (!this.muteChords && stepIndex % 4 === 0) {
      const chordIdx = Math.floor(stepIndex / 4) % preset.chordNotes.length;
      const notes = preset.chordNotes[chordIdx];
      if (notes && notes.length > 0 && notes[0] > 0) {
        this.playChord(ctx, now, notes, stepDur * 3.8, preset.synthWave);
      }
    }
  }

  // Trigger a Pirate Radio "Wheel-Up / Reload" Siren & Rewind FX
  public triggerReloadWheelUp() {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;
    const now = ctx.currentTime;

    // Dub Siren / Vinyl Spinback Sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.38);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.55);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.75);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.78);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  private playKick(ctx: AudioContext, time: number, velocity: number, isLong808: boolean) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(145, time);
    osc.frequency.exponentialRampToValueAtTime(isLong808 ? 42 : 48, time + 0.09);
    osc.frequency.exponentialRampToValueAtTime(32, time + (isLong808 ? 0.38 : 0.22));

    gain.gain.setValueAtTime(0.75 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isLong808 ? 0.4 : 0.24));

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + (isLong808 ? 0.42 : 0.25));
  }

  private playSnare(ctx: AudioContext, time: number, velocity: number) {
    if (!this.masterGain) return;

    // Noise burst for snare wires
    const bufferSize = ctx.sampleRate * 0.16;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(velocity < 0.6 ? 1400 : 750, time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.42 * velocity, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + (velocity < 0.6 ? 0.07 : 0.16));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(time);

    // Body tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(velocity < 0.6 ? 380 : 195, time);
    osc.frequency.exponentialRampToValueAtTime(110, time + 0.08);

    oscGain.gain.setValueAtTime(0.35 * velocity, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playHiHat(ctx: AudioContext, time: number, isOpen: boolean, gainLevel: number) {
    if (!this.masterGain) return;
    const duration = isOpen ? 0.19 : 0.045;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * (isOpen ? 0.08 : 0.015)));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6800, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  private playClaveOrStab(ctx: AudioContext, time: number, preset: InstrumentalPreset) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (preset.id === 'uk-grime-140') {
      // Eskibeat square-wave icy pluck
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.setValueAtTime(440, time + 0.03);
      gain.gain.setValueAtTime(0.16, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);
    } else if (preset.id === 'memphis-triplet-138') {
      // 808 Cowbell (two detuned square waves look-alike)
      osc.type = 'square';
      osc.frequency.setValueAtTime(540, time);
      gain.gain.setValueAtTime(0.14, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    } else {
      // Woodblock / Clavé bell
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, time);
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.065);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.13);
  }

  private playBass(
    ctx: AudioContext,
    time: number,
    freq: number,
    nextFreq: number,
    duration: number,
    preset: InstrumentalPreset
  ) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = preset.id === 'uk-grime-140' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(freq, time);

    if (preset.bassGlide && nextFreq !== freq && nextFreq > 0) {
      osc.frequency.exponentialRampToValueAtTime(nextFreq, time + duration * 0.85);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(preset.id === 'uk-grime-140' ? 420 : 210, time);

    gain.gain.setValueAtTime(0.48, time);
    gain.gain.exponentialRampToValueAtTime(0.008, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playChord(
    ctx: AudioContext,
    time: number,
    notes: number[],
    duration: number,
    waveType: OscillatorType
  ) {
    if (!this.masterGain) return;
    notes.forEach((freq) => {
      if (freq <= 0 || !this.masterGain) return;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.055, time + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.002, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + duration + 0.03);
    });
  }
}

export const beatSynth = new ProceduralBeatSynthesizer();

// ============================================================================
// INDEXED-DB STORAGE FOR USER-UPLOADED INSTRUMENTALS (MP3 / WAV / OGG / M4A)
// ============================================================================

const DB_NAME = 'rapper_friend_instrumentals_db';
const STORE_NAME = 'custom_beats';
const DB_VERSION = 1;

function openBeatsDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCustomUploadedBeats(): Promise<CustomUploadedBeat[]> {
  try {
    const db = await openBeatsDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = (req.result as CustomUploadedBeat[]) || [];
        items.sort((a, b) => b.createdAt - a.createdAt);
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not load custom beats from IndexedDB', e);
    return [];
  }
}

export async function saveCustomUploadedBeat(beat: CustomUploadedBeat): Promise<void> {
  try {
    const db = await openBeatsDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(beat);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not save custom beat to IndexedDB', e);
  }
}

export async function deleteCustomUploadedBeat(id: string): Promise<void> {
  try {
    const db = await openBeatsDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not delete custom beat from IndexedDB', e);
  }
}
