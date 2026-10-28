export type LcarsEra = 'tng' | 'voyager' | 'nemesis' | 'lowerdecks' | 'ldpadd' | 'picard';

export interface EtymologyData {
  pieRoot?: string; // Proto-Indo-European root
  originLanguage: string; // e.g. Old English, Latin, Ancient Greek, Old Norse, Sanskrit, AAVE/Hip-Hop
  century?: string; // e.g. 12th Century, 16th Century, 1980s
  history: string; // concise etymological path & semantic drift
  cognates: string[]; // related words with same root
  evolutionChain: string[]; // e.g. ["*bher- (PIE)", "beran (Proto-Germanic)", "beran (Old English)", "bear (Modern English)"]
}

export interface WordEntry {
  id: string;
  word: string;
  syllables: number;
  ipa: string; // e.g. /kæt/
  stressPattern: string; // e.g. "1" or "1-0" (1 = primary stress, 0 = unstressed)
  rhymeFamily: string; // e.g. "-æt", "-ɒt", "-aɪt", "-eɪn"
  rhymeFamilyLabel: string; // e.g. "-at (cat/fat)", "-ot/-ock (top/rot/stock)"
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'interjection' | 'prefix';
  definition: string;
  etymology: EtymologyData;
  perfectRhymes: string[];
  slantRhymes: string[];
  multisyllableRhymes: string[];
  artRapSnippet?: string; // An art-rap lyric demonstrating the word in cadence
  tags: string[]; // e.g. ["cosmic", "philosophy", "concrete", "grit", "kinetic"]
}

export interface LiteraryDeviceMatch {
  type: 'Alliteration' | 'Assonance' | 'Consonance' | 'Internal Rhyme' | 'Multisyllabic Rhyme' | 'Anaphora' | 'Epistrophe' | 'Chiasmus' | 'Polyptoton' | 'Oxymoron';
  description: string;
  words: string[];
  lineIndex?: number;
}

export interface BarAnalysisResult {
  lines: string[];
  lineSyllables: number[];
  totalSyllables: number;
  avgSyllablesPerBar: number;
  rhymeDensityScore: number; // 0 to 100%
  phonemicComplexityScore: number; // 0 to 100
  cadenceGrade: 'POCKET S+' | 'POCKET A' | 'POCKET B' | 'SYNCOPATED' | 'OFF-METER';
  detectedDevices: LiteraryDeviceMatch[];
  rhymeGroups: { [colorHex: string]: { word: string; lineIndex: number; wordIndex: number }[] };
  meterPattern: string[]; // array of meter strings per line, e.g. "´ ˘ ´ ˘ ´"
}

export interface SavedPhrase {
  id: string;
  phrase: string;
  createdAt: number;
  barCount: number;
  syllables: number;
  notes?: string;
  tags: string[];
  rhymeScheme?: string;
  attachedRoots: {
    word: string;
    pieRoot?: string;
    origin: string;
    definition: string;
  }[];
}

export type RhymeSchemePattern = 'AABB' | 'ABAB' | 'AAAA' | 'ABBA' | 'AABC' | 'ABAC' | 'FREE';

export interface EndWordPhoneme {
  lineIndex: number;
  word: string;
  cleanWord: string;
  rhymeTail: string;
  syllables: number;
  symbol: string; // e.g. 'A', 'B', 'C', 'X'
}

export interface SchemeSuggestion {
  targetPattern: 'AABB' | 'ABAB' | 'AAAA';
  matchScore: number; // 0 to 100% how close the current text is to this pattern
  title: string;
  description: string;
  explanation: string;
  lineSuggestions: {
    lineIndex: number;
    currentWord: string;
    targetSymbol: string; // 'A' or 'B'
    targetRhymeTail: string;
    suggestedWords: string[]; // rhyming suggestions from lexicon database matching the target coda
  }[];
}

export interface SchemeAnalysis {
  detectedPattern: string; // e.g. "AABB", "ABAB", "AAAA", "ABCB", "AXAX"
  confidence: number;
  endWords: EndWordPhoneme[];
  suggestions: SchemeSuggestion[];
}

export interface MultiRhymeMatch {
  phrase: string;
  syllables: number;
  vowelChain: string[];
  type: 'compound' | 'mosaic' | 'polysyllabic' | 'slant';
  matchScore: number; // 0 to 100%
  breakdown: string; // e.g. "quan-tum for-mat"
  poeticNote?: string;
}

export interface PieRootNode {
  id: string;
  root: string; // e.g. "*wekw-"
  protoMeaning: string; // e.g. "to speak, utter"
  originEra: string; // e.g. "c. 4500–2500 BCE (Pontic-Caspian Steppe)"
  overview: string;
  branches: {
    languageFamily: string; // e.g. "Italic / Latin", "Hellenic / Greek", "Germanic / Old English", "Indo-Iranian / Sanskrit"
    intermediateForms: string[];
    modernWords: {
      word: string;
      definition: string;
      poeticUsage: string;
    }[];
  }[];
  cognatePairs: {
    wordA: string;
    wordB: string;
    relationship: string;
    conceptHook: string; // lyrical inspiration for punchlines
  }[];
}

