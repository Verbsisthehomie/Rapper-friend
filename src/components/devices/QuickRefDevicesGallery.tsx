import React, { useState, useMemo } from 'react';
import { LcarsEra, LiteraryDeviceGuide } from '../../types/lcars';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { LITERARY_DEVICES_DATABASE } from '../../data/devicesData';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  Sparkles,
  Search,
  BookOpen,
  Copy,
  Check,
  Send,
  X,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface QuickRefDevicesGalleryProps {
  currentEra: LcarsEra;
  isOpen: boolean;
  onClose: () => void;
  onSendToAnalyzer?: (template: string) => void;
}

export const QuickRefDevicesGallery: React.FC<QuickRefDevicesGalleryProps> = ({
  currentEra,
  isOpen,
  onClose,
  onSendToAnalyzer,
}) => {
  const theme = LCARS_THEMES[currentEra];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<LiteraryDeviceGuide | null>(
    LITERARY_DEVICES_DATABASE[0] || null
  );

  const categories = ['ALL', 'Repetition & Cadence', 'Wordplay & Morphing', 'Syntax & Inversion', 'Imagery & Contrast'];

  const filteredDevices = useMemo(() => {
    return LITERARY_DEVICES_DATABASE.filter(device => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.iconicBar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.formula.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || device.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleCopy = (device: LiteraryDeviceGuide) => {
    playLcarsChirp('ack');
    navigator.clipboard.writeText(`${device.name} Template:\n${device.drillTemplate}`);
    setCopiedId(device.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (device: LiteraryDeviceGuide) => {
    playLcarsChirp('warp');
    if (onSendToAnalyzer) {
      onSendToAnalyzer(device.drillTemplate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border-2 overflow-hidden shadow-2xl bg-neutral-950"
        style={{ borderColor: theme.primary }}
      >
        {/* LCARS Modal Header Bar */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-3 border-b text-black font-mono font-bold tracking-wider"
          style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-black" />
            <span className="text-base sm:text-lg font-black tracking-widest uppercase">
              LCARS QUICK REF // RHETORICAL & POETIC DEVICES GALLERY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs bg-black/20 px-2 py-0.5 rounded font-mono">
              HOTKEY [D]
            </span>
            <button
              onClick={() => {
                playLcarsChirp('input');
                onClose();
              }}
              className="p-1 hover:bg-black/20 rounded-lg transition-colors cursor-pointer"
              title="Close Gallery (Esc)"
              aria-label="Close Gallery"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:p-4 bg-neutral-900 border-b border-neutral-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search devices by name, formula, or example..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  playLcarsChirp('input');
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all uppercase cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-black font-bold shadow-md'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split view (Device List + Inspector) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[420px]">
          {/* Left Column: Device Cards List */}
          <div className="md:col-span-5 border-r border-neutral-800 overflow-y-auto p-3 space-y-2 max-h-[50vh] md:max-h-[65vh]">
            {filteredDevices.length === 0 ? (
              <div className="p-6 text-center text-neutral-400 font-mono text-sm">
                No rhetorical devices match query.
              </div>
            ) : (
              filteredDevices.map(device => {
                const isSelected = selectedDevice?.id === device.id;
                return (
                  <div
                    key={device.id}
                    onClick={() => {
                      playLcarsChirp('input');
                      setSelectedDevice(device);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 text-white shadow-md'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-600 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-base font-mono text-amber-300 flex items-center gap-2">
                        {device.name}
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {device.category.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono mt-1 italic">
                      {device.greekEtymology}
                    </div>
                    <div className="mt-2 text-xs font-mono bg-black/50 px-2 py-1 rounded text-amber-200/90 border border-neutral-800">
                      Formula: <span className="text-emerald-400">{device.formula}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Device Deep Dive */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto max-h-[50vh] md:max-h-[65vh] bg-neutral-950 space-y-4">
            {selectedDevice ? (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-3">
                  <div>
                    <h2 className="text-2xl font-black font-mono text-amber-400 uppercase tracking-wide">
                      {selectedDevice.name}
                    </h2>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5">
                      ROOT: {selectedDevice.greekEtymology}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(selectedDevice)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition cursor-pointer"
                    >
                      {copiedId === selectedDevice.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                    {onSendToAnalyzer && (
                      <button
                        onClick={() => handleSend(selectedDevice)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-400 hover:bg-amber-300 text-black transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>Inject into Analyzer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Definition */}
                <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    LCARS Definition & Functional Purpose
                  </div>
                  <div className="text-sm text-neutral-200 leading-relaxed font-sans">
                    {selectedDevice.definition}
                  </div>
                </div>

                {/* Formula Diagram */}
                <div className="bg-black p-3.5 rounded-xl border border-amber-900/40">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                    Structural Symmetry Formula
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-400 tracking-wider">
                    {selectedDevice.formula}
                  </div>
                </div>

                {/* Iconic Bar Breakdown */}
                <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 uppercase">
                    <span>Mastery Art-Rap Demonstration</span>
                    <span className="text-amber-400">{selectedDevice.artist}</span>
                  </div>
                  <blockquote className="border-l-2 border-amber-400 pl-3 py-1 italic font-mono text-sm text-amber-100">
                    "{selectedDevice.iconicBar}"
                  </blockquote>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed pt-1">
                    {selectedDevice.breakdown}
                  </p>
                </div>

                {/* Drill Practice Template */}
                <div className="bg-neutral-900/90 p-3.5 rounded-xl border border-cyan-900/40">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Fill-in-the-Blank Drill Template</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Use in your next verse</span>
                  </div>
                  <pre className="font-mono text-xs text-cyan-200 bg-black/60 p-2.5 rounded border border-neutral-800 whitespace-pre-wrap">
                    {selectedDevice.drillTemplate}
                  </pre>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-neutral-500 font-mono">
                Select a device from the left to view complete breakdown.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
          <div>
            Showing {filteredDevices.length} rhetorical devices // Star Trek LCARS Cadence Matrix
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs cursor-pointer"
          >
            Close [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};
