import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ActiveTab, LcarsEra } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BarChart2,
  Disc,
  Radio,
  BookOpen,
  GitFork,
  Orbit,
  Globe2,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Play,
  RotateCcw,
  Minimize2,
  Maximize2,
  HelpCircle,
  Volume2,
  Terminal,
  Zap,
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  currentEra: LcarsEra;
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectEra: (era: LcarsEra) => void;
  onSendToAnalyzer?: (text: string) => void;
}

interface TourStation {
  id: string;
  stationNumber: number;
  totalStations: number;
  subsystemCode: string;
  targetTab?: ActiveTab;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: {
    label: string;
    detail: string;
    icon: React.ReactNode;
  }[];
  quickAction?: {
    label: string;
    icon: React.ReactNode;
    action: () => void;
  };
  sampleTip: string;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  currentEra,
  isOpen,
  onClose,
  onSelectTab,
  onSelectEra,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const STATIONS: TourStation[] = [
    {
      id: 'cockpit-welcome',
      stationNumber: 1,
      totalStations: 9,
      subsystemCode: 'SYS-001',
      badge: 'STARFLEET CADET ONBOARDING',
      title: 'Welcome to Rapper Friend & The LCARS Cockpit',
      subtitle: 'Starfleet Ergonomics • Art-Rap Epistemology • 6 Historical Eras',
      description:
        'Rapper Friend is a subspace acoustic operating system inspired by the iconic Star Trek LCARS-26 interface and built for serious lyricists, MCs, and wordsmiths. Created by VerBS under the ethos "stay beamed up", it unites literary Golden Era hip-hop craft, 12 regional rhyme disciplines, a 400,000+ word dictionary with Indo-European roots, and an integrated Web Audio beat studio.',
      highlights: [
        {
          label: '6 Canon Starfleet Eras',
          detail: 'Switch instantly between TNG 2360s, Voyager 2370s, Nemesis Blue, Lower Decks, LD PADD, and Picard 2401 palettes.',
          icon: <Terminal className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Authentic Subspace Chirps',
          detail: 'Tactile sound effects from thelcars.com with procedural Web Audio synthesizer fallbacks and full mute control.',
          icon: <Volume2 className="w-4 h-4 text-cyan-400" />,
        },
        {
          label: 'Zero-Telemetry Privacy',
          detail: 'All lyrics, custom beats, and phrase collections are stored locally on your device in IndexedDB & LocalStorage.',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        },
      ],
      quickAction: {
        label: 'Switch to Picard 2401 Era',
        icon: <Zap className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('warp');
          onSelectEra('picard');
          showFeedback('Activated Picard 2401 LCARS Theme');
        },
      },
      sampleTip: 'Pro Tip: Tap any of the era buttons in the top header or press "M" to toggle sound effects anytime.',
    },
    {
      id: 'bar-analyzer',
      stationNumber: 2,
      totalStations: 9,
      subsystemCode: '01-919',
      targetTab: 'analyzer',
      badge: 'HYPER-DETAIL BARS ANALYZER',
      title: 'Real-Time Phonemic Compiler & Meter Telemetry',
      subtitle: 'Live Syllable Counting • Rhyme Density (0–100%) • Literary Device Scanner',
      description:
        'The Bar Analyzer is your high-precision lyrical workstation. As you type or paste bars, an AST compiler evaluates your syllables, computes average pace per bar, calculates a real-time Rhyme Density Score, evaluates your cadence pocket (S+ to C), and automatically scans for 15+ literary devices.',
      highlights: [
        {
          label: 'Real-Time Syllables & Meter Pattern',
          detail: 'Monitors exact metric feet per bar (e.g. 10–14 syllables for 4/4 equilibrium) with stressed/unstressed maps.',
          icon: <BarChart2 className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Rhyme Density & Complexity Scores',
          detail: 'Tracks the exact percentage of rhyming syllables across the stanza with visual progress gauges.',
          icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        },
        {
          label: 'Automated Literary Device Scanner',
          detail: 'Detects Alliteration, Assonance, Consonance, Chiasmus, Anaphora, Epistrophe, and Polysyllabic Chains in real time.',
          icon: <Layers className="w-4 h-4 text-cyan-400" />,
        },
      ],
      quickAction: {
        label: 'Inject VerBS Art-Rap Sample Bar',
        icon: <Play className="w-3.5 h-3.5 fill-current" />,
        action: () => {
          playLcarsChirp('warp');
          onSelectTab('analyzer');
          if (onSendToAnalyzer) {
            onSendToAnalyzer(
              `I drop the mic and ignite the light\nDeep in the flight through the darkest night\nAncient wisdom carved in stone\nThe cyber soul upon the golden throne`
            );
          }
          showFeedback('Loaded 4-Bar VerBS Cadence into Analyzer');
        },
      },
      sampleTip: 'Try typing lyrics into the notebook or load one of the built-in presets to watch the gauges recalculate live.',
    },
    {
      id: 'instrumental-beat-deck',
      stationNumber: 3,
      totalStations: 9,
      subsystemCode: 'BEAT-DECK',
      targetTab: 'analyzer',
      badge: 'MULTI-STYLE BEAT DECK & FLOW STUDIO',
      title: '12 Procedural Instrumentals & Custom Beat Uploader',
      subtitle: 'Zero-Latency Web Audio • Stem Mixer • Flow Beat Maker • Wheel-Up Reload',
      description:
        'Practicing cadence requires real music. Built right into the Bar Analyzer is a multi-style Web Audio procedural synthesizer generating 12 authentic regional beat styles with live BPM control, MPC swing, stem mutes, and an IndexedDB uploader for your own MP3/WAV tracks.',
      highlights: [
        {
          label: '12 Authentic Beat Grooves',
          detail: 'NY Boom-Bap (90 BPM), 140 BPM UK Grime, Sliding 808 UK Drill, Memphis Triplets, Texas 68 BPM Chopped Slab, G-Funk, Midwest Chopper, and Afro-Amapiano.',
          icon: <Disc className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Interactive 16-Step Flow Sequencer',
          detail: 'Click cells to program your own custom Kick, Snare, and 3x Triplet Hi-Hat rolls with 0% to 35% MPC swing.',
          icon: <Layers className="w-4 h-4 text-cyan-400" />,
        },
        {
          label: 'Stem Mixer & Reload Siren',
          detail: 'Mute/solo Drums, 808 Sub-Bass, or Chords independently, or trigger the Pirate Radio "Wheel-Up Reload!" siren.',
          icon: <RotateCcw className="w-4 h-4 text-purple-400" />,
        },
      ],
      quickAction: {
        label: 'Audition 140 BPM Grime Riddim',
        icon: <Disc className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('warp');
          onSelectTab('analyzer');
          window.dispatchEvent(
            new CustomEvent('audition-rapper-friend-beat', { detail: { presetId: 'uk-grime-140' } })
          );
          showFeedback('Auditioning UK Grime 140 BPM Eskibeat');
        },
      },
      sampleTip: 'Switch to the "UPLOAD BEATS" tab in the Beat Deck to load your own MP3s with 0.75x (Screwed) to 1.15x speed adjustment.',
    },
    {
      id: 'rhyme-evolutions',
      stationNumber: 4,
      totalStations: 9,
      subsystemCode: '07-140',
      targetTab: 'rhyme-evolutions',
      badge: 'RHYME EVOLUTIONS LAB',
      title: 'Under the Hood: 12 Divergent Rhyme Systems',
      subtitle: 'Acoustic Crucibles • 16-Step Subdivision Grids • IPA Phonetic Engine',
      description:
        'An encyclopedic masterclass exploring why different regions formulated bars differently. Compares 6 UK, African & Caribbean systems (Grime, Road Rap, 2-Step Garage, Britcore, West African Polyrhythm, Dancehall) against 6 American conventions (NY Golden Era, Abstract Drumless, Memphis Triplets, G-Funk, Midwest Choppers, Detroit Off-Beat).',
      highlights: [
        {
          label: 'Acoustic Crucibles & Bar Geometry',
          detail: 'Learn why 8-bar pirate radio reload rallies at 140 BPM differ from 90 BPM headphone boom-bap and car-trunk 808s.',
          icon: <Radio className="w-4 h-4 text-emerald-400" />,
        },
        {
          label: 'Subdivision Telemetry Grids',
          detail: 'Visualizes exact 16th-note syllable locks against kicks, snares, caesura breath pockets, and reload punchlines.',
          icon: <BarChart2 className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'IPA Phonetic Vowel & Consonant Shifts',
          detail: 'Shows how London MLE non-rhoticity, T-glottalization, Southern monophthong drawl, and West African tonal contours unlock new rhymes.',
          icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        },
      ],
      quickAction: {
        label: 'Inspect 12 Disciplines in Evolutions Lab',
        icon: <Compass className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('tap');
          onSelectTab('rhyme-evolutions');
          showFeedback('Switched to Rhyme Evolutions Lab (07-140)');
        },
      },
      sampleTip: 'Every discipline features a "TEST THIS FLOW IN BAR ANALYZER" button that transfers its canonical 8-bar exemplar directly into your notebook.',
    },
    {
      id: 'universal-lexicon',
      stationNumber: 5,
      totalStations: 9,
      subsystemCode: '07-447',
      targetTab: 'lexicon',
      badge: 'UNIVERSAL SUBSPACE LEXICON',
      title: '400,000+ Words, Curated Canon & Idiom Matrix',
      subtitle: '301 Hand-Crafted Nodes • Sayings & Proverbs • AAVE & UK Slang • PIE Roots',
      description:
        'The Lexicon contains a hand-curated 301-entry Canon spanning Occult Arcana (grimoire, abraum, hierophant), Poetics (crepuscule, psithurism), Romance, Obscure Curiosities (palimpsest, syzygy), Astrometrics, Cypher Rhetoric, Idioms & Proverbs ("it is what it is", "teach a man to fish"), and Regional Slang (mandem, duppy, wahala, japa), backed by a 400,000+ word dictionary.',
      highlights: [
        {
          label: '301 Curated Lyrical Nodes',
          detail: 'Every word features exact IPA transcriptions, syllable counts, stress patterns, rhyme families, and art-rap sample bars.',
          icon: <BookOpen className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Multi-Word Idiom & Proverb Engine',
          detail: 'Search entire multi-word phrases and aphorisms to deconstruct their cadence, origins, and philosophical definitions.',
          icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        },
        {
          label: 'Custom Canon Pinning',
          detail: 'Discover any word in the 400,000-word universe and pin it into your personal offline canon with 1 click.',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        },
      ],
      quickAction: {
        label: 'Open Lexicon & Search Idioms',
        icon: <BookOpen className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('tap');
          onSelectTab('lexicon');
          showFeedback('Switched to Universal Lexicon (07-447)');
        },
      },
      sampleTip: 'Press "R" on your keyboard at any time to draw a random rare word from the database for instant inspiration.',
    },
    {
      id: 'multisyllabic-engine',
      stationNumber: 6,
      totalStations: 9,
      subsystemCode: '03-108',
      targetTab: 'multis',
      badge: 'MULTI-RHYME & SLANT ENGINE',
      title: 'Compound Vowel Chords & Mosaic Rhyme Solver',
      subtitle: '3-to-6 Syllable Vowel Sequences • Word-Boundary Dissolution • Slant Matches',
      description:
        'In Golden Era and underground art-rap (Rakim, Kool G Rap, Nas, MF DOOM, Big Pun), MCs rhyme entire multi-word vowel sequences rather than single end-syllables. The Multi-Rhyme Engine extracts vowel nuclei chords and pairs them across mosaic word boundaries.',
      highlights: [
        {
          label: 'Vowel Chord Harmonic Matching',
          detail: 'Matches vowel sequences regardless of consonants (e.g. "metaphorical symphony" ↔ "categorical infamy").',
          icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        },
        {
          label: 'Mosaic Word Boundary Solver',
          detail: 'Pairs a single 4-syllable word against 3 everyday street words ("incunabulum" ↔ "in cue nab you lum").',
          icon: <Layers className="w-4 h-4 text-cyan-400" />,
        },
        {
          label: 'Slant & Assonance Tolerance',
          detail: 'Adjust vowel tolerance sliders to explore tighter compound rhymes or broader conversational slant chords.',
          icon: <BarChart2 className="w-4 h-4 text-amber-400" />,
        },
      ],
      quickAction: {
        label: 'Explore Multi-Rhyme Engine',
        icon: <Sparkles className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('tap');
          onSelectTab('multis');
          showFeedback('Switched to Multi-Rhyme Engine (03-108)');
        },
      },
      sampleTip: 'Type any multi-word phrase into the input to generate matching 3-to-5 syllable vowel chord pairings.',
    },
    {
      id: 'pie-root-ancestry',
      stationNumber: 7,
      totalStations: 9,
      subsystemCode: '04-360',
      targetTab: 'pieroot',
      badge: 'PIE ROOT ANCESTRY & 3D ASTROMETRICS',
      title: '6,000-Year Etymology & 3D Semantic Galaxy',
      subtitle: 'Proto-Indo-European Roots • Deep Cognates • Interactive Three.js WebGL',
      description:
        'Words carry historical power. The PIE Root Explorer traces modern street terms, poetic adjectives, and astronomical nouns back 6,000 years to ancient Proto-Indo-European roots (*nokwt-, *bhel-, *leuk-), while the 3D Super-Galaxy lets you orbit through lexical constellations in WebGL.',
      highlights: [
        {
          label: 'Proto-Indo-European Radix Tree',
          detail: 'See how a single ancient root branched into Latin, Germanic, Greek, and modern hip-hop vernacular.',
          icon: <GitFork className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Deep Cognate Lyrical Hooks',
          detail: 'Discover surprising cognate pairs (words sharing the same root) to construct double-meaning punchlines.',
          icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
        },
        {
          label: '3D WebGL Force Constellation',
          detail: 'Explore rhyme families rendered as glowing nodes in 3D subspace with full orbit, pan, and raycasting controls.',
          icon: <Globe2 className="w-4 h-4 text-purple-400" />,
        },
      ],
      quickAction: {
        label: 'Open PIE Root Explorer',
        icon: <GitFork className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('tap');
          onSelectTab('pieroot');
          showFeedback('Switched to PIE Root Explorer (04-360)');
        },
      },
      sampleTip: 'Check out the 2D and 3D Astrometric tabs (hotkeys 9 & 0) to visualize lexical relationships in force-directed space.',
    },
    {
      id: 'holodeck-vault',
      stationNumber: 8,
      totalStations: 9,
      subsystemCode: '05-742',
      targetTab: 'holodeck',
      badge: 'HOLODECK CYPHER & FAVORITES VAULT',
      title: 'Freestyle Drills, Rhetorical Devices & Root Vault',
      subtitle: 'Timed Cypher Challenges • Devices Codex • Offline Root Definition Archiving',
      description:
        'Sharpen your spontaneous delivery in the Holodeck Cypher with timed word-prompt drills across four difficulty ranks (Cadet to Fleet Captain). Study 20+ rhetorical devices with drill templates in the Devices Codex, and archive your best bars in the Favorites Vault alongside attached root definitions.',
      highlights: [
        {
          label: 'Holodeck Cypher Drills',
          detail: 'Timed freestyle simulations with target rhyme schemes, syllable target constraints, and target PIE roots.',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        },
        {
          label: 'Rhetorical Devices Codex (06-615)',
          detail: 'Master Chiasmus, Polyptoton, Anaphora, and Epistrophe with fill-in-the-blank templates and iconic hip-hop examples.',
          icon: <Layers className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Favorites Vault with Root Attacher',
          detail: 'Save written bars directly into your offline vault alongside the full etymological definitions of every word used.',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        },
      ],
      quickAction: {
        label: 'Launch Holodeck Cypher',
        icon: <ShieldAlert className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('tap');
          onSelectTab('holodeck');
          showFeedback('Switched to Holodeck Cypher (05-742)');
        },
      },
      sampleTip: 'Press "D" anywhere in the app to open the quick-reference Rhetorical Devices overlay without leaving your notebook.',
    },
    {
      id: 'mission-ready',
      stationNumber: 9,
      totalStations: 9,
      subsystemCode: 'WARP-CLEAR',
      badge: 'WARP FACTOR ENGAGED',
      title: 'You Are Mission Ready // Stay Beamed Up',
      subtitle: 'Starfleet Command Summary • Hotkeys • PDF Export Archives',
      description:
        'You now have full command of the Rapper Friend subspace array. Whether writing dense Golden Era boom-bap, rapid 140 BPM UK Grime reload rallies, Memphis 12/8 triplet flows, or exploring ancient Indo-European etymology, the ship is ready for your voice.',
      highlights: [
        {
          label: 'Number Keys 1 to 0 for Fast Tab Navigation',
          detail: 'Press 1 for Analyzer, 2 for Song Anatomy, 3 for Multis, 4 for PIE Root, 5 for Holodeck, 6 for Devices, 7 for Lexicon, 8 for Wordlists, 9 for 2D Graph, 0 for 3D Graph, and V for Vault.',
          icon: <Terminal className="w-4 h-4 text-amber-400" />,
        },
        {
          label: 'Press ? for Complete Keyboard Shortcuts',
          detail: 'Press ? anytime to open the full Starfleet hotkey and mobile gesture manual.',
          icon: <HelpCircle className="w-4 h-4 text-cyan-400" />,
        },
        {
          label: 'Export Pitch Deck & Tech Specs PDFs',
          detail: 'Click "DOCS / PDFS" in the top header to review or export formatted 5-page PDFs for presentation.',
          icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        },
      ],
      quickAction: {
        label: 'Engage Cockpit & Complete Tour',
        icon: <Zap className="w-3.5 h-3.5" />,
        action: () => {
          playLcarsChirp('warp');
          handleFinishTour();
        },
      },
      sampleTip: '"you know a nigga love rapping and you knooooooow a nigga be a star trek fan since I was 6 years old..." — VerBS',
    },
  ];

  const currentStation = STATIONS[currentStepIndex];

  // Mark demo as completed in LocalStorage
  const handleFinishTour = () => {
    try {
      localStorage.setItem('rapper_friend_demo_tour_completed', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleNext = () => {
    playLcarsChirp('tap');
    if (currentStepIndex < STATIONS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStation = STATIONS[nextIdx];
      if (nextStation.targetTab) {
        onSelectTab(nextStation.targetTab);
      }
    } else {
      handleFinishTour();
    }
  };

  const handlePrev = () => {
    playLcarsChirp('tap');
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const prevStation = STATIONS[prevIdx];
      if (prevStation.targetTab) {
        onSelectTab(prevStation.targetTab);
      }
    }
  };

  const handleJumpToStation = (idx: number) => {
    playLcarsChirp('tap');
    setCurrentStepIndex(idx);
    const target = STATIONS[idx];
    if (target.targetTab) {
      onSelectTab(target.targetTab);
    }
  };

  // Keyboard navigation for demo tour
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  // Render Mini Floating PADD Mode (Allows user to see the tour while interacting with the app)
  if (isMinimized) {
    return createPortal(
      <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border-2 p-3.5 bg-neutral-950/95 shadow-2xl backdrop-blur-md font-lcars text-white space-y-2 animate-in slide-in-from-bottom duration-200"
        style={{ borderColor: theme.primary }}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-mono-tech font-bold uppercase text-amber-300">
              LCARS DEMO // STATION {currentStation.stationNumber}/{currentStation.totalStations}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setIsMinimized(false);
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
              title="Expand Walkthrough PADD"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playLcarsChirp('tap');
                onClose();
              }}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-red-400"
              title="Close Walkthrough"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase text-white truncate">
            {currentStation.title}
          </h4>
          <p className="text-[11px] text-slate-300 font-sans line-clamp-2 mt-0.5">
            {currentStation.description}
          </p>
        </div>

        {/* Quick Action in Mini Mode */}
        {currentStation.quickAction && (
          <button
            onClick={() => {
              if (currentStation.quickAction) {
                currentStation.quickAction.action();
              }
            }}
            className="w-full py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            {currentStation.quickAction.icon}
            {currentStation.quickAction.label}
          </button>
        )}

        {/* Mini Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs font-mono-tech">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 font-bold uppercase text-[10px] cursor-pointer"
          >
            ← PREV
          </button>
          <div className="flex gap-1">
            {STATIONS.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === currentStepIndex ? 'bg-amber-400 scale-125' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-2.5 py-1 rounded text-black font-bold uppercase text-[10px] cursor-pointer"
            style={{ backgroundColor: theme.primary }}
          >
            {currentStepIndex === STATIONS.length - 1 ? 'FINISH ✓' : 'NEXT →'}
          </button>
        </div>
      </div>,
      document.body
    );
  }

  // Full Expanded Starfleet Briefing PADD Modal
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto font-lcars animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-950 border-2 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ borderColor: theme.primary }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top LCARS Header Banner */}
        <div
          className="px-5 py-3.5 flex items-center justify-between text-black font-bold tracking-widest text-sm sm:text-base uppercase"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
            <span>STARFLEET COMMAND DEMO WALKTHROUGH // PROTOCOL VerBS-001</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setIsMinimized(true);
              }}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-black transition-colors cursor-pointer"
              title="Minimize to Floating PADD (Explore while browsing)"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playLcarsChirp('tap');
                onClose();
              }}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-black transition-colors cursor-pointer"
              title="Exit Walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Status Bar with Feedback Notification */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black text-amber-400 font-bold uppercase">
              {currentStation.subsystemCode}
            </span>
            <span className="text-slate-300 uppercase hidden sm:inline">
              STATION {currentStation.stationNumber} OF {currentStation.totalStations}:
            </span>
            <span className="text-amber-300 font-bold uppercase truncate max-w-[200px] sm:max-w-md">
              {currentStation.badge}
            </span>
          </div>

          {actionFeedback && (
            <span className="text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {actionFeedback}
            </span>
          )}
        </div>

        {/* Modal Main Content: 2-Column LCARS Layout */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Left Column: Station Step Rail */}
          <div className="w-full md:w-64 bg-slate-950/70 p-4 flex flex-col gap-1.5 shrink-0 overflow-y-auto max-h-48 md:max-h-none">
            <div className="text-[10px] font-mono-tech uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
              <span>SYSTEM FLIGHT PLAN:</span>
              <span className="text-amber-400">{Math.round(((currentStepIndex + 1) / STATIONS.length) * 100)}%</span>
            </div>

            {STATIONS.map((st, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => handleJumpToStation(idx)}
                  className={`px-3 py-2 rounded-xl text-left font-mono-tech transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-amber-400 text-black font-extrabold shadow-md scale-[1.02]'
                      : isPast
                      ? 'bg-slate-900/80 text-emerald-300 hover:bg-slate-900'
                      : 'bg-slate-900/40 text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] opacity-75 font-bold">
                      0{st.stationNumber}
                    </span>
                    <span className="truncate uppercase text-[11px]">
                      {st.badge.split(' ')[0]}
                    </span>
                  </div>
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-black shrink-0 animate-ping" />
                  ) : (
                    <span className="text-[10px] text-slate-600">·</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Briefing & Live Action Panel */}
          <div className="flex-1 p-5 sm:p-6 space-y-5 bg-black/60 overflow-y-auto">
            {/* Station Title Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-800/60 uppercase font-bold">
                  {currentStation.badge}
                </span>
                <span className="text-xs font-mono-tech text-slate-400">
                  {currentStation.subsystemCode}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
                {currentStation.title}
              </h3>
              <div className="text-xs font-mono-tech text-amber-400">
                {currentStation.subtitle}
              </div>
            </div>

            {/* Description Text */}
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {currentStation.description}
            </p>

            {/* 3 Core Highlights Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentStation.highlights.map((hl, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-black border border-slate-800 shrink-0 mt-0.5">
                    {hl.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-white font-mono-tech">
                      {hl.label}
                    </div>
                    <div className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
                      {hl.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Interactive Action Callout */}
            {currentStation.quickAction && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono-tech text-amber-400 uppercase font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    LIVE INTERACTIVE DEMO ACTION:
                  </div>
                  <div className="text-xs text-amber-200 font-sans">
                    Execute this action to experience the live subsystem right now.
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (currentStation.quickAction) {
                      currentStation.quickAction.action();
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
                >
                  {currentStation.quickAction.icon}
                  {currentStation.quickAction.label}
                </button>
              </div>
            )}

            {/* Sample Tip Footnote */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono-tech text-slate-400 flex items-center gap-2">
              <span className="text-amber-400 font-bold shrink-0">LCARS TIP:</span>
              <span className="truncate">{currentStation.sampleTip}</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playLcarsChirp('tap');
                handleFinishTour();
              }}
              className="text-xs font-mono-tech text-slate-400 hover:text-white uppercase transition-colors"
            >
              SKIP TOUR & EXPLORE FREELY
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] font-mono-tech text-slate-500 hidden sm:inline">
              HOTKEYS: ← / → ARROWS TO NAVIGATE, ESC TO EXIT
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              PREVIOUS
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-full text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: theme.primary }}
            >
              <span>{currentStepIndex === STATIONS.length - 1 ? 'COMPLETE WALKTHROUGH' : 'NEXT STATION'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