export interface HolodeckChallenge {
  id: string;
  code: string; // e.g. "HOL-902-ALPHA"
  title: string;
  theme: 'ASTROMETRICS' | 'CYBERNETICS' | 'SUBTERRANEAN JAZZ' | 'TEMPORAL PARADOX' | 'STREET EPISTEMOLOGY' | 'QUANTUM ENTROPY';
  difficulty: 'CADET' | 'LIEUTENANT' | 'COMMANDER' | 'FLEET CAPTAIN';
  rhymeScheme: 'AABB' | 'ABAB' | 'AAAA';
  targetRoot: string; // e.g. "*bhel- (to shine/burn)"
  targetWords: string[];
  targetDevice: string; // e.g. "Chiasmus" or "Epistrophe"
  syllableTarget: string; // e.g. "12–14 syllables per bar"
  timeLimitSeconds: number; // e.g. 180 (3 min)
  promptScaffold: string; // 4-line initial template for the lyricist
  objective: string;
}

export interface LiteraryDeviceGuide {
  id: string;
  name: string;
  greekEtymology: string; // e.g. "khiasmos (crossing/X-shaped)"
  category: 'Repetition & Cadence' | 'Wordplay & Morphing' | 'Syntax & Inversion' | 'Imagery & Contrast';
  definition: string;
  formula: string; // e.g. "A ... B / B ... A"
  iconicBar: string;
  artist: string;
  breakdown: string;
  drillTemplate: string; // fill-in-the-blank template to inject directly into notebook
}

export type ActiveTab =
  | 'lexicon'
  | 'wordlists'
  | 'analyzer'
  | 'song-anatomy'
  | 'multis'
  | 'pieroot'
  | 'holodeck'
  | 'devices'
  | 'rhyme-evolutions'
  | 'graph2d'
  | 'graph3d'
  | 'vault';

export interface BarAnatomyLine {
  barNumber: number;
  rawText: string;
  cleanedText: string;
  syllableCount: number;
  meterPattern: string;
  endWord: string;
  rhymeTail: string;
  rhymeColor: string;
  rhymeTagId: string;
  internalRhymes: { word: string; rhymeTagId: string; color: string }[];
  detectedDevices: LiteraryDeviceMatch[];
  cadenceNote: string;
  timestamp?: string;
}

export interface RhymeFamilyGroup {
  id: string;
  color: string;
  coda: string;
  vowelSound: string;
  type: 'perfect' | 'slant' | 'multisyllabic' | 'mosaic';
  occurrences: { barNumber: number; word: string; isEndWord: boolean }[];
}

export interface ClevernessInsight {
  title: string;
  tag: 'Cadence Tension' | 'Mosaic Rhyme' | 'Double Entendre' | 'Rhetorical Form' | 'Sonic Texture' | 'Semantic Drift';
  summary: string;
  lyricQuote: string;
  breakdown: string;
}

export interface ClevernessAnalysis {
  overallScore: number; // 0 to 100
  cadenceGrade: 'S+' | 'S' | 'A+' | 'A' | 'B';
  executiveSummary: string;
  flowPocketDescription: string;
  mosaicRhymesDeconstruction: string[];
  literaryCraftSummary: string;
  semanticWordplayInsights: ClevernessInsight[];
  breathAndPauseAnalysis: string;
}

export interface SongAnatomyResult {
  title: string;
  artist: string;
  sourceType: 'upload-audio' | 'upload-lyrics' | 'paste-link' | 'paste-lyrics' | 'preset';
  sourceUrlOrName?: string;
  estimatedBpm: number;
  totalBars: number;
  totalSyllables: number;
  avgSyllablesPerBar: number;
  rhymeDensityScore: number; // 0 to 100%
  multisyllableRatio: number; // 0 to 100%
  dominantScheme: string; // e.g. "AABB Compound Chains", "ABAB Cross-Cadence", "Complex Freeform Mosaic"
  bars: BarAnatomyLine[];
  rhymeFamilies: RhymeFamilyGroup[];
  cleverness: ClevernessAnalysis;
  audioDurationSeconds?: number;
}

export interface RareEmotionEntry {
  emotion: 'joy' | 'sadness' | 'anger' | 'fear' | 'love' | 'wonder' | 'disgust' | 'longing' | 'peace' | 'ennui' | 'triumph' | 'remorse';
  emotionLabel: string;
  word: string;
  syllables: number;
  ipa: string;
  definition: string;
  poeticNote: string;
  artRapSnippet: string;
}

export interface RareColorEntry {
  colorCategory: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'black' | 'white' | 'orange';
  colorLabel: string;
  word: string;
  hexValue: string;
  syllables: number;
  ipa: string;
  definition: string;
  poeticNote: string;
  artRapSnippet: string;
}



