import type { LiteraryDeviceGuide } from '../types/lcars.ts';

export const LITERARY_DEVICES_DATABASE: LiteraryDeviceGuide[] = [
  {
    id: 'device-chiasmus',
    name: 'Chiasmus',
    greekEtymology: 'khiasmos (Greek) — "crossing, placing crosswise, shaping like the letter Chi (Χ)"',
    category: 'Syntax & Inversion',
    definition: 'A rhetorical inversion of words in grammatical parallel phrases where the second half is an inverted mirror of the first (A ... B / B ... A).',
    formula: '[Phrase A] ─── [Phrase B]  /  [Phrase B] ─── [Phrase A]',
    iconicBar: 'Never let a fool kiss you, or a kiss fool you.',
    artist: 'Joey Bada$$ / Classic Rhetoric',
    breakdown: 'Transforms simple vocabulary into an inescapable philosophical trap by reversing the syntactic order while inverting the semantic meaning.',
    drillTemplate: `[Concept A] moves the [Concept B] when we ignite the mic
[Concept B] moves the [Concept A] into the deepest night`,
  },
  {
    id: 'device-anaphora',
    name: 'Anaphora',
    greekEtymology: 'anaphora (Greek) — "carrying back, repeating" (ana "back" + pherein "to carry")',
    category: 'Repetition & Cadence',
    definition: 'Repetition of the identical word or phrase at the beginning of successive bars or clauses to build rhythmic momentum and rhetorical conviction.',
    formula: '[Key Phrase] ─── (Clause 1)  /  [Key Phrase] ─── (Clause 2)  /  [Key Phrase] ─── (Clause 3)',
    iconicBar: 'Drop the logic, drop the ego, drop the weight upon the floor / Drop the fear into the fire till you open up the door.',
    artist: 'Lupe Fiasco / Aesop Rock Style',
    breakdown: 'Hammering the listener with rhythmic downbeats on the first measure creates an authoritative, hypnotic flow state.',
    drillTemplate: `Deep in the [noun 1] where the shadows collide
Deep in the [noun 2] where the masters reside
Deep in the [noun 3] we are building the flow
Deep in the [noun 4] where the frequencies glow`,
  },
  {
    id: 'device-epistrophe',
    name: 'Epistrophe',
    greekEtymology: 'epistrophe (Greek) — "turning upon" (epi "upon" + strophe "turning")',
    category: 'Repetition & Cadence',
    definition: 'Repetition of the same word or phrase at the end of consecutive bars, creating relentless terminal punchlines.',
    formula: '(Clause 1) ─── [Key Word]  /  (Clause 2) ─── [Key Word]  /  (Clause 3) ─── [Key Word]',
    iconicBar: 'Carve the philosophy into the stone / Lay down the vanity, sit on the throne / Walk through the galaxy, never alone.',
    artist: 'Nas / Black Thought Style',
    breakdown: 'Rather than varying rhyme tails, locking the exact word forces the lyricist to vary the preceding narrative rhythm dramatically.',
    drillTemplate: `Ignite the flame inside the [noun 1] tonight
Observe the coordinates of the [noun 2] tonight
We overcome the turbulence of the [noun 3] tonight`,
  },
  {
    id: 'device-polyptoton',
    name: 'Polyptoton',
    greekEtymology: 'polyptoton (Greek) — "many cases" (poly "many" + ptosis "falling/grammatical case")',
    category: 'Wordplay & Morphing',
    definition: 'Repeating words derived from the identical etymological root in rapid succession with altered grammatical forms or parts of speech.',
    formula: '[Root - Verb] ─── [Root - Noun] ─── [Root - Adjective]',
    iconicBar: 'Battle the battling batter who battered the beat.',
    artist: 'Eminem / MF DOOM Style',
    breakdown: 'Activates internal assonance and consonance simultaneously while showcasing deep etymological mastery.',
    drillTemplate: `I speak the spoken speech of the speakers who spoke the truth
Breathing the breathless breath of the builders in early youth`,
  },
  {
    id: 'device-internal-multisyllable',
    name: 'Internal Multisyllabic Rhyme',
    greekEtymology: 'poly-syllabē (Greek) — "many syllables taken together"',
    category: 'Repetition & Cadence',
    definition: 'Rhyming phrases containing two or more syllables embedded within the interior of bars rather than solely on the end-stops.',
    formula: '... [Multi A1] ... [Multi B1]  /  ... [Multi A2] ... [Multi B2]',
    iconicBar: 'Atmospheric velocity shattering the gravity / Lyrical acrobat maneuvering the tragedy.',
    artist: 'VerBS / Kool G Rap',
    breakdown: 'Dense internal multis ensure that the rhyme density meter spikes to 90%+, delivering continuous acoustic pleasure.',
    drillTemplate: `We calibrate the [Multi 1A] inside the [Multi 2A]
To regulate the [Multi 1B] through every [Multi 2B]`,
  },
  {
    id: 'device-oxymoron',
    name: 'Oxymoron & Paradox',
    greekEtymology: 'oxumōron (Greek) — "pointedly foolish" (oxys "sharp, keen" + moros "dull, foolish")',
    category: 'Imagery & Contrast',
    definition: 'The juxtaposition of contradictory or incongruous terms that reveals a deeper hidden poetic truth upon reflection.',
    formula: '[Contradiction 1] + [Contradiction 2]  =>  [Transcendent Synthesis]',
    iconicBar: 'Blinding darkness illuminated the silent symphony of the ruins.',
    artist: 'Kendrick Lamar / GZA Style',
    breakdown: 'Sharp conceptual frictions snap the listener out of passive hearing, forcing active cerebral interpretation.',
    drillTemplate: `Living in a [adjective 1] [noun 1] with [contradictory adj 2] [noun 2]
Finding the [adjective 3] [noun 3] inside the [contradictory adj 4] [noun 4]`,
  },
  {
    id: 'device-mosaic-rhyme',
    name: 'Mosaic Rhyme',
    greekEtymology: 'mōsaikos (Greek) — "belonging to the Muses, inlaid mosaic pattern"',
    category: 'Wordplay & Morphing',
    definition: 'A multisyllabic rhyme where a single multisyllabic word is rhymed with a phrase composed of two or more distinct smaller words.',
    formula: '[One Multi-Syllable Word]  <===>  [Two or Three Small Words]',
    iconicBar: 'Studying the habitat / watching where the cat sat.',
    artist: 'Mos Def / André 3000 Style',
    breakdown: 'A trademark technique of elite lyricists, creating asymmetric acoustic locks that catch listeners off-guard.',
    drillTemplate: `Analyzing the [3-syllable word]
Before they could [verb] at that`,
  },
];
