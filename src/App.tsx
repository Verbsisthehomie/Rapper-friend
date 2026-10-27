/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, LcarsEra, WordEntry, SavedPhrase } from './types/lcars';
import { LcarsFrame } from './components/lcars/LcarsFrame';
import { LexiconSearch } from './components/lexicon/LexiconSearch';
import { RhymeFamiliesList } from './components/wordlists/RhymeFamiliesList';
import { BarAnalyzer } from './components/analyzer/BarAnalyzer';
import { Graph2DView } from './components/graph/Graph2DView';
import { Graph3DView } from './components/graph/Graph3DView';
import { FavoritesVault } from './components/vault/FavoritesVault';
import { WordDetailModal } from './components/lexicon/WordDetailModal';
import { MultiRhymeEngine } from './components/multis/MultiRhymeEngine';
import { PieRootExplorer } from './components/pieroot/PieRootExplorer';
import { HolodeckChamber } from './components/holodeck/HolodeckChamber';
import { DevicesCodex } from './components/devices/DevicesCodex';
import { SongAnatomyLab } from './components/anatomy/SongAnatomyLab';
import { QuickRefDevicesGallery } from './components/devices/QuickRefDevicesGallery';
import { KeyboardShortcutsModal } from './components/shortcuts/KeyboardShortcutsModal';
import { playLcarsChirp } from './utils/lcarsAudio';
import { LEXICON_DATABASE } from './data/lexiconData';
import { enrichUniversalWordEntry, getSavedCustomCanon } from './utils/universalDictionaryEngine';

