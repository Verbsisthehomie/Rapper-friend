import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { WordEntry, LcarsEra } from '../../types/lcars';
import { LEXICON_DATABASE } from '../../data/lexiconData';
import { LCARS_THEMES } from '../lcars/LcarsTheme';
import { playLcarsChirp } from '../../utils/lcarsAudio';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Globe2,
} from 'lucide-react';

interface Graph3DViewProps {
  currentEra: LcarsEra;
  onSelectWord: (word: WordEntry) => void;
}

export const Graph3DView: React.FC<Graph3DViewProps> = ({ currentEra, onSelectWord }) => {
  const theme = LCARS_THEMES[currentEra];
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'rhyme' | 'etymology'>('all');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.003);

  // Keep callback and state in refs for animation loop
  const onSelectWordRef = useRef(onSelectWord);
  onSelectWordRef.current = onSelectWord;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.0018);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 45, 120);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff9900, 1.2);
    dirLight.position.set(50, 80, 50);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 1.5, 300);
    cyanLight.position.set(-50, -30, -50);
    scene.add(cyanLight);

    // 4. LCARS Astrometric Galaxy Group
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Concentric LCARS Astrometric Rings
    [30, 60, 90, 120].forEach((radius, i) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.2, radius + 0.2, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff9900 : 0x00e5ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      galaxyGroup.add(ringMesh);
    });

    // Background Star Field Particle Dust
    const starsGeo = new THREE.BufferGeometry();
    const starCount = isHeadless ? 300 : 900;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 500;
      starPos[i + 1] = (Math.random() - 0.5) * 300;
      starPos[i + 2] = (Math.random() - 0.5) * 500;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x9999ff,
      size: 1.5,
      transparent: true,
      opacity: 0.45,
    });
    const starPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starPoints);

    // 5. Build Word Nodes in 3D Galaxy
    const nodes: { mesh: THREE.Mesh; entry: WordEntry; pos: THREE.Vector3 }[] = [];
    const sphereGeo = new THREE.SphereGeometry(2.2, 16, 16);

    LEXICON_DATABASE.forEach((entry, idx) => {
      // Golden Spiral distribution in 3D
      const theta = idx * 2.39996; // Golden angle
      const radius = 18 + Math.sqrt(idx) * 11;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = Math.sin(idx * 0.8) * 14;

      const nodeColor =
        entry.syllables === 1
          ? 0xff9900 // Amber
          : entry.syllables === 2
          ? 0xffcc00 // Gold
          : 0x00e5ff; // Cyan

      const mat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        roughness: 0.25,
        metalness: 0.6,
        emissive: nodeColor,
        emissiveIntensity: 0.35,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { entry };
      galaxyGroup.add(mesh);

      // Create a canvas text sprite label floating above node
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 48;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Antonio, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(entry.word.toUpperCase(), 64, 24);
      }
      const labelTex = new THREE.CanvasTexture(canvas);
      labelTex.colorSpace = THREE.SRGBColorSpace;
      const spriteMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, opacity: 0.85 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(x, y + 4.2, z);
      sprite.scale.set(10, 4, 1);
      galaxyGroup.add(sprite);

      nodes.push({ mesh, entry, pos: new THREE.Vector3(x, y, z) });
    });

    // 6. Constellation Connection Lines
    const lineMatAmber = new THREE.LineBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.3,
    });
    const lineMatCyan = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.3,
    });

    const rhymePoints: THREE.Vector3[] = [];
    const rootPoints: THREE.Vector3[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        // Rhyme link
        if (nodeA.entry.rhymeFamily === nodeB.entry.rhymeFamily) {
          rhymePoints.push(nodeA.pos, nodeB.pos);
        }
        // Root link
        else if (
          nodeA.entry.etymology.pieRoot &&
          nodeA.entry.etymology.pieRoot === nodeB.entry.etymology.pieRoot
        ) {
          rootPoints.push(nodeA.pos, nodeB.pos);
        }
      }
    }

    if (rhymePoints.length > 0) {
      const rhymeGeo = new THREE.BufferGeometry().setFromPoints(rhymePoints);
      const rhymeLines = new THREE.LineSegments(rhymeGeo, lineMatAmber);
      galaxyGroup.add(rhymeLines);
    }

    if (rootPoints.length > 0) {
      const rootGeo = new THREE.BufferGeometry().setFromPoints(rootPoints);
      const rootLines = new THREE.LineSegments(rootGeo, lineMatCyan);
      galaxyGroup.add(rootLines);
    }

    // 7. Interactive Raycasting & Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        galaxyGroup.rotation.y += deltaX * 0.005;
        galaxyGroup.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.1, 40, 220);
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));
      if (intersects.length > 0) {
        playLcarsChirp('tap');
        const entry = intersects[0].object.userData.entry as WordEntry;
        if (entry) {
          onSelectWordRef.current(entry);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-rotation if not dragging
      if (!isMouseDown) {
        galaxyGroup.rotation.y += rotationSpeed;
      }

      // Check Hovered Node for tooltip
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));
      if (intersects.length > 0) {
        const entry = intersects[0].object.userData.entry as WordEntry;
        setHoveredWord(entry.word);
      } else {
        setHoveredWord(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. Clean Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      sphereGeo.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [rotationSpeed]);

  return (
    <div className="flex-1 flex flex-col gap-3 font-lcars relative">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-black font-extrabold text-xs tracking-wider uppercase"
              style={{ backgroundColor: theme.primary }}
            >
              3D ASTROMETRIC SUPER-GALAXY
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              OKUDA 3D SPATIAL SCAN // 05-771
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mt-1">
            Lexical Constellation & Semantic Orbits
          </h2>
        </div>

        {/* Hovered word telemetry badge */}
        {hoveredWord && (
          <div className="px-3 py-1 rounded-full bg-black/90 border border-amber-400 text-amber-300 font-mono-tech text-xs uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            TARGET ACQUIRED: <span className="font-bold text-white">{hoveredWord}</span>
          </div>
        )}
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="flex-1 rounded-2xl bg-black border border-slate-800 overflow-hidden min-h-[500px] relative cursor-grab active:cursor-grabbing"
      >
        {/* Subtle LCARS Astrometric coordinate watermark in corner */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono-tech text-[10px] text-slate-500 uppercase space-y-0.5">
          <div>SECTOR: 001-TERRA // GRID 47-ALPHA</div>
          <div>ASTROMETRIC DEPTH: 120 PARSECS</div>
          <div>ROTATIONAL SYNC: {(rotationSpeed * 1000).toFixed(1)} DEG/S</div>
        </div>

        {/* Collapsible Unified Bottom Control Dock (Following Three.js guidelines) */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${
            isControlsCollapsed ? 'translate-y-12' : 'translate-y-0'
          }`}
          style={{ maxWidth: 'min(940px, 94vw)' }}
        >
          {/* Collapse/Expand Toggle Handle */}
          <div className="flex justify-center -mb-1">
            <button
              onClick={() => {
                playLcarsChirp('tap');
                setIsControlsCollapsed(!isControlsCollapsed);
              }}
              className="px-3 py-1 rounded-t-lg bg-slate-900/90 border-t border-x border-slate-700 text-slate-300 hover:text-white text-[10px] font-mono-tech uppercase font-bold flex items-center gap-1 cursor-pointer"
            >
              {isControlsCollapsed ? (
                <>
                  <ChevronUp className="w-3 h-3 text-amber-400" /> SHOW HUD CONTROLS
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 text-amber-400" /> HIDE HUD
                </>
              )}
            </button>
          </div>

          {/* Unified Bottom Dock Body */}
          <div className="p-2.5 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
            
            {/* Speed slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase text-[10px] font-bold">
                ORBIT SPEED:
              </span>
              <button
                onClick={() => setRotationSpeed(s => (s === 0 ? 0.003 : 0))}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] uppercase font-bold"
              >
                {rotationSpeed === 0 ? 'RESUME' : 'PAUSE'}
              </button>
            </div>

            {/* Constellation Legend */}
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-300">RHYMES</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-300">PIE ROOTS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                <span className="text-slate-300">MULTIS</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 hidden md:block">
              Drag to Orbit • Scroll to Zoom • Click Node to Inspect
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
