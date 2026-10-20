import type { HolodeckChallenge } from '../types/lcars.ts';

export const HOLODECK_CHALLENGES: HolodeckChallenge[] = [
  {
    id: 'holo-01-astrometric',
    code: 'HOL-ALPHA-701',
    title: 'Astrometric Telemetry Drill',
    theme: 'ASTROMETRICS',
    difficulty: 'LIEUTENANT',
    rhymeScheme: 'AABB',
    targetRoot: '*bhel- (to shine/burn)',
    targetWords: ['light', 'night', 'flight', 'ignite'],
    targetDevice: 'Assonance & Consonance',
    syllableTarget: '10–12 syllables per bar',
    timeLimitSeconds: 180,
    promptScaffold: `I plot the starship coordinates through the darkest night
Quantum calculations blazing with a spark of light
Engines hum with plasma pulses ready to ignite
Beyond the gravitational pull we launch the flight`,
    objective: 'Weave all 4 target words into an AABB quad while maintaining 10-12 syllables and activating the *bhel- fire/light root.',
  },
  {
    id: 'holo-02-cybernetic',
    code: 'HOL-BETA-412',
    title: 'Cybernetic Monorhyme Barrage',
    theme: 'CYBERNETICS',
    difficulty: 'COMMANDER',
    rhymeScheme: 'AAAA',
    targetRoot: '*steh₂- (*sta- to stand/substance)',
    targetWords: ['cat', 'habitat', 'format', 'combat'],
    targetDevice: 'Internal Rhyme',
    syllableTarget: '11–13 syllables per bar',
    timeLimitSeconds: 150,
    promptScaffold: `Slick black cybernetic cat stalking down the habitat
Overclocking algorithms locked in digital format
Heavy sub-bass armor charging up for iron combat
Never leaving verses flat, standing firm upon the mat`,
    objective: 'Execute an unrelenting AAAA monorhyme barrage using the -at family with at least one internal rhyme in bars 1 and 3.',
  },
  {
    id: 'holo-03-jazz-subterrene',
    code: 'HOL-GAMMA-903',
    title: 'Subterranean Jazz Chiasmus',
    theme: 'SUBTERRANEAN JAZZ',
    difficulty: 'FLEET CAPTAIN',
    rhymeScheme: 'ABAB',
    targetRoot: '*men- (to think/remember/spirit)',
    targetWords: ['voice', 'music', 'epic', 'vow'],
    targetDevice: 'Chiasmus (A...B / B...A)',
    syllableTarget: '10–14 syllables per bar',
    timeLimitSeconds: 240,
    promptScaffold: `We shape the midnight music when the music shapes the voice
Carving out an epic verse to sanctify the vow
The spirit never falters when the cadence makes the choice
Echoes of the ancient root resonate right now`,
    objective: 'Implement an authentic Chiasmus structure ("music shapes voice / voice shapes music") while alternating cross-rhymes in ABAB cadence.',
  },
  {
    id: 'holo-04-temporal-paradox',
    code: 'HOL-DELTA-219',
    title: 'Temporal Paradox Cadence',
    theme: 'TEMPORAL PARADOX',
    difficulty: 'COMMANDER',
    rhymeScheme: 'ABAB',
    targetRoot: '*nókʷt- (night/celestial shadow)',
    targetWords: ['night', 'stone', 'flight', 'throne'],
    targetDevice: 'Anaphora (Line-head repetition)',
    syllableTarget: '9–11 syllables per bar',
    timeLimitSeconds: 180,
    promptScaffold: `Deep in the center of the timeless night
Carved in the ruins of the granite stone
Deep in the velocity of quantum flight
Ascending quietly to claim the throne`,
    objective: 'Alternate rhymes in ABAB scheme and utilize anaphora (repeating "Deep in the..." on lines 1 and 3).',
  },
  {
    id: 'holo-05-street-epistemology',
    code: 'HOL-EPSILON-554',
    title: 'Cadet Fundamentals Protocol',
    theme: 'STREET EPISTEMOLOGY',
    difficulty: 'CADET',
    rhymeScheme: 'AABB',
    targetRoot: '*wekw- (to speak/voice)',
    targetWords: ['top', 'rot', 'pot', 'stock'],
    targetDevice: 'Alliteration',
    syllableTarget: '8–10 syllables per bar',
    timeLimitSeconds: 210,
    promptScaffold: `We stand upon the solid mountain top
Watching all the counterfeit illusions rot
Simmering the wisdom in an iron pot
Rising up the ranks and taking every stock`,
    objective: 'Cadet baseline: integrate all 4 target rhyme codas in AABB format with steady 8-10 syllable boom-bap rhythm.',
  },
];
