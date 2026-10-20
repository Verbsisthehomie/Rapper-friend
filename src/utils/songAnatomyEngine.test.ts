import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeSongRhymeAnatomy,
  parseSongLink,
  extractCleanLyricsFromText,
  SHOWCASE_SONG_PRESETS,
} from './songAnatomyEngine.ts';

test('parseSongLink: extracts YouTube, Spotify, and Genius link metadata', () => {
  const yt = parseSongLink('https://www.youtube.com/watch?v=sB1ke-LdGFI');
  assert.equal(yt.platform, 'youtube');

  const spot = parseSongLink('https://open.spotify.com/track/meatgrinder-doom');
  assert.equal(spot.platform, 'spotify');
  assert.match(spot.titleGuess, /Meatgrinder/i);

  const genius = parseSongLink('https://genius.com/Verbs-art-rap-cipher-lyrics');
  assert.equal(genius.platform, 'genius');
});

test('extractCleanLyricsFromText: filters section tags and parses LRC timestamps', () => {
  const input = `[Verse 1]
[00:12.50] I calculate the azimuth and activate the frequency
[00:15.00] Subterranean syndicate commanding with expediency
[Chorus]
We keep the cypher moving`;

  const parsed = extractCleanLyricsFromText(input);
  assert.equal(parsed.lines.length, 3);
  assert.equal(parsed.lines[0].timestamp, '00:12.50');
  assert.equal(parsed.lines[0].text, 'I calculate the azimuth and activate the frequency');
  assert.equal(parsed.lines[1].text, 'Subterranean syndicate commanding with expediency');
  assert.equal(parsed.lines[2].text, 'We keep the cypher moving');
});

test('analyzeSongRhymeAnatomy: produces full phonemic rhyme groups, scheme, and cleverness metrics', () => {
  const preset = SHOWCASE_SONG_PRESETS[0];
  const result = analyzeSongRhymeAnatomy(preset.lyrics, {
    title: preset.title,
    artist: preset.artist,
    bpm: preset.bpm,
  });

  assert.equal(result.totalBars, 8);
  assert.ok(result.totalSyllables > 80);
  assert.ok(result.avgSyllablesPerBar >= 10);
  assert.ok(result.rhymeDensityScore > 20);
  assert.ok(result.rhymeFamilies.length >= 2);

  // Cleverness analysis checks
  assert.ok(result.cleverness.overallScore >= 80);
  assert.ok(['S+', 'S', 'A+', 'A'].includes(result.cleverness.cadenceGrade));
  assert.ok(result.cleverness.executiveSummary.length > 50);
  assert.ok(result.cleverness.semanticWordplayInsights.length >= 3);
});
