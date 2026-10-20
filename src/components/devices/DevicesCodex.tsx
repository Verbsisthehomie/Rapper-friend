import React, { useState, useMemo } from 'react';
import { LcarsEra, LiteraryDeviceGuide } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { LITERARY_DEVICES_DATABASE } from '../../data/devicesData';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  Layers,
  Search,
  Send,
  BookOpen,
  Sparkles,
  Zap,
  Quote,
  Flame,
  Wand2,
} from 'lucide-react';

interface DevicesCodexProps {
  currentEra: LcarsEra;
  onSendToAnalyzer: (text: string) => void;
}

export const DevicesCodex: React.FC<DevicesCodexProps> = ({
  currentEra,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<LiteraryDeviceGuide>(
    LITERARY_DEVICES_DATABASE[0]
  );
  const [drillSuccess, setDrillSuccess] = useState<boolean>(false);

  const categories = useMemo(() => {
    return Array.from(new Set(LITERARY_DEVICES_DATABASE.map((d) => d.category)));
  }, []);

  const filteredDevices = useMemo(() => {
    return LITERARY_DEVICES_DATABASE.filter((dev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dev.name.toLowerCase().includes(q) ||
        dev.greekEtymology.toLowerCase().includes(q) ||
        dev.definition.toLowerCase().includes(q) ||
        dev.iconicBar.toLowerCase().includes(q) ||
        dev.artist.toLowerCase().includes(q);

      const matchesCat = !selectedCategory || dev.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleInjectDrill = (device: LiteraryDeviceGuide) => {
    playLcarsChirp('warp');
    onSendToAnalyzer(device.drillTemplate);
    setDrillSuccess(true);
    setTimeout(() => setDrillSuccess(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 pb-3"
        style={{ borderColor: theme.primary }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-black font-extrabold text-[11px] font-mono-tech tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              LCARS RHETORICAL CODEX 07-615
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              CLASSICAL RHETORIC & HIP-HOP POETIC ARCHITECTURE
            </span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white mt-1">
            Rhetorical & Art-Rap Literary Devices Codex
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-tech">
            <span className="text-slate-400 mr-2">DEVICES ARCHIVED:</span>
            <span className="font-bold text-amber-400">
              {LITERARY_DEVICES_DATABASE.length} RHETORICAL TOOLS
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search devices, etymologies, or rhetorical formulas (e.g. 'Chiasmus', 'Anaphora')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm font-mono-tech text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              playLcarsChirp('tap');
              setSelectedCategory(null);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-amber-400 text-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playLcarsChirp('tap');
                setSelectedCategory(selectedCategory === cat ? null : cat);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Device Cards List */}
        <div className="lg:col-span-5 space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredDevices.map((dev) => {
            const isSelected = selectedDevice.id === dev.id;
            return (
              <div
                key={dev.id}
                onClick={() => {
                  playLcarsChirp('tap');
                  setSelectedDevice(dev);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {dev.name}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase"
                    style={{ backgroundColor: theme.secondary, color: '#000' }}
                  >
                    {dev.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono-tech mt-1 line-clamp-2">
                  {dev.definition}
                </p>

                <div className="mt-2 text-[10px] font-mono-tech text-cyan-300 truncate">
                  Etymology: {dev.greekEtymology.split('—')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: In-Depth Rhetorical Breakdown */}
        <div className="lg:col-span-7 space-y-3">
          {selectedDevice && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              {/* Header Box */}
              <div className="p-3.5 rounded-lg bg-black/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-wider">
                    RHETORICAL CODEX ENTRY
                  </span>
                  <span className="text-xs font-mono-tech text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700">
                    {selectedDevice.category}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold uppercase text-white tracking-wider">
                  {selectedDevice.name}
                </h3>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono-tech text-amber-300">
                  <span className="text-slate-400 uppercase text-[10px] block mb-0.5">HISTORICAL ETYMOLOGY:</span>
                  {selectedDevice.greekEtymology}
                </div>
              </div>

              {/* Structural Formula */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono-tech text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  STRUCTURAL CADENCE FORMULA
                </div>
                <div className="p-2.5 rounded bg-black/80 border border-slate-700 text-amber-400 font-mono-tech font-bold text-center tracking-wider text-sm">
                  {selectedDevice.formula}
                </div>
                <p className="text-xs text-slate-300 font-mono-tech leading-relaxed pt-1">
                  {selectedDevice.definition}
                </p>
              </div>

              {/* Iconic Hip-Hop Bar Example */}
              <div className="p-3.5 rounded-lg bg-black/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-tech font-bold text-amber-400 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    CANONICAL ART-RAP EXEMPLAR
                  </span>
                  <span className="text-slate-400 font-normal">
                    Artist Credit: {selectedDevice.artist}
                  </span>
                </div>

                <blockquote className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-white font-mono-tech text-sm italic">
                  "{selectedDevice.iconicBar}"
                </blockquote>

                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono-tech flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedDevice.breakdown}</span>
                </div>
              </div>

              {/* Practice Drill Scaffolding */}
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-amber-400 uppercase font-bold flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" />
                    FILL-IN-THE-BLANK NOTEBOOK DRILL
                  </span>
                  <button
                    onClick={() => handleInjectDrill(selectedDevice)}
                    className="px-3 py-1 rounded text-black font-extrabold text-xs font-mono-tech uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Send className="w-3 h-3" />
                    {drillSuccess ? 'INJECTED TO ANALYZER!' : 'DRILL INTO NOTEBOOK'}
                  </button>
                </div>

                <pre className="p-3 rounded bg-black/80 border border-slate-700 text-cyan-300 font-mono-tech text-xs overflow-x-auto whitespace-pre-wrap">
                  {selectedDevice.drillTemplate}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
