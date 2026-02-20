import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  type MapLayerType,
  cityCoordinates,
  layerConfigs,
  generateLayerData,
  getLayerColor,
  getRainCells,
  findNearestPoint,
  type DataPoint,
} from '@/data/mapData';

// ---------- Types ----------
interface Particle {
  x: number;
  y: number;
  speed: number;
  direction: number;
  life: number;
  maxLife: number;
  cachedSpeed: number;
}

interface TooltipInfo {
  x: number;
  y: number;
  value: number;
  layer: MapLayerType;
}

interface Props {
  city: string;
  onBack: () => void;
}

// ---------- Layers list ----------
const LAYERS: MapLayerType[] = ['rain', 'temp', 'wind', 'aqi', 'clouds'];

export default function WeatherMapPage({ city, onBack }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const dataRef = useRef<DataPoint[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const activeLayerRef = useRef<MapLayerType>('rain');
  const timeOffsetRef = useRef(0);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('rain');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [centerInfo, setCenterInfo] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Keep refs in sync
  useEffect(() => { activeLayerRef.current = activeLayer; }, [activeLayer]);
  useEffect(() => { timeOffsetRef.current = timeOffset; }, [timeOffset]);

  // ========== Canvas sizing ==========
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = mapContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }, []);

  // ========== Drawing Functions ==========
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const map = mapRef.current;
    if (!canvas || !map) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    const layer = activeLayerRef.current;
    const data = dataRef.current;

    switch (layer) {
      case 'rain':
        drawRainOverlay(ctx, map, w, h);
        break;
      case 'temp':
      case 'aqi':
        drawHeatmapOverlay(ctx, map, data, w, h, layer);
        break;
      case 'wind':
        drawWindOverlay(ctx, map, w, h);
        break;
      case 'clouds':
        drawCloudOverlay(ctx, map, data, w, h);
        break;
    }
  }, []);

  const drawRainOverlay = (ctx: CanvasRenderingContext2D, map: L.Map, _w: number, _h: number) => {
    const cells = getRainCells(city);
    const zoom = map.getZoom();

    cells.forEach(cell => {
      const cellLat = cell.lat + cell.dx * timeOffsetRef.current;
      const cellLng = cell.lng + cell.dy * timeOffsetRef.current;
      const point = map.latLngToContainerPoint([cellLat, cellLng]);
      const radius = cell.radius * Math.pow(2, zoom) * 0.8;

      // Multiple layers for realistic radar look
      for (let ring = 3; ring >= 0; ring--) {
        const r = radius * (0.3 + ring * 0.25);
        const intensity = cell.intensity * (1 - ring * 0.2);
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, r);
        const color = getLayerColor('rain', intensity * 20, 0.35 - ring * 0.06);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.7, color.replace(/[\d.]+\)$/, `${0.1})`));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const drawHeatmapOverlay = (ctx: CanvasRenderingContext2D, map: L.Map, data: DataPoint[], w: number, h: number, layer: MapLayerType) => {
    ctx.globalCompositeOperation = 'screen';
    const zoom = map.getZoom();
    const baseRadius = Math.max(25, zoom * 9);

    data.forEach(point => {
      const px = map.latLngToContainerPoint([point.lat, point.lng]);
      if (px.x < -baseRadius || px.x > w + baseRadius || px.y < -baseRadius || px.y > h + baseRadius) return;

      const gradient = ctx.createRadialGradient(px.x, px.y, 0, px.x, px.y, baseRadius);
      gradient.addColorStop(0, getLayerColor(layer, point.value, 0.45));
      gradient.addColorStop(0.6, getLayerColor(layer, point.value, 0.15));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px.x, px.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
  };

  const drawCloudOverlay = (ctx: CanvasRenderingContext2D, map: L.Map, data: DataPoint[], w: number, h: number) => {
    const zoom = map.getZoom();
    const baseRadius = Math.max(35, zoom * 12);

    data.forEach(point => {
      if (point.value < 10) return;
      const px = map.latLngToContainerPoint([point.lat, point.lng]);
      if (px.x < -baseRadius || px.x > w + baseRadius || px.y < -baseRadius || px.y > h + baseRadius) return;

      const alpha = (point.value / 100) * 0.35;
      const gradient = ctx.createRadialGradient(px.x, px.y, 0, px.x, px.y, baseRadius);
      gradient.addColorStop(0, `rgba(220, 225, 240, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(220, 225, 240, ${alpha * 0.4})`);
      gradient.addColorStop(1, 'rgba(220, 225, 240, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px.x, px.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    particlesRef.current = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 1 + Math.random() * 2,
      direction: 0,
      life: Math.random() * 80,
      maxLife: 40 + Math.random() * 100,
      cachedSpeed: 10,
    }));
  }, []);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const map = mapRef.current;
    if (!canvas || !map) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    particlesRef.current.forEach(p => {
      // Update direction from nearest data point periodically
      if (p.life === 0 || p.life % 25 === 0) {
        const latlng = map.containerPointToLatLng(L.point(p.x, p.y));
        const nearest = findNearestPoint(dataRef.current, latlng.lat, latlng.lng);
        if (nearest?.direction !== undefined) {
          p.direction = (nearest.direction - 90) * Math.PI / 180; // Convert to radians, adjust for screen coords
          p.cachedSpeed = Math.max(1, nearest.value / 8);
        }
      }

      p.x += Math.cos(p.direction) * p.cachedSpeed * 0.5;
      p.y += Math.sin(p.direction) * p.cachedSpeed * 0.5;
      p.life++;

      if (p.life > p.maxLife || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.life = 0;
      }
    });
  }, []);

  const drawWindOverlay = (ctx: CanvasRenderingContext2D, _map: L.Map, _w: number, _h: number) => {
    particlesRef.current.forEach(p => {
      const lifeRatio = p.life / p.maxLife;
      const alpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;
      const color = getLayerColor('wind', p.cachedSpeed * 8, alpha * 0.7);

      const tailLength = Math.min(12, p.cachedSpeed * 3);
      const tailX = p.x - Math.cos(p.direction) * tailLength;
      const tailY = p.y - Math.sin(p.direction) * tailLength;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      // Dot at head
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // ========== Update center info ==========
  const updateCenterInfo = useCallback(() => {
    const map = mapRef.current;
    if (!map || !dataRef.current.length) return;

    const center = map.getCenter();
    const nearest = findNearestPoint(dataRef.current, center.lat, center.lng);
    if (nearest) {
      const config = layerConfigs[activeLayerRef.current];
      setCenterInfo(`${Math.round(nearest.value)}${config.unit} · ${config.getStatus(nearest.value)}`);
    }
  }, []);

  // ========== Map Initialization ==========
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const center = cityCoordinates[city] || [28.6, 77.2];
    const map = L.map(mapContainerRef.current, {
      center: center as L.LatLngExpression,
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
    });

    // CartoDB dark tiles - free, no API key
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Sync on map events
    const handleMapMove = () => {
      renderCanvas();
      setTooltip(null);
      updateCenterInfo();
    };

    map.on('move', handleMapMove);
    map.on('zoom', handleMapMove);
    map.on('resize', () => {
      resizeCanvas();
      renderCanvas();
    });

    // Click for tooltip
    map.on('click', (e: L.LeafletMouseEvent) => {
      const nearest = findNearestPoint(dataRef.current, e.latlng.lat, e.latlng.lng);
      if (nearest) {
        setTooltip({
          x: e.containerPoint.x,
          y: e.containerPoint.y,
          value: nearest.value,
          layer: activeLayerRef.current,
        });
      }
    });

    // Wait for tiles to load for initial render
    map.whenReady(() => {
      resizeCanvas();
      setIsReady(true);
    });

    return () => {
      isAnimatingRef.current = false;
      cancelAnimationFrame(animRef.current);
      map.remove();
    };
    // eslint-disable-next-line
  }, [city]);

  // ========== Generate data on layer/time/city change ==========
  useEffect(() => {
    if (!isReady) return;
    dataRef.current = generateLayerData(city, activeLayer, timeOffset);

    if (activeLayer === 'wind') {
      initParticles();
    }

    renderCanvas();
    updateCenterInfo();
  }, [activeLayer, timeOffset, city, isReady, renderCanvas, updateCenterInfo, initParticles]);

  // ========== Animation loop for wind particles ==========
  useEffect(() => {
    if (!isReady) return;

    if (activeLayer === 'wind') {
      isAnimatingRef.current = true;
      const animate = () => {
        if (!isAnimatingRef.current) return;
        updateParticles();
        renderCanvas();
        animRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      isAnimatingRef.current = false;
      cancelAnimationFrame(animRef.current);
    }

    return () => {
      isAnimatingRef.current = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [activeLayer, isReady, updateParticles, renderCanvas]);

  // ========== Time auto-play ==========
  useEffect(() => {
    if (!isPlaying || !layerConfigs[activeLayer].animated) return;

    const interval = setInterval(() => {
      setTimeOffset(prev => {
        if (prev >= 3) return -3;
        return +(prev + 0.5).toFixed(1);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, activeLayer]);

  // ========== Escape key ==========
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  // ========== Locate me ==========
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 10);
        },
        () => {
          // Permission denied - fly to city center
          const center = cityCoordinates[city];
          if (center) mapRef.current?.flyTo(center, 10);
        }
      );
    }
  };

  const config = layerConfigs[activeLayer];
  const hasTimeControl = config.animated;

  const getTimeLabel = () => {
    if (timeOffset === 0) return 'Now';
    const sign = timeOffset > 0 ? '+' : '';
    return `${sign}${timeOffset}h`;
  };

  return (
    <div className="fixed inset-0 z-[200]" style={{ animation: 'pageSlideIn 0.3s ease-out' }}>
      {/* Map container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ background: '#0a0a1a' }} />

      {/* Canvas overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />

      {/* ========== Top Controls ========== */}
      <div
        className="absolute top-0 left-0 right-0 z-[10] px-4 pt-4 pb-8"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Center info */}
          <div className="text-center">
            <div className="text-white/90 text-sm font-medium">
              {config.icon} {config.name}
              <span className="text-white/50 font-light ml-1.5">·</span>
              <span className="text-white/60 font-light ml-1.5 text-xs">{getTimeLabel()}</span>
            </div>
          </div>

          {/* Locate me */}
          <button
            onClick={handleLocateMe}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ========== Bottom Controls Container ========== */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[10] pb-5 px-4 pt-12"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}
      >
        <div className="max-w-2xl mx-auto flex flex-col gap-3">

          {/* Layer Selector Pills */}
          <div className="flex justify-center">
            <div className="inline-flex gap-1 bg-black/40 backdrop-blur-xl rounded-full p-1 border border-white/5">
              {LAYERS.map(layer => (
                <button
                  key={layer}
                  onClick={() => {
                    setActiveLayer(layer);
                    setTooltip(null);
                    setIsPlaying(false);
                    setTimeOffset(0);
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeLayer === layer
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className="mr-1">{layerConfigs[layer].icon}</span>
                  <span className="hidden sm:inline">{layerConfigs[layer].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Control */}
          {hasTimeControl && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2.5 border border-white/5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <rect x="1" y="1" width="3.5" height="10" rx="1" />
                      <rect x="7.5" y="1" width="3.5" height="10" rx="1" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M2 1.5L10.5 6L2 10.5V1.5Z" />
                    </svg>
                  )}
                </button>

                <span className="text-[10px] text-white/40 w-5 text-right">-3h</span>

                <div className="relative w-36 h-5 flex items-center">
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={0.5}
                    value={timeOffset}
                    onChange={(e) => setTimeOffset(Number(e.target.value))}
                    className="map-time-slider w-full"
                  />
                </div>

                <span className="text-[10px] text-white/40 w-5">+3h</span>

                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/80 min-w-[40px] text-center">
                  {getTimeLabel()}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Row: Legend + Info Strip */}
          <div className="flex items-end justify-between gap-3">
            {/* Color Legend */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl px-3 py-2.5 border border-white/5">
              <div className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5 font-medium">
                {config.name}
              </div>
              <div className="flex gap-0.5">
                {config.legend.map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-7 h-2.5 first:rounded-l-sm last:rounded-r-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-white/50 text-[8px] mt-0.5 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Strip */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl px-3 py-2.5 border border-white/5 text-right max-w-[200px]">
              <div className="text-white/70 text-[11px] font-light truncate">
                {centerInfo || 'Pan map to explore'}
              </div>
              <div className="text-white/30 text-[9px] mt-0.5">
                Updated 10 min ago
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Tooltip ========== */}
      {tooltip && (
        <div
          className="absolute z-[20] pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 50 }}
        >
          <div className="bg-black/75 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10 shadow-xl">
            <div className="text-white text-sm font-medium">
              {Math.round(tooltip.value)}{config.unit}
            </div>
            <div className="text-white/50 text-[10px]">
              {config.getStatus(tooltip.value)}
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-black/75 rotate-45 border-r border-b border-white/10" />
        </div>
      )}

      {/* ========== Loading overlay ========== */}
      {!isReady && (
        <div className="absolute inset-0 z-[30] bg-[#0a0a1a] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span className="text-white/40 text-sm font-light">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
}
