// Configuração segura dos ícones do Leaflet evitando SSR: o pacote 'leaflet'
// acessa 'window' no import. Portanto, só carregamos no client.
// Use: setupLeafletIcons() em um componente client antes de renderizar <Marker />.
let _leafletIconsPatched = false;

export function setupLeafletIcons() {
  if (_leafletIconsPatched) return;
  if (typeof window === 'undefined') return; // Guarda contra SSR

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const L = require('leaflet');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const iconRetina = require('leaflet/dist/images/marker-icon-2x.png');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const icon = require('leaflet/dist/images/marker-icon.png');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const shadow = require('leaflet/dist/images/marker-shadow.png');

  // Compatibilidade: alguns bundlers expõem em .default
  const iconRetinaUrl = iconRetina.default || iconRetina;
  const iconUrl = icon.default || icon;
  const shadowUrl = shadow.default || shadow;

  if (L?.Icon?.Default) {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
    _leafletIconsPatched = true;
  }
}

// Export vazio para evitar erro caso seja importado sem uso.
export default setupLeafletIcons;
