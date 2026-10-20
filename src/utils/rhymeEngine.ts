import type {
  BarAnalysisResult,
  LiteraryDeviceMatch,
  SchemeAnalysis,
  SchemeSuggestion,
  EndWordPhoneme,
} from '../types/lcars.ts';
import { LEXICON_DATABASE } from '../data/lexiconData.ts';

// Phonetic vowel sound clusters for assonance & rhyme detection
const VOWEL_SOUND_MAP: Record<string, string> = {
  'ight': 'aɪt', 'ite': 'aɪt', 'y': 'aɪ', 'igh': 'aɪ',
  'ound': 'aʊnd', 'own': 'aʊn', 'out': 'aʊt',
  'ain': 'eɪn', 'ane': 'eɪn', 'ay': 'eɪ', 'eigh': 'eɪ',
  'ore': 'ɔːr', 'oar': 'ɔːr', 'oor': 'ɔːr', 'our': 'ɔːr',
  'eep': 'iːp', 'eap': 'iːp', 'ea': 'iː', 'ee': 'iː',
  'ack': 'æk', 'at': 'æt', 'ap': 'æp', 'ash': 'æʃ',
  'ot': 'ɒt', 'ock': 'ɒk', 'op': 'ɒp', 'otting': 'ɒtɪŋ',
  'oon': 'uːn', 'une': 'uːn', 'oom': 'uːm',
  'art': 'ɑːrt', 'ark': 'ɑːrk', 'arm': 'ɑːrm',
  'ire': 'aɪər', 'yre': 'aɪər',
  'aze': 'eɪz', 'ase': 'eɪz',
};

