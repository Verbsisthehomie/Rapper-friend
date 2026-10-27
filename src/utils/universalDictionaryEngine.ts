import type { WordEntry } from '../types/lcars.ts';
import { countSyllables, getRhymeTail } from './rhymeEngine.ts';
import { LEXICON_DATABASE } from '../data/lexiconData.ts';

const CUSTOM_CANON_STORAGE_KEY = 'lcars_user_custom_canon_v1';

// In-memory cache for fast repeated lookups
const universalWordCache = new Map<string, WordEntry>();
const universalSearchCache = new Map<string, WordEntry[]>();

// Root & Morpheme Etymology Analyzer for rich PIE & linguistic lineage synthesis
interface MorphemeRootInfo {
  pattern: RegExp;
  pieRoot: string;
  originLanguage: string;
  meaning: string;
  cognates: string[];
  chain: string[];
}

const MORPHEME_ETYMOLOGY_TABLE: MorphemeRootInfo[] = [
  {
    pattern: /(chron|temp)/i,
    pieRoot: '*gher- / *temp- (time, stretch)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'time, duration, or temporal sequence',
    cognates: ['chronicle', 'chroniton', 'synchronize', 'temporal'],
    chain: ['khronos (Ancient Greek)', 'chronia (Late Latin)', 'Modern English'],
  },
  {
    pattern: /(astr|stell|cosm|sid)/i,
    pieRoot: '*ster- (star)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'star, celestial body, or cosmic order',
    cognates: ['astronomy', 'stellar', 'constellation', 'cosmos', 'sidereal'],
    chain: ['*ster- (PIE)', 'astron / stella (Greek/Latin)', 'Modern English'],
  },
  {
    pattern: /(phon|son|voc|vok)/i,
    pieRoot: '*bha- / *wekw- (to speak, sound)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'voice, sound wave, or vocal resonance',
    cognates: ['phoneme', 'symphony', 'sonic', 'vocal', 'invoke'],
    chain: ['*bha- (PIE)', 'phōnē (Ancient Greek)', 'Modern English'],
  },
  {
    pattern: /(log|lex|leg|lect)/i,
    pieRoot: '*leg- (to collect, speak, reason)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'word, discourse, reason, or lexical collection',
    cognates: ['lexicon', 'logic', 'syllogism', 'dialect', 'lecture'],
    chain: ['*leg- (PIE)', 'logos / lexis (Ancient Greek)', 'Modern English'],
  },
  {
    pattern: /(graph|gram|scrib|script)/i,
    pieRoot: '*gerbh- / *skribh- (to scratch, carve, write)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'carved mark, written inscription, or recorded scripture',
    cognates: ['epigraph', 'grammar', 'manuscript', 'inscribe', 'hologram'],
    chain: ['*gerbh- (PIE)', 'graphein (Ancient Greek)', 'Modern English'],
  },
  {
    pattern: /(luc|lum|phot|phos)/i,
    pieRoot: '*leuk- / *bha- (light, brightness, shine)',
    originLanguage: 'Latin / Ancient Greek',
    meaning: 'radiant light, illumination, or photon emission',
    cognates: ['lucid', 'luminous', 'photon', 'phosphorescent', 'lucubration'],
    chain: ['*leuk- (PIE)', 'lux / lumen (Latin)', 'Modern English'],
  },
  {
    pattern: /(morph|form)/i,
    pieRoot: '*merph- (form, shape)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'shape, structure, or structural transmutation',
    cognates: ['metamorphosis', 'amorphous', 'morphology', 'transform'],
    chain: ['morphē (Ancient Greek)', 'forma (Latin)', 'Modern English'],
  },
  {
    pattern: /(phil|amor|amab)/i,
    pieRoot: '*bhei- / *am- (to love, cherish)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'deep affinity, devotion, or philosophical love',
    cognates: ['philosophy', 'ceraunophile', 'inamorata', 'amorous'],
    chain: ['philein (Ancient Greek)', 'philos (Greek)', 'Modern English'],
  },
  {
    pattern: /(psych|anim|spir)/i,
    pieRoot: '*bhes- / *ane- (to breathe, soul, spirit)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'breath, vital spirit, mind, or consciousness',
    cognates: ['psyche', 'spirit', 'animate', 'conspire', 'inspire'],
    chain: ['*bhes- (PIE)', 'psykhē (Ancient Greek)', 'Modern English'],
  },
  {
    pattern: /(crypt|apocry|occult|calyp)/i,
    pieRoot: '*kel- / *kadh- (to hide, conceal, cover)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'hidden vault, secret cipher, or veiled revelation',
    cognates: ['cryptic', 'apocalypse', 'occult', 'apocryphal'],
    chain: ['*kel- (PIE)', 'kryptos (Ancient Greek)', 'Modern English'],
  },
  {
    pattern: /(gnos|cogn|not|sci)/i,
    pieRoot: '*gno- / *skei- (to know, discern)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'knowledge, discernment, or esoteric realization',
    cognates: ['gnosis', 'cognition', 'anagnorisis', 'science', 'prescience'],
    chain: ['*gno- (PIE)', 'gnōsis / cognoscere (Greek/Latin)', 'Modern English'],
  },
  {
    pattern: /(path|pass|pati)/i,
    pieRoot: '*kwent(h)- (to suffer, feel, endure)',
    originLanguage: 'Ancient Greek / Latin',
    meaning: 'deep feeling, passion, or emotional resonance',
    cognates: ['empathy', 'pathos', 'passion', 'sympathy', 'telepathy'],
    chain: ['*kwent(h)- (PIE)', 'pathos (Ancient Greek)', 'Modern English'],
  },
  {
    pattern: /(spec|scop|vid|vis|opt)/i,
    pieRoot: '*spek- / *weid- (to observe, see)',
    originLanguage: 'Latin / Ancient Greek',
    meaning: 'vision, observation, or optical spectrum',
    cognates: ['spectrum', 'telescopic', 'vision', 'panopticon', 'introspect'],
    chain: ['*spek- (PIE)', 'specere / skopein (Latin/Greek)', 'Modern English'],
  },
  {
    pattern: /(vert|vers|trop)/i,
    pieRoot: '*wert- / *trep- (to turn, rotate, revolve)',
    originLanguage: 'Latin / Ancient Greek',
    meaning: 'turning, poetic verse line, or cosmic rotation',
    cognates: ['verse', 'universe', 'vortex', 'entropy', 'heliotrope'],
    chain: ['*wert- (PIE)', 'vertere (Latin)', 'versus (Old French/English)'],
  },
  {
    pattern: /(tion|sion|ment|ance|ence)$/i,
    pieRoot: '*dhe- / *sta- (action, state, condition)',
    originLanguage: 'Latin / Anglo-French',
    meaning: 'state of action, process, or abstract manifestation',
    cognates: ['creation', 'transmutation', 'cadence', 'resonance'],
    chain: ['Latin -tio / -antia', 'Old French', 'Middle English', 'Modern English'],
  },
];

