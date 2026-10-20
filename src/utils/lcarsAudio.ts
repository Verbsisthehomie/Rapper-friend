/**
 * Authentic Star Trek LCARS Audio Engine
 * Powered by official audio assets from www.thelcars.com (beep1-4, picard-key)
 * with procedural Web Audio API synthesizer fallback
 */

import { LcarsEra } from '../types/lcars';

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;
let activeEra: LcarsEra = 'tng';

// Pre-cached audio elements for ultra-low latency playback
const audioCache: Record<string, HTMLAudioElement> = {};

function getCachedAudio(path: string): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audioCache[path]) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioCache[path] = audio;
    } catch {
      return null;
    }
  }
  return audioCache[path];
}

export function setAudioEra(era: LcarsEra) {
  activeEra = era;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function toggleAudioMute(muted?: boolean): boolean {
  if (typeof muted === 'boolean') {
    isAudioMuted = muted;
  } else {
    isAudioMuted = !isAudioMuted;
  }
  return isAudioMuted;
}

export function getAudioMutedState(): boolean {
  return isAudioMuted;
}

/**
 * Play authentic thelcars.com sound effects with fallback to procedural synth
 */
export function playLcarsChirp(
  type: 'tap' | 'ack' | 'scan' | 'warp' | 'alert' | 'tick' | 'input' = 'tap'
) {
  if (isAudioMuted) return;

  // Determine official MP3 sound asset based on era and interaction type
  let mp3Path: string | null = null;

  if (activeEra === 'picard' && (type === 'tap' || type === 'input')) {
    mp3Path = '/assets/lcars/picard-key.mp3';
  } else if (type === 'tap' || type === 'input') {
    mp3Path = '/assets/lcars/beep1.mp3';
  } else if (type === 'ack') {
    mp3Path = '/assets/lcars/beep2.mp3';
  } else if (type === 'scan') {
    mp3Path = '/assets/lcars/beep3.mp3';
  } else if (type === 'warp' || type === 'alert') {
    mp3Path = '/assets/lcars/beep4.mp3';
  }

  if (mp3Path) {
    const audioEl = getCachedAudio(mp3Path);
    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.volume = type === 'alert' ? 0.35 : 0.25;
      audioEl.play().catch(() => {
        // Fall back to Web Audio procedural synthesis if browser blocks unmuted media
        playSynthesizedFallback(type);
      });
      return;
    }
  }

  playSynthesizedFallback(type);
}

function playSynthesizedFallback(type: 'tap' | 'ack' | 'scan' | 'warp' | 'alert' | 'tick' | 'input') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (type === 'tap' || type === 'input') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'input' ? 960 : 880, now);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } else if (type === 'ack') {
    [1046.5, 1318.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.07, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.09);
    });
  } else if (type === 'scan') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(1760, now + 0.12);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'warp') {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);
      gain.gain.setValueAtTime(0.06, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.26);
    });
  } else if (type === 'tick') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }
}