/**
 * Counts syllables accurately using phonemic heuristics.
 */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Common special cases
  const overrides: Record<string, number> = {
    'the': 1, 'every': 2, 'rhythm': 2, 'subtle': 2, 'prism': 2,
    'poetry': 3, 'poetic': 3, 'cosmos': 2, 'universe': 3, 'mc': 2,
    'bars': 1, 'rhyme': 1, 'flow': 1, 'words': 1, 'chiasmus': 3,
    'alliteration': 5, 'metaphor': 3, 'cadence': 2, 'etymology': 5,
    'galaxy': 3, 'quantum': 2, 'astronomy': 4, 'nebula': 3,
  };
  if (overrides[clean]) return overrides[clean];

  // Heuristic counting
  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < clean.length; i++) {
    const isVowel = vowels.includes(clean[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  // Adjust for silent e at the end (e.g. 'make', 'fate', but not 'le' like 'bottle')
  if (clean.endsWith('e') && !clean.endsWith('le') && count > 1) {
    count--;
  }

  // Adjust for -ed if not preceded by t or d
  if (clean.endsWith('ed') && !clean.endsWith('ted') && !clean.endsWith('ded') && count > 1) {
    count--;
  }

  // Adjust for -es
  if (clean.endsWith('es') && !clean.endsWith('ches') && !clean.endsWith('shes') && count > 1) {
    count--;
  }

  // -ia, -io, -iu, -ea (in words like created, lineage, reality)
  if (/([aeiou])([ia|io|iu|eo])/i.test(clean)) {
    count++;
  }

  return Math.max(1, count);
}

/**
 * Extracts normalized phonetic rhyme tail/coda.
 */
export function getRhymeTail(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length <= 2) return clean;

  // Check custom mapping
  for (const [pattern, tail] of Object.entries(VOWEL_SOUND_MAP)) {
    if (clean.endsWith(pattern)) {
      return tail;
    }
  }

  // Fallback to last vowel + following consonants
  const match = clean.match(/[aeiouy]+[^aeiouy]*$/);
  if (match) {
    return match[0];
  }
  return clean.slice(-2);
}

export const normalizeRhymeCoda = getRhymeTail;

/**
 * Checks if two words have a rhyme relationship (perfect, slant, or assonant).
 */
export function wordsRhyme(wordA: string, wordB: string): { rhymes: boolean; type: 'perfect' | 'slant' | 'none' } {
  const a = wordA.toLowerCase().replace(/[^a-z]/g, '');
  const b = wordB.toLowerCase().replace(/[^a-z]/g, '');
  if (!a || !b || a === b) return { rhymes: false, type: 'none' };

  const tailA = getRhymeTail(a);
  const tailB = getRhymeTail(b);

  if (tailA === tailB && tailA.length >= 2) {
    return { rhymes: true, type: 'perfect' };
  }

  // Slant rhyme: common ending consonants or identical vowel kernel
  const vowelKernelA = tailA.replace(/[^aeiou]/g, '');
  const vowelKernelB = tailB.replace(/[^aeiou]/g, '');
  if (vowelKernelA && vowelKernelA === vowelKernelB && vowelKernelA.length >= 1) {
    return { rhymes: true, type: 'slant' };
  }

  return { rhymes: false, type: 'none' };
}

/**
 * Detects classic and advanced literary devices in lyric bars.
 */
export function detectLiteraryDevices(lines: string[]): LiteraryDeviceMatch[] {
  const results: LiteraryDeviceMatch[] = [];
  const allWords = lines.flatMap(line => line.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean));

  // 1. Alliteration (consecutive words starting with same consonant sound)
  lines.forEach((line, lineIdx) => {
    const words = line.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const w3 = words[i + 2];
      if (w1[0] && w2[0] && w1[0] === w2[0] && !'aeiou'.includes(w1[0])) {
        const cluster = (w3 && w3[0] === w1[0]) ? [w1, w2, w3] : [w1, w2];
        results.push({
          type: 'Alliteration',
          description: `Alliteration on consonant /${w1[0].toUpperCase()}/`,
          words: cluster,
          lineIndex: lineIdx,
        });
        if (cluster.length === 3) i++; // skip extra
      }
    }
  });

  // 2. Anaphora (lines starting with the same word)
  if (lines.length >= 2) {
    const firstWords = lines.map(l => l.trim().split(/\s+/)[0]?.toLowerCase()).filter(Boolean);
    for (let i = 0; i < firstWords.length - 1; i++) {
      if (firstWords[i] && firstWords[i] === firstWords[i + 1] && firstWords[i].length > 1) {
        results.push({
          type: 'Anaphora',
          description: `Repeated initial word "${firstWords[i]}" across successive bars`,
          words: [firstWords[i]],
          lineIndex: i,
        });
      }
    }
  }

  // 3. Epistrophe (lines ending with same word)
  if (lines.length >= 2) {
    const lastWords = lines.map(l => {
      const parts = l.trim().split(/\s+/);
      return parts[parts.length - 1]?.toLowerCase().replace(/[^a-z]/g, '');
    }).filter(Boolean);

    for (let i = 0; i < lastWords.length - 1; i++) {
      if (lastWords[i] && lastWords[i] === lastWords[i + 1] && lastWords[i].length > 1) {
        results.push({
          type: 'Epistrophe',
          description: `Repeated cadence tail "${lastWords[i]}" at line endings`,
          words: [lastWords[i]],
          lineIndex: i,
        });
      }
    }
  }

  // 4. Multisyllabic Rhyme Detection (words with >= 3 syllables that rhyme or slant rhyme)
  const multiWords = allWords.filter(w => countSyllables(w) >= 3);
  for (let i = 0; i < multiWords.length; i++) {
    for (let j = i + 1; j < multiWords.length; j++) {
      const match = wordsRhyme(multiWords[i], multiWords[j]);
      if (match.rhymes) {
        results.push({
          type: 'Multisyllabic Rhyme',
          description: `Polysyllabic rhyme chain between "${multiWords[i]}" (${countSyllables(multiWords[i])} syl) & "${multiWords[j]}" (${countSyllables(multiWords[j])} syl)`,
          words: [multiWords[i], multiWords[j]],
        });
      }
    }
  }

  // 5. Internal Rhyme (rhyme between middle and end of same bar)
  lines.forEach((line, idx) => {
    const tokens = line.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(w => w.length > 2);
    if (tokens.length >= 4) {
      const last = tokens[tokens.length - 1];
      for (let i = 0; i < tokens.length - 1; i++) {
        if (wordsRhyme(tokens[i], last).rhymes) {
          results.push({
            type: 'Internal Rhyme',
            description: `Internal strike: "${tokens[i]}" mirrors bar-end "${last}"`,
            words: [tokens[i], last],
            lineIndex: idx,
          });
        }
      }
    }
  });

  // 6. Chiasmus / Mirroring detection (ABBA word inversion)
  if (lines.length >= 2) {
    for (let l = 0; l < lines.length - 1; l++) {
      const wA = lines[l].toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
      const wB = lines[l + 1].toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
      if (wA.length >= 2 && wB.length >= 2) {
        const firstA = wA[0], lastA = wA[wA.length - 1];
        const firstB = wB[0], lastB = wB[wB.length - 1];
        if (firstA === lastB && lastA === firstB && firstA !== lastA) {
          results.push({
            type: 'Chiasmus',
            description: `Chiastic inversion pattern across bars: [${firstA} ... ${lastA}] mirrors [${firstB} ... ${lastB}]`,
            words: [firstA, lastA],
            lineIndex: l,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Calculates real-time metric and bar analysis (syllable counts, rhyme density, phonemic complexity).
 */
export function analyzeBars(text: string): BarAnalysisResult {
  const rawLines = text.split('\n');
  const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);

  if (lines.length === 0) {
    return {
      lines: [],
      lineSyllables: [],
      totalSyllables: 0,
      avgSyllablesPerBar: 0,
      rhymeDensityScore: 0,
      phonemicComplexityScore: 0,
      cadenceGrade: 'OFF-METER',
      detectedDevices: [],
      rhymeGroups: {},
      meterPattern: [],
    };
  }

  const lineSyllables = lines.map(line => {
    const words = line.split(/\s+/).filter(Boolean);
    return words.reduce((acc, word) => acc + countSyllables(word), 0);
  });

  const totalSyllables = lineSyllables.reduce((a, b) => a + b, 0);
  const avgSyllablesPerBar = Math.round((totalSyllables / lines.length) * 10) / 10;

  // Meter pattern generation (simplified: iambic/trochaic rhythm estimate)
  const meterPattern = lines.map(line => {
    const words = line.split(/\s+/).filter(Boolean);
    return words.map(w => {
      const syls = countSyllables(w);
      if (syls === 1) return '´';
      if (syls === 2) return '´ ˘';
      if (syls === 3) return '´ ˘ ˘';
      return '´ ˘ ´ ˘';
    }).join(' ');
  });

  // Calculate Rhyme Groups and Rhyme Density
  const LCARS_COLORS = ['#FF9900', '#FFCC00', '#CC6699', '#9999FF', '#99CCFF', '#FF6600', '#00CCCC'];
  const rhymeGroups: { [colorHex: string]: { word: string; lineIndex: number; wordIndex: number }[] } = {};
  let colorIdx = 0;

  const wordCoords: { word: string; lineIndex: number; wordIndex: number; assignedGroup?: string }[] = [];
  lines.forEach((line, lIdx) => {
    const words = line.split(/\s+/).filter(Boolean);
    words.forEach((w, wIdx) => {
      wordCoords.push({ word: w.toLowerCase().replace(/[^a-z]/g, ''), lineIndex: lIdx, wordIndex: wIdx });
    });
  });

  let rhymingWordsCount = 0;
  for (let i = 0; i < wordCoords.length; i++) {
    const itemA = wordCoords[i];
    if (!itemA.word || itemA.word.length <= 1) continue;

    for (let j = i + 1; j < wordCoords.length; j++) {
      const itemB = wordCoords[j];
      if (!itemB.word || itemB.word.length <= 1) continue;

      const res = wordsRhyme(itemA.word, itemB.word);
      if (res.rhymes) {
        let groupColor = itemA.assignedGroup || itemB.assignedGroup;
        if (!groupColor) {
          groupColor = LCARS_COLORS[colorIdx % LCARS_COLORS.length];
          colorIdx++;
          rhymeGroups[groupColor] = [];
        }

        if (!itemA.assignedGroup) {
          itemA.assignedGroup = groupColor;
          rhymeGroups[groupColor].push({ word: itemA.word, lineIndex: itemA.lineIndex, wordIndex: itemA.wordIndex });
          rhymingWordsCount++;
        }
        if (!itemB.assignedGroup) {
          itemB.assignedGroup = groupColor;
          rhymeGroups[groupColor].push({ word: itemB.word, lineIndex: itemB.lineIndex, wordIndex: itemB.wordIndex });
          rhymingWordsCount++;
        }
      }
    }
  }

  // Rhyme density: percentage of words that take part in a rhyme chain
  const totalWords = wordCoords.filter(w => w.word.length > 1).length;
  const rawDensity = totalWords > 0 ? (rhymingWordsCount / totalWords) * 100 : 0;
  const rhymeDensityScore = Math.min(100, Math.round(rawDensity * 1.2));

  // Phonemic complexity score: based on multisyllabic vocabulary + consonant density
  const multiSyllableCount = wordCoords.filter(w => countSyllables(w.word) >= 2).length;
  const multiRatio = totalWords > 0 ? multiSyllableCount / totalWords : 0;
  const complexConsonants = text.match(/[str|chr|ph|th|ck|ght|spl|scr]/gi)?.length || 0;
  const phonemicComplexityScore = Math.min(100, Math.round((multiRatio * 50) + (complexConsonants * 2.5) + (avgSyllablesPerBar * 2)));

  // Cadence grade based on bar balance (hip hop bars typically 10-16 syllables per 4/4 bar)
  let cadenceGrade: BarAnalysisResult['cadenceGrade'] = 'OFF-METER';
  const stdDev = calculateStdDev(lineSyllables);
  if (stdDev <= 1.5 && avgSyllablesPerBar >= 10 && avgSyllablesPerBar <= 16) {
    cadenceGrade = 'POCKET S+';
  } else if (stdDev <= 3 && avgSyllablesPerBar >= 8 && avgSyllablesPerBar <= 18) {
    cadenceGrade = 'POCKET A';
  } else if (avgSyllablesPerBar >= 6) {
    cadenceGrade = 'SYNCOPATED';
  }

  const detectedDevices = detectLiteraryDevices(lines);

  return {
    lines,
    lineSyllables,
    totalSyllables,
    avgSyllablesPerBar,
    rhymeDensityScore,
    phonemicComplexityScore,
    cadenceGrade,
    detectedDevices,
    rhymeGroups,
    meterPattern,
  };
}

function calculateStdDev(nums: number[]): number {
  if (nums.length <= 1) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / nums.length;
  return Math.sqrt(variance);
}

/**
 * Extracts the end word from a line with trailing punctuation stripped.
 */
export function extractEndWord(line: string): { word: string; clean: string; trailingPunct: string } {
  const trimmed = line.trim();
  if (!trimmed) return { word: '', clean: '', trailingPunct: '' };

  const tokens = trimmed.split(/\s+/);
  const rawWord = tokens[tokens.length - 1] || '';

  const match = rawWord.match(/^(.*?)([.,!?;:—"']*)$/);
  const core = match ? match[1] : rawWord;
  const trailingPunct = match ? match[2] : '';
  const clean = core.toLowerCase().replace(/[^a-z']/g, '');

  return { word: rawWord, clean, trailingPunct };
}

/**
 * Finds candidate rhyming words from the database matching a target word or coda.
 */
export function findRhymeCandidates(targetWordOrCoda: string, limit: number = 8): string[] {
  const clean = targetWordOrCoda.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return [];

  // Check if target word exists in database with pre-compiled perfect rhymes
  const dbMatch = LEXICON_DATABASE.find(w => w.word.toLowerCase() === clean);
  if (dbMatch && dbMatch.perfectRhymes.length > 0) {
    const list = dbMatch.perfectRhymes.filter(r => r.toLowerCase() !== clean);
    if (list.length >= limit) return list.slice(0, limit);
    return list;
  }

  // Otherwise search database words whose rhyme tail matches
  const targetTail = getRhymeTail(clean);
  const candidates: string[] = [];

  for (const entry of LEXICON_DATABASE) {
    if (entry.word.toLowerCase() === clean) continue;
    const entryTail = getRhymeTail(entry.word);
    if (entryTail === targetTail || wordsRhyme(entry.word, clean).rhymes) {
      if (!candidates.includes(entry.word)) {
        candidates.push(entry.word);
      }
    }
  }

  // If still fewer than limit, add from perfect rhymes array of matches
  for (const entry of LEXICON_DATABASE) {
    for (const pr of entry.perfectRhymes) {
      const prLower = pr.toLowerCase();
      if (prLower !== clean && !candidates.includes(prLower)) {
        if (getRhymeTail(prLower) === targetTail || wordsRhyme(prLower, clean).rhymes) {
          candidates.push(prLower);
        }
      }
    }
  }

  return candidates.slice(0, limit);
}

/**
 * Analyzes input text end-word phonemes and generates automated suggestions
 * for target rhyme schemes: AABB, ABAB, and AAAA.
 */
export function analyzeRhymeSchemes(lines: string[]): SchemeAnalysis {
  const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0);

  if (cleanLines.length === 0) {
    return {
      detectedPattern: 'NONE',
      confidence: 0,
      endWords: [],
      suggestions: [],
    };
  }

  // 1. Extract end-words & phonemic coda
  const endWords: EndWordPhoneme[] = cleanLines.map((line, idx) => {
    const { word, clean } = extractEndWord(line);
    const rhymeTail = getRhymeTail(clean);
    const syllables = countSyllables(clean);
    return {
      lineIndex: idx,
      word,
      cleanWord: clean,
      rhymeTail,
      syllables,
      symbol: '',
    };
  });

  // 2. Assign rhyme symbols: A, B, C, D...
  const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  let nextSymbolIdx = 0;

  endWords.forEach((item, idx) => {
    if (idx === 0) {
      item.symbol = symbols[nextSymbolIdx++];
      return;
    }

    // Check if rhymes with any previous line
    let matchedSymbol: string | null = null;
    for (let prevIdx = 0; prevIdx < idx; prevIdx++) {
      const prev = endWords[prevIdx];
      const check = wordsRhyme(item.cleanWord, prev.cleanWord);
      if (check.rhymes || (item.rhymeTail && item.rhymeTail === prev.rhymeTail)) {
        matchedSymbol = prev.symbol;
        break;
      }
    }

    if (matchedSymbol) {
      item.symbol = matchedSymbol;
    } else {
      item.symbol = symbols[nextSymbolIdx % symbols.length];
      nextSymbolIdx++;
    }
  });

  // 4-bar scheme window
  const barSymbols = endWords.slice(0, 4).map(e => e.symbol);
  const detectedPattern = barSymbols.join('');

  // 3. Propose target rhyme schemes: AABB, ABAB, AAAA
  const suggestions: SchemeSuggestion[] = [];

  // --- Proposal 1: AABB Couplets ---
  {
    const pair1Rhymes = endWords.length >= 2 ? wordsRhyme(endWords[0].cleanWord, endWords[1].cleanWord).rhymes : false;
    const pair2Rhymes = endWords.length >= 4 ? wordsRhyme(endWords[2].cleanWord, endWords[3].cleanWord).rhymes : endWords.length === 3;
    
    let aabbScore = 0;
    if (pair1Rhymes) aabbScore += 50;
    if (pair2Rhymes) aabbScore += 50;

    const lineSuggs: SchemeSuggestion['lineSuggestions'] = [];

    // If lines 0 and 1 don't rhyme, suggest line 1 rhyming with line 0
    if (!pair1Rhymes && endWords.length >= 2) {
      lineSuggs.push({
        lineIndex: 1,
        currentWord: endWords[1].cleanWord,
        targetSymbol: 'A',
        targetRhymeTail: endWords[0].rhymeTail,
        suggestedWords: findRhymeCandidates(endWords[0].cleanWord, 6),
      });
    }

    // If lines 2 and 3 don't rhyme, suggest line 3 rhyming with line 2
    if (!pair2Rhymes && endWords.length >= 4) {
      lineSuggs.push({
        lineIndex: 3,
        currentWord: endWords[3].cleanWord,
        targetSymbol: 'B',
        targetRhymeTail: endWords[2].rhymeTail,
        suggestedWords: findRhymeCandidates(endWords[2].cleanWord, 6),
      });
    } else if (endWords.length === 3) {
      // 3 bars present, suggest completion for bar 4
      lineSuggs.push({
        lineIndex: 3,
        currentWord: '[New Bar 4]',
        targetSymbol: 'B',
        targetRhymeTail: endWords[2].rhymeTail,
        suggestedWords: findRhymeCandidates(endWords[2].cleanWord, 6),
      });
    }

    suggestions.push({
      targetPattern: 'AABB',
      matchScore: aabbScore,
      title: 'AABB Couplet Pattern',
      description: pair1Rhymes && pair2Rhymes
        ? 'Locked Couplet Alignment: Line 1 pairs with 2, Line 3 pairs with 4.'
        : `Couplet Shift: ${lineSuggs.length} line${lineSuggs.length > 1 ? 's' : ''} require adjustment to close consecutive couplets.`,
      explanation: 'Two consecutive paired rhymes (AA then BB). Standard bedrock of classic hip-hop and dynamic multi-bar punches.',
      lineSuggestions: lineSuggs,
    });
  }

  // --- Proposal 2: ABAB Alternating Cross-Rhymes ---
  {
    const cross1Rhymes = endWords.length >= 3 ? wordsRhyme(endWords[0].cleanWord, endWords[2].cleanWord).rhymes : false;
    const cross2Rhymes = endWords.length >= 4 ? wordsRhyme(endWords[1].cleanWord, endWords[3].cleanWord).rhymes : false;

    let ababScore = 0;
    if (cross1Rhymes) ababScore += 50;
    if (cross2Rhymes) ababScore += 50;

    const lineSuggs: SchemeSuggestion['lineSuggestions'] = [];

    // Check Bar 3 (index 2) matching Bar 1 (index 0)
    if (!cross1Rhymes && endWords.length >= 3) {
      lineSuggs.push({
        lineIndex: 2,
        currentWord: endWords[2].cleanWord,
        targetSymbol: 'A',
        targetRhymeTail: endWords[0].rhymeTail,
        suggestedWords: findRhymeCandidates(endWords[0].cleanWord, 6),
      });
    }

    // Check Bar 4 (index 3) matching Bar 2 (index 1)
    if (!cross2Rhymes && endWords.length >= 4) {
      lineSuggs.push({
        lineIndex: 3,
        currentWord: endWords[3].cleanWord,
        targetSymbol: 'B',
        targetRhymeTail: endWords[1].rhymeTail,
        suggestedWords: findRhymeCandidates(endWords[1].cleanWord, 6),
      });
    } else if (endWords.length === 2) {
      lineSuggs.push({
        lineIndex: 2,
        currentWord: '[New Bar 3]',
        targetSymbol: 'A',
        targetRhymeTail: endWords[0].rhymeTail,
        suggestedWords: findRhymeCandidates(endWords[0].cleanWord, 6),
      });
    }

    suggestions.push({
      targetPattern: 'ABAB',
      matchScore: ababScore,
      title: 'ABAB Alternating Cross-Rhymes',
      description: cross1Rhymes && cross2Rhymes
        ? 'Interlocking Alternation: Odd lines (1 & 3) match; even lines (2 & 4) match.'
        : `Alternating Sync: ${lineSuggs.length} line${lineSuggs.length > 1 ? 's' : ''} require adjustment to alternate cadence.`,
      explanation: 'Alternating rhyme scheme creates poetic suspense, carrying tension across bars before resolving on the 4th beat.',
      lineSuggestions: lineSuggs,
    });
  }

  // --- Proposal 3: AAAA Monorhyme Barrage ---
  {
    // Find dominant rhyme coda across bars
    const codaCounts: Record<string, number> = {};
    endWords.forEach(w => {
      codaCounts[w.rhymeTail] = (codaCounts[w.rhymeTail] || 0) + 1;
    });

    const dominantTail = Object.entries(codaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || endWords[0]?.rhymeTail;
    const dominantWord = endWords.find(w => w.rhymeTail === dominantTail)?.cleanWord || endWords[0]?.cleanWord;

    const matchingCount = endWords.filter(w => w.rhymeTail === dominantTail || wordsRhyme(w.cleanWord, dominantWord).rhymes).length;
    const aaaaScore = Math.min(100, Math.round((matchingCount / Math.max(1, Math.min(4, endWords.length))) * 100));

    const lineSuggs: SchemeSuggestion['lineSuggestions'] = [];
    endWords.slice(0, 4).forEach(item => {
      if (item.rhymeTail !== dominantTail && !wordsRhyme(item.cleanWord, dominantWord).rhymes) {
        lineSuggs.push({
          lineIndex: item.lineIndex,
          currentWord: item.cleanWord,
          targetSymbol: 'A',
          targetRhymeTail: dominantTail,
          suggestedWords: findRhymeCandidates(dominantWord, 6),
        });
      }
    });

    suggestions.push({
      targetPattern: 'AAAA',
      matchScore: aaaaScore,
      title: 'AAAA Monorhyme Barrage',
      description: lineSuggs.length === 0
        ? 'Pure Monorhyme Barrage: All 4 bars lock into the identical phonetic coda.'
        : `Monorhyme Surge: Replace ${lineSuggs.length} line ending${lineSuggs.length > 1 ? 's' : ''} to build unrelenting mono-rhyme pressure.`,
      explanation: 'Sustained four-bar monorhyme (AAAA). High-impact battle-rap technique providing relentless acoustic momentum.',
      lineSuggestions: lineSuggs,
    });
  }

  // Confidence calculation based on how definitive the pattern is
  const topMatch = Math.max(...suggestions.map(s => s.matchScore));

  return {
    detectedPattern,
    confidence: topMatch,
    endWords,
    suggestions,
  };
}

/**
 * Replaces the end-word on a specified line, preserving punctuation and formatting.
 */
export function applySchemeReplacement(fullText: string, lineIndex: number, newEndWord: string): string {
  const lines = fullText.split('\n');
  if (lineIndex < 0 || lineIndex >= lines.length) return fullText;

  const targetLine = lines[lineIndex];
  const { word, trailingPunct } = extractEndWord(targetLine);

  if (!word) {
    lines[lineIndex] = `${targetLine} ${newEndWord}`;
    return lines.join('\n');
  }

  // Find last index of the word in line
  const lastIndex = targetLine.lastIndexOf(word);
  if (lastIndex !== -1) {
    const replacement = `${newEndWord}${trailingPunct}`;
    lines[lineIndex] = targetLine.substring(0, lastIndex) + replacement + targetLine.substring(lastIndex + word.length);
  } else {
    lines[lineIndex] = `${targetLine} ${newEndWord}${trailingPunct}`;
  }

  return lines.join('\n');
}