/**
 * Loads user's saved Custom Canon words from localStorage
 */
export function getSavedCustomCanon(): WordEntry[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CANON_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves a WordEntry to the user's persistent Custom Canon in localStorage
 */
export function saveWordToCustomCanon(entry: WordEntry): WordEntry[] {
  const existing = getSavedCustomCanon();
  const filtered = existing.filter(w => w.id.toLowerCase() !== entry.id.toLowerCase());
  const enriched: WordEntry = {
    ...entry,
    tags: Array.from(new Set([...entry.tags, 'saved-canon', 'rare-word'])),
  };
  const updated = [enriched, ...filtered];
  try {
    localStorage.setItem(CUSTOM_CANON_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

/**
 * Removes a WordEntry from the user's Custom Canon
 */
export function removeWordFromCustomCanon(wordId: string): WordEntry[] {
  const existing = getSavedCustomCanon();
  const updated = existing.filter(w => w.id.toLowerCase() !== wordId.toLowerCase());
  try {
    localStorage.setItem(CUSTOM_CANON_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return updated;
}

/**
 * Checks if a word ID is already in the built-in Canon or Saved Canon
 */
export function isWordInCanon(wordId: string): boolean {
  const lower = wordId.toLowerCase();
  if (LEXICON_DATABASE.some(w => w.id.toLowerCase() === lower || w.word.toLowerCase() === lower)) {
    return true;
  }
  return getSavedCustomCanon().some(w => w.id.toLowerCase() === lower || w.word.toLowerCase() === lower);
}

/**
 * Infers stress pattern from an IPA string or syllable count
 */
function inferStressPattern(ipa: string, syllables: number): string {
  if (syllables <= 1) return '1';
  // Check if IPA has explicit syllable dots or stress marks
  const cleanIpa = ipa.replace(/^\/|\/$/g, '');
  if (cleanIpa.includes('.') || cleanIpa.includes('ˈ') || cleanIpa.includes('ˌ')) {
    const parts = cleanIpa.split('.');
    if (parts.length === syllables) {
      return parts.map(p => (p.includes('ˈ') || p.includes('ˌ') ? '1' : '0')).join('-');
    }
  }
  // Default alternating trochaic or iambic stress pattern
  const pattern: string[] = [];
  for (let i = 0; i < syllables; i++) {
    pattern.push(i === 0 ? '1' : i % 2 === 0 ? '1' : '0');
  }
  return pattern.join('-');
}

/**
 * Synthesizes an approximate IPA pronunciation when external IPA is unavailable
 */
function synthesizeFallbackIpa(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  const tail = getRhymeTail(clean);
  if (clean.length <= 4) {
    return `/${clean}/`;
  }
  return `/${clean.slice(0, Math.max(2, clean.length - tail.length))}.${tail}/`;
}

/**
 * Parses Datamuse POS tags into WordEntry 'pos' union type
 */
function parsePosTag(tags?: string[], defText?: string): WordEntry['pos'] {
  if (defText) {
    if (defText.startsWith('n\t')) return 'noun';
    if (defText.startsWith('v\t')) return 'verb';
    if (defText.startsWith('adj\t')) return 'adjective';
    if (defText.startsWith('adv\t')) return 'adverb';
  }
  if (tags) {
    if (tags.includes('n')) return 'noun';
    if (tags.includes('v')) return 'verb';
    if (tags.includes('adj')) return 'adjective';
    if (tags.includes('adv')) return 'adverb';
  }
  return 'noun';
}

/**
 * Builds an etymology object using dictionary origin text + morpheme analysis
 */
function synthesizeEtymology(word: string, dictOrigin?: string): WordEntry['etymology'] {
  const clean = word.toLowerCase();
  const matchedMorpheme = MORPHEME_ETYMOLOGY_TABLE.find(m => m.pattern.test(clean));

  if (dictOrigin) {
    return {
      pieRoot: matchedMorpheme?.pieRoot,
      originLanguage: matchedMorpheme?.originLanguage || 'Classical Latin / Germanic / Old English',
      century: 'Historical Lexicon',
      history: dictOrigin,
      cognates: matchedMorpheme?.cognates || [clean],
      evolutionChain: matchedMorpheme?.chain
        ? [...matchedMorpheme.chain.slice(0, -1), `${clean} (Modern English)`]
        : ['Classical / Historical Root', 'Middle English', `${clean} (Modern English)`],
    };
  }

  if (matchedMorpheme) {
    return {
      pieRoot: matchedMorpheme.pieRoot,
      originLanguage: matchedMorpheme.originLanguage,
      century: 'Classical / Modern Lexicon',
      history: `Derived through ${matchedMorpheme.originLanguage} roots signifying ${matchedMorpheme.meaning}. Preserved in the Universal Subspace Lexicon for lyrical and rhetorical precision.`,
      cognates: matchedMorpheme.cognates.filter(c => c.toLowerCase() !== clean),
      evolutionChain: [...matchedMorpheme.chain.slice(0, -1), `${clean} (Modern English)`],
    };
  }

  return {
    originLanguage: 'Indo-European / English Lexicon',
    century: 'Standard Unabridged Canon',
    history: `Cataloged in the Universal English & CMU Phonetic Lexicon. Analyzed via Starfleet Subspace Linguistic subroutines for syllabic cadence and rhyme resonance.`,
    cognates: [],
    evolutionChain: ['Proto-Germanic / Latinate Root', 'Middle English', `${clean} (Modern English)`],
  };
}

interface DatamuseWordItem {
  word: string;
  score?: number;
  numSyllables?: number;
  tags?: string[];
  defs?: string[];
}

/**
 * Counts total syllables across a single word or multi-word phrase/idiom
 */
function countPhraseSyllables(text: string): number {
  const tokens = text
    .trim()
    .split(/\s+/)
    .map(t => t.replace(/[^a-zA-Z]/g, ''))
    .filter(Boolean);
  if (tokens.length === 0) return 1;
  return tokens.reduce((sum, tk) => sum + (countSyllables(tk) || 1), 0);
}

/**
 * Extracts the final landing word of a phrase for end-rhyme matching
 */
function getLandingWord(text: string): string {
  const tokens = text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.replace(/[^a-z]/g, ''))
    .filter(Boolean);
  return tokens[tokens.length - 1] || text.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Converts a Datamuse item into a preliminary WordEntry for grid display
 * Supports both single words and multi-word idioms/sayings
 */
function datamuseItemToWordEntry(item: DatamuseWordItem): WordEntry {
  const cleanWord = item.word.toLowerCase().trim();
  const isPhrase = cleanWord.includes(' ');

  // Check if it already exists in our Curated Canon
  const existingCanon = LEXICON_DATABASE.find(
    w =>
      w.id.toLowerCase() === cleanWord ||
      w.word.toLowerCase() === cleanWord ||
      w.id.toLowerCase() === cleanWord.replace(/\s+/g, '-')
  );
  if (existingCanon) return existingCanon;

  // Check in-memory cache
  const cached = universalWordCache.get(cleanWord);
  if (cached) return cached;

  const syllables = item.numSyllables || countPhraseSyllables(cleanWord) || 1;
  const ipaTag = item.tags?.find(t => t.startsWith('ipa_pron:'));
  const rawIpa = ipaTag ? ipaTag.replace('ipa_pron:', '').trim() : '';
  const ipa = rawIpa ? `/${rawIpa}/` : synthesizeFallbackIpa(cleanWord);

  const rawDef = item.defs?.[0] || '';
  const pos = isPhrase ? 'interjection' : parsePosTag(item.tags, rawDef);
  const cleanDef = rawDef
    ? rawDef.replace(/^(n|v|adj|adv)\t/, '').replace(/^\(([^)]+)\)\s*/, '($1) ')
    : isPhrase
    ? `Idiomatic saying or proverbial expression ("${cleanWord}") with a ${syllables}-syllable cadence landing on "${getLandingWord(cleanWord)}". Click to inspect full meaning, origin, and rhymes.`
    : `Unabridged English ${pos} ("${cleanWord}") indexed in the CMU Phonetic & Subspace Lexicon. Click to inspect full rhymes and etymology.`;

  const formattedDef = cleanDef.charAt(0).toUpperCase() + cleanDef.slice(1) + (cleanDef.endsWith('.') ? '' : '.');
  const landingWord = getLandingWord(cleanWord);
  const tail = getRhymeTail(landingWord);
  const stressPattern = inferStressPattern(ipa, syllables);

  // Find quick local rhymes from LEXICON_DATABASE matching the landing word
  const localRhymes = LEXICON_DATABASE.filter(
    w => w.word.toLowerCase() !== landingWord && getRhymeTail(getLandingWord(w.word)) === tail
  ).map(w => w.word);

  const entry: WordEntry = {
    id: cleanWord.replace(/\s+/g, '-'),
    word: cleanWord,
    syllables,
    ipa,
    stressPattern,
    rhymeFamily: `-${tail}`,
    rhymeFamilyLabel: `-${tail} (${landingWord}${localRhymes.length ? ', ' + localRhymes.slice(0, 2).join(', ') : ''})`,
    pos,
    definition: formattedDef,
    etymology: synthesizeEtymology(cleanWord),
    perfectRhymes: localRhymes.slice(0, 8),
    slantRhymes: [],
    multisyllableRhymes: [],
    artRapSnippet: isPhrase
      ? `Flipping the saying "${cleanWord}" on the four-beat—${syllables}-syllable cadence landing clean on the -${tail} rhyme.`
      : `Calibrating "${cleanWord}" on the subspace mic—${syllables}-syllable ${pos} locked in the -${tail} cadence.`,
    tags: isPhrase
      ? ['universal-dictionary', 'idiom-proverb', `${syllables}-syllable`]
      : ['universal-dictionary', pos, `${syllables}-syllable`],
  };

  universalWordCache.set(cleanWord, entry);
  return entry;
}

/**
 * Searches the Universal English Dictionary & Idiom/Phrase Matrix (400,000+ words & sayings)
 */
export async function searchUniversalDictionary(query: string): Promise<WordEntry[]> {
  const clean = query.trim().toLowerCase().replace(/[^a-z\s'-]/g, '');
  if (!clean) return [];

  const cacheKey = `q:${clean}`;
  if (universalSearchCache.has(cacheKey)) {
    return universalSearchCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(clean)}*&md=sfpdr&ipa=1&max=24`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Datamuse query failed');
    const data: DatamuseWordItem[] = await res.json();

    const entries: WordEntry[] = [];
    const seen = new Set<string>();

    for (const item of data) {
      if (!item.word) continue;
      const wLower = item.word.toLowerCase();
      if (seen.has(wLower)) continue;
      seen.add(wLower);
      entries.push(datamuseItemToWordEntry(item));
    }

    // Always ensure the exact queried word or multi-word saying/idiom is synthesized at the top
    if (!seen.has(clean)) {
      const exactEntry = await enrichUniversalWordEntry(clean);
      entries.unshift(exactEntry);
    }

    universalSearchCache.set(cacheKey, entries);
    return entries;
  } catch {
    const fallback = datamuseItemToWordEntry({
      word: clean,
      numSyllables: countPhraseSyllables(clean),
    });
    return [fallback];
  }
}

/**
 * Browses Universal Dictionary words starting with a specific letter (A-Z)
 */
export async function browseUniversalByLetter(letter: string): Promise<WordEntry[]> {
  const cleanLetter = letter.trim().toLowerCase().slice(0, 1);
  if (!cleanLetter || !/[a-z]/.test(cleanLetter)) return [];

  const cacheKey = `letter:${cleanLetter}`;
  if (universalSearchCache.has(cacheKey)) {
    return universalSearchCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.datamuse.com/words?sp=${cleanLetter}????*&md=sfpdr&ipa=1&max=30`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Letter browse failed');
    const data: DatamuseWordItem[] = await res.json();

    const entries: WordEntry[] = [];
    const seen = new Set<string>();

    for (const item of data) {
      if (!item.word || item.word.includes(' ') || !item.defs?.length) continue;
      const wLower = item.word.toLowerCase();
      if (seen.has(wLower)) continue;
      seen.add(wLower);
      entries.push(datamuseItemToWordEntry(item));
    }

    universalSearchCache.set(cacheKey, entries);
    return entries;
  } catch {
    return [];
  }
}

/**
 * Strips HTML tags from Wiktionary REST API definition strings
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Deeply enriches any English word OR multi-word idiom/proverb/saying with full live
 * CMU Perfect Rhymes, Slant Rhymes, Multisyllabic Rhymes, Dictionary/Wiktionary definitions, and etymology!
 */
export async function enrichUniversalWordEntry(wordOrEntry: string | WordEntry): Promise<WordEntry> {
  const targetWord = (typeof wordOrEntry === 'string' ? wordOrEntry : wordOrEntry.word)
    .toLowerCase()
    .trim();
  const isPhrase = targetWord.includes(' ');
  const landingWord = getLandingWord(targetWord);

  // If it's a built-in Curated Canon word or idiom, return it as-is
  const canonMatch = LEXICON_DATABASE.find(
    w =>
      w.id.toLowerCase() === targetWord ||
      w.word.toLowerCase() === targetWord ||
      w.id.toLowerCase() === targetWord.replace(/\s+/g, '-')
  );
  if (canonMatch) return canonMatch;

  // Check if we already deeply enriched this word/phrase
  const existingCached = universalWordCache.get(targetWord);
  if (existingCached && existingCached.tags.includes('deep-enriched')) {
    return existingCached;
  }

  const baseEntry: WordEntry =
    typeof wordOrEntry === 'object'
      ? wordOrEntry
      : existingCached ||
        datamuseItemToWordEntry({
          word: targetWord,
          numSyllables: countPhraseSyllables(targetWord),
        });

  try {
    const wiktionarySlug = encodeURIComponent(targetWord.replace(/\s+/g, '_'));
    const [exactRes, rhyRes, slantRes, dictRes, wikiRes] = await Promise.allSettled([
      fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(targetWord)}&md=sfpdr&ipa=1&max=1`),
      fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(landingWord)}&md=s&max=28`),
      fetch(`https://api.datamuse.com/words?rel_nry=${encodeURIComponent(landingWord)}&md=s&max=16`),
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(targetWord)}`),
      fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${wiktionarySlug}`),
    ]);

    let syllables = baseEntry.syllables;
    let ipa = baseEntry.ipa;
    let pos = baseEntry.pos;
    let definition = baseEntry.definition;
    let dictOrigin: string | undefined;
    let dictExample: string | undefined;

    // 1. Parse Exact Datamuse metadata
    if (exactRes.status === 'fulfilled' && exactRes.value.ok) {
      const exactData: DatamuseWordItem[] = await exactRes.value.json();
      if (exactData[0]) {
        const d = exactData[0];
        if (d.numSyllables) syllables = d.numSyllables;
        const ipaTag = d.tags?.find(t => t.startsWith('ipa_pron:'));
        if (ipaTag) {
          ipa = `/${ipaTag.replace('ipa_pron:', '').trim()}/`;
        }
        if (d.defs?.[0]) {
          pos = isPhrase ? 'interjection' : parsePosTag(d.tags, d.defs[0]);
          const cleanD = d.defs[0].replace(/^(n|v|adj|adv)\t/, '');
          definition = cleanD.charAt(0).toUpperCase() + cleanD.slice(1) + (cleanD.endsWith('.') ? '' : '.');
        }
      }
    }

    // 2. Parse Free Dictionary API
    if (dictRes.status === 'fulfilled' && dictRes.value.ok) {
      const dictJson = await dictRes.value.json();
      if (Array.isArray(dictJson) && dictJson[0]) {
        const entry0 = dictJson[0];
        if (entry0.phonetic && (!ipa || ipa.includes(targetWord))) {
          ipa = entry0.phonetic;
        }
        if (entry0.origin) {
          dictOrigin = entry0.origin;
        }
        const firstMeaning = entry0.meanings?.[0];
        if (firstMeaning) {
          const p = firstMeaning.partOfSpeech?.toLowerCase();
          if (p === 'noun' || p === 'verb' || p === 'adjective' || p === 'adverb' || p === 'interjection') {
            pos = p;
          }
          const firstDef = firstMeaning.definitions?.[0];
          if (firstDef?.definition) {
            definition = firstDef.definition;
          }
          for (const m of entry0.meanings || []) {
            for (const defObj of m.definitions || []) {
              if (defObj.example) {
                dictExample = defObj.example;
                break;
              }
            }
            if (dictExample) break;
          }
        }
      }
    }

    // 3. Parse Wiktionary REST API (especially useful for multi-word idioms, sayings, and slang!)
    if (wikiRes.status === 'fulfilled' && wikiRes.value.ok) {
      const wikiJson = await wikiRes.value.json();
      const enEntries = wikiJson?.en;
      if (Array.isArray(enEntries) && enEntries.length > 0) {
        for (const section of enEntries) {
          const firstWikiDef = section.definitions?.[0]?.definition;
          if (firstWikiDef) {
            const stripped = stripHtml(firstWikiDef);
            if (stripped.length > 10) {
              definition = stripped;
              const wikiEx = section.definitions?.[0]?.examples?.[0];
              if (wikiEx && !dictExample) {
                dictExample = stripHtml(wikiEx);
              }
              break;
            }
          }
        }
      }
    }

    // 4. Parse Perfect & Multisyllable Rhymes for the landing word
    const perfectRhymes: string[] = [];
    const multisyllableRhymes: string[] = [];
    if (rhyRes.status === 'fulfilled' && rhyRes.value.ok) {
      const rhyData: DatamuseWordItem[] = await rhyRes.value.json();
      for (const r of rhyData) {
        if (!r.word || r.word.toLowerCase() === landingWord) continue;
        if ((r.numSyllables || 1) >= 3 || r.word.includes(' ')) {
          if (multisyllableRhymes.length < 10) multisyllableRhymes.push(r.word);
        }
        if (!r.word.includes(' ') && perfectRhymes.length < 14) {
          perfectRhymes.push(r.word);
        }
      }
    }

    // 5. Parse Slant / Near Rhymes for the landing word
    const slantRhymes: string[] = [];
    if (slantRes.status === 'fulfilled' && slantRes.value.ok) {
      const slantData: DatamuseWordItem[] = await slantRes.value.json();
      for (const s of slantData) {
        if (!s.word || s.word.toLowerCase() === landingWord || perfectRhymes.includes(s.word)) continue;
        if (slantRhymes.length < 12) slantRhymes.push(s.word);
      }
    }

    const tail = getRhymeTail(landingWord);
    if (perfectRhymes.length === 0) {
      LEXICON_DATABASE.forEach(w => {
        if (w.word.toLowerCase() !== landingWord && getRhymeTail(getLandingWord(w.word)) === tail) {
          if (perfectRhymes.length < 8) perfectRhymes.push(w.word);
        }
      });
    }

    const topRhyme = perfectRhymes[0] || slantRhymes[0] || 'flow';
    const artRapSnippet = dictExample
      ? dictExample
      : isPhrase
      ? `Wove the proverb "${targetWord}" into the bar, landing on "${landingWord}" to rhyme clean with "${topRhyme}".`
      : `Weaving ${targetWord} into the subspace frequency, rhyming clean with ${topRhyme} on the four-beat.`;

    const enriched: WordEntry = {
      ...baseEntry,
      syllables,
      ipa,
      stressPattern: inferStressPattern(ipa, syllables),
      rhymeFamily: `-${tail}`,
      rhymeFamilyLabel: `-${tail} (${[landingWord, ...perfectRhymes.slice(0, 2)].join(', ')})`,
      pos,
      definition,
      etymology: isPhrase
        ? {
            originLanguage: 'Idiomatic Proverb / Cultural Maxim',
            century: 'Oral & Literary Tradition',
            history:
              dictOrigin ||
              `Multi-word idiomatic expression ("${targetWord}") spanning ${syllables} syllables and terminating on the anchor word "${landingWord}" (-${tail} rhyme family). Used in lyricism for thematic resonance and double-entendre flips.`,
            cognates: [landingWord, ...perfectRhymes.slice(0, 3)],
            evolutionChain: ['Oral Maxim / Proverb', `"${targetWord}" (Lyrical Idiom)`],
          }
        : synthesizeEtymology(targetWord, dictOrigin),
      perfectRhymes: perfectRhymes.length > 0 ? perfectRhymes : ['flow', 'know', 'glow'],
      slantRhymes: slantRhymes.length > 0 ? slantRhymes : ['rhythm', 'prism', 'system'],
      multisyllableRhymes:
        multisyllableRhymes.length > 0
          ? multisyllableRhymes
          : [`subspace ${landingWord}`, `quantum ${topRhyme}`],
      artRapSnippet,
      tags: Array.from(
        new Set([
          ...baseEntry.tags,
          'universal-dictionary',
          'deep-enriched',
          ...(isPhrase ? ['idiom-proverb'] : []),
        ])
      ),
    };

    universalWordCache.set(targetWord, enriched);
    return enriched;
  } catch {
    return baseEntry;
  }
}

