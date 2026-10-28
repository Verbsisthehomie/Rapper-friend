import React, { useState } from 'react';
import { LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { InstrumentalBeatDeck } from '../beats/InstrumentalBeatDeck';
import {
  Radio,
  Cpu,
  Zap,
  Send,
  Layers,
  Volume2,
  GitBranch,
  Sparkles,
  Disc,
  BookOpen,
  Microscope,
} from 'lucide-react';

interface RhymeEvolutionsLabProps {
  currentEra: LcarsEra;
  onSendToAnalyzer: (text: string) => void;
}

interface SubdivisionStep {
  step: number;
  label: string;
  drum?: 'KICK' | 'SNARE' | 'CLAP' | '808-GLIDE' | 'BASS-STAB' | 'CLAVE' | '2-STEP' | 'PIANO';
  vocalRole?: 'SETUP' | 'INTERNAL' | 'SKIP-BURST' | 'CAESURA-PAUSE' | 'END-RHYME' | 'RELOAD-PUNCH';
  syllableExample: string;
}

interface SubDisciplineSchool {
  name: string;
  practitioners: string;
  mechanics: string;
  signatureExample: string;
}

interface ForensicBarBreakdown {
  barNumber: number;
  annotatedBar: string;
  vowelSpine: string;
  engineeringNote: string;
}

interface RhymeSystemDeepDive {
  id: string;
  region: 'us' | 'uk-global';
  flag: string;
  name: string;
  subtitle: string;
  bpm: string;
  matchedInstrumentalId: string;
  eraAndOrigin: string;
  architects: string[];
  acousticEnvironment: string;
  barGeometryAndStructure: string;
  microTimingPocket: string;
  subDisciplines: SubDisciplineSchool[];
  forensicBreakdown: ForensicBarBreakdown[];
  phoneticEngineRules: {
    ruleName: string;
    ipaShift: string;
    explanation: string;
    unlockedRhymePairs: string;
  }[];
  grid16Steps: SubdivisionStep[];
  formulationChecklist: string[];
  exemplarVerse: string;
}

const DIVERGENT_RHYME_SYSTEMS: RhymeSystemDeepDive[] = [
  // ==========================================================================
  // UK & GLOBAL SYSTEMS (6 DEEP DISCIPLINES)
  // ==========================================================================
  {
    id: 'uk-grime-140-engine',
    region: 'uk-global',
    flag: '🇬🇧',
    name: 'UK Grime: 140 BPM Skippy Double-Time & 8-Bar Pirate Radio Reload System',
    subtitle: 'Pirate Radio Clash Architecture • Eskibeat / Sublow • Bow E3',
    bpm: '138 – 140 BPM (Half-Time 70 BPM Stomp / Double-Time 280 SPM)',
    matchedInstrumentalId: 'uk-grime-140',
    eraAndOrigin: '2001–Present • Bow E3, East London (Rinse FM, Deja Vu FM, Eskimo Dance, Lord of the Mics)',
    architects: [
      'Wiley',
      'Dizzee Rascal',
      'Kano',
      'Skepta',
      'Ghetts',
      'Jme',
      'D Double E',
      'Flowdan',
      'Devlin',
      'P Money',
      'Crazy Titch',
      'Durrty Goodz',
    ],
    acousticEnvironment:
      'Forged in tiny East London council-tower Pirate Radio studios (Rinse FM, Deja Vu, Freeze FM) and pitch-black basement raves where 6 to 10 MCs shared a single Shure SM58 microphone over a DJ spinning 140 BPM vinyl dubplates (Wiley’s Eskibeat, Danny Weed’s Creeper, Musical Mob’s Pulse X). Unlike American studio albums where an MC gets 16 bars alone in a vocal booth to build a narrative, on a Grime set you had strictly 8 bars before the next MC snatched the mic—unless your 8th bar hit with such percussive shock that the DJ physically spun the Technics 1210 turntable backward for a "Wheel-Up / Reload".',
    barGeometryAndStructure:
      'Built on the "8-Bar Rally" (two contrasting 4-bar blocks) and the "16-Bar War Dub". Bars 1–4 establish a heavy 70 BPM half-time stomp (often opening with a famous vocal watermark or declarative rally cry) so the rave locks into the head-nod. Bars 5–7 shift gears into a 16th-note "skippy" double-time pocket where internal rhymes ricochet off the syncopated square-wave bass stabs. Bar 8 leaves a deliberate quarter-note breath pocket on Beat 3 before slamming a compound haymaker noun on Beat 4 to trigger the DJ’s reload.',
    microTimingPocket:
      'Ahead-of-the-Grid Percussive Attack (+5 to +12ms): Whereas US Boom-Bap drags 20–30ms behind the snare for a laid-back jazz swing, Grime MCs attack directly on top of or slightly ahead of the 16th-note grid. The vocal cords, glottal stops (/ʔ/), and bilabial plosives (/p/, /b/) function as an auxiliary snare drum cutting through 110dB sub-bass.',
    subDisciplines: [
      {
        name: 'The Eskibeat Skippy Flow (Wiley / Kano / Dizzee School)',
        practitioners: 'Wiley, Dizzee Rascal, Kano, President T',
        mechanics:
          'Alternates between 8th-note anchors and sudden 3-note 16th bursts ("da-da-DUM, da-da-DUM") that mirror the off-beat square-wave bass stabs of Pulse X and Morgue.',
        signatureExample: 'Accenting steps 3, 7, and 13 instead of straight beats 1, 2, 3, 4.',
      },
      {
        name: 'The 32nd-Note Artillery Switch (Ghetts / Durrty Goodz / Devlin School)',
        practitioners: 'Ghetts (Ghetto), Durrty Goodz, Devlin, P Money',
        mechanics:
          'Mid-bar gear-shifting from conversational 70 BPM cadence into frantic 280-syllable-per-minute multi-syllabic machine-gun clusters, using alveolar trills and glottal stops to prevent slurring.',
        signatureExample: 'Packing 18 to 22 syllables into a single 140 BPM bar without losing consonant clarity.',
      },
      {
        name: 'The Yardie-Bass & Reload Watermark School (Flowdan / D Double E / Riko Dan)',
        practitioners: 'D Double E, Flowdan, Riko Dan, Jammer, Footsie',
        mechanics:
          'Uses Jamaican Sound System baritone projection, Patois dread-talk, and iconic ad-lib watermarks ("Bluku! Bluku!", "Ooooh-aaah!") on Bar 1 to command instant crowd reloads before the verse even finishes.',
        signatureExample: 'Stretching resonant low-frequency vowels over sub-low 50Hz basslines.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Step in the [ENDS] at a hun-dred and [FOR-TY] // shell-ing the [SET] till the speak-ers [SPARK]',
        vowelSpine: '/ɛ/ (ends/set) + /ɔː-i/ (forty) + /ɑːk/ (spark)',
        engineeringNote: 'Half-time 70 BPM entry anchor on Beat 1 ("Step") and Beat 3 ("shelling"), locking the crowd before accelerating.',
      },
      {
        barNumber: 2,
        annotatedBar: 'Bow E-[THREE] on the pi-rate [FRE-QUEN-CY] // es-ki-beat [CUT-TING] right through the [DARK]',
        vowelSpine: '/iː/ (three/frequency/eskibeat) + /ɑːk/ (dark)',
        engineeringNote: 'Internal assonance chain (/iː/) bridges the mid-bar snare while maintaining the A-rhyme (/ɑːk/) at the bar end.',
      },
      {
        barNumber: 3,
        annotatedBar: '[SKIP] on the snare with a [DOU-BLE-TIME] flur-ry // [MAN-DEM] in [TAN-DEM] we dup-py the [CHART]',
        vowelSpine: '/æ-əm/ (mandem/tandem) + /ɑːt/ (chart)',
        engineeringNote: 'Double-time 16th-note skip burst ("mandem in tandem") hits on Beat 3-&-a to build kinetic momentum.',
      },
      {
        barNumber: 4,
        annotatedBar: '[WHEEL UP] the deck for the [RE-LOAD], (PAUSE) // merked ev-ery [PAI-GON] right from the [START]!',
        vowelSpine: '/iː-oʊ/ (wheel/reload) + /ɑːt/ (start)',
        engineeringNote: 'Micro-pause after "reload" lets the square-wave bass stab breathe before the Beat 4 Reload Punch ("START!").',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Non-Rhotic Vowel Locking (Dropping Post-Vocalic /r/)',
        ipaShift: '/ɑːr/ → /ɑː/ & /ɜːr/ → /ə/',
        explanation:
          'In London MLE, the "R" after a vowel is silent unless followed by another vowel. This transforms rhotic endings into open vowel sustains that rhyme cleanly with vowel-final words.',
        unlockedRhymePairs: 'bar / star / car / far ↔ nah / yah / pa  |  water / quarter / daughter ↔ caught her / order',
      },
      {
        ruleName: 'T-Glottalization Percussion (/t/ → /ʔ/)',
        ipaShift: 'intervocalic /t/ → glottal stop /ʔ/',
        explanation:
          'Internal and final "T" consonants are replaced with a sharp glottal closure in the throat, turning 2-syllable words into percussive staccato clicks that lock onto 140 BPM hi-hats.',
        unlockedRhymePairs: 'bu’er (butter) / gu’er (gutter) / shu’er (shutter) / le’er (letter) / be’er (better)',
      },
      {
        ruleName: 'TH-Fronting Consonant Merger',
        ipaShift: '/θ/ → /f/ & /ð/ → /v/',
        explanation:
          'Unvoiced "th" shifts to /f/ and voiced "th" shifts to /v/, merging previously separate consonant families into unified rhyme pools.',
        unlockedRhymePairs: 'three / free  |  thing / wing / ring  |  brother (bruv) / love / above  |  mouth / south',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'Step' },
      { step: 2, label: 'e', syllableExample: 'in' },
      { step: 3, label: '&', drum: 'BASS-STAB', vocalRole: 'SKIP-BURST', syllableExample: 'the' },
      { step: 4, label: 'a', vocalRole: 'SKIP-BURST', syllableExample: 'ends' },
      { step: 5, label: '2', vocalRole: 'INTERNAL', syllableExample: 'hun-' },
      { step: 6, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'dred' },
      { step: 7, label: '&', drum: 'BASS-STAB', vocalRole: 'SKIP-BURST', syllableExample: 'for-' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'ty' },
      { step: 9, label: '3', drum: 'SNARE', vocalRole: 'INTERNAL', syllableExample: 'shell-' },
      { step: 10, label: 'e', syllableExample: 'ing' },
      { step: 11, label: '&', vocalRole: 'CAESURA-PAUSE', syllableExample: '[air]' },
      { step: 12, label: 'a', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'we' },
      { step: 13, label: '4', vocalRole: 'SKIP-BURST', syllableExample: 'dup-' },
      { step: 14, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'py' },
      { step: 15, label: '&', vocalRole: 'SETUP', syllableExample: 'the' },
      { step: 16, label: 'a', drum: 'SNARE', vocalRole: 'RELOAD-PUNCH', syllableExample: 'CHART!' },
    ],
    formulationChecklist: [
      'Open Bar 1 with an unmistakable vocal watermark or declarative call ("Listen!", "Oi!", "Bluku!") so the rave knows who has the mic.',
      'Pack hard plosive consonants (K, P, T, B, D) onto steps 3, 7, and 13 to mirror the square-wave eskibeat bass stabs.',
      'Switch from half-time (70 BPM feel) in Bars 1–4 to double-time 16th-note triplets/skips in Bars 5–7.',
      'Leave a half-beat breath pocket in Bar 8 right before dropping the final haymaker noun to force the DJ reload.',
    ],
    exemplarVerse: `Step in the ends at a hundred and forty, shelling the set till the speakers spark
Bow E3 on the pirate frequency, eskibeat cutting right through the dark
Skip on the snare with a double-time flurry, mandem in tandem, we duppy the chart
Wheel up the deck for the reload, Jackum—merked every paigon right from the start
Signal is live on the roof of the tower, copper can't climb where the aerial sits
Sub-low pressure is rattling windows, turning the riddim to surgical bits
No cap in the booth when I reload the clip, every syllable hitting like artillery hits
Tell the DJ spin back the dubplate twice—this 8-bar rally just shut down the bits`,
  },
  {
    id: 'uk-road-rap-drill-engine',
    region: 'uk-global',
    flag: '🇬🇧',
    name: 'UK Road Rap & UK Drill: The Caesura Pause & 3+3+2 Sliding 808 System',
    subtitle: 'Peckham SN1 Conversational Coldness • Tresillo Hi-Hat Syncopation',
    bpm: '130 – 144 BPM (Half-Time Conversational & 3+3+2 Tresillo Drill)',
    matchedInstrumentalId: 'uk-drill-142',
    eraAndOrigin: '2007–Present • Peckham (SN1), Brixton (67), Church Road (NW10), West & East London',
    architects: [
      'Giggs',
      'Potter Payper',
      'Nines',
      'Blade Brown',
      'Skrapz',
      'Headie One',
      'Dave',
      'Digga D',
      'Central Cee',
      'K-Trap',
      'LD (67)',
      'Unknown T',
    ],
    acousticEnvironment:
      'Born on London council estates in the mid-2000s as a stark, street-realist counterweight to rave-oriented Grime. Pioneered by Giggs (SN1) in Peckham ("Talkin the Hardest") and Blade Brown in South London with a slow, sub-zero baritone delivery designed for tinted car systems rather than pirate raves. In the mid-2010s, UK producers (808Melo, AXL Beats, M1OnTheBeat) fused this Road Rap cadence with Chicago Drill, replacing straight trap hi-hats with 142 BPM UK Garage/Dancehall-derived 3+3+2 tresillo hi-hat grids and octave-gliding 808 sub-bass.',
    barGeometryAndStructure:
      'Built on the "Caesura Delayed Punch" and "Counter-Glide Syncopation". Instead of filling every 16th note with rapid syllables, UK Road Rap uses negative space as a weapon: the MC delivers a 6-to-8 syllable setup across Beats 1 and 2, pauses completely during Beat 3 while the 808 bassline slides upward an octave, and drops a deadpan 2-to-3 syllable punchline flat on Beat 4.',
    microTimingPocket:
      '3+3+2 Tresillo Hi-Hat Lock: In UK Drill, hi-hats don’t tick in straight 8th or 16th notes—they follow a 3+3+2 Dancehall/Garage pattern (accenting 16th-note steps 1, 4, and 7 of each half-bar, with the snare delayed to Beat 3 or Beat 3-&). MCs lock their stressed vowels directly onto steps 1, 4, and 7.',
    subDisciplines: [
      {
        name: 'The Peckham SN1 / Church Road Baritone Pause (Giggs / Nines / Skrapz School)',
        practitioners: 'Giggs, Nines, Skrapz, Blade Brown, Potter Payper',
        mechanics:
          'Conversational, unhurried half-time phrasing where the MC pauses for up to 2 full beats mid-bar, letting the menace hang in the silence before dropping an understated, darkly funny or cinematic end-rhyme.',
        signatureExample: 'Setup on Beats 1–2 → [2-Beat Dead Air] → Deadpan Punchline on Beat 4.',
      },
      {
        name: 'The 3+3+2 Tresillo Drill Bounce (Headie One / Digga D / Unknown T School)',
        practitioners: 'Headie One, Digga D, Unknown T, K-Trap, Loski, MizOrMac',
        mechanics:
          'Rides the 3+3+2 hi-hat cadence with syncopated three-syllable bursts, matching vocal pitch inflections to the upward octave glides of the 808 sub-bass.',
        signatureExample: 'Bouncing stressed syllables on steps 1, 4, 7, 9, 12, 15.',
      },
      {
        name: 'Narrative State-of-the-Nation Realism (Potter Payper / Dave / Ghetts Road School)',
        practitioners: 'Potter Payper, Dave, Rimzee, Meekz',
        mechanics:
          'Extended 32-to-64 bar storytelling without a hook, combining multi-syllabic internal rhymes with forensic psychological detail and zero wasted filler words.',
        signatureExample: 'Maintaining a single multi-syllabic vowel spine across 16 consecutive bars.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: '[BACK] in the [ENDS] where the [STREET-LAMPS] flick-er... (808 GLIDE PAUSE) ...no-bo-dy talks when the [WIN-DOW TINTS]',
        vowelSpine: '/ɛ/ (ends) + /ɪ-ə/ (flicker) + /ɪ-oʊ ɪ/ (window tints)',
        engineeringNote: ' Setup lands on steps 1, 4, 7 (3+3+2 tresillo); Beat 3 is left open for the octave 808 slide before "WINDOW TINTS".',
      },
      {
        barNumber: 2,
        annotatedBar: '[COLD] on the [WING] like a [WIN-TER] in Peck-ham... (PAUSE) ...leav-ing no trace of the [FIN-GER-PRINTS]',
        vowelSpine: '/ɪ-ə/ (winter) + /ɪ-ə-ɪ/ (fingerprints)',
        engineeringNote: '3-syllable compound rhyme ("window tints" / "fingerprints") locks with deadpan conversational restraint.',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'MLE Price-Vowel Monophthongization (/aɪ/ → /aː/)',
        ipaShift: '/aɪ/ → /aː/ or /ɑɪ/',
        explanation:
          'The long "I" diphthong flattens in London road speech, allowing words like "time, ride, line, mind, outside" to lock with broader open-vowel slant rhymes.',
        unlockedRhymePairs: 'time / grime / line / nine / outside / glide',
      },
      {
        ruleName: 'Carib-British Code-Switching & Arabic/Somali/Yoruba Loanwords',
        ipaShift: 'Multi-lexical stress alignment',
        explanation:
          'Modern London MLE blends Jamaican Patois (duppy, yard, nyam), Nigerian/Ghanaian (japa, wahala, chale), Somali/Arabic (wallahi, akhi, malis), and Cockney into a single rhyming lexicon.',
        unlockedRhymePairs: 'akhi / khaki / low-key  |  paigon / Ronald Reagan  |  ends / Mercedes-Benz',
      },
      {
        ruleName: 'L-Vocalization at Word Ends (/l/ → /ʊ/ or /o/)',
        ipaShift: 'dark /ɫ/ → vowel /ʊ/',
        explanation:
          'In London vernacular, final "L" after a vowel turns into a rounded vowel sound (/ʊ/), making words ending in -ell, -ill, -all rhyme cleanly with vowel-ending words.',
        unlockedRhymePairs: 'cell / tell / well ↔ידע / flow  |  real / deal / steel ↔ view',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'Back' },
      { step: 2, label: 'e', syllableExample: 'in' },
      { step: 3, label: '&', syllableExample: 'the' },
      { step: 4, label: 'a', drum: 'CLAVE', vocalRole: 'INTERNAL', syllableExample: 'ends' },
      { step: 5, label: '2', syllableExample: 'where' },
      { step: 6, label: 'e', syllableExample: 'the' },
      { step: 7, label: '&', drum: 'CLAVE', vocalRole: 'INTERNAL', syllableExample: 'street-' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'lamps' },
      { step: 9, label: '3', drum: 'SNARE', vocalRole: 'CAESURA-PAUSE', syllableExample: '[PAUSE]' },
      { step: 10, label: 'e', drum: '808-GLIDE', vocalRole: 'CAESURA-PAUSE', syllableExample: '[808 GLIDE]' },
      { step: 11, label: '&', vocalRole: 'SETUP', syllableExample: 'no-' },
      { step: 12, label: 'a', vocalRole: 'SETUP', syllableExample: 'bo-dy' },
      { step: 13, label: '4', drum: '808-GLIDE', vocalRole: 'END-RHYME', syllableExample: 'win-' },
      { step: 14, label: 'e', vocalRole: 'END-RHYME', syllableExample: 'dow' },
      { step: 15, label: '&', drum: 'SNARE', vocalRole: 'RELOAD-PUNCH', syllableExample: 'TINTS.' },
      { step: 16, label: 'a', syllableExample: '' },
    ],
    formulationChecklist: [
      'Use the "Giggs Pause": leave a deliberate 1-to-2 beat gap of dead air after the mid-bar snare so the 808 slide is heard clearly before your punchline.',
      'Accent steps 1, 4, and 7 (the 3+3+2 UK Drill hi-hat bounce) rather than straight four-on-the-floor beats.',
      'Keep vocal tone understated and ice-cold—let the weight of the imagery carry the menace rather than shouting.',
    ],
    exemplarVerse: `Back in the ends where the streetlamps flicker... nobody talks when the window tints
Cold on the wing like a winter in Peckham, leaving no trace of the fingerprints
Gliding the bass on a hundred and forty, counting the profit in sovereign mints
Look in the eyes of the mandem standing—ten toes down and we never flinch
Step on the block in a blacked-out runner, rain on the glass of the estate tower
Every decision is weighed on the scale, turning the struggle to quiet power
Wait for the slide of the eight-oh-eight... before we reclaim every single hour
Came from the concrete under the fog, where only the sharpest minds don't sour`,
  },
  {
    id: 'uk-garage-jungle-fastchat',
    region: 'uk-global',
    flag: '🇬🇧',
    name: 'UK Garage (2-Step), Bassline & 170 BPM Jungle MC Fast-Chat System',
    subtitle: 'Sound System Fast-Chat • 2-Step Shuffling Skip • Amen Break Double-Time',
    bpm: '132 – 138 BPM (2-Step UKG / Bassline) & 165 – 175 BPM (Jungle / Drum & Bass)',
    matchedInstrumentalId: 'uk-garage-jungle-134',
    eraAndOrigin: '1992–Present • London, Bristol, Birmingham, Sheffield, Nottingham',
    architects: [
      'Stevie Hyper D',
      'Skibadee',
      'Shabba D',
      'MC Det',
      'General Levy',
      'Heartless Crew',
      'Pay As U Go Cartel',
      'So Solid Crew',
      'MC Neat',
      'DRS',
      'Bru-C',
    ],
    acousticEnvironment:
      'The evolutionary bridge between Jamaican Sound System culture and UK Grime. In the early 1990s, British rave producers sped breakbeats up to 165–175 BPM over 50Hz dub reggae basslines (Jungle), while UK Garage (132–136 BPM) stripped out the 2nd and 4th kicks of House music to create the shuffling "2-Step" groove. MCs had to invent a hybrid of Jamaican fast-chat ("diddly-diddly" tongue-rolls) and hyper-syncopated pocket riding to hype 5,000-person raves.',
    barGeometryAndStructure:
      'Operates on "Dual-Tempo Pocket Switching": in 170 BPM Jungle, the bassline moves at 85 BPM (half-time) while the Amen break snares fire at 170 BPM (double-time). The MC alternates between slow reggae-melodic chants over the 85 BPM bass and lightning-fast 16th-note staccato bursts locked to the 170 BPM snare rolls.',
    microTimingPocket:
      'Swung 2-Step Shuffle (64% Swing): In UK Garage, the kick lands on Step 1, Step 8 (the "a" of Beat 2), and Step 11 (the "&" of Beat 3). MCs bounce their stressed syllables on those exact off-beat kicks.',
    subDisciplines: [
      {
        name: '170 BPM Jungle Double-Time Fast-Chat (Stevie Hyper D / Skibadee / Shabba D)',
        practitioners: 'Stevie Hyper D, Skibadee, Shabba D, Harry Shotta, Eksman',
        mechanics:
          'Uses rapid-fire alveolar consonant alternation (T-D-K-B) and circular nasal breathing to sustain 16-bar runs at 175 BPM without audible gasps.',
        signatureExample: 'Rolling 32nd-note tongue trills directly into the Amen break snare fill.',
      },
      {
        name: '134 BPM 2-Step Garage & Champagne Groove (Heartless Crew / So Solid Crew)',
        practitioners: 'Bushkin, Mighty Moe, Megaman, Romeo, Lisa Maffia, Oxide & Neutrino',
        mechanics:
          'Smooth, percussive call-and-response pockets that ride the shuffling 2-step hi-hat swing, blending sung R&B cadences with sharp staccato rap bursts.',
        signatureExample: 'Syncopating internal rhymes onto the "2-a" and "3-&" shuffling kicks.',
      },
      {
        name: '4x4 Niche / Northern Bassline Wobble (Sheffield / Bradford / Nottingham School)',
        practitioners: 'Bru-C, Window Kid, Jamie Duggan crews, TRC',
        mechanics:
          'High-energy warp-bass riding at 138–142 BPM where punchlines lock onto LFO filter-wobble bass drops.',
        signatureExample: 'Dropping a percussive two-syllable catchphrase right as the LFO bassline warps.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Selecta [SPIN] dat [DUB] on the [TWO-STEP] // shuffling [FEET] when the [SUB-BASS] drops',
        vowelSpine: '/ʌ/ (dub/sub) + /uː-ɛ/ (two-step) + /ɒ/ (drops)',
        engineeringNote: 'Syllables bounce on the 2-step kick positions (Step 1, Step 8, Step 11).',
      },
      {
        barNumber: 2,
        annotatedBar: 'Double the [SPEED] on the [A-MEN] break-beat // [CHAT-TER-ING] fast till the [SPEAK-ER] pops',
        vowelSpine: '/iː/ (speed/beat/speaker) + /ɒ/ (pops)',
        engineeringNote: 'Shifts into rapid 16th-note fast-chat on Beat 3 ("chattering fast") to match the drum roll.',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Alveolar-Velar Double-Tonguing (/t-k-d-ɡ/)',
        ipaShift: 'Alternating coronal /t, d/ and dorsal /k, ɡ/ stops',
        explanation:
          'Like a brass player double-tonguing ("ta-ka-ta-ka"), Jungle and UKG MCs choose words that alternate front-of-mouth (T/D) and back-of-mouth (K/G) consonants to hit 10+ syllables per second.',
        unlockedRhymePairs: 'tick-tock / catacomb / tactical / critical / lyrical',
      },
      {
        ruleName: 'Sound System Melodic Sustain-to-Staccato Contrast',
        ipaShift: 'Long open /ɑː, ɔː/ → clipped /ɪ, ɛ/',
        explanation:
          'Holding a long sung vowel for 2 beats ("Booyakasha—") and immediately snapping into clipped short vowels.',
        unlockedRhymePairs: 'champion sound ↔ chat-ta-box / rat-ta-tat',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'Se-' },
      { step: 2, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'lec-' },
      { step: 3, label: '&', vocalRole: 'SKIP-BURST', syllableExample: 'ta' },
      { step: 4, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'spin' },
      { step: 5, label: '2', drum: 'SNARE', vocalRole: 'INTERNAL', syllableExample: 'dat' },
      { step: 6, label: 'e', syllableExample: 'dub' },
      { step: 7, label: '&', syllableExample: 'on' },
      { step: 8, label: 'a', drum: '2-STEP', vocalRole: 'SKIP-BURST', syllableExample: 'the' },
      { step: 9, label: '3', vocalRole: 'INTERNAL', syllableExample: 'two-' },
      { step: 10, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'step' },
      { step: 11, label: '&', drum: '2-STEP', vocalRole: 'SKIP-BURST', syllableExample: 'shuf-' },
      { step: 12, label: 'a', vocalRole: 'SKIP-BURST', syllableExample: 'fling' },
      { step: 13, label: '4', drum: 'SNARE', vocalRole: 'END-RHYME', syllableExample: 'sub-' },
      { step: 14, label: 'e', vocalRole: 'END-RHYME', syllableExample: 'bass' },
      { step: 15, label: '&', vocalRole: 'RELOAD-PUNCH', syllableExample: 'DROPS!' },
      { step: 16, label: 'a', syllableExample: '' },
    ],
    formulationChecklist: [
      'In 2-Step Garage (134 BPM), accent the off-beat kicks on the "a" of Beat 2 (Step 8) and the "&" of Beat 3 (Step 11).',
      'In Jungle (170 BPM), write alternating 4-bar blocks: 4 bars of half-time reggae chant (85 BPM feel) followed by 4 bars of 170 BPM double-time fast-chat.',
      'Choose words with alternating T/D and K/G consonants for effortless high-speed articulation.',
    ],
    exemplarVerse: `Selecta spin dat dub on the two-step, shuffling feet when the sub-bass drops
Double the speed on the Amen breakbeat, chattering fast till the speaker pops
Inna di dance with the laser frequency, bassline rattling all of the blocks
Rewind the tape to the top of the session, nobody testing the rhythm we lock
Half-time chant on the dreadlock bassline, floating aloft on the sub-low wave
Then I switch gears into double-time artillery, shelling the middle of the midnight rave
Tick-tock tactical, lyrical miracle, carving the groove in a concrete cave
Pull up the tune when the horn section blasts—every single raver in the sector saved`,
  },
  {
    id: 'uk-britcore-highfocus-boombap',
    region: 'uk-global',
    flag: '🇬🇧',
    name: 'UK Hip-Hop, Britcore & Council-Estate Philosophical Boom-Bap',
    subtitle: 'High Focus Literary Dense Webs • Multi-Accent UK Boom-Bap • 88–96 BPM & 110 BPM',
    bpm: '86 – 96 BPM (Council-Estate Jazz/Crate Boom-Bap)',
    matchedInstrumentalId: 'ny-boombap-90',
    eraAndOrigin: '1988–Present • Ladbroke Grove, Camden, Brixton, Brighton, Manchester, Bristol',
    architects: [
      'London Posse (Rodney P)',
      'Roots Manuva',
      'Jehst',
      'Chester P (Task Force)',
      'Klashnekoff',
      'Skinnyman',
      'Little Simz',
      'Dave',
      'Loyle Carner',
      'Ocean Wisdom',
      'Kae Tempest',
      'Jam Baxter',
    ],
    acousticEnvironment:
      'In 1988, London Posse ("Money Mad") made the historic breakthrough that British MCs should stop imitating American accents and instead rap in unapologetic London, Jamaican-British, Scottish, and Northern English voices over heavy boom-bap drums. Through labels like Low Life, Big Dada, and High Focus Records, UK Hip-Hop evolved a deeply literary, philosophical, rain-soaked aesthetic—blending William Blake-level poetic imagery, council-estate grit, dub bass, and world-record-setting multisyllabic speed (Ocean Wisdom).',
    barGeometryAndStructure:
      'Combines dense 5-syllable compound rhyme webs with British dry wit, surrealist metaphor (Jam Baxter, Jehst, Chester P), and intense theatrical dynamic shifts (Little Simz, Dave). Because British English preserves crisp consonant stops alongside non-rhotic open vowels, UK Boom-Bap MCs can stack complex internal assonance and consonance simultaneously.',
    microTimingPocket:
      'Dub-Heavy Ragga Swing & Spoken-Word Rubato: Roots Manuva and Rodney P infused the 90 BPM boom-bap snare pocket with a heavy Jamaican dub bass sway, while modern lyricists like Little Simz and Loyle Carner weave intimate conversational rubato in and out of live jazz drums.',
    subDisciplines: [
      {
        name: 'Ragga-Hop & Dub-Boom-Bap (London Posse / Roots Manuva / Klashnekoff)',
        practitioners: 'Rodney P, Roots Manuva, Klashnekoff, Blak Twang, Estelle',
        mechanics:
          'Marries hard-hitting 90 BPM breakbeats with Patois-inflected London slang and heavy dub-plate bass emphasis on Beats 1 and 3.',
        signatureExample: 'Klashnekoff’s "Murda" or Roots Manuva’s "Witness (1 Hope)" off-kilter dub bounce.',
      },
      {
        name: 'High Focus Metaphysical & Surrealist Boom-Bap (Jehst / Chester P / Jam Baxter)',
        practitioners: 'Jehst, Chester P, Jam Baxter, Dirty Dike, Four Owls, Coops',
        mechanics:
          'Hyper-dense internal rhyme lattices packed with arcane vocabulary, urban folklore, and dystopian British imagery.',
        signatureExample: 'Stringing 8 consecutive bars of 4-syllable compound rhymes over dusty jazz loops.',
      },
      {
        name: 'Theatrical Introspective & Symphonic Lyrical (Little Simz / Dave / Loyle Carner)',
        practitioners: 'Little Simz, Dave, Loyle Carner, Ghetts, Akala, Wretch 32',
        mechanics:
          'Builds cinematic, emotionally devastating crescendos across 64-bar arrangements, shifting from quiet whispered confessionals to breathless double-time orchestration.',
        signatureExample: 'Little Simz ("Introvert" / "Gorilla") and Dave ("Psychodrama" / "Heart Attack") dynamic arcs.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Rain on the [SLATE] of the [COUN-CIL] es-[TATE] // scrib-bling [FATE] by the [FLICK-ER-ING] lamp',
        vowelSpine: '/eɪ/ (slate/estate/fate) + /ɪ-ə-ɪ/ (flickering)',
        engineeringNote: 'Triple internal /eɪ/ chain in the first half-bar resolves into a 3-syllable setup at the bar end.',
      },
      {
        barNumber: 2,
        annotatedBar: 'Pave-ment is [GREY] where the [PHI-LO-SOPHERS] wait // [LON-DON] pos-se with the [SOV-ER-EIGN] stamp',
        vowelSpine: '/eɪ/ (grey/wait) + /ɒ-ə-ɪ/ (philosophers / sovereign) + /æmp/ (lamp/stamp)',
        engineeringNote: 'Cross-bar internal rhyme (/eɪ/) plus dactylic rhythm ("flickering lamp" / "sovereign stamp").',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'British TRAP-BATH Vowel Split (/æ/ vs /ɑː/)',
        ipaShift: 'pass, glass, path, dance → /ɑː/ (Southern UK) vs /æ/ (Northern UK)',
        explanation:
          'In Southern British / London speech, words like "glass, past, dance, chance, plant" use a long /ɑː/ vowel, letting them rhyme with "far, star, heart, dark"—a rhyme pair impossible in American English!',
        unlockedRhymePairs: 'glass / past / chance /path ↔ star / heart / dark / sharp / art',
      },
      {
        ruleName: 'lot-cloth Rounded Short O (/ɒ/)',
        ipaShift: 'lot, clock, god, stop → rounded /ɒ/ (distinct from /ɑː/)',
        explanation:
          'Unlike American English where "father" and "bother" merge to /ɑː/, British English keeps /ɒ/ crisp and rounded, creating razor-sharp staccato internal rhyme chains.',
        unlockedRhymePairs: 'clock / block / fog / cobble / philosophy / odyssey',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'Rain' },
      { step: 2, label: 'e', syllableExample: 'on' },
      { step: 3, label: '&', syllableExample: 'the' },
      { step: 4, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'slate' },
      { step: 5, label: '2', drum: 'SNARE', syllableExample: 'of' },
      { step: 6, label: 'e', syllableExample: 'the' },
      { step: 7, label: '&', vocalRole: 'INTERNAL', syllableExample: 'coun-' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'cil' },
      { step: 9, label: '3', drum: 'KICK', syllableExample: 'es-' },
      { step: 10, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'tate' },
      { step: 11, label: '&', vocalRole: 'SETUP', syllableExample: 'flick-' },
      { step: 12, label: 'a', vocalRole: 'SETUP', syllableExample: 'er-' },
      { step: 13, label: '4', drum: 'SNARE', vocalRole: 'END-RHYME', syllableExample: 'ing' },
      { step: 14, label: 'e', vocalRole: 'END-RHYME', syllableExample: 'LAMP' },
      { step: 15, label: '&', syllableExample: '' },
      { step: 16, label: 'a', syllableExample: '' },
    ],
    formulationChecklist: [
      'Exploit the British TRAP-BATH split: rhyme "glass, past, chance, mask" with "heart, dark, star, craft".',
      'Anchor Beats 1 and 2 with a 3-hit internal assonance chain before resolving the multi-syllabic end-rhyme on Beat 4.',
      'Blend high-register philosophical/literary vocabulary (e.g., "palimpsest, chiaroscuro, hypostasis") with grounded council-estate imagery.',
    ],
    exemplarVerse: `Rain on the slate of the council estate, scribbling fate by the flickering lamp
Pavement is grey where the philosophers wait, London Posse with the sovereign stamp
Looking through glass at the ghosts of the past, carving a path through the wintery dark
Every syllable sharp as a blade in the grass, turning a whisper into a spark
High Focus vision in the Camden mist, stacking the multis in subterranean rooms
Pen in the fist of the alchemist, watching the concrete garden as it blooms
No gimmick needed when the drums hit raw, riding the break with a surgical grace
Speaking the truth that the camera saw, leaving a permanent mark on the place`,
  },
  {
    id: 'west-african-afro-polyrhythm',
    region: 'uk-global',
    flag: '🌍',
    name: 'West African Pidgin, Hiplife, Asakaa & Afro-Diaspora Polyrhythmic System',
    subtitle: '3-2 Clavé Timeline • Tonal Pitch Rhyme • Lagos, Accra, Kumasi & Johannesburg',
    bpm: '100 – 116 BPM (Afro-Fusion / Amapiano) & 140 BPM (Kumasi Asakaa Drill)',
    matchedInstrumentalId: 'afro-amapiano-112',
    eraAndOrigin: '1990s–Present • Lagos (Nigeria), Accra & Kumasi (Ghana), Johannesburg (SA), London Diaspora',
    architects: [
      'Fela Kuti',
      'Reggie Rockstone',
      'Sarkodie',
      'Olamide',
      'M.I Abaga',
      'Burna Boy',
      'Black Sherif',
      'J Hus',
      'Obongjayar',
      'Pa Salieu',
      'Yaw Tog',
      'Sampa the Great',
    ],
    acousticEnvironment:
      'Rooted in West African polyrhythmic percussion (talking drums, shekere, and the 3-2 / 2-3 bell clavé), Ghanaian Hiplife & Kumasi Asakaa Drill, Nigerian Indigenous Rap (Yoruba/Igbo/Pidgin), and South African Amapiano log-drums. Rather than treating rhythm as a flat 4/4 march, every bar is a three-dimensional weave of cross-rhythms where the human voice acts as the lead talking drum.',
    barGeometryAndStructure:
      'Operates on "Tonal Contour Matching" and "Clavé Off-Beat Phrasing". Because West African languages like Yoruba, Igbo, Twi, and Ga are tonal (where High, Mid, and Low pitch tones distinguish meaning), MCs construct rhymes that match both the vowel phoneme AND the melodic pitch rise/fall at the end of each bar.',
    microTimingPocket:
      'Syncopated 3-2 Clavé Pocket: Key stressed words land on the five asymmetric pulses of the West African bell timeline (steps 1, 4, 7, 11, 13) and the resonant Amapiano log-drum bass roll.',
    subDisciplines: [
      {
        name: 'Yoruba / Naija Pidgin Indigenous Cadence (Olamide / Burna Boy / Reminisce)',
        practitioners: 'Olamide, Burna Boy, Phyno, Zlatan, Odumodublvck, Obongjayar',
        mechanics:
          'Uses tonal proverbs (owe), percussive ideophones ("gbege", "kpa", "gbosa"), and rapid code-switching between Naija Pidgin, Yoruba/Igbo, and English.',
        signatureExample: 'Matching High-Low-High pitch contours across bar endings so the rhyme sings like a talking drum.',
      },
      {
        name: 'Ghanaian Hiplife Speed-Flow & Kumasi Asakaa Drill (Sarkodie / Black Sherif / Yaw Tog)',
        practitioners: 'Sarkodie, Reggie Rockstone, Black Sherif, Yaw Tog, Kwesi Arthur, M.anifest',
        mechanics:
          'Combines Twi high-velocity consonant articulation (Sarkodie’s breath-defying compound runs) with Highlife melodic soul cries (Black Sherif) and 140 BPM Asakaa drill.',
        signatureExample: 'Bouncing Twi and English internal rhymes across 3+3+2 Asakaa sliding basslines.',
      },
      {
        name: 'UK Afro-Swing & Diaspora Synthesis (J Hus / Pa Salieu / NSG / Dave)',
        practitioners: 'J Hus, Pa Salieu, Kojey Radical, Sampa the Great, Little Simz',
        mechanics:
          'Fuses London council-estate Road Rap coldness with Gambian, Nigerian, Zimbabwean, and Ghanaian polyrhythmic bounce at 104–112 BPM.',
        signatureExample: 'Effortless mid-sentence switches between London MLE slang and West African proverbs.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'A-beg no [WA-HA-LA] (L-H-L) in the [SEC-TOR] // we came from the [MUD] just to [CHOP LIFE] (H-L)',
        vowelSpine: '/ɑ-ɑ-ɑ/ (wahala) + /ɒ aɪ/ (chop life)',
        engineeringNote: 'Stressed syllables lock directly onto the 3-2 clavé bell hits (steps 1, 4, 7, 11, 15).',
      },
      {
        barNumber: 2,
        annotatedBar: 'Cha-le on the [LOG DRUM] (H-L), La-gos to [LON-DON] // the man-dem are shin-ing in [STAR-LIGHT] (H-L)',
        vowelSpine: '/ɒ-ʌ/ (log drum / London) + /ɑː-aɪ/ (starlight)',
        engineeringNote: '"Chop life" [H-L] and "starlight" [H-L] match both open vowel nuclei and High-to-Low pitch contour.',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Tonal Melodic Rhyme (High-Low-High Pitch Matching)',
        ipaShift: 'Suprasegmental Pitch Contour [H-L-H] & [H-L]',
        explanation:
          'Even when two words have slightly different final consonants (slant rhyme), matching their exact 2- or 3-syllable pitch melody makes them lock together seamlessly to the ear.',
        unlockedRhymePairs: 'wahala (L-H-L) / valhalla (L-H-L) / impala (L-H-L)  |  japa (H-L) / sapa (H-L)',
      },
      {
        ruleName: 'Labial-Velar & Ideophone Percussion (/ɡb/, /kp/)',
        ipaShift: 'Double-articulated stops /ɡb/ & /kp/',
        explanation:
          'West African consonants like "gb" (gbege, gbedu, gbosa) and "kp" (kpa, kpelle) release simultaneous velar and labial closures, producing a natural sub-bass pop in the mouth.',
        unlockedRhymePairs: 'gbege / reggae / heavy  |  chop life / starlight / midnight',
      },
      {
        ruleName: 'Syllable-Timed Vowel Purity (Zero Vowel Reduction)',
        ipaShift: 'Every syllable receives full vowel color (no schwa /ə/ slurring)',
        explanation:
          'Unlike American or British stress-timed English where unstressed vowels blur into "uh" (/ə/), West African English is syllable-timed—giving every syllable crisp, percussive weight.',
        unlockedRhymePairs: 'ca-li-bra-tion / na-vi-ga-tion / ju-bi-la-tion (4 distinct rhythmic drum hits)',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'A-beg' },
      { step: 2, label: 'e', syllableExample: 'no' },
      { step: 3, label: '&', vocalRole: 'INTERNAL', syllableExample: 'wa-' },
      { step: 4, label: 'a', drum: 'CLAVE', vocalRole: 'INTERNAL', syllableExample: 'ha-la' },
      { step: 5, label: '2', syllableExample: 'in' },
      { step: 6, label: 'e', syllableExample: 'the' },
      { step: 7, label: '&', drum: 'CLAVE', vocalRole: 'INTERNAL', syllableExample: 'sec-tor' },
      { step: 8, label: 'a', syllableExample: 'we' },
      { step: 9, label: '3', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'came' },
      { step: 10, label: 'e', drum: 'CLAVE', vocalRole: 'INTERNAL', syllableExample: 'from' },
      { step: 11, label: '&', syllableExample: 'the' },
      { step: 12, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'mud' },
      { step: 13, label: '4', drum: 'CLAVE', vocalRole: 'SETUP', syllableExample: 'just' },
      { step: 14, label: 'e', syllableExample: 'to' },
      { step: 15, label: '&', drum: 'SNARE', vocalRole: 'END-RHYME', syllableExample: 'CHOP' },
      { step: 16, label: 'a', vocalRole: 'RELOAD-PUNCH', syllableExample: 'LIFE!' },
    ],
    formulationChecklist: [
      'Use code-switching mid-bar (English → Naija Pidgin / Twi / Patois → English) to access multi-language rhyme pairs.',
      'Place stressed syllables on the 3-2 clavé accents (steps 1, 4, 7, 11, 13) so the flow dances across the drums.',
      'Match the melodic pitch contour (upward or downward inflection) on your end-words.',
    ],
    exemplarVerse: `Abeg, no wahala in the sector, we came from the mud just to chop life
Chale on the log drum, Lagos to London, the mandem are shining in starlight
Dodging the sapa, we hit warp nine when the gbege erupted at midnight
Frequency lekker, the ancestor spirit is guiding the ship through the far flight
Talking drum speaking in code on the clavé, nobody stopping the motion
From Accra to Kumasi, the hiplife artillery crossing the width of the ocean
Ginger the spirit with heavyweight gbedu, we moving with total devotion
Every bar blessed by the elders before us, igniting a cosmic commotion`,
  },
  {
    id: 'jamaican-dancehall-toasting',
    region: 'uk-global',
    flag: '🇯🇲',
    name: 'Jamaican Sound System Toasting, Dembow Riddim & Patois Clash System',
    subtitle: 'The Ancestral Root of Both NY Hip-Hop & UK Grime • 3+3+2 Riddim Pocket',
    bpm: '85 – 105 BPM (Digital Dancehall / Rub-a-Dub) & 72 BPM (One-Drop Dub)',
    matchedInstrumentalId: 'dancehall-riddim-98',
    eraAndOrigin: '1968–Present • Kingston, Jamaica (King Tubby’s, Volcano, Stone Love, Sting Clash)',
    architects: [
      'U-Roy',
      'Big Youth',
      'Yellowman',
      'Super Cat',
      'Shabba Ranks',
      'Buju Banton',
      'Capleton',
      'Beenie Man',
      'Bounty Killer',
      'Vybz Kartel',
      'Damian Marley',
      'Sister Nancy',
    ],
    acousticEnvironment:
      'The foundational blueprint for global MCing. In late-1960s and 1970s Kingston, Sound System "deejays" (MCs) toasted over instrumental "dub versions" on towering custom speaker stacks. Jamaican immigrant Clive Campbell (DJ Kool Herc) brought this exact Sound System blueprint to 1520 Sedgwick Ave in the Bronx in 1973 (birthing US Hip-Hop), while Jamaican diaspora sound systems in London, Birmingham, and Bristol birthed Jungle, UK Garage, and Grime.',
    barGeometryAndStructure:
      'Built on "Riddim Counteraction" and the "3+3+2 Dembow Tresillo". Rather than locking strictly to Beats 2 and 4, Dancehall toasting rides the syncopated snare on step 4 (the "a" of Beat 1) and step 7 (the "&" of Beat 2), using melodic chants, rapid-fire "fast-chat" tongue rolls, and crowd-commanding "pull-up" hooks.',
    microTimingPocket:
      'Rub-a-Dub Off-Beat Bounce: The MC’s phrasing pushes against the heavy one-drop or 3+3+2 bassline, accenting the off-beat guitar skank and the syncopated rimshot.',
    subDisciplines: [
      {
        name: 'Rub-a-Dub & Fast-Chat Originator Flow (U-Roy / Yellowman / Super Cat)',
        practitioners: 'U-Roy, Daddy Freddy, Super Cat, Papa San, Lt. Stitchie',
        mechanics:
          'Alternates breezy, melodic storytelling with sudden bursts of 16th-note phonetic scatting ("biddly-biddly-bap") that directly inspired both UK Jungle MCs and US stars like Busta Rhymes and Biggie.',
        signatureExample: 'Super Cat’s razor-sharp staccato triplets over Apache and Stalag riddims.',
      },
      {
        name: 'Ragga Gravel Baritone & Clash Counteraction (Buju Banton / Bounty Killer / Shabba)',
        practitioners: 'Buju Banton, Bounty Killer, Shabba Ranks, Capleton, Sizzla',
        mechanics:
          'Uses chest-rattling diaphragmatic gravel projection and improvised "counteraction" verses engineered to dismantle an opponent live on stage at Sting.',
        signatureExample: 'Commanding the selector to "pull up" the riddim on the 4th bar with a thunderous baritone drop.',
      },
      {
        name: 'Modern Lyrical Wordplay & Melodic Dancehall (Vybz Kartel / Damian Marley / Protoje)',
        practitioners: 'Vybz Kartel, Damian "Jr. Gong" Marley, Aidonia, Masicka, Popcaan, Stefflon Don',
        mechanics:
          'Applies intricate multi-syllabic internal rhyme schemes, double entendres, and auto-melodic pitch contours over dark digital dancehall riddims.',
        signatureExample: 'Damian Marley’s "Welcome to Jamrock" relentless single-rhyme-family barrage across 16 bars.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Pon di [COR-NER] of Kingston di [SOUND] sys-tem [ROAR] // hun-dred [THOU-SAND] watt speak-er Box [SHA-KING] di [FLOOR]',
        vowelSpine: '/ɔː/ (corner/roar/floor)',
        engineeringNote: 'Stressed vowels lock onto the 3+3+2 riddim accents (steps 1, 4, 7, 12, 15).',
      },
      {
        barNumber: 2,
        annotatedBar: 'When di [SE-LEC-TA] wheel up di [DUB-PLATE] once [MORE] // ev-ery [MASS-IVE] in-side a di [LA-BOR-A-TORY] [SOAR]',
        vowelSpine: '/ɔː/ (more/laboratory/soar)',
        engineeringNote: 'Patois stress shift on "la-BOR-a-tory" turns a 5-syllable English word into a thunderous /ɔː/ rhyme anchor.',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Patois Open-A & Diphthong Smoothing (/oʊ/ → /uo/, /eɪ/ → /ie/)',
        ipaShift: 'stone → /stuon/, face → /fies/, star → /staː/',
        explanation:
          'Jamaican Patois turns flat English vowels into resonant falling diphthongs (/uo/, /ie/) and drops final consonant clusters (-st, -nd, -ld), creating ultra-musical open vowel endings.',
        unlockedRhymePairs: 'test / bless / chest ↔ press  |  mind / time / line ↔ shine',
      },
      {
        ruleName: 'Syllabic Stress Re-Weighting on Polysyllables',
        ipaShift: 'Secondary stress elevated to primary beat anchor',
        explanation:
          'In Dancehall toasting, 3- and 4-syllable words ("med-i-TA-tion", "ed-u-CA-tion", "la-bor-A-tory") receive heavy musical stress on both the first and final syllables, turning one word into two drum hits.',
        unlockedRhymePairs: 'meditation / revelation / foundation / generation / station',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'Pon' },
      { step: 2, label: 'e', syllableExample: 'di' },
      { step: 3, label: '&', syllableExample: 'cor-' },
      { step: 4, label: 'a', drum: 'SNARE', vocalRole: 'INTERNAL', syllableExample: 'ner' },
      { step: 5, label: '2', drum: 'KICK', syllableExample: 'di' },
      { step: 6, label: 'e', syllableExample: 'sound' },
      { step: 7, label: '&', drum: 'SNARE', vocalRole: 'INTERNAL', syllableExample: 'sys-tem' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'roar' },
      { step: 9, label: '3', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'speak-' },
      { step: 10, label: 'e', syllableExample: 'er' },
      { step: 11, label: '&', syllableExample: 'box' },
      { step: 12, label: 'a', drum: 'SNARE', vocalRole: 'INTERNAL', syllableExample: 'sha-' },
      { step: 13, label: '4', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'king' },
      { step: 14, label: 'e', syllableExample: 'di' },
      { step: 15, label: '&', drum: 'SNARE', vocalRole: 'RELOAD-PUNCH', syllableExample: 'FLOOR!' },
      { step: 16, label: 'a', syllableExample: '' },
    ],
    formulationChecklist: [
      'Lock your internal syllables to the 3+3+2 Dembow snare hits (step 4 and step 7 of each half-bar).',
      'Sustain a single dominant vowel family (e.g., "-ation" or "-or") for 8 to 16 consecutive bars to build hypnotic Sound System momentum.',
      'Use Patois stress elevation on polysyllabic words ("med-i-TA-tion", "con-stant-i-NO-ple") to turn single words into rhythmic hooks.',
    ],
    exemplarVerse: `Pon di corner of Kingston di sound system roar, hundred thousand watt speaker box shaking di floor
When di selecta wheel up di dubplate once more, every massive inside a di sanctuary soar
From King Tubby studio straight to di shore, heavy sub-bass vibration go deep to di core
No bwoy cyaan test weh di elders restore, original riddim knocking right pon di door
Meditation and lightning inside a di booth, speaking nothing but fire and lyrical truth
From di ancient foundation we guide up di youth, heavyweight champion sound stay uncouth
Pull up di tune mek di horn section blast, history written from first to di last
Every continent echo di dubplate we cast, future and present connected to past`,
  },

  // ==========================================================================
  // AMERICAN RHYME CONVENTIONS & REGIONAL EVOLUTIONS (6 DEEP DISCIPLINES)
  // ==========================================================================
  {
    id: 'us-ny-golden-compound',
    region: 'us',
    flag: '🇺🇸',
    name: 'NY Golden Era & Five-Borough Boom-Bap: Compound Multisyllabics & Enjambment',
    subtitle: 'The Rakim Revolution • 4-to-6 Syllable Vowel Chords • Bronx, Queensbridge, Brooklyn, Staten',
    bpm: '86 – 96 BPM (SP-1200 / MPC60 Chopped Soul & Jazz Breaks)',
    matchedInstrumentalId: 'ny-boombap-90',
    eraAndOrigin: '1986–Present • Bronx, Queensbridge, Brooklyn, Staten Island, Harlem, Yonkers',
    architects: [
      'Rakim',
      'Kool G Rap',
      'Big Daddy Kane',
      'Nas',
      'GZA',
      'Raekwon',
      'Ghostface Killah',
      'Notorious B.I.G.',
      'Big Pun',
      'Big L',
      'Prodigy',
      'Black Thought',
    ],
    acousticEnvironment:
      'Evolved from open-air Bronx block parties into headphones, walkmans, and boomboxes via E-mu SP-1200 and Akai MPC60 12-bit drum samplers (Marley Marl, DJ Premier, Pete Rock, Large Professor, RZA, Q-Tip). Once MCs no longer had to shout simple 4-beat call-and-response chants over a noisy park PA system, Rakim (1986, "Eric B. Is President" / "My Melody") revolutionized American rap by treating the voice like John Coltrane’s tenor saxophone—writing dense, literary internal rhyme matrices designed for close headphone inspection.',
    barGeometryAndStructure:
      'Defined by three structural pillars: (1) Compound Multisyllabic Rhyming—where the end of every bar locks a 3-to-6 syllable vowel sequence ("holographic projections" / "astrometric connections"); (2) Enjambment (Breaking the Bar Line)—where a grammatical sentence doesn’t stop on Beat 4, but spills across into Beat 1 or Beat 2 of the next bar before landing an internal rhyme; and (3) The Mid-Bar Snare Spine—placing an internal rhyme on Beat 2 that either echoes the previous bar’s end-rhyme or sets up a parallel internal chain.',
    microTimingPocket:
      'Behind-the-Snare Boom-Bap Drag (-15 to -35ms): The producer programs the MPC hi-hats at 58%–64% swing, and the MC places stressed vowels slightly behind the crisp snare on Beats 2 and 4—creating the signature unhurried, head-nodding New York pocket.',
    subDisciplines: [
      {
        name: 'The Saxophone Enjambment & Internal Matrix (Rakim / Nas / GZA School)',
        practitioners: 'Rakim, Nas, GZA, AZ, OC, Mos Def, Black Thought',
        mechanics:
          'Phrases begin on the "4-&-a" pickup of the previous bar and weave across the bar line, packing 3 to 4 internal rhyme hits per line with calm, authoritative breath control.',
        signatureExample: 'Nas ("NY State of Mind") & Rakim ("Follow the Leader") seamless cross-bar enjambment.',
      },
      {
        name: 'Breathless Multisyllabic Machine-Gun Chains (Kool G Rap / Big Pun / Big L)',
        practitioners: 'Kool G Rap, Big Punisher, Big L, Percee P, Pharoahe Monch, Conway the Machine',
        mechanics:
          'Stacks 4-to-6 syllable compound rhymes on EVERY beat (Beat 1, Beat 2, Beat 3, Beat 4) for 8 to 16 consecutive bars without breaking the vowel chord.',
        signatureExample: 'Big Pun’s "Twinz (Deep Cover 98)"—"Dead in the middle of Little Italy, little did we know that we riddled two middlemen who didn’t do diddly."',
      },
      {
        name: 'Wu-Tang / Brooklyn Slang Cryptography & Swing (Raekwon / Ghostface / Biggie)',
        practitioners: 'Notorious B.I.G., Raekwon, Ghostface Killah, Method Man, Sean Price, Cam’ron',
        mechanics:
          'Combines Five-Percenter Supreme Mathematics, Staten Island/Brooklyn street code, and luxurious behind-the-beat swing where multi-word slang phrases rhyme with high-fashion or martial-arts nouns.',
        signatureExample: 'Biggie’s melodic behind-the-snare bounce and Ghostface’s impressionistic stream-of-consciousness multis.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: '[DEAD-ASS] out the [MUD] with the [BLUE-PRINT] carved in ob-[SID-I-AN STONE]',
        vowelSpine: '/ɪ-i-ə oʊ/ (obsidian stone)',
        engineeringNote: 'Beat 1 & 2 establish crisp dental/plosive attack; Beats 3–4 plant a 5-syllable vowel chord [ɪ-i-ə-oʊ].',
      },
      {
        barNumber: 2,
        annotatedBar: 'Ten toes [DOWN] in the [CI-PHER], the [PO-LY-MATH] sit-ting a-[TOP OF THE THRONE]',
        vowelSpine: '/ɒ-ə-ə oʊ/ (top of the throne) ↔ matches rhythm & cadence of [obsidian stone]',
        engineeringNote: 'Compound mosaic match: 2 words ("obsidian stone") rhymed against 4 words ("a-top of the throne").',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Multi-Vowel Harmonic Chord Locking',
        ipaShift: '[V1 - V2 - V3 - V4] === [V1 - V2 - V3 - V4]',
        explanation:
          'In American compound rhyming, consonants can vary completely as long as the sequence of 3 to 5 stressed and unstressed vowel nuclei is identical.',
        unlockedRhymePairs: 'metaphorical symphony [ɛ-ə-ɔː-ɪ-ə-ɪ-ə-i] ↔ categorical infamy [æ-ə-ɔː-ɪ-ə-ɪ-ə-i]',
      },
      {
        ruleName: 'NYC Non-Rhotic Backing & Dental Stop Attack',
        ipaShift: '/ɔːr/ → /ɔːə/ & /t, d/ → dentalized [t̪, d̪]',
        explanation:
          'Classic New York AAVE rounds and backs the /ɔː/ vowel (talk, walk, New York, raw, floor, war) while articulating initial T and D against the back of the teeth for crisp consonant projection.',
        unlockedRhymePairs: 'New York / hawk / walk / chalk  |  raw / floor / door / war / metaphor',
      },
      {
        ruleName: 'Alveolar Flap Smoothing in Multisyllabics (/t, d/ → [ɾ])',
        ipaShift: 'intervocalic /t, d/ → rapid tap [ɾ]',
        explanation:
          'American English taps intervocalic T and D ("city / gritty / witty / Little Italy"), allowing rapid 16th-note multisyllabic chains to glide smoothly over 90 BPM snares.',
        unlockedRhymePairs: 'Little Italy / middlemen / diddly / critically / politically',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'So-' },
      { step: 2, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'lar' },
      { step: 3, label: '&', vocalRole: 'INTERNAL', syllableExample: 'ec-' },
      { step: 4, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'lipse' },
      { step: 5, label: '2', drum: 'SNARE', vocalRole: 'SETUP', syllableExample: 'on' },
      { step: 6, label: 'e', syllableExample: 'the' },
      { step: 7, label: '&', vocalRole: 'INTERNAL', syllableExample: 'ho-' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'lo-gram' },
      { step: 9, label: '3', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'bridge' },
      { step: 10, label: 'e', drum: 'KICK', syllableExample: 'of' },
      { step: 11, label: '&', syllableExample: 'the' },
      { step: 12, label: 'a', vocalRole: 'END-RHYME', syllableExample: 'o-' },
      { step: 13, label: '4', drum: 'SNARE', vocalRole: 'END-RHYME', syllableExample: 'ver-' },
      { step: 14, label: 'e', vocalRole: 'END-RHYME', syllableExample: 'lord' },
      { step: 15, label: '&', vocalRole: 'END-RHYME', syllableExample: 'ship' },
      { step: 16, label: 'a', vocalRole: 'SETUP', syllableExample: 'And' },
    ],
    formulationChecklist: [
      'Never rhyme just the last 1 syllable—always match at least the last 3 to 5 vowel sounds across bars (Mosaic / Compound rhyme).',
      'Place an internal rhyme chain on Beat 2 (the first snare) that echoes either the previous bar’s end-rhyme or sets up a new middle-bar spine.',
      'Use enjambment: start your next sentence on the "4-&-a" pickup of the bar so your flow never sounds boxy or predictable.',
    ],
    exemplarVerse: `Deadass out the mud with the blueprint carved in obsidian stone
Ten toes down in the cipher, the polymath sitting atop of the throne
Iron sharpens iron in the subterranean lab where the legends are grown
Keep it a buck on the frequency, beaming the bars to a quadrant unknown
Solar eclipse on the hologram bridge of the overlord ship when we land
Charting a trajectory nobody else in the galaxy could understand
Every syllable weighed on the jewelers scale with a surgical hand
Golden era philosophy locked in the pocket whenever the horn section slams`,
  },
  {
    id: 'us-abstract-mosaic-doom',
    region: 'us',
    flag: '🇺🇸',
    name: 'Abstract Underground, Def Jux & Drumless Mosaic System (MF DOOM / Aesop / Ka)',
    subtitle: '70%+ Syllable Rhyme Saturation • Holorhyme, Cryptic Polysemy & Chamber Loops',
    bpm: '74 – 90 BPM (Off-Kilter Crate Loops, Dusty Soul & Drumless Chamber Loops)',
    matchedInstrumentalId: 'abstract-drumless-80',
    eraAndOrigin: '1997–Present • Long Island, Lower East Side, Brownsville, Underground Indosphere',
    architects: [
      'MF DOOM',
      'Aesop Rock',
      'Ka',
      'Roc Marciano',
      'Billy Woods',
      'El-P',
      'Breeze Brewin',
      'Lupe Fiasco',
      'Mach-Hommy',
      'Earl Sweatshirt',
      'Homeboy Sandman',
      'Busdriver',
    ],
    acousticEnvironment:
      'Forged on independent vinyl labels (Fondle ’Em, Rawkus, Definitive Jux, Stones Throw, Rhymesayers, Backwoodz, Iron Works) for hyper-attentive listeners dissecting every syllable with a lyric sheet. In the modern Drumless evolution pioneered by Roc Marciano ("Marcberg") and Ka ("Honor Killed the Samurai"), the heavy kick and snare are stripped away almost completely—meaning the MC’s internal rhyme placement, consonant clicks, and cadence shifts must generate 100% of the percussive rhythm.',
    barGeometryAndStructure:
      'Instead of an AABB or ABAB end-rhyme skeleton, the bar is a continuous "Phonemic Web" where 65% to 85% of all syllables in a 16-step bar rhyme with each other (MF DOOM’s "Madvillainy" average). Uses Mosaic Rhymes (1 four-syllable esoteric/occult word rhymed against 3 short street words), Front-Rhyming (landing the rhyme on Beat 1 of the next bar), and Chiasmus inversions.',
    microTimingPocket:
      'Conversational Drunken-Master Rubato: The flow weaves ahead of and behind the sample loop’s downbeat, grouping syllables in odd five-note and seven-note clusters that resolve unexpectedly on Beat 1 or Beat 2-& of the following bar.',
    subDisciplines: [
      {
        name: 'The Supervillain Total-Line Holorhyme Web (MF DOOM / Madvillain School)',
        practitioners: 'MF DOOM, Viktor Vaughn, Bishop Nehru, Your Old Droog, Mach-Hommy',
        mechanics:
          'Constructs entire bars where a 6-syllable phrase in the first half of the line is phonetically mirrored by a 6-syllable phrase in the second half, often spilling over the bar line with comic-book and arcane vocabulary.',
        signatureExample: 'Rhyming every stressed vowel in a 4-bar passage while shifting the position of the rhyme hit each bar.',
      },
      {
        name: 'Maximalist Lexicon Compression (Aesop Rock / El-P / Lupe Fiasco School)',
        practitioners: 'Aesop Rock, El-P, Lupe Fiasco, Rob Sonic, Open Mike Eagle, Milo / R.A.P. Ferreira',
        mechanics:
          'Maximizes unique word count (type-token ratio) by pairing scientific, mythological, and occult nouns ("incunabulum, syzygy, apotheosis") with jagged, syncopated multi-syllabic syntax.',
        signatureExample: 'Aesop Rock’s 7,300+ unique word vocabulary packed into dense anapestic and dactylic meters.',
      },
      {
        name: 'The Drumless Whisper & Chiaroscuro Chamber School (Ka / Roc Marciano / Billy Woods)',
        practitioners: 'Ka, Roc Marciano, Billy Woods, Earl Sweatshirt, Navy Blue, MIKE',
        mechanics:
          'Delivered at an intimate, low-decibel conversational whisper over bare guitar, harp, or piano loops with zero drums—relying on double-meaning homophones, biblical/classical allusions, and internal consonant clicks to keep time.',
        signatureExample: 'Ka’s tight aphoristic chiasmus bars where every single word carries a double meaning.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Sweep the [AB-RAUM] from the [AL-TAR] // [LU-CU-BRA-TION] by the lan-tern’s [AU-RE-OLE]',
        vowelSpine: '/æ-ɔː/ (abraum/altar) + /uː-ə-eɪ-ən/ (lucubration) + /ɔː-i-oʊl/ (aureole)',
        engineeringNote: 'Zero wasted syllables: Beat 1–2 locks /æ-ɔː/, Beat 3–4 opens the /oʊl/ spine.',
      },
      {
        barNumber: 2,
        annotatedBar: 'Ev-ery [PA-LIMP-SEST] I [SCRIB-BLED] in the [CRE-PUS-CULE] is worth its [WEIGHT IN GOLD]',
        vowelSpine: '/ɛ-ɪ-ɛ/ (palimpsest) + /ɛ-ə-uːl/ (crepuscule) + /eɪ-ɪ-oʊld/ (weight in gold ↔ aureole)',
        engineeringNote: 'Mosaic rhyme at bar end: 1 rare word ("aureole" [ɔː-i-oʊl]) matched against 3 words ("weight in gold" [eɪ-ɪ-oʊld]).',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Mosaic Word-Boundary Dissolution',
        ipaShift: 'Polysyllabic Word [A] === Phrase [B + C + D]',
        explanation:
          'The human ear hears continuous phoneme streams, not spaces between words. Breaking a 4-syllable rare word into 3 everyday words creates cognitive surprise.',
        unlockedRhymePairs: 'incunabulum ↔ in-cue-nab-you-lum  |  apotheosis ↔ a-pot-he-owes-us  |  elenchus ↔ he-linked-us',
      },
      {
        ruleName: 'Consonant Cluster Percussion (/kr/, /str/, /spl/, /ɡl/)',
        ipaShift: 'Sustained Onset Consonants acting as Hi-Hats & Snares',
        explanation:
          'In drumless or abstract production, stringing 4 or 5 words with identical consonant clusters creates a physical drum roll on the listener’s eardrum.',
        unlockedRhymePairs: 'crepuscule / crypt / crystal / crimson / chronicle',
      },
      {
        ruleName: 'Front-Rhyming (Beat-1 Resolution)',
        ipaShift: 'Bar 1 Beat 4 Rhyme → Resolves immediately on Bar 2 Beat 1',
        explanation:
          'Instead of waiting until the end of Bar 2 to complete a rhyme, the MC drops the rhyming word on the very first beat of Bar 2, then pivots into a brand-new rhyme family.',
        unlockedRhymePairs: '...worth its weight in [GOLD] / [COLD] iron on the anvil...',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', vocalRole: 'INTERNAL', syllableExample: 'Sweep' },
      { step: 2, label: 'e', syllableExample: 'the' },
      { step: 3, label: '&', vocalRole: 'INTERNAL', syllableExample: 'ab-' },
      { step: 4, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'raum' },
      { step: 5, label: '2', vocalRole: 'INTERNAL', syllableExample: 'from' },
      { step: 6, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'the' },
      { step: 7, label: '&', vocalRole: 'INTERNAL', syllableExample: 'cat-' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'a-comb' },
      { step: 9, label: '3', vocalRole: 'INTERNAL', syllableExample: 'scrib-' },
      { step: 10, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'ble' },
      { step: 11, label: '&', vocalRole: 'INTERNAL', syllableExample: 'lu-' },
      { step: 12, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'cu-' },
      { step: 13, label: '4', vocalRole: 'END-RHYME', syllableExample: 'bra-' },
      { step: 14, label: 'e', vocalRole: 'END-RHYME', syllableExample: 'tion' },
      { step: 15, label: '&', vocalRole: 'END-RHYME', syllableExample: 'in' },
      { step: 16, label: 'a', vocalRole: 'RELOAD-PUNCH', syllableExample: 'CHROME' },
    ],
    formulationChecklist: [
      'Pair a high-register scholarly/occult word from the Lexicon (e.g., "lucubration", "simulacrum", "incunabulum") with a multi-word street mosaic rhyme.',
      'Stack an internal rhyme on every single quarter-note pulse (Beats 1, 2, 3, and 4) so the bar hums even with the drums muted.',
      'Place a surprise rhyme on Beat 1 of the following bar ("front-rhyming") before switching vowel families.',
    ],
    exemplarVerse: `Sweep the abraum from the altar, lucubration by the lantern’s aureole
Every palimpsest I scribbled in the crepuscule is worth its weight in gold
Cut through the industry sophistry, spitting an elenchus cold from the soul
Hierophant holding the grimoire, watching the nebula’s syzygy unfold
Chiaroscuro in the alleyway, counting up the obols in a rusty tin
Mask on the face like a metal-fingered villain when the chamber loops begin
No snare needed when the consonant clusters are clicking like a firing pin
Turning esoteric parables into a blueprint for the next of kin`,
  },
  {
    id: 'us-south-memphis-atlanta-texas',
    region: 'us',
    flag: '🇺🇸',
    name: 'Dirty South Matrix: Memphis 12/8 Triplets, Texas Chopped Drawl & Atlanta 808 Bounce',
    subtitle: '12/8 Triplet Rolls • Monophthong Vowel Bending • 808 Sub-Bass Architecture',
    bpm: '65 – 75 BPM (Texas Chopped/Slowed) & 130 – 155 BPM (Memphis Triplet / Atlanta Trap)',
    matchedInstrumentalId: 'memphis-triplet-138',
    eraAndOrigin: '1991–Present • Memphis, Atlanta, Houston, Port Arthur, New Orleans, Miami',
    architects: [
      'Lord Infamous',
      'Project Pat',
      'Juicy J & DJ Paul',
      'André 3000',
      'Big Boi',
      'Bun B & Pimp C (UGK)',
      'DJ Screw',
      'Scarface',
      'Lil Wayne',
      'T.I.',
      'Future',
      'Young Thug',
    ],
    acousticEnvironment:
      'Engineered for car trunk sub-woofers (dual 15-inch Roland TR-808 bass systems), skating rinks, and Southern bounce clubs. Because sub-bass 808s occupy the lowest audible frequencies (30–80 Hz) with long decay tails, Southern MCs developed high-contrast rhythmic and melodic pockets—either riding razor-sharp 12/8 triplet subdivisions above the sub-bass (Memphis), stretching vowels into syrupy organ-like chords (Texas), or weaving syncopated brass-section polyrhythms (Atlanta).',
    barGeometryAndStructure:
      'Features three foundational Southern engines: (1) The Memphis Triplet Grid (pioneered by Lord Infamous, Koopsta Knicca & Project Pat in the early 1990s), which divides each beat into 3 equal triplet syllables (12 syllables per bar in a continuous rolling cadence); (2) The Texas Gulf Coast Drawl (UGK, Scarface, DJ Screw), which stretches long monophthong vowels across slow 68 BPM snares; and (3) The Atlanta OutKast / Trap Syncopation, combining hyper-fast double-time bursts with melodic pitch-bent hooks and ad-lib call-and-response.',
    microTimingPocket:
      'Metronomic Triplet Lock & Melodic Drawl: In Memphis triplet flow, every syllable strikes like a machine-gun hi-hat on the "1-trip-let 2-trip-let" subdivision; in Texas Gulf Coast flow, vowels sit wide and heavy behind the beat.',
    subDisciplines: [
      {
        name: 'Memphis 12/8 Triplet & Project Pat Anapestic Bounce',
        practitioners: 'Lord Infamous, Project Pat, Koopsta Knicca, Juicy J, Gangsta Boo, Tommy Wright III',
        mechanics:
          'Locks 3 syllables per quarter note ("1-trip-let, 2-trip-let, 3-trip-let") where Beats 1, 2, and 3 share a tight internal rhyme before Beat 4 pauses or drops a recurring refrain.',
        signatureExample: 'Project Pat’s "da-da-DUM, da-da-DUM, da-da-DUM—ten toes down!" cadence.',
      },
      {
        name: 'Dungeon Family Brass-Polyrhythm & Melodic Trap (André 3000 / Lil Wayne / Future)',
        practitioners: 'André 3000, Big Boi, CeeLo Green, Lil Wayne, T.I., Jeezy, Future, Young Thug',
        mechanics:
          'Treats the voice as both a horn section and a jazz drum kit—shifting unpredictably between 16th-note staccato sprints, odd-meter internal rhymes, and pitch-bent melodic crooning.',
        signatureExample: 'André 3000 ("Aquemini" / "B.O.B.") and Lil Wayne ("A Milli") relentless homophone pivoting.',
      },
      {
        name: 'Texas Gulf Coast Drawl & Chopped-and-Screwed Slab Cadence (UGK / Scarface / DJ Screw)',
        practitioners: 'Bun B, Pimp C, Scarface, Devin the Dude, Z-Ro, Chamillionaire, Paul Wall',
        mechanics:
          'Built for 65–72 BPM trunk-rattling organ and bass grooves; uses Southern monophthong vowel smoothing (/aɪ/ → /ɑː/) and blues-preacher storytelling.',
        signatureExample: 'Bun B’s impeccable bar-filling breath control paired with Pimp C’s nasal blues drawl.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Got it [OUT THE MUD] (1-trip-let) // ne-ver [FOLD IN FLOOD] (2-trip-let) // keep-ing [TRILL IN BLOOD] (3-trip-let) // [TEN TOES DOWN] (4)!',
        vowelSpine: '/ʌd/ (mud/flood/blood) + /aʊn/ (down)',
        engineeringNote: 'Classic Memphis 3-beat internal triplet chain (/ʌd/) resolving into a 3-syllable anchor on Beat 4.',
      },
      {
        barNumber: 2,
        annotatedBar: 'Ri-ding [THROUGH THE BLOCK] (1-trip-let) // eight-oh-[EIGHT WILL ROCK] (2-trip-let) // ne-ver [WATCH THE CLOCK] (3-trip-let) // [HOLD THE CROWN] (4)!',
        vowelSpine: '/ɒk/ (block/rock/clock) + /aʊn/ (crown ↔ down)',
        engineeringNote: 'Beats 1–3 switch internal vowel to /ɒk/ while Beat 4 locks the stanza end-rhyme (/aʊn/) with Bar 1.',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Southern Vowel Monophthongization (/aɪ/ → /ɑː/)',
        ipaShift: '/aɪ/ → /ɑː/ (Glide Deletion)',
        explanation:
          'In Southern AAVE, the second half of the /aɪ/ diphthong is smoothed away, allowing words with different final consonants (-ine, -ind, -ime, -ide, -ire) to rhyme as pure open-vowel chords.',
        unlockedRhymePairs: 'shine / mind / time / ride / fire / blind / grind / design',
      },
      {
        ruleName: 'The "Project Pat" Anapestic Bounce (da-da-DUM, da-da-DUM)',
        ipaShift: '˘ ˘ ´ | ˘ ˘ ´ | ˘ ˘ ´ + Turnaround',
        explanation:
          'Repeating a 3-syllable anapestic foot across the first three beats where beat 1, beat 2, and beat 3 all rhyme internally before beat 4 flips the stanza rhyme.',
        unlockedRhymePairs: 'Out the mud, in the flood, with the blood — ten toes down!',
      },
      {
        ruleName: 'PIN-PEN Merger before Nasal Consonants (/ɛn/ → /ɪn/)',
        ipaShift: '/ɛ/ before /m, n, ŋ/ merges to /ɪ/',
        explanation:
          'In Southern phonology, short E and short I merge before nasal consonants, unlocking seamless rhymes between -en/-em and -in/-im words.',
        unlockedRhymePairs: 'ten / win / pin / pen  |  wind / spend / friend / sinned  |  them / rim / gym',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SKIP-BURST', syllableExample: 'Got' },
      { step: 2, label: 'trip', vocalRole: 'SKIP-BURST', syllableExample: 'it' },
      { step: 3, label: 'let', vocalRole: 'INTERNAL', syllableExample: 'mud' },
      { step: 4, label: '2', vocalRole: 'SKIP-BURST', syllableExample: 'in' },
      { step: 5, label: 'trip', vocalRole: 'SKIP-BURST', syllableExample: 'the' },
      { step: 6, label: 'let', vocalRole: 'INTERNAL', syllableExample: 'flood' },
      { step: 7, label: '3', drum: 'SNARE', vocalRole: 'SKIP-BURST', syllableExample: 'trill' },
      { step: 8, label: 'trip', vocalRole: 'SKIP-BURST', syllableExample: 'in' },
      { step: 9, label: 'let', vocalRole: 'INTERNAL', syllableExample: 'blood' },
      { step: 10, label: '4', vocalRole: 'SETUP', syllableExample: 'ten' },
      { step: 11, label: 'trip', syllableExample: 'toes' },
      { step: 12, label: 'let', drum: 'SNARE', vocalRole: 'RELOAD-PUNCH', syllableExample: 'DOWN!' },
      { step: 13, label: '(&)', syllableExample: '[808]' },
      { step: 14, label: '(a)', syllableExample: '[SUB]' },
      { step: 15, label: '(e)', syllableExample: '[TAIL]' },
      { step: 16, label: '(&)', syllableExample: '[ROLL]' },
    ],
    formulationChecklist: [
      'To write a Memphis Triplet bar, count 3 syllables per beat (1-trip-let, 2-trip-let, 3-trip-let, 4-trip-let = 12 syllables per bar).',
      'Rhyme the 3rd syllable of Beat 1, Beat 2, and Beat 3 with each other, and land the main stanza rhyme on Beat 4.',
      'Use Southern vowel smoothing (/aɪ/ → /ɑː/ and PIN-PEN merger) to connect -ind, -ime, -ine, -en, and -in words into seamless melodic runs.',
    ],
    exemplarVerse: `Got it out the mud, never fold in the flood, keeping hundred-percent trill in the blood
Riding through the sector with the sub-bass crunk, eight-oh-eight shaking up the whole neighborhood
Finna calibrate the coordinates clean, standing ten toes down like a commander should
No cap in the log when we spin the whole block, turning raw stardust into livelihood
Triple-six cadence on the cowbell loop, every syllable locked in a triplet roll
From the Memphis tape hiss to the Houston slab, pouring Southern hospitality out the soul
Let the organ chords breathe while the bassline glides, keeping every frequency under control
Shining in the dark like a diamond in the rough, till the whole starship reaches the goal`,
  },
  {
    id: 'us-west-coast-gfunk-blowed',
    region: 'us',
    flag: '🇺🇸',
    name: 'West Coast G-Funk Drawl, Project Blowed Jazz-Scat & Bay Area Slanguage',
    subtitle: 'Compton/Long Beach Melodic Bounce • Vallejo Elastic Pocket • Leimert Park Freestyle',
    bpm: '90 – 102 BPM (G-Funk / West Coast Bounce & Bay Area Mob Music)',
    matchedInstrumentalId: 'westcoast-gfunk-94',
    eraAndOrigin: '1988–Present • Compton, Long Beach, South Central LA (Good Life / Project Blowed), Vallejo, Oakland',
    architects: [
      'Ice Cube',
      'Snoop Dogg',
      'E-40',
      'Too $hort',
      'Mac Dre',
      'DJ Quik',
      'Kurupt',
      'Kendrick Lamar',
      'Freestyle Fellowship (Aceyalone, Myka 9)',
      'Pharcyde',
      'Souls of Mischief',
      'Nipsey Hussle',
    ],
    acousticEnvironment:
      'California evolved three distinct yet interconnected rhyme ecosystems: (1) Southern California G-Funk (Dr. Dre, DJ Quik, Daz Dillinger), built for lowriders cruising at 94 BPM with Parliament-Funkadelic Moog basslines and high portamento sine-wave whistles; (2) The Bay Area / Vallejo Mob & Hyphy Pocket (E-40, Too $hort, Mac Dre), featuring rubbery funk basslines and rapid elastic slang invention; and (3) South Central LA’s Good Life Cafe & Project Blowed (Freestyle Fellowship, Jurassic 5, Busdriver), an underground jazz-rap crucible where MCs fused Charlie Parker bebop scatting with polyrhythmic internal rhymes.',
    barGeometryAndStructure:
      'Combines extreme rhythmic elasticity with theatrical vocal inflection. In E-40’s Vallejo school, the MC intentionally packs 20 to 24 syllables into a bar ("rubber-band overfill"), stretching the sentence past Beat 4 and snapping back on the snare of the next bar. In Kendrick Lamar’s Compton synthesis, the MC shifts vocal timbre, pitch, and persona mid-verse to dramatize multiple characters inside a single 16-bar stanza.',
    microTimingPocket:
      'Laid-Back West Coast Bounce & Elastic Overfill: Snoop Dogg’s Long Beach flow sits 30–40ms behind the handclap snare with a melodic, sing-song cadence, whereas E-40 and Myka 9 accelerate and decelerate rubber-band style across the 16th-note grid.',
    subDisciplines: [
      {
        name: 'Long Beach & Compton Melodic G-Funk Drawl (Snoop Dogg / DJ Quik / Kurupt / Nate Dogg)',
        practitioners: 'Snoop Dogg, Ice Cube, DJ Quik, Kurupt, Warren G, Nipsey Hussle, YG',
        mechanics:
          'Uses ultra-relaxed, conversational behind-the-clap phrasing interspersed with melodic pitch-inflexions, phonetic spelling bars ("S-N-double-O-P"), and razor-sharp West Coast battle multis (Kurupt).',
        signatureExample: 'Snoop’s effortless melodic bounce paired with Kurupt’s dense battle-rap multisyllabics.',
      },
      {
        name: 'Vallejo & Bay Area Elastic Slanguage (E-40 / Mac Dre / Too $hort / Souls of Mischief)',
        practitioners: 'E-40, Mac Dre, B-Legit, Too $hort, Del the Funky Homosapien, Souls of Mischief',
        mechanics:
          'Treats the 4/4 bar like a rubber band—compressing rapid conversational asides, custom Bay Area idioms ("fo’ sheezy, slappin’, gouda,broccoli"), and expressive vocal sound-effects into syncopated pockets.',
        signatureExample: 'E-40’s signature pause-and-burst cadence where a bar pauses on Beat 3 and crams 8 syllables onto Beat 4.',
      },
      {
        name: 'Leimert Park / Project Blowed Bebop Jazz-Scat & Kendrick Theatrical Synthesis',
        practitioners: 'Myka 9, Aceyalone, Abstract Rude, Busdriver, Nocando, Kendrick Lamar, Ab-Soul',
        mechanics:
          'Applies jazz-saxophone double-time arpeggios, pitch-shifted character voices, and breathless polyrhythmic internal rhyme chains.',
        signatureExample: 'Myka 9’s harmonic jazz scatting and Kendrick Lamar’s ("Rigamortus" / "DNA.") multi-persona cadence shifts.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: '[CRUI-SIN] down the [BOU-LE-VARD] in [SIX-FOUR] chrome // [SYNTH] lead [WHIST-LING] while we [HEAD] back [HOME]',
        vowelSpine: '/ɔː/ (boulevard/four) + /oʊm/ (chrome/home)',
        engineeringNote: 'Laid-back 94 BPM G-Funk pocket: internal /ɔː/ anchor on Beat 2, smooth /oʊm/ sustain on Beat 4.',
      },
      {
        barNumber: 2,
        annotatedBar: 'Val-[LE-JO] to [LEI-MERT PARK]—(pause)—we [STRETCH] the whole [POCK-ET] like a [MET-RO-NOME]',
        vowelSpine: '/ɛ-oʊ/ (Vallejo) + /ɛ-ə-oʊm/ (metronome ↔ chrome/home)',
        engineeringNote: 'Bay Area rubber-band pause after "Leimert Park" followed by a rapid 9-syllable burst landing on "metronome".',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'California Fronted /uː/ & /oʊ/ Glide',
        ipaShift: '/uː/ → [ʉː] & laid-back diphthong elongation',
        explanation:
          'West Coast delivery elongates open vowels over the G-Funk synth lead, turning single-syllable end words ("chrome, zone, coast, toast") into 2-beat melodic sustains.',
        unlockedRhymePairs: 'six-four / Crenshaw /mentor  |  coast / toast / ghost / most',
      },
      {
        ruleName: 'Infixation & Phonetic Spelling Cadence (-izzle / Letter-by-Letter)',
        ipaShift: 'Lexical infixation & spelled-out acronyms as rhythmic percussion',
        explanation:
          'Pioneered in the Bay Area (E-40) and Long Beach (Snoop), inserting "-izz-" infixes or spelling words letter-by-letter turns a 1-syllable word into a 4-beat rhythmic hook.',
        unlockedRhymePairs: 'game → G-A-M-E  |  for sure → fo’ sheezy',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SETUP', syllableExample: 'Crui-' },
      { step: 2, label: 'e', syllableExample: 'sin' },
      { step: 3, label: '&', syllableExample: 'down' },
      { step: 4, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'the' },
      { step: 5, label: '2', drum: 'CLAP', vocalRole: 'INTERNAL', syllableExample: 'bou-' },
      { step: 6, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'le-' },
      { step: 7, label: '&', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'vard' },
      { step: 8, label: 'a', syllableExample: 'in' },
      { step: 9, label: '3', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'six-' },
      { step: 10, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'four' },
      { step: 11, label: '&', vocalRole: 'CAESURA-PAUSE', syllableExample: '[whistle]' },
      { step: 12, label: 'a', vocalRole: 'SKIP-BURST', syllableExample: 'stretch-ing' },
      { step: 13, label: '4', drum: 'CLAP', vocalRole: 'END-RHYME', syllableExample: 'met-' },
      { step: 14, label: 'e', vocalRole: 'END-RHYME', syllableExample: 'ro-' },
      { step: 15, label: '&', vocalRole: 'RELOAD-PUNCH', syllableExample: 'NOME' },
      { step: 16, label: 'a', syllableExample: '' },
    ],
    formulationChecklist: [
      'Contrast laid-back behind-the-clap vowels in the first half of the bar with a sudden elastic syllable burst on Beat 3-&-a.',
      'Use vocal inflection shifts (dropping an octave or rising into a jazz-scat melody) to emphasize punchlines.',
      'Weave internal rhymes onto the syncopated P-Funk bass notes (steps 1, 7, and 10).',
    ],
    exemplarVerse: `Cruising down the boulevard in six-four chrome, synth lead whistling while we head back home
Vallejo to Leimert Park—we stretch the whole pocket like a metronome
Project Blowed jazz-scat bouncing off the glass, turning every cipher to a biodome
Spitting game sharper than a laser beam, carving californian hieroglyphs in stone
Rubber-band cadence when I overfill the bar, packing twenty syllables inside the lane
Then I let the Moog bass breathe for a second while the whistle melody refrains
From the Oakland bay breeze to the Compton streets, keeping every frequency inside the brain
Stay beamed up on the West Coast wave, soaking up the sunshine after the rain`,
  },
  {
    id: 'us-midwest-chopper-precision',
    region: 'us',
    flag: '🇺🇸',
    name: 'Midwest Chopper & Double-Time Precision Artillery (130–160+ BPM)',
    subtitle: '32nd-Note Double-Tonguing • Melodic Harmonic Triplets • Cleveland, Chicago, KC, Detroit',
    bpm: '130 – 165 BPM (Double-Time / Triple-Time Chopper Grid)',
    matchedInstrumentalId: 'midwest-chopper-148',
    eraAndOrigin: '1992–Present • Cleveland (St. Clair), Chicago (West Side), Kansas City, Detroit',
    architects: [
      'Bone Thugs-N-Harmony (Krayzie, Bizzy, Layzie)',
      'Twista',
      'Tech N9ne',
      'Crucial Conflict',
      'Do or Die',
      'Eminem',
      'Royce da 5’9"',
      'Freddie Gibbs',
      'Danny Brown',
      'JID (Atlanta/Chopper Hybrid)',
    ],
    acousticEnvironment:
      'In the early 1990s, Midwest MCs in Chicago (Tung Twista, Crucial Conflict) and Cleveland (Bone Thugs-N-Harmony) took the speed of early fast-rap and engineered it into a high-precision musical science. While Chicago perfected crisp, staccato 11.2-syllable-per-second plosive articulation over dark house/hip-hop tempos, Cleveland’s Bone Thugs fused 3-part gospel/R&B vocal harmonies with rapid-fire double-time and triplet cadences.',
    barGeometryAndStructure:
      'Built on "Subdivision Gear-Shifting" (Quarter → 8th → 16th → 16th-Triplet → 32nd notes). A Midwest Chopper verse is architected like a drum solo: the MC groups syllables into 4-note and 6-note percussive cells where every Beat-2 and Beat-4 snare is anchored by a heavy multisyllabic rhyme, while the spaces in between are filled with alliterative 16th- and 32nd-note runs.',
    microTimingPocket:
      'Quantized Laser Grid (0ms Offset): At speeds of 8 to 11 syllables per second, dragging behind the beat causes trainwrecking. Midwest Choppers lock with sub-millisecond precision directly onto the 16th- and 32nd-note subdivisions.',
    subDisciplines: [
      {
        name: 'Cleveland Harmonic Singing-Chopper (Bone Thugs-N-Harmony School)',
        practitioners: 'Krayzie Bone, Bizzy Bone, Layzie Bone, Flesh-n-Bone, Wish Bone',
        mechanics:
          'Sings rapid 16th-note and triplet melodies in minor pentatonic harmony, using soft continuant consonants (/l/, /m/, /n/, /r/, /w/) so fast syllables flow like liquid.',
        signatureExample: 'Krayzie & Bizzy Bone’s seamless melodic double-time runs on "1st of tha Month" and "Thuggish Ruggish Bone".',
      },
      {
        name: 'Chicago & Kansas City Staccato Artillery (Twista / Tech N9ne School)',
        practitioners: 'Twista, Tech N9ne, Do or Die, Crucial Conflict, Krizz Kaliko',
        mechanics:
          'Uses brass-instrument "double-tonguing" (alternating T/D front-of-tongue hits with K/G back-of-tongue hits) and diaphragmatic breath compression to articulate 24 to 32 syllables per bar.',
        signatureExample: 'Twista’s Guinness-record 11.2 syllables/sec burst and Tech N9ne’s percussive drum-pattern flows.',
      },
      {
        name: 'Detroit & Gary Vowel-Bending Technical Mastery (Eminem / Royce da 5’9" / Freddie Gibbs)',
        practitioners: 'Eminem, Royce da 5’9", Elzhi, Freddie Gibbs, Big Sean, Danny Brown',
        mechanics:
          'Bends unstressed vowels and shifts word stress to force 5- and 6-syllable phrases into unbroken 32-bar rhyme columns while switching flows every 4 bars.',
        signatureExample: 'Freddie Gibbs’ gangster-chopper pocket and Royce/Eminem’s total-bar multisyllabic stacking.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: '[TAC-TI-CAL] [LY-RI-CAL] [SYL-LA-BLE] [PIN-NA-CLE] // [CHOP-PING] the [FRE-QUEN-CY] [IN-TO] the [NIGHT]',
        vowelSpine: '/æ-ɪ-ə/ (tactical/lyrical/syllable/pinnacle) + /aɪt/ (night)',
        engineeringNote: 'Four consecutive dactylic feet (´ ˘ ˘) in Beats 1–2 create a 12-syllable machine-gun roll before resolving on Beat 4.',
      },
      {
        barNumber: 2,
        annotatedBar: '[HAR-MO-NY] [MEL-O-DY] [HEAV-EN-LY] [EN-ER-GY] // [BEAM-ING] the [TE-LE-ME-TRY] [FA-STER] than [LIGHT]',
        vowelSpine: '/ɑː-ə-i/ & /ɛ-ə-i/ (harmony/melody/heavenly/energy/telemetry) + /aɪt/ (light)',
        engineeringNote: 'Maintains exact 16th-note dactylic drum-roll symmetry while locking "telemetry" internally.',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Coronal-Velar Double-Tonguing Alternation (/t-k-l/ & /p-t-k/)',
        ipaShift: 'Labial /p, b/ → Coronal /t, d/ → Velar /k, ɡ/',
        explanation:
          'The human tongue cannot repeat the exact same consonant 10 times a second, but it CAN alternate front-to-back ("p-t-k" or "t-k-l") at 12+ syllables per second.',
        unlockedRhymePairs: 'tactical / critical / pinnacle / particle / optical / catapult',
      },
      {
        ruleName: 'Detroit Nasal Raising & Stress Bending (/æ/ → [eə])',
        ipaShift: 'Inland Northern Cities Vowel Shift + Emphatic Schwa Coloring',
        explanation:
          'By slightly coloring unstressed schwa (/ə/) toward /ɪ/ or /ɛ/, a 4-syllable word can be bent to rhyme with a 3-word phrase.',
        unlockedRhymePairs: 'telemetry / symmetry / energy / enemy / memory / heavenly',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'SKIP-BURST', syllableExample: 'Tac-ti-' },
      { step: 2, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'cal' },
      { step: 3, label: '&', vocalRole: 'SKIP-BURST', syllableExample: 'ly-ri-' },
      { step: 4, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'cal' },
      { step: 5, label: '2', drum: 'SNARE', vocalRole: 'SKIP-BURST', syllableExample: 'syl-la-' },
      { step: 6, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'ble' },
      { step: 7, label: '&', vocalRole: 'SKIP-BURST', syllableExample: 'pin-na-' },
      { step: 8, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'cle' },
      { step: 9, label: '3', drum: 'KICK', vocalRole: 'SKIP-BURST', syllableExample: 'beaming' },
      { step: 10, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'te-' },
      { step: 11, label: '&', vocalRole: 'INTERNAL', syllableExample: 'le-me-' },
      { step: 12, label: 'a', vocalRole: 'INTERNAL', syllableExample: 'try' },
      { step: 13, label: '4', drum: 'SNARE', vocalRole: 'SETUP', syllableExample: 'fas-ter' },
      { step: 14, label: 'e', syllableExample: 'than' },
      { step: 15, label: '&', vocalRole: 'RELOAD-PUNCH', syllableExample: 'LIGHT!' },
      { step: 16, label: 'a', vocalRole: 'CAESURA-PAUSE', syllableExample: '[breath]' },
    ],
    formulationChecklist: [
      'Build 3-syllable dactylic cells (DA-da-da, DA-da-da) using words ending in "-ical", "-ity", or "-ery" to hit effortless double-time speed.',
      'Alternate front-of-mouth (P, B, T, D) and back-of-mouth (K, G) consonants so your tongue never trips.',
      'Leave step 16 (the "a" of Beat 4) open for a rapid diaphragmatic catch-breath before launching the next bar.',
    ],
    exemplarVerse: `Tactical lyrical syllable pinnacle, chopping the frequency into the night
Harmony melody heavenly energy, beaming the telemetry faster than light
Velocity critical, never predictable, keeping the vocal projection airtight
Midwest artillery hitting the target, we calibrate every coordinate right
Double-time sprinting across the horizon, the turbine is spinning at maximum speed
Every consonant clicking like clockwork, fulfilling the code of the starship creed
Bone Thugs harmony mixed with the Chicago chopper is giving the rhythm you need
Lock in the pocket at hundred and forty-eight, watching the galaxies recede`,
  },
  {
    id: 'us-detroit-flint-offbeat',
    region: 'us',
    flag: '🇺🇸',
    name: 'Detroit & Flint Nervous Piano Off-Beat & Punch-In Talk-Rap System',
    subtitle: 'Urgent Michigan Piano Loops • Punch-In Run-On Bars • Conversational Off-Beat',
    bpm: '100 – 110 BPM (Classic Blade Icewood / Street Lordz) & 180 – 200 BPM (Modern Flint/Detroit)',
    matchedInstrumentalId: 'detroit-flint-106',
    eraAndOrigin: '1999–Present • Detroit (East Side / West Side, 7 Mile), Flint, Ypsilanti, Inkster',
    architects: [
      'Blade Icewood',
      'Doughboyz Cashout (Payroll Giovanni)',
      'BandGang',
      'Rio Da Yung OG',
      'RMC Mike',
      'BabyTron',
      'Veeze',
      'Boldy James',
      'Babyface Ray',
      'Teejayx6',
      'Kash Doll',
      'Sada Baby',
    ],
    acousticEnvironment:
      'Michigan engineered one of the most unmistakable regional styles in modern rap history. Built over urgent, menacing minor-key piano stabs, synth strings, and hyper-bouncy basslines (Helluva, Enrgy Beats, Michigan Meech), Detroit and Flint MCs abandoned traditional 4-bar breathed stanzas in favor of "Punch-In Talk-Rap"—where the MC records one conversational, run-on bar at a time, overlapping the end of one line with the start of the next.',
    barGeometryAndStructure:
      'Operates on "Intentional Bar-Line Overrun" and "Deadpan Absurdist Punchline Stacking". Instead of landing the rhyme politely on Beat 4’s snare, a Detroit/Flint MC starts their sentence on Beat 2, talks rapidly across Beat 4 without pausing, and lands the rhyming punchline on Beat 1-& or Beat 2 of the next bar.',
    microTimingPocket:
      'Ahead-of-the-Piano Urgent Talk-Pocket: The vocals sit slightly ahead of or counter-rhythmic to the 16th-note piano stabs, creating a breathless, high-stakes conversational urgency ("shit-talking" right in the listener’s ear).',
    subDisciplines: [
      {
        name: 'Flint & Detroit Punch-In Shit-Talk School (Rio Da Yung OG / RMC Mike / Sada Baby)',
        practitioners: 'Rio Da Yung OG, RMC Mike, Louie Ray, YN Jay, KrispyLife Kidd, Sada Baby',
        mechanics:
          'Delivered with zero studio polish in a raw, conversational tone where every 2 bars contain an outrageous, hyper-specific metaphor or comedic street hyperbole.',
        signatureExample: 'Pausing mid-sentence to correct oneself on the mic before dropping a 4-syllable slant rhyme.',
      },
      {
        name: '190 BPM Hyper-Sample Pop-Culture Barrage (BabyTron / StanWill / TrDee)',
        practitioners: 'BabyTron, ShittyBoyz, Teejayx6, Kasher Quon',
        mechanics:
          'Raps at double speed over 180–200 BPM Michigan drums, packing sports, sci-fi, and pop-culture similes into every bar while crossing the bar-line continuously.',
        signatureExample: 'Landing rhymes on the "1-e" of the next bar while the next punch-in vocal already starts.',
      },
      {
        name: '7-Mile Hustler Boss-Talk & Concreatures Cool (Payroll Giovanni / Babyface Ray / Veeze)',
        practitioners: 'Payroll Giovanni, Blade Icewood, Babyface Ray, Veeze, Boldy James, Icewear Vezzo',
        mechanics:
          'Ultra-laid-back, gravelly or raspy whispers (Veeze, Babyface Ray) and motivational hustler game (Payroll Giovanni) that float calmly over frantic Detroit piano percussion.',
        signatureExample: 'Veeze’s mumbled, syrupy off-beat pocket where rhymes land on unexpected 16th-note syncopations.',
      },
    ],
    forensicBreakdown: [
      {
        barNumber: 1,
        annotatedBar: 'Wait—let me [TALK TO ’EM] on the [DARK PI-A-NO] // punch-ing in the [BOOTH] while the [SUB-BASS SLAM]—',
        vowelSpine: '/ɑː-i-æ-oʊ/ (dark piano) + /ʌ-eɪ-æm/ (sub-bass slam)',
        engineeringNote: 'Starts with conversational interrupt ("Wait—") and runs right past Beat 4 into Bar 2.',
      },
      {
        barNumber: 2,
        annotatedBar: '—over-[LAP-PING] every bar like a [HO-LO-GRAM] // seven-mile [VET-ER-AN] sticking to the [PRO-GRAM]',
        vowelSpine: '/ɒ-ə-ɡræm/ (overlapping / hologram / veteran / program)',
        engineeringNote: 'The rhyme from Bar 1 ("slam") resolves on Beat 2 of Bar 2 ("hologram") and Beat 4 ("program").',
      },
    ],
    phoneticEngineRules: [
      {
        ruleName: 'Punch-In Run-On Enjambment (Overlapping Vocal Takes)',
        ipaShift: 'Bar 1 Coda overlaps Bar 2 Onset',
        explanation:
          'By eliminating the natural breathing gap at the end of Bar 1, the listener experiences a relentless wall of conversational punchlines.',
        unlockedRhymePairs: 'hologram / program / slow jam / whole fam / door slam',
      },
      {
        ruleName: 'Conversational Slant-Vowel Flattening',
        ipaShift: 'Spoken pitch inflection overrides strict consonant identity',
        explanation:
          'In Detroit/Flint talk-rap, if two 3-syllable phrases are spoken with the exact same sarcastic or deadpan pitch cadence, the ear accepts wide consonant slant rhymes as exact hits.',
        unlockedRhymePairs: 'starship captain / archive匹 / dark night action',
      },
    ],
    grid16Steps: [
      { step: 1, label: '1', drum: 'KICK', vocalRole: 'CAESURA-PAUSE', syllableExample: 'Wait—' },
      { step: 2, label: 'e', vocalRole: 'SETUP', syllableExample: 'let' },
      { step: 3, label: '&', drum: 'PIANO', vocalRole: 'SETUP', syllableExample: 'me' },
      { step: 4, label: 'a', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'talk' },
      { step: 5, label: '2', drum: 'SNARE', vocalRole: 'INTERNAL', syllableExample: 'to' },
      { step: 6, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'em' },
      { step: 7, label: '&', drum: 'PIANO', vocalRole: 'SETUP', syllableExample: 'on' },
      { step: 8, label: 'a', syllableExample: 'the' },
      { step: 9, label: '3', drum: 'KICK', vocalRole: 'INTERNAL', syllableExample: 'dark' },
      { step: 10, label: 'e', vocalRole: 'INTERNAL', syllableExample: 'pi-' },
      { step: 11, label: '&', drum: 'PIANO', vocalRole: 'INTERNAL', syllableExample: 'a-no' },
      { step: 12, label: 'a', drum: 'KICK', vocalRole: 'SKIP-BURST', syllableExample: 'punch-ing' },
      { step: 13, label: '4', drum: 'SNARE', vocalRole: 'SKIP-BURST', syllableExample: 'in' },
      { step: 14, label: 'e', vocalRole: 'SKIP-BURST', syllableExample: 'the' },
      { step: 15, label: '&', drum: 'PIANO', vocalRole: 'END-RHYME', syllableExample: 'sub-bass' },
      { step: 16, label: 'a', vocalRole: 'RELOAD-PUNCH', syllableExample: 'SLAM—' },
    ],
    formulationChecklist: [
      'Open with a conversational check-in ("Wait—", "Hold on—", "Listen—") as if talking directly to the engineer in the booth.',
      'Let your sentence spill right past the Beat-4 snare and land your rhyme on Beat 1-& or Beat 2 of the next bar.',
      'Pack vivid, hyper-specific similes into every 2-bar pair while keeping your vocal delivery cool and deadpan.',
    ],
    exemplarVerse: `Wait—let me talk to ’em on the dark piano, punching in the booth while the sub-bass slam
Overlapping every bar like a hologram, Seven-Mile veteran sticking to the program
Talking crazy on the comms while the starship glide, never needed autopilot when I’m inside
Every punchline hitting like a asteroid strike, whole crew beamed up on the Michigan side
Hold on—let the piano loop repeat from the top, eighteen syllables before the beat even drop
Running right across the bar line without a breath, turning raw telemetry into a work of art
From the Flint water tower to the outer rim, keeping every single phaser set to maximum
If the beat stop right now I’m still gonna talk—walking on the moon like a neighborhood astronaut`,
  },
];

// Cross-Dialect Phonetic Vowel & Consonant Shift Table
const DIALECT_PHONETIC_COMPARISONS = [
  {
    feature: 'Post-Vocalic "R" (bar, star, car, water)',
    usStandardNy: 'Rhotic /r/ or NY Backed /ɔːə/ (bar / cigar / floor / war)',
    usSouth: 'Soft R-drop /ə/ (flo’ / do’ / mo’ / sho’ / po’)',
    ukGrimeMle: 'Non-Rhotic /ɑː/ & /ə/ (bar / nah /utta | water / caught her)',
    westAfricanPatois: 'Open Vowel /aː/ (star / Jah / far / yard / corn)',
  },
  {
    feature: 'Intervocalic "T" (butter, gutter, letter, matter)',
    usStandardNy: 'Alveolar Flap [ɾ] ("budder / ledder / Little Italy")',
    usSouth: 'Soft Flap [ɾ] with stretched first vowel',
    ukGrimeMle: 'Sharp Glottal Stop [ʔ] ("bu’er / gu’er / le’er") — acts as vocal hi-hat',
    westAfricanPatois: 'Crisp Plosive [t] ("mat-ter / bet-ter") — locks onto clavé bell',
  },
  {
    feature: 'Long "I" Diphthong (time, mind, line, ride)',
    usStandardNy: 'Full Diphthong [aɪ] (strictly rhymes -ime with -ime)',
    usSouth: 'Monophthong [ɑː] (rhymes time / mind / shine / blind / grind)',
    ukGrimeMle: 'Backed MLE [ɑɪ] / [aː] (rhymes time / grime / outside)',
    westAfricanPatois: 'High-Contrast [aɪ] with tonal pitch inflection',
  },
  {
    feature: '"TH" Consonants (thing, three, brother, mouth)',
    usStandardNy: 'Dental Stop [t̪ / d̪] ("tin / tree / brudder")',
    usSouth: 'Labiodental / Alveolar ("mouf / souf / bruvva")',
    ukGrimeMle: 'TH-Fronting [f / v] ("fing / free / bruv / luv")',
    westAfricanPatois: 'Plosive Stop [t / d] ("ting / tree / bredda")',
  },
  {
    feature: 'TRAP-BATH Vowel Split (glass, past, dance, path)',
    usStandardNy: 'Flat Front Vowel [æ] (rhymes glass / pass / mass)',
    usSouth: 'Drawled Diphthong [æɛ] (gl-a-ass / p-a-ast)',
    ukGrimeMle: 'Broad Back Vowel [ɑː] (rhymes glass / past ↔ heart / dark / star!)',
    westAfricanPatois: 'Pure Open [a] (rhymes dance / chance / Jah)',
  },
];

export const RhymeEvolutionsLab: React.FC<RhymeEvolutionsLabProps> = ({
  currentEra,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [regionFilter, setRegionFilter] = useState<'all' | 'uk-global' | 'us'>('all');
  const [selectedSystemId, setSelectedSystemId] = useState<string>(DIVERGENT_RHYME_SYSTEMS[0].id);

  const visibleSystems = DIVERGENT_RHYME_SYSTEMS.filter(
    (s) => regionFilter === 'all' || s.region === regionFilter
  );

  const activeSystem =
    DIVERGENT_RHYME_SYSTEMS.find((s) => s.id === selectedSystemId) || visibleSystems[0];

  const handleAuditionDisciplineBeat = (presetId: string) => {
    playLcarsChirp('warp');
    window.dispatchEvent(
      new CustomEvent('audition-rapper-friend-beat', { detail: { presetId } })
    );
  };

  return (
    <div className="space-y-6 font-lcars">
      {/* Top LCARS Banner */}
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2"
        style={{ borderColor: theme.primary }}
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              SUBSPACE ETHNOMUSICOLOGY & CADENCE ENGINEERING // 07-140
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              12 DIVERGENT RHYME DISCIPLINES • LIVE INSTRUMENTAL STUDIO • CUSTOM BEAT UPLOADER
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mt-1">
            Under the Hood: Divergent Evolutions of Rhyme Systems & Instrumentals
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1 max-w-4xl">
            Explore the acoustic crucibles, 16-step beat subdivisions, sub-school master techniques, forensic bar breakdowns, and IPA vowel shifts across 12 global and American rap disciplines—and practice your flows over 12 built-in regional instrumentals or upload your own MP3/WAV beats below.
          </p>
        </div>

        {/* Region Filter Switcher */}
        <div className="flex rounded-full bg-slate-900 p-1 border border-slate-800 text-xs shrink-0 self-start">
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setRegionFilter('all');
            }}
            className={`px-3 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer ${
              regionFilter === 'all'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ALL DISCIPLINES ({DIVERGENT_RHYME_SYSTEMS.length})
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setRegionFilter('uk-global');
              setSelectedSystemId('uk-grime-140-engine');
            }}
            className={`px-3 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer ${
              regionFilter === 'uk-global'
                ? 'bg-emerald-400 text-black shadow-md'
                : 'text-emerald-300/80 hover:text-white'
            }`}
          >
            🇬🇧🌍🇯🇲 UK, AFRO & CARIBBEAN (6)
          </button>
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setRegionFilter('us');
              setSelectedSystemId('us-ny-golden-compound');
            }}
            className={`px-3 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer ${
              regionFilter === 'us'
                ? 'bg-cyan-400 text-black shadow-md'
                : 'text-cyan-300/80 hover:text-white'
            }`}
          >
            🇺🇸 AMERICAN CONVENTIONS (6)
          </button>
        </div>
      </div>

      {/* Embedded Multi-Style Instrumental Beat Deck & Custom Beat Uploader */}
      <InstrumentalBeatDeck
        currentEra={currentEra}
        initialPresetId={activeSystem.matchedInstrumentalId}
      />

      {/* System Selector Cards Strip (12 Disciplines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleSystems.map((sys) => {
          const isSelected = sys.id === activeSystem.id;
          return (
            <button
              key={sys.id}
              onClick={() => {
                playLcarsChirp('tap');
                setSelectedSystemId(sys.id);
              }}
              className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 shadow-xl scale-[1.01]'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
              style={isSelected ? { borderColor: theme.primary } : {}}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xl">{sys.flag}</span>
                  <span
                    className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-full font-bold uppercase ${
                      sys.region === 'uk-global'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                    }`}
                  >
                    {sys.bpm.split('(')[0].trim()}
                  </span>
                </div>
                <div className="text-base font-bold uppercase text-white leading-snug">
                  {sys.name}
                </div>
                <div className="text-[11px] font-mono-tech text-slate-400 mt-1">
                  {sys.subtitle}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-tech">
                <span className="text-amber-400 font-bold uppercase">
                  {isSelected ? '● ACTIVE SCHEMATIC' : 'INSPECT DISCIPLINE →'}
                </span>
                <span className="text-slate-500">{sys.architects.slice(0, 3).join(', ')}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active System Deep-Dive Schematic */}
      <div
        className="p-5 rounded-3xl border-2 bg-slate-950/90 space-y-6"
        style={{ borderColor: theme.secondary }}
      >
        {/* Schematic Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl">{activeSystem.flag}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-amber-400 tracking-wide">
                {activeSystem.name}
              </h3>
            </div>
            <div className="text-xs font-mono-tech text-cyan-300">
              TEMPO & POCKET: {activeSystem.bpm} • ORIGIN: {activeSystem.eraAndOrigin}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => handleAuditionDisciplineBeat(activeSystem.matchedInstrumentalId)}
              className="px-4 py-2.5 rounded-full font-extrabold text-black bg-emerald-400 hover:bg-emerald-300 text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <Disc className="w-4 h-4" />
              AUDITION DISCIPLINE INSTRUMENTAL
            </button>

            <button
              onClick={() => {
                playLcarsChirp('warp');
                onSendToAnalyzer(activeSystem.exemplarVerse);
              }}
              className="px-4 py-2.5 rounded-full font-extrabold text-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
              style={{ backgroundColor: theme.primary }}
            >
              <Send className="w-4 h-4" />
              TEST 8-BAR FLOW IN ANALYZER
            </button>
          </div>
        </div>

        {/* Architects Strip */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-tech">
          <span className="text-slate-400 uppercase font-bold mr-1">KEY ARCHITECTS & PIONEERS:</span>
          {activeSystem.architects.map((arch, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-200 border border-slate-700"
            >
              {arch}
            </span>
          ))}
        </div>

        {/* 3-Column Core Engineering Breakdown: Acoustic Crucible, Bar Geometry, Micro-Timing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              1. ACOUSTIC CRUCIBLE (WHY IT EVOLVED)
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {activeSystem.acousticEnvironment}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono-tech uppercase font-bold text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              2. BAR, STANZA & BREATH GEOMETRY
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {activeSystem.barGeometryAndStructure}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs font-mono-tech uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              3. MICRO-TIMING, SWING & POCKET PHYSICS
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {activeSystem.microTimingPocket}
            </p>
          </div>
        </div>

        {/* Sub-Schools & Master Techniques (3 Deep Sub-Disciplines per System) */}
        <div className="space-y-3">
          <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            4. SUB-SCHOOLS & MASTER TECHNIQUES WITHIN THIS DISCIPLINE
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {activeSystem.subDisciplines.map((sub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="text-sm font-bold uppercase text-white">
                    {sub.name}
                  </div>
                  <div className="text-[11px] font-mono-tech text-cyan-300">
                    PRACTITIONERS: {sub.practitioners}
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {sub.mechanics}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono-tech text-amber-200">
                  <span className="text-amber-400 uppercase font-bold block mb-0.5">
                    SIGNATURE TECHNIQUE:
                  </span>
                  {sub.signatureExample}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forensic Bar-by-Bar Structural Deconstruction */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="text-xs font-mono-tech uppercase font-bold text-emerald-400 flex items-center gap-1.5">
            <Microscope className="w-4 h-4" />
            5. FORENSIC BAR-BY-BAR ANATOMY (VOWEL CHORDS & BREATH POCKET MAPPING)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSystem.forensicBreakdown.map((fb, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono-tech">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-extrabold uppercase">
                    BAR 0{fb.barNumber} DECONSTRUCTION
                  </span>
                  <span className="text-cyan-300">{fb.vowelSpine}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono-tech text-xs text-white leading-relaxed">
                  {fb.annotatedBar}
                </div>
                <p className="text-xs font-sans text-slate-300 leading-snug">
                  <strong className="text-emerald-400 font-mono-tech uppercase mr-1">
                    CADENCE NOTE:
                  </strong>
                  {fb.engineeringNote}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive 16-Step Subdivision Beat Grid Visualizer */}
        <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              6. 16-STEP SUBDIVISION TELEMETRY GRID (HOW SYLLABLES LOCK TO THE DRUMS)
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono-tech">
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500 inline-block" /> INTERNAL RHYME
              </span>
              <span className="flex items-center gap-1 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-500 inline-block" /> SKIP / DOUBLE-TIME BURST
              </span>
              <span className="flex items-center gap-1 text-rose-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> CAESURA PAUSE / 808 GLIDE
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" /> END-RHYME / RELOAD PUNCH
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-1.5 pt-1">
            {activeSystem.grid16Steps.map((st) => {
              let roleBg = 'bg-slate-900 border-slate-800 text-slate-300';
              if (st.vocalRole === 'INTERNAL') {
                roleBg = 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200';
              } else if (st.vocalRole === 'SKIP-BURST') {
                roleBg = 'bg-purple-950/80 border-purple-500/60 text-purple-200';
              } else if (st.vocalRole === 'CAESURA-PAUSE') {
                roleBg = 'bg-rose-950/70 border-rose-500/60 text-rose-300';
              } else if (st.vocalRole === 'END-RHYME' || st.vocalRole === 'RELOAD-PUNCH') {
                roleBg = 'bg-amber-500/20 border-amber-400 text-amber-200 font-extrabold';
              }

              return (
                <div
                  key={st.step}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center min-h-[78px] ${roleBg}`}
                >
                  <span className="text-[10px] font-mono-tech text-slate-400 font-bold">
                    {st.label}
                  </span>
                  <span className="text-xs font-mono-tech my-1 tracking-tight">
                    {st.syllableExample || '·'}
                  </span>
                  <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-black/60 text-slate-300 uppercase">
                    {st.drum || '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phonetic Vowel & Consonant Engine Rules */}
        <div className="space-y-3">
          <div className="text-xs font-mono-tech uppercase font-bold text-cyan-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" />
            7. UNDER THE HOOD: PHONETIC VOWEL & CONSONANT ENGINE (IPA SHIFTS)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {activeSystem.phoneticEngineRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold uppercase text-white">
                      {rule.ruleName}
                    </span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 text-[11px] font-sans text-cyan-300">
                    IPA SHIFT: {rule.ipaShift}
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {rule.explanation}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/90 text-[11px] font-mono-tech">
                  <span className="text-amber-400 uppercase font-bold block mb-0.5">
                    UNLOCKED RHYME PAIRS:
                  </span>
                  <span className="text-slate-200">{rule.unlockedRhymePairs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: MC Formulation Checklist + Canonical 8-Bar Exemplar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="text-xs font-mono-tech uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              8. MC BAR FORMULATION CHECKLIST (HOW TO WRITE IN THIS DISCIPLINE)
            </div>
            <ul className="space-y-2 text-xs sm:text-sm font-sans text-slate-200">
              {activeSystem.formulationChecklist.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-mono-tech font-bold">0{i + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 mb-2">
                // CANONICAL 8-BAR RALLY & CADENCE EXEMPLAR
              </div>
              <pre className="p-3.5 rounded-xl bg-black border border-slate-800 text-cyan-200 font-mono-tech text-xs whitespace-pre-wrap leading-relaxed">
                {activeSystem.exemplarVerse}
              </pre>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => handleAuditionDisciplineBeat(activeSystem.matchedInstrumentalId)}
                className="px-3.5 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Disc className="w-3.5 h-3.5" />
                PLAY MATCHING BEAT
              </button>
              <button
                onClick={() => {
                  playLcarsChirp('warp');
                  onSendToAnalyzer(activeSystem.exemplarVerse);
                }}
                className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                LOAD 8-BARS INTO BAR ANALYZER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Dialect Phonetic Vowel & Consonant Shift Comparison Matrix */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div>
          <div className="text-xs font-mono-tech uppercase font-bold text-amber-400 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            CROSS-DIALECT PHONETIC MATRIX // WHY ACCENTS CHANGE WHAT RHYMES
          </div>
          <h3 className="text-xl font-bold uppercase text-white mt-0.5">
            Comparative Vowel & Consonant Shifts: US NY vs. US South vs. UK Grime/MLE vs. Afro-Caribbean
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-700 text-[11px] font-mono-tech uppercase text-amber-400">
                <th className="py-2.5 px-3">Phonetic Feature</th>
                <th className="py-2.5 px-3">🇺🇸 US Standard / NYC Boom-Bap</th>
                <th className="py-2.5 px-3">🇺🇸 US Dirty South / Texas / Memphis</th>
                <th className="py-2.5 px-3">🇬🇧 UK Grime / Road Rap (London MLE)</th>
                <th className="py-2.5 px-3">🇯🇲🌍 Jamaican Patois & West African Pidgin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {DIALECT_PHONETIC_COMPARISONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-white font-mono-tech">
                    {row.feature}
                  </td>
                  <td className="py-3 px-3 text-cyan-200">{row.usStandardNy}</td>
                  <td className="py-3 px-3 text-amber-200">{row.usSouth}</td>
                  <td className="py-3 px-3 text-emerald-200">{row.ukGrimeMle}</td>
                  <td className="py-3 px-3 text-purple-200">{row.westAfricanPatois}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
