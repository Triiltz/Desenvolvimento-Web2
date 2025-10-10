'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setupLeafletIcons } from '@/lib/leafletIcons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import type { Station } from '@/types/station';
import { useRouter } from 'next/navigation';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), {
  ssr: false,
});
const ZoomControl = dynamic(
  () => import('react-leaflet').then((m) => m.ZoomControl),
  { ssr: false }
);

export function HomeMapClient() {
  setupLeafletIcons();
  const router = useRouter();
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [showMobileList, setShowMobileList] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, []);

  const center: [number, number] = useMemo(
    () => userPos || [-22.0195, -47.891],
    [userPos]
  );

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (userPos) {
        params.set('userLat', String(userPos[0]));
        params.set('userLng', String(userPos[1]));
      }
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch('/api/stations/all?' + params.toString());
      if (!res.ok) throw new Error('Falha ao carregar postos');
      const json = await res.json();
      setStations(json.data || []);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [userPos, search, refreshVersion]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchStations();
      return;
    }
    const t = setTimeout(fetchStations, 350);
    return () => clearTimeout(t);
  }, [fetchStations]);

  const filteredStations = stations;

  const getStationColor = (rating: number) => {
    if (rating >= 4.5) return '#FE4F02';
    if (rating >= 4.0) return '#FF8C00';
    return '#FFA500';
  };

  const cheapestPreview = (st: Station) => {
    const fuels = ['gasoline', 'ethanol', 'diesel'] as const;
    return fuels
      .filter((f) => st.fuels?.[f])
      .map((f) => `${f[0].toUpperCase()}: R$ ${st.fuels[f]!.price.toFixed(2)}`)
      .join(' • ');
  };

  const openModal = (st: Station) => setSelected(st);
  const closeModal = () => setSelected(null);
  const refresh = () => setRefreshVersion((v) => v + 1);
  const toggleMobileList = () => setShowMobileList((prev) => !prev);
  const distanceLabel = (st: Station) =>
    st.distanceMeters != null ? `${st.distanceMeters}m de você` : '';

  const createMarkerIcon = useCallback(
    (rating: number) =>
      L.divIcon({
        className: 'fizy-custom-marker-wrapper',
        html: `<div class="fizy-custom-marker" style="background-color: ${getStationColor(
          rating
        )}"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28],
      }),
    []
  );

  return (
    <div className="app-container relative w-screen h-screen overflow-hidden">
      <header className="app-header absolute top-0 left-0 right-0 z-[1000] flex items-center gap-4 p-5 md:p-6">
        <button
          onClick={() => router.push('/config')}
          className="config-button w-12 h-12 md:w-14 md:h-14 rounded-xl bg-black flex items-center justify-center hover:scale-105 active:scale-95 transition text-orange-600 shadow border border-orange-300"
          aria-label="Configurações"
        >
          <GearIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 max-w-xl">
          <div className="search-bar h-12 md:h-14 w-full bg-white border border-neutral-200 rounded-xl flex items-center gap-3 px-4 shadow-sm focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
            <SearchIcon className="w-5 h-5 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar postos de combustível..."
              className="flex-1 outline-none bg-transparent text-sm md:text-base placeholder:text-neutral-400"
            />
            <button
              onClick={() => userPos && fetchStations()}
              className="location-button p-1.5 rounded-md hover:bg-orange-50 text-orange-600 transition"
              aria-label="Usar minha localização"
            >
              <TargetIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <div className="w-full h-full grid lg:grid-cols-[1fr_400px]">
        <div className="relative w-full h-full">
          <MapContainer
            center={center}
            zoom={14}
            zoomControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ZoomControl position="bottomright" />
            {filteredStations.map((st) => (
              <Marker
                key={st.id}
                position={[st.lat, st.lng]}
                eventHandlers={{ click: () => openModal(st) }}
                icon={createMarkerIcon(st.rating)}
              >
                <Popup>
                  <div className="space-y-1">
                    <strong>{st.name}</strong>
                    <div className="text-xs text-neutral-600">{st.address}</div>
                    {st.fuels?.gasoline && (
                      <div className="text-xs">
                        Gasolina: R$ {st.fuels.gasoline.price.toFixed(2)}
                      </div>
                    )}
                    {st.distanceMeters != null && (
                      <div className="text-xs">
                        Distância: {st.distanceMeters}m
                      </div>
                    )}
                    <button
                      onClick={() => openModal(st)}
                      className="mt-1 w-full text-xs bg-orange-500 hover:bg-orange-600 text-white py-1 rounded cursor-pointer"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {userPos && (
              <Marker position={userPos}>
                <Popup>Você está aqui.</Popup>
              </Marker>
            )}
          </MapContainer>
          {loading && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow px-4 py-2 text-sm animate-fade-in-up z-20">
              Carregando postos...
            </div>
          )}
          {error && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-xl shadow px-4 py-2 text-sm z-20">
              {error}
            </div>
          )}
          {/* Botão para mostrar lista em mobile */}
          <button
            onClick={toggleMobileList}
            className="lg:hidden fixed bottom-6 left-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-[900] transition-transform active:scale-95"
            aria-label="Mostrar lista de postos"
          >
            <ListIcon className="w-6 h-6" />
          </button>
        </div>
        <aside className="hidden lg:flex flex-col bg-white/90 backdrop-blur border-l border-neutral-200 z-[900] h-full">
          <div className="flex items-center justify-between px-5 pt-8 pb-4 border-b">
            <h2 className="text-base font-semibold text-neutral-800">
              Postos próximos
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="w-9 h-9 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 text-neutral-600"
                aria-label="Atualizar lista"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filteredStations.map((st) => (
              <div
                key={st.id}
                role="button"
                tabIndex={0}
                onClick={() => openModal(st)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(st);
                  }
                }}
                className={`station-card-item ${
                  selected?.id === st.id ? 'active' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm text-neutral-800 leading-tight">
                      {st.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 max-w-[230px]">
                      {st.address}
                    </p>
                  </div>
                  {st.distanceMeters != null && (
                    <span className="text-[10px] px-2 py-1 rounded bg-orange-100 text-orange-600 font-medium whitespace-nowrap">
                      {st.distanceMeters}m
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-600 font-medium">
                  {cheapestPreview(st)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarIcon className="w-3 h-3" />
                    <span className="text-[11px] text-neutral-700 font-medium">
                      {st.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {distanceLabel(st)}
                  </span>
                </div>
              </div>
            ))}
            {!loading && filteredStations.length === 0 && (
              <div className="text-xs text-neutral-500 text-center py-10">
                Nenhum posto encontrado.
              </div>
            )}
          </div>
        </aside>
        {/* Lista mobile em tela cheia */}
        <aside
          className={`lg:hidden fixed inset-0 bg-white z-[1050] flex flex-col transition-transform duration-300 ${
            showMobileList ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b bg-orange-500 text-white">
            <h2 className="text-lg font-semibold">Postos próximos</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center hover:bg-white/10 text-white"
                aria-label="Atualizar lista"
              >
                <RefreshIcon className="w-4 h-4" />
              </button>
              <button
                onClick={toggleMobileList}
                className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center hover:bg-white/10 text-white"
                aria-label="Voltar ao mapa"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filteredStations.map((st) => (
              <div
                key={st.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  openModal(st);
                  setShowMobileList(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(st);
                    setShowMobileList(false);
                  }
                }}
                className={`station-card-item ${
                  selected?.id === st.id ? 'active' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm text-neutral-800 leading-tight">
                      {st.name}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 max-w-[230px]">
                      {st.address}
                    </p>
                  </div>
                  {st.distanceMeters != null && (
                    <span className="text-[10px] px-2 py-1 rounded bg-orange-100 text-orange-600 font-medium whitespace-nowrap">
                      {st.distanceMeters}m
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-600 font-medium">
                  {cheapestPreview(st)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarIcon className="w-3 h-3" />
                    <span className="text-[11px] text-neutral-700 font-medium">
                      {st.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {distanceLabel(st)}
                  </span>
                </div>
              </div>
            ))}
            {!loading && filteredStations.length === 0 && (
              <div className="text-xs text-neutral-500 text-center py-10">
                Nenhum posto encontrado.
              </div>
            )}
          </div>
        </aside>
      </div>
      {selected && (
        <div
          className="station-modal fixed inset-0 bg-black/50 z-[1100] flex items-end md:items-center justify-center p-4 animate-fade-in-up"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
            <div className="modal-header flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-neutral-800">
                {selected.name}
              </h2>
              <button
                onClick={closeModal}
                className="close-button w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100 text-neutral-500"
                aria-label="Fechar"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body px-6 py-5 space-y-6 overflow-y-auto">
              <div className="station-rating flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={
                        'w-4 h-4 ' +
                        (i < Math.round(selected.rating)
                          ? 'fill-yellow-400'
                          : 'fill-neutral-300 text-neutral-300')
                      }
                    />
                  ))}
                </div>
                <span className="rating-text text-xs font-medium text-neutral-600">
                  {selected.rating.toFixed(1)} de 5
                </span>
              </div>
              <div className="station-info space-y-4">
                <div className="info-item flex gap-3 items-start">
                  <LocationPinIcon className="w-4 h-4 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="info-label text-[10px] uppercase tracking-wide text-neutral-400 font-semibold mb-1">
                      Endereço
                    </p>
                    <p className="info-value text-sm text-neutral-700 leading-snug">
                      {selected.address}
                    </p>
                  </div>
                </div>
                {selected.distanceMeters != null && (
                  <div className="info-item flex gap-3 items-start">
                    <DistanceIcon className="w-4 h-4 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="info-label text-[10px] uppercase tracking-wide text-neutral-400 font-semibold mb-1">
                        Distância
                      </p>
                      <p className="info-value text-sm text-neutral-700 leading-snug">
                        {selected.distanceMeters}m de você
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="fuel-prices">
                <h3 className="text-sm font-semibold text-neutral-800 mb-3">
                  Preços dos Combustíveis
                </h3>
                <div className="fuel-grid grid grid-cols-2 gap-3">
                  {['gasoline', 'ethanol', 'diesel'].map((f) => {
                    const fd = selected.fuels?.[f];
                    if (!fd) return null;
                    const label =
                      f === 'gasoline'
                        ? 'Gasolina'
                        : f === 'ethanol'
                        ? 'Etanol'
                        : 'Diesel';
                    return (
                      <div
                        key={f}
                        className="fuel-item rounded-xl bg-neutral-100 hover:bg-orange-50 border border-transparent hover:border-orange-400 p-4 flex flex-col items-center text-center transition"
                      >
                        <div className="fuel-type text-xs font-medium text-neutral-500 mb-1">
                          {label}
                        </div>
                        <div className="fuel-price text-base font-bold text-neutral-800">
                          R$ {fd.price.toFixed(2)}
                        </div>
                        <div className="fuel-updated text-[10px] text-neutral-400 mt-1">
                          {new Date(fd.updated).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modal-actions flex gap-3 pt-2">
                <button className="action-button secondary flex-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium py-3 flex items-center justify-center gap-2 transition">
                  <HeartIcon className="w-5 h-5" /> Favoritar
                </button>
                {userPos && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-button primary flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 flex items-center justify-center gap-2 transition"
                  >
                    <RouteIcon className="w-5 h-5" /> Como chegar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`loading-spinner fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl px-10 py-8 text-center z-[1200] transition ${
          loading ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="spinner mx-auto mb-4 w-12 h-12 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-600 font-medium">
          Localizando postos próximos...
        </p>
      </div>
    </div>
  );
}

// Inline icons
function GearIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.85 2C13.73 2 14.44 2.67 14.5 3.54L14.65 5.17C15.12 5.4 15.56 5.67 15.96 5.98L17.5 5.31C18.32 5 19.23 5.3 19.68 6.03L20.54 7.47C20.99 8.2 20.85 9.15 20.19 9.73L18.97 10.65C19.01 11.1 19.01 11.55 18.97 12L20.19 12.92C20.85 13.5 20.99 14.45 20.54 15.18L19.68 16.62C19.23 17.35 18.32 17.65 17.5 17.34L15.96 16.67C15.56 16.98 15.12 17.25 14.65 17.48L14.5 19.11C14.44 19.98 13.73 20.65 12.85 20.65H11.15C10.27 20.65 9.56 19.98 9.5 19.11L9.35 17.48C8.88 17.25 8.44 16.98 8.04 16.67L6.5 17.34C5.68 17.65 4.77 17.35 4.32 16.62L3.46 15.18C3.01 14.45 3.15 13.5 3.81 12.92L5.03 12C4.99 11.55 4.99 11.1 5.03 10.65L3.81 9.73C3.15 9.15 3.01 8.2 3.46 7.47L4.32 6.03C4.77 5.3 5.68 5 6.5 5.31L8.04 5.98C8.44 5.67 8.88 5.4 9.35 5.17L9.5 3.54C9.56 2.67 10.27 2 11.15 2H12.85ZM12 8.5C10.07 8.5 8.5 10.07 8.5 12S10.07 15.5 12 15.5S15.5 13.93 15.5 12S13.93 8.5 12 8.5Z"
        fill="white"
      ></path>
    </svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      {...props}
    >
      <circle cx="9" cy="9" r="7" />
      <path d="M17 17l-4-4" />
    </svg>
  );
}
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      {...props}
    >
      <path d="M10 2v2M10 16v2M18 10h-2M4 10H2" />
      <path d="M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34" />
      <circle cx="10" cy="10" r="3" />
    </svg>
  );
}
function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 10A7 7 0 006.13 4.13M3 10a7 7 0 0010.87 5.87" />
      <path d="M6 2v4H2M18 14v4h-4" />
    </svg>
  );
}
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" stroke="none" {...props}>
      <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
    </svg>
  );
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
function LocationPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 2C5.79 2 4 3.79 4 6C4 9.5 8 14 8 14S12 9.5 12 6C12 3.79 10.21 2 8 2ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6S7.17 4.5 8 4.5S9.5 5.17 9.5 6S8.83 7.5 8 7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
function DistanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7S11.87 1 8 1Zm.5 10.5h-1v-4h1v4Zm0-5h-1v-1h1v1Z"
        fill="currentColor"
      />
    </svg>
  );
}
function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 17.5L8.83 16.45C4.8 12.86 2 10.39 2 7.5 2 5.5 3.5 4 5.5 4c1.14 0 2.24.57 3 1.5C9.26 4.57 10.36 4 11.5 4 13.5 4 15 5.5 15 7.5c0 2.89-2.8 5.36-6.83 8.95L10 17.5Z" />
    </svg>
  );
}
function RouteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 7 17 3 13 17 10 10 3 7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 6h14M3 10h14M3 14h14" />
    </svg>
  );
}
