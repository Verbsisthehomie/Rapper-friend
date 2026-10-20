import React, { useRef, useEffect, useState } from 'react';
import { WordEntry, LcarsEra } from '../../types/lcars';
import { LEXICON_DATABASE } from '../../data/lexiconData';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Orbit, Sparkles } from 'lucide-react';

interface Graph2DViewProps {
  currentEra: LcarsEra;
  onSelectWord: (word: WordEntry) => void;
}

interface Node {
  id: string;
  word: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  family: string;
  entry: WordEntry;
}

interface Link {
  source: string;
  target: string;
  type: 'rhyme' | 'etymology';
}

export const Graph2DView: React.FC<Graph2DViewProps> = ({ currentEra, onSelectWord }) => {
  const theme = LCARS_THEMES[currentEra];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'rhyme' | 'etymology'>('all');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize node layout
  useEffect(() => {
    const width = 800;
    const height = 600;
    const nodes: Node[] = LEXICON_DATABASE.map((item, idx) => {
      const angle = (idx / LEXICON_DATABASE.length) * Math.PI * 2;
      const radius = 180 + (idx % 3) * 60;
      return {
        id: item.id,
        word: item.word,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: item.syllables === 1 ? 16 : item.syllables === 2 ? 20 : 24,
        family: item.rhymeFamily,
        entry: item,
      };
    });

    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Rhyme links
        if (nodes[i].family === nodes[j].family) {
          links.push({ source: nodes[i].id, target: nodes[j].id, type: 'rhyme' });
        }
        // Etymology links (shared root or language)
        else if (
          nodes[i].entry.etymology.pieRoot &&
          nodes[i].entry.etymology.pieRoot === nodes[j].entry.etymology.pieRoot
        ) {
          links.push({ source: nodes[i].id, target: nodes[j].id, type: 'etymology' });
        } else if (
          nodes[i].entry.etymology.originLanguage.split('/')[0].trim() ===
          nodes[j].entry.etymology.originLanguage.split('/')[0].trim()
        ) {
          // occasional cross-lingual link
          if ((i + j) % 5 === 0) {
            links.push({ source: nodes[i].id, target: nodes[j].id, type: 'etymology' });
          }
        }
      }
    }

    nodesRef.current = nodes;
    linksRef.current = links;
  }, []);

  // Animation Loop for 2D Graph Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let anglePulse = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      anglePulse += 0.015;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Save transform
      ctx.save();
      ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Draw LCARS Tactical Astrometric Grid & Rings
      ctx.strokeStyle = '#1b2234';
      ctx.lineWidth = 1;

      // Concentric range rings
      for (let r = 100; r <= 380; r += 70) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(width / 2 - 400, height / 2);
      ctx.lineTo(width / 2 + 400, height / 2);
      ctx.moveTo(width / 2, height / 2 - 300);
      ctx.lineTo(width / 2, height / 2 + 300);
      ctx.stroke();

      // Rotating Radar Sweep Line
      ctx.strokeStyle = 'rgba(255, 153, 0, 0.15)';
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(
        width / 2 + Math.cos(anglePulse) * 380,
        height / 2 + Math.sin(anglePulse) * 380
      );
      ctx.stroke();

      const nodesMap = new Map<string, Node>(nodesRef.current.map(n => [n.id, n]));

      // Draw Links
      linksRef.current.forEach(link => {
        if (filterType !== 'all' && link.type !== filterType) return;

        const sourceNode = nodesMap.get(link.source);
        const targetNode = nodesMap.get(link.target);
        if (!sourceNode || !targetNode) return;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        if (link.type === 'rhyme') {
          ctx.strokeStyle = 'rgba(255, 153, 0, 0.35)'; // Amber for rhymes
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)'; // Cyan for etymology
          ctx.lineWidth = 1.5;
        }
        ctx.stroke();
      });

      // Draw Nodes
      nodesRef.current.forEach(node => {
        const isSelected = selectedNode?.id === node.id;

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 6 : 2), 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? theme.primary : '#0a0d14';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : theme.primary;
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Node label
        ctx.fillStyle = isSelected ? '#000000' : '#ffffff';
        ctx.font = 'bold 11px Antonio, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.word.toUpperCase(), node.x, node.y);
      });

      ctx.restore();
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [pan, zoom, filterType, selectedNode, theme]);

  // Handle canvas clicks
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Invert zoom and pan transform
    const width = canvas.width;
    const height = canvas.height;
    const transformedX = (mouseX - width / 2 - pan.x) / zoom + width / 2;
    const transformedY = (mouseY - height / 2 - pan.y) / zoom + height / 2;

    // Check hit test against nodes
    for (const node of nodesRef.current) {
      const dx = transformedX - node.x;
      const dy = transformedY - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
        playLcarsChirp('tap');
        setSelectedNode(node);
        onSelectWord(node.entry);
        return;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex-1 flex flex-col gap-3 font-lcars">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              2D ASTROMETRIC RELATIONAL GRAPH
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              POLAR RADAR SECTOR // 04-320
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Lexical Orbit & Rhyme Coordinate Plane
          </h2>
        </div>

        {/* Filter and Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800 text-xs">
            <span className="text-slate-400 text-[10px] font-mono-tech uppercase font-bold px-1.5">
              LINKS:
            </span>
            {(['all', 'rhyme', 'etymology'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  playLcarsChirp('tap');
                  setFilterType(mode);
                }}
                className={`px-2.5 py-0.5 rounded-full uppercase font-bold ${
                  filterType === mode
                    ? 'text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={filterType === mode ? { backgroundColor: theme.primary } : {}}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Mount */}
      <div className="flex-1 relative rounded-2xl bg-black border border-slate-800 overflow-hidden min-h-[480px]">
        <canvas
          ref={canvasRef}
          width={900}
          height={550}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Legend Overlay at Bottom */}
        <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono-tech space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            <span className="text-slate-300">RHYME CODA CONNECTIONS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
            <span className="text-slate-300">PIE ROOT & ETYMOLOGY COGNATES</span>
          </div>
          <div className="text-[10px] text-slate-500 pt-0.5">
            Click any node to open full etymological definition. Drag to pan.
          </div>
        </div>
      </div>
    </div>
  );
};