const INITIAL_SAVED_PHRASES: SavedPhrase[] = [
  {
    id: 'phrase-init-1',
    phrase: `I drop the mic and ignite the light
Deep in the flight through the darkest night
Ancient wisdom carved in stone
The cyber soul upon the golden throne`,
    createdAt: Date.now() - 3600000,
    barCount: 4,
    syllables: 42,
    notes: 'VerBS art-rap flow cadence test. Double end-rhymes on night/flight/ignite with deep PIE roots.',
    tags: ['POCKET S+', 'Density 85%'],
    rhymeScheme: 'AABB',
    attachedRoots: [
      {
        word: 'night',
        pieRoot: '*nokwt- (night)',
        origin: 'Proto-Indo-European / Old English',
        definition: 'The period of darkness between sunset and sunrise; the unconscious expanse of deep space.',
      },
      {
        word: 'flight',
        pieRoot: '*pleu- (to flow, fly, swim)',
        origin: 'Proto-Germanic / Old English',
        definition: 'The action or process of flying through the air; an ascent of imagination or poetic escape.',
      },
      {
        word: 'ignite',
        pieRoot: '*egni- (fire)',
        origin: 'Latin',
        definition: 'To catch fire or cause to catch fire; spark a movement or intellectual flame.',
      },
    ],
  },
  {
    id: 'phrase-init-2',
    phrase: `Slick black cat stepping through the quantum format
Sub-bass fat shaking up the habitat`,
    createdAt: Date.now() - 7200000,
    barCount: 2,
    syllables: 24,
    notes: 'Bass-heavy pocket rhyming -at family with multisyllabic endings.',
    tags: ['POCKET A', 'Density 80%'],
    rhymeScheme: 'AA',
    attachedRoots: [
      {
        word: 'cat',
        origin: 'Late Latin / Old English',
        definition: 'A small domesticated carnivorous mammal; in hip-hop jazz vernacular, a person, player, or musician with style.',
      },
      {
        word: 'fat',
        pieRoot: '*peye- (to be fat, swell)',
        origin: 'Old English / Proto-Germanic',
        definition: 'Having a large amount of excess flesh; in hip-hop (also spelled PHAT), rich, heavy, prosperous, full of bass or style.',
      },
      {
        word: 'acrobat',
        origin: 'Ancient Greek / French',
        definition: 'An entertainer who performs gymnastic feats; a verbal master of agile rhyme acrobatics.',
      },
    ],
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('analyzer');
  const [currentEra, setCurrentEra] = useState<LcarsEra>('tng');
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [analyzerText, setAnalyzerText] = useState<string>('');
  const [isDevicesQuickRefOpen, setIsDevicesQuickRefOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.key === 'Escape') {
        setSelectedWord(null);
        setIsDevicesQuickRefOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setIsDevicesQuickRefOpen((prev) => !prev);
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-verbs-avatar-deck'));
        playLcarsChirp('input');
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        // Pick random rare word from database
        const rareWords = LEXICON_DATABASE.filter((w) => w.tags.includes('rare-word'));
        const pool = rareWords.length > 0 ? rareWords : LEXICON_DATABASE;
        const randomWord = pool[Math.floor(Math.random() * pool.length)];
        setSelectedWord(randomWord);
        playLcarsChirp('warp');
        return;
      }

      // Quick Module Navigation
      if (e.key === '1') {
        setCurrentTab('analyzer');
        playLcarsChirp('tap');
      } else if (e.key === '2') {
        setCurrentTab('song-anatomy');
        playLcarsChirp('tap');
      } else if (e.key === '3') {
        setCurrentTab('multis');
        playLcarsChirp('tap');
      } else if (e.key === '4') {
        setCurrentTab('pieroot');
        playLcarsChirp('tap');
      } else if (e.key === '5') {
        setCurrentTab('holodeck');
        playLcarsChirp('tap');
      } else if (e.key === '6') {
        setCurrentTab('devices');
        playLcarsChirp('tap');
      } else if (e.key === '7') {
        setCurrentTab('lexicon');
        playLcarsChirp('tap');
      } else if (e.key === '8') {
        setCurrentTab('wordlists');
        playLcarsChirp('tap');
      } else if (e.key === '9') {
        setCurrentTab('graph2d');
        playLcarsChirp('tap');
      } else if (e.key === '0') {
        setCurrentTab('graph3d');
        playLcarsChirp('tap');
      } else if (e.key === 'v' || e.key === 'V') {
        setCurrentTab('vault');
        playLcarsChirp('tap');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persistent Saved Phrases in localStorage
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>(() => {
    try {
      const stored = localStorage.getItem('rapper_friend_saved_phrases');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read saved phrases from storage', e);
    }
    return INITIAL_SAVED_PHRASES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('rapper_friend_saved_phrases', JSON.stringify(savedPhrases));
    } catch (e) {
      console.warn('Could not persist phrases', e);
    }
  }, [savedPhrases]);

  const handleSendToAnalyzer = (text: string) => {
    setAnalyzerText((prev) => (prev ? `${prev}\n${text}` : text));
    setCurrentTab('analyzer');
  };

  const handleSaveToVault = (phrase: SavedPhrase) => {
    setSavedPhrases((prev) => [phrase, ...prev]);
  };

  const handleDeletePhrase = (id: string) => {
    setSavedPhrases((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveWordToVault = (word: WordEntry) => {
    const newPhrase: SavedPhrase = {
      id: `word-phrase-${Date.now()}`,
      phrase: word.artRapSnippet || `${word.word.toUpperCase()} - ${word.definition}`,
      createdAt: Date.now(),
      barCount: 1,
      syllables: word.syllables,
      notes: `Saved directly from Lexicon node for "${word.word}".`,
      tags: [word.rhymeFamilyLabel, word.etymology.originLanguage],
      attachedRoots: [
        {
          word: word.word,
          pieRoot: word.etymology.pieRoot,
          origin: word.etymology.originLanguage,
          definition: word.definition,
        },
      ],
    };
    handleSaveToVault(newPhrase);
    setSelectedWord(null);
  };

  const handleSelectWordById = async (wordId: string) => {
    const clean = wordId.trim().toLowerCase();
    const match =
      LEXICON_DATABASE.find((w) => w.id.toLowerCase() === clean || w.word.toLowerCase() === clean) ||
      getSavedCustomCanon().find((w) => w.id.toLowerCase() === clean || w.word.toLowerCase() === clean);
    if (match) {
      setSelectedWord(match);
      return;
    }
    // Synthesize & enrich any English word from the Universal Dictionary on the fly
    const universalNode = await enrichUniversalWordEntry(clean);
    setSelectedWord(universalNode);
  };

  useEffect(() => {
    if (
      selectedWord &&
      selectedWord.tags.includes('universal-dictionary') &&
      !selectedWord.tags.includes('deep-enriched')
    ) {
      let active = true;
      enrichUniversalWordEntry(selectedWord).then((enriched) => {
        if (active) setSelectedWord(enriched);
      });
      return () => {
        active = false;
      };
    }
  }, [selectedWord]);

  return (
    <LcarsFrame
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      currentEra={currentEra}
      onSelectEra={setCurrentEra}
      onOpenDevicesGallery={() => setIsDevicesQuickRefOpen(true)}
      onOpenShortcuts={() => setIsShortcutsOpen(true)}
    >
      {/* Tab: Hyper-detailed Bar Analyzer */}
      {currentTab === 'analyzer' && (
        <BarAnalyzer
          currentEra={currentEra}
          initialText={analyzerText}
          onSaveToVault={handleSaveToVault}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Tab: Song Rhyme Anatomy & Craft Deconstruction Lab */}
      {currentTab === 'song-anatomy' && (
        <SongAnatomyLab
          currentEra={currentEra}
          onSendToAnalyzer={handleSendToAnalyzer}
          onSaveToVault={handleSaveToVault}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Tab: Multi-Rhyme & Slant Rhyme Subspace Engine */}
      {currentTab === 'multis' && (
        <MultiRhymeEngine
          currentEra={currentEra}
          onSendToAnalyzer={handleSendToAnalyzer}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Tab: PIE Roots & Linguistic Ancestry Subspace Map */}
      {currentTab === 'pieroot' && (
        <PieRootExplorer
          currentEra={currentEra}
          onSelectWord={setSelectedWord}
          onSendToAnalyzer={handleSendToAnalyzer}
        />
      )}

      {/* Tab: Holodeck Rhyme Challenge & Cypher Drill Simulator */}
      {currentTab === 'holodeck' && (
        <HolodeckChamber
          currentEra={currentEra}
          onSaveToVault={handleSaveToVault}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Tab: Rhetorical & Art-Rap Literary Devices Codex */}
      {currentTab === 'devices' && (
        <DevicesCodex
          currentEra={currentEra}
          onSendToAnalyzer={handleSendToAnalyzer}
        />
      )}

      {/* Tab: Lexicon Matrix */}
      {currentTab === 'lexicon' && (
        <LexiconSearch
          currentEra={currentEra}
          onSelectWord={setSelectedWord}
          onSendToAnalyzer={handleSendToAnalyzer}
        />
      )}

      {/* Tab: Simple Word Lists / Rhyme Families */}
      {currentTab === 'wordlists' && (
        <RhymeFamiliesList
          currentEra={currentEra}
          onSelectWord={setSelectedWord}
          onSendToAnalyzer={handleSendToAnalyzer}
        />
      )}

      {/* Tab: 2D Astrometric Graph */}
      {currentTab === 'graph2d' && (
        <Graph2DView
          currentEra={currentEra}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Tab: 3D Astrometric Galaxy */}
      {currentTab === 'graph3d' && (
        <Graph3DView
          currentEra={currentEra}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Tab: Favorites Vault */}
      {currentTab === 'vault' && (
        <FavoritesVault
          currentEra={currentEra}
          savedPhrases={savedPhrases}
          onDeletePhrase={handleDeletePhrase}
          onSendToAnalyzer={handleSendToAnalyzer}
          onSelectWord={setSelectedWord}
        />
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          currentEra={currentEra}
          onClose={() => setSelectedWord(null)}
          onSendToAnalyzer={handleSendToAnalyzer}
          onSaveToVault={handleSaveWordToVault}
          onSelectWord={handleSelectWordById}
        />
      )}

      {/* Quick Reference Rhetorical Devices Gallery Modal */}
      <QuickRefDevicesGallery
        currentEra={currentEra}
        isOpen={isDevicesQuickRefOpen}
        onClose={() => setIsDevicesQuickRefOpen(false)}
        onSendToAnalyzer={handleSendToAnalyzer}
      />

      {/* Keyboard Shortcuts & Mobile Guide Modal */}
      <KeyboardShortcutsModal
        currentEra={currentEra}
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </LcarsFrame>
  );
}
