import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countSyllables,
  wordsRhyme,
  getRhymeTail,
  detectLiteraryDevices,
  analyzeBars,
  analyzeRhymeSchemes,
  applySchemeReplacement,
} from './rhymeEngine.ts';

test('countSyllables: calculates accurate syllable counts for words', () => {
  assert.equal(countSyllables('cat'), 1);
  assert.equal(countSyllables('pot'), 1);
  assert.equal(countSyllables('rhythm'), 2);
  assert.equal(countSyllables('poetry'), 3);
  assert.equal(countSyllables('alliteration'), 5);
  assert.equal(countSyllables('galaxy'), 3);
});

test('getRhymeTail & wordsRhyme: detects perfect and slant rhymes', () => {
  const catFat = wordsRhyme('cat', 'fat');
  assert.equal(catFat.rhymes, true);
  assert.equal(catFat.type, 'perfect');

  const nightLight = wordsRhyme('night', 'light');
  assert.equal(nightLight.rhymes, true);
  assert.equal(nightLight.type, 'perfect');

  const potRot = wordsRhyme('pot', 'rot');
  assert.equal(potRot.rhymes, true);
});

test('detectLiteraryDevices: detects alliteration, anaphora, and internal rhymes', () => {
  const bars = [
    'big bad beats bounce bold',
    'big bad beats break bones',
  ];
  const devices = detectLiteraryDevices(bars);
  const alliteration = devices.find(d => d.type === 'Alliteration');
  assert.ok(alliteration, 'Should identify alliteration');

  const anaphora = devices.find(d => d.type === 'Anaphora');
  assert.ok(anaphora, 'Should identify anaphora for repeated initial word');
});

test('analyzeBars: parses bars, syllable counts, and calculates rhyme density', () => {
  const rap = `I drop the mic and ignite the light
Deep in the flight through the darkest night
Ancient wisdom carved in stone
The cyber soul upon the golden throne`;

  const analysis = analyzeBars(rap);
  assert.equal(analysis.lines.length, 4);
  assert.equal(analysis.lineSyllables.length, 4);
  assert.ok(analysis.totalSyllables > 30, 'Total syllables counted');
  assert.ok(analysis.rhymeDensityScore > 0, 'Rhyme density score computed');
  assert.ok(analysis.cadenceGrade.length > 0, 'Cadence grade assigned');
});

test('analyzeRhymeSchemes: correctly detects AABB, ABAB, and AAAA patterns', () => {
  // AABB Couplets
  const aabbBars = [
    'I step into the night',
    'Igniting every light',
    'Ancient words upon the stone',
    'Ascending to the golden throne',
  ];
  const aabbRes = analyzeRhymeSchemes(aabbBars);
  assert.equal(aabbRes.detectedPattern, 'AABB');
  assert.equal(aabbRes.suggestions.find(s => s.targetPattern === 'AABB')?.matchScore, 100);

  // ABAB Alternating
  const ababBars = [
    'I step into the night',
    'Ancient words upon the stone',
    'Igniting every light',
    'Ascending to the golden throne',
  ];
  const ababRes = analyzeRhymeSchemes(ababBars);
  assert.equal(ababRes.detectedPattern, 'ABAB');
  assert.equal(ababRes.suggestions.find(s => s.targetPattern === 'ABAB')?.matchScore, 100);

  // AAAA Monorhyme
  const aaaaBars = [
    'Slick black cat',
    'Velvet on the mat',
    'Bass frequencies fat',
    'Never looking flat',
  ];
  const aaaaRes = analyzeRhymeSchemes(aaaaBars);
  assert.equal(aaaaRes.detectedPattern, 'AAAA');
  assert.equal(aaaaRes.suggestions.find(s => s.targetPattern === 'AAAA')?.matchScore, 100);
});

test('analyzeRhymeSchemes: generates suggestions for unrhymed bars', () => {
  const unrhymedBars = [
    'I step into the night',
    'Looking at the moon',
    'Words upon the stone',
    'Standing in the dark',
  ];
  const res = analyzeRhymeSchemes(unrhymedBars);
  assert.ok(res.suggestions.length >= 3, 'Proposes AABB, ABAB, and AAAA suggestions');

  const aabb = res.suggestions.find(s => s.targetPattern === 'AABB');
  assert.ok(aabb, 'Has AABB proposal');
  assert.ok(aabb.lineSuggestions.length > 0, 'Has line suggestions');
  assert.ok(aabb.lineSuggestions[0].suggestedWords.length > 0, 'Has candidate words');

  // Test applySchemeReplacement
  const replaced = applySchemeReplacement(unrhymedBars.join('\n'), 1, 'light');
  assert.ok(replaced.includes('Looking at the light'), 'Replaced end word cleanly');
});

