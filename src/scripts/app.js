// FIZY - Fuel Station Finder App
// Enhanced with real map integration using Leaflet.js

class FuelStationApp {
  constructor() {
    this.map = null;
    this.userLocation = null;
    this.stations = [];
    this.currentStationIndex = 0;
    this.markers = [];
    this.userMarker = null;

    this.init();
  }

  init() {
    this.initializeMap();
    this.bindEvents();
    this.requestUserLocation();
  }

  async loadStationsFromAPI(params = {}) {
    try {
      const baseUrl = 'http://localhost:3000/api/stations/all';
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '')
          url.searchParams.set(k, v);
      });
      this.showLoading(true);
      const res = await fetch(url.toString());
      const json = await res.json();
      this.stations = (json.data || json).map((s) => ({
        ...s,
        distance: s.distanceMeters ? `${s.distanceMeters}m` : s.distance || '',
      }));
      this.clearMarkers();
      this.addStationsToMap();
      this.showLoading(false);
    } catch (e) {
      console.error('Erro ao carregar postos', e);
      this.showLoading(false);
    }
  }

  clearMarkers() {
    this.markers.forEach((m) => this.map.removeLayer(m.marker));
    this.markers = [];
  }

  initializeMap() {
    // Default coordinates (São Carlos, SP)
    const defaultLat = -22.0195;
    const defaultLng = -47.891;

    // Initialize Leaflet map
    this.map = L.map('map').setView([defaultLat, defaultLng], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Disable default zoom control and add custom positioning
    this.map.zoomControl.setPosition('bottomright');

    // Carrega inicialmente usando bounding box padrão do mapa
    this.fetchByCurrentMapBounds();

    // Atualiza ao mover/zoom (debounce)
    let timeout;
    this.map.on('moveend', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.fetchByCurrentMapBounds(), 300);
    });
  }

  addStationsToMap() {
    this.stations.forEach((station, index) => {
      const marker = L.marker([station.lat, station.lng], {
        icon: this.createCustomIcon(station),
      }).addTo(this.map);

      // Add popup with station info
      const popupContent = this.createPopupContent(station);
      marker.bindPopup(popupContent);

      // Store marker reference
      this.markers.push({ marker, station, index });

      // Add click event
      marker.on('click', () => {
        this.showStationModal(station);
      });
    });
  }

  createCustomIcon(station) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="custom-marker" style="background: ${this.getStationColor(
        station.rating
      )}"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }

  getStationColor(rating) {
    if (rating >= 4.5) return '#FE4F02'; // Orange for excellent
    if (rating >= 4.0) return '#FF8C00'; // Dark orange for good
    return '#FFA500'; // Light orange for average
  }

  createPopupContent(station) {
    const stars = this.generateStarsHTML(station.rating);
    const cheapestFuel = this.getCheapestFuel(station.fuels);

    return `
            <div class="popup-station">
                <h3>${station.name}</h3>
                <div class="station-rating">${stars}</div>
                <p><strong>${station.distance}</strong> de você</p>
                <div class="popup-fuel-preview">
                    <div class="popup-fuel-item">G: R$${
                      cheapestFuel.gasoline
                    }</div>
                    <div class="popup-fuel-item">E: R$${
                      cheapestFuel.ethanol
                    }</div>
                    <div class="popup-fuel-item">D: R$${
                      cheapestFuel.diesel
                    }</div>
                </div>
                <button class="popup-view-more" onclick="app.showStationModal(${JSON.stringify(
                  station
                ).replace(/"/g, '&quot;')})">
                    Ver detalhes
                </button>
            </div>
        `;
  }

  getCheapestFuel(fuels) {
    return {
      gasoline: fuels.gasoline?.price.toFixed(2) || 'N/A',
      ethanol: fuels.ethanol?.price.toFixed(2) || 'N/A',
      diesel: fuels.diesel?.price.toFixed(2) || 'N/A',
    };
  }

  requestUserLocation() {
    if (navigator.geolocation) {
      this.showLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.updateMapWithUserLocation();
          this.showLoading(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          this.showLoading(false);
          // Use default location if geolocation fails
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }

  updateMapWithUserLocation() {
    if (this.userLocation) {
      // Center map on user location
      this.map.setView([this.userLocation.lat, this.userLocation.lng], 16);

      // Add user location marker
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      this.userMarker = L.marker(
        [this.userLocation.lat, this.userLocation.lng],
        {
          icon: L.divIcon({
            className: 'user-marker',
            html: '<div class="user-marker"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        }
      ).addTo(this.map);

      this.userMarker.bindPopup(
        '<div style="text-align: center; padding: 8px;"><strong>Você está aqui!</strong></div>'
      );

      // Update distances to stations
      this.updateStationDistances();
    }
  }

  updateStationDistances() {
    if (!this.userLocation) return;

    this.stations.forEach((station) => {
      const distance = this.calculateDistance(
        this.userLocation.lat,
        this.userLocation.lng,
        station.lat,
        station.lng
      );
      station.distance = `${Math.round(distance * 1000)}m`;
    });

    // Sort stations by distance
    this.stations.sort((a, b) => {
      const distA = parseInt(a.distance);
      const distB = parseInt(b.distance);
      return distA - distB;
    });
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  showStationModal(station) {
    const modal = document.getElementById('stationModal');

    // Update modal content
    document.getElementById('modalStationName').textContent = station.name;
    document.getElementById('modalAddress').textContent = station.address;
    document.getElementById('modalDistance').textContent =
      station.distance + ' de você';

    // Update rating
    const starsContainer = document.getElementById('modalStars');
    starsContainer.innerHTML = this.generateStarsHTML(station.rating, 20);

    document.getElementById(
      'modalRating'
    ).textContent = `${station.rating} de 5`;

    // Update fuel prices
    const fuelGrid = document.getElementById('modalFuelGrid');
    fuelGrid.innerHTML = this.generateFuelGridHTML(station.fuels);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  hideStationModal() {
    const modal = document.getElementById('stationModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  generateStarsHTML(rating, size = 16) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" class="star filled">
                <path d="M10 2L12.09 6.26L18 6.27L13.55 9.97L15.18 14.02L10 11.77L4.82 14.02L6.45 9.97L2 6.27L7.91 6.26L10 2Z" fill="#FE4F02"/>
            </svg>`;
    }

    if (hasHalfStar) {
      starsHTML += `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" class="star filled">
                <defs>
                    <linearGradient id="half">
                        <stop offset="50%" stop-color="#FE4F02"/>
                        <stop offset="50%" stop-color="#CFCFCF"/>
                    </linearGradient>
                </defs>
                <path d="M10 2L12.09 6.26L18 6.27L13.55 9.97L15.18 14.02L10 11.77L4.82 14.02L6.45 9.97L2 6.27L7.91 6.26L10 2Z" fill="url(#half)"/>
            </svg>`;
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" class="star empty">
                <path d="M10 2L12.09 6.26L18 6.27L13.55 9.97L15.18 14.02L10 11.77L4.82 14.02L6.45 9.97L2 6.27L7.91 6.26L10 2Z" fill="#CFCFCF"/>
            </svg>`;
    }

    return starsHTML;
  }

  generateFuelGridHTML(fuels) {
    const fuelTypes = [
      { key: 'gasoline', name: 'Gasolina Comum', letter: 'G' },
      { key: 'ethanol', name: 'Etanol', letter: 'E' },
      { key: 'diesel', name: 'Diesel S-10', letter: 'D' },
    ];

    return fuelTypes
      .map((fuel) => {
        const fuelData = fuels[fuel.key];
        if (!fuelData) return '';

        return `
                <div class="fuel-item">
                    <div class="fuel-type">${fuel.name}</div>
                    <div class="fuel-price">R$ ${fuelData.price.toFixed(
                      2
                    )}</div>
                    <div class="fuel-updated">Atualizado ${
                      fuelData.updated
                    }</div>
                </div>
            `;
      })
      .join('');
  }

  showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
      spinner.classList.add('active');
    } else {
      spinner.classList.remove('active');
    }
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.fetchByCurrentMapBounds();
      return;
    }
    this.fetchByCurrentMapBounds(query);
  }

  useCurrentLocation() {
    this.requestUserLocation();
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    const triggerSearch = (value) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => this.handleSearch(value), 350);
    };
    searchInput.addEventListener('input', (e) => {
      triggerSearch(e.target.value);
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') triggerSearch(e.target.value);
    });

    // Location button
    const locationButton = document.getElementById('locationButton');
    locationButton.addEventListener('click', () => {
      this.useCurrentLocation();
    });

    // Config button
    const configButton = document.getElementById('configButton');
    configButton.addEventListener('click', () => {
      window.location.href = '../src/components/config.html';
    });

    // Modal close button
    const closeModal = document.getElementById('closeModal');
    closeModal.addEventListener('click', () => {
      this.hideStationModal();
    });

    // Modal backdrop click
    const modal = document.getElementById('stationModal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideStationModal();
      }
    });

    // Modal action buttons
    document.getElementById('favoriteButton').addEventListener('click', () => {
      console.log('Add to favorites');
      // Implement favorite functionality
    });

    document.getElementById('navigateButton').addEventListener('click', () => {
      console.log('Navigate to station');
      // Implement navigation functionality
      // Could open Google Maps or Apple Maps
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideStationModal();
      }
    });
  }

  fetchByCurrentMapBounds(search) {
    if (!this.map) return;
    const b = this.map.getBounds();
    const params = {
      minLat: b.getSouth(),
      maxLat: b.getNorth(),
      minLng: b.getWest(),
      maxLng: b.getEast(),
      search,
    };
    if (this.userLocation) {
      params.userLat = this.userLocation.lat;
      params.userLng = this.userLocation.lng;
    }
    this.loadStationsFromAPI(params);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FuelStationApp();
});

// Navigation functions for other pages
function goToFirstSteps() {
  window.location.href = '../src/components/onboarding/first-steps-1.html';
}

function goToLogin() {
  window.location.href = '../src/components/auth/login.html';
}

function goToSignup() {
  window.location.href = '../src/components/auth/signup.html';
}

function goToConfig() {
  window.location.href = '../src/components/config.html';
}

function goToHome() {
  window.location.href = '../public/index.html';
}

let currentStationIndex = 0;

// DOM Elements
const configButton = document.getElementById('configButton');
const searchInput = document.getElementById('searchInput');
const seeMoreButton = document.getElementById('seeMoreButton');
const prevButton = document.getElementById('prevStation');
const nextButton = document.getElementById('nextStation');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
  generateLocationPins();
  updateStationCard();
  setupEventListeners();
});

// Generate location pins on the map
function generateLocationPins() {
  const pinsContainer = document.querySelector('.location-pins');
  const pinPositions = [
    { top: '15%', left: '20%' },
    { top: '25%', left: '70%' },
    { top: '35%', left: '45%', primary: true },
    { top: '45%', left: '25%' },
    { top: '55%', left: '80%' },
    { top: '65%', left: '35%' },
    { top: '75%', left: '60%' },
    { top: '20%', left: '85%' },
    { top: '40%', left: '75%' },
    { top: '60%', left: '15%' },
    { top: '80%', left: '40%' },
    { top: '30%', left: '30%' },
    { top: '50%', left: '55%' },
    { top: '70%', left: '75%' },
    { top: '85%', left: '20%' },
  ];

  pinPositions.forEach((position, index) => {
    const pin = document.createElement('div');
    pin.className = `pin ${position.primary ? 'primary' : ''}`;
    pin.style.top = position.top;
    pin.style.left = position.left;

    // Add subtle animation delay
    pin.style.animationDelay = `${index * 0.1}s`;

    pinsContainer.appendChild(pin);
  });
}

// Update station card with current station data
function updateStationCard() {
  const station = stationData[currentStationIndex];

  // Update station info
  document.querySelector('.station-name').textContent = station.name;
  document.querySelector('.station-address').textContent = station.address;
  document.querySelector('.station-distance').textContent = station.distance;

  // Update rating stars
  updateStarRating(station.rating);

  // Update fuel prices
  const fuelCards = document.querySelectorAll('.fuel-card');
  fuelCards.forEach((card) => {
    const fuelType = card.getAttribute('data-fuel');
    const priceElement = card.querySelector('.fuel-price');
    priceElement.textContent = `R$${station.fuels[fuelType].toFixed(2)}`;
  });

  // Update steps indicator
  updateStepsIndicator();

  // Add animation
  const stationCard = document.querySelector('.station-card');
  stationCard.style.animation = 'none';
  stationCard.offsetHeight; // Trigger reflow
  stationCard.style.animation = 'fadeInUp 0.6s ease-out';
}

// Update star rating display
function updateStarRating(rating) {
  const stars = document.querySelectorAll('.stars svg');
  stars.forEach((star, index) => {
    const path = star.querySelector('path');
    if (index < Math.floor(rating)) {
      // Full star
      path.setAttribute('fill', 'var(--Primria)');
      path.setAttribute('opacity', '1');
    } else if (index < rating) {
      // Half star
      path.setAttribute('fill', 'var(--Primria)');
      path.setAttribute('opacity', '0.5');
    } else {
      // Empty star
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'var(--Primria)');
      path.setAttribute('stroke-width', '1');
    }
  });
}

// Update steps indicator
function updateStepsIndicator() {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    if (index === currentStationIndex) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
}

// Navigation functions
function goToNextStation() {
  currentStationIndex = (currentStationIndex + 1) % stationData.length;
  updateStationCard();
}

function goToPrevStation() {
  currentStationIndex =
    currentStationIndex === 0
      ? stationData.length - 1
      : currentStationIndex - 1;
  updateStationCard();
}

// Setup event listeners
function setupEventListeners() {
  // Config button
  configButton.addEventListener('click', function () {
    window.location.href = '../src/components/config.html';
  });

  // Search functionality
  searchInput.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length > 2) {
      performSearch(searchTerm);
    }
  });

  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value.toLowerCase();
      performSearch(searchTerm);
    }
  });

  // See more button
  seeMoreButton.addEventListener('click', function () {
    showStationDetails();
  });

  // Navigation buttons
  nextButton.addEventListener('click', goToNextStation);
  prevButton.addEventListener('click', goToPrevStation);

  // Fuel card interactions
  document.querySelectorAll('.fuel-card').forEach((card) => {
    card.addEventListener('click', function () {
      const fuelType = this.getAttribute('data-fuel');
      showFuelDetails(fuelType);
    });
  });

  // Touch gestures for mobile
  let startX = 0;
  let endX = 0;

  document
    .querySelector('.station-card')
    .addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    });

  document
    .querySelector('.station-card')
    .addEventListener('touchend', function (e) {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next station
        goToNextStation();
      } else {
        // Swipe right - previous station
        goToPrevStation();
      }
    }
  }

  // Auto-rotate stations (optional)
  // setInterval(goToNextStation, 10000); // Change station every 10 seconds
}

// Search functionality
function performSearch(searchTerm) {
  const filteredStations = stationData.filter(
    (station) =>
      station.name.toLowerCase().includes(searchTerm) ||
      station.address.toLowerCase().includes(searchTerm)
  );

  if (filteredStations.length > 0) {
    const stationIndex = stationData.findIndex(
      (station) => station.id === filteredStations[0].id
    );
    currentStationIndex = stationIndex;
    updateStationCard();
    showMessage(`Encontrado: ${filteredStations[0].name}`, 'success');
  } else {
    showMessage('Nenhum posto encontrado', 'warning');
  }
}

// Show station details
function showStationDetails() {
  const station = stationData[currentStationIndex];
  const details = `
        <div style="text-align: left;">
            <h3>${station.name}</h3>
            <p><strong>Endereço:</strong> ${station.address}</p>
            <p><strong>Distância:</strong> ${station.distance}</p>
            <p><strong>Avaliação:</strong> ${station.rating}/5 estrelas</p>
            <br>
            <p><strong>Combustíveis disponíveis:</strong></p>
            <ul>
                <li>Gasolina: R$${station.fuels.gasolina.toFixed(2)}</li>
                <li>Etanol: R$${station.fuels.etanol.toFixed(2)}</li>
                <li>Diesel: R$${station.fuels.diesel.toFixed(2)}</li>
            </ul>
        </div>
    `;
  showMessage(details, 'info', true);
}

// Show fuel details
function showFuelDetails(fuelType) {
  const station = stationData[currentStationIndex];
  const fuelNames = {
    gasolina: 'Gasolina',
    etanol: 'Etanol',
    diesel: 'Diesel',
  };

  const message = `
        <div style="text-align: center;">
            <h3>${fuelNames[fuelType]}</h3>
            <p style="font-size: 1.5rem; color: var(--Primria); margin: 1rem 0;">
                R$${station.fuels[fuelType].toFixed(2)}
            </p>
            <p>Disponível em ${station.name}</p>
        </div>
    `;
  showMessage(message, 'info', true);
}

// Show message function
function showMessage(message, type = 'info', isHTML = false) {
  // Remove existing messages
  const existingMessage = document.querySelector('.message-popup');
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `message-popup message-${type}`;

  if (isHTML) {
    messageDiv.innerHTML = message;
  } else {
    messageDiv.textContent = message;
  }

  // Style the message
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${
          type === 'success'
            ? '#4CAF50'
            : type === 'warning'
            ? '#FF9800'
            : 'var(--Cinza)'
        };
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 90vw;
        animation: slideDown 0.3s ease-out;
    `;

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(messageDiv);

  // Auto-remove after 3 seconds (or 5 for detailed messages)
  setTimeout(
    () => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => messageDiv.remove(), 300);
      }
    },
    isHTML ? 5000 : 3000
  );

  // Allow click to dismiss
  messageDiv.addEventListener('click', () => {
    messageDiv.style.animation = 'slideDown 0.3s ease-out reverse';
    setTimeout(() => messageDiv.remove(), 300);
  });
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function () {
  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll(
    '.fuel-card, .see-more-button, .config-button, .nav-arrow'
  );

  interactiveElements.forEach((element) => {
    element.addEventListener('mouseenter', function () {
      this.style.transform = this.style.transform || '';
      this.style.transform += ' scale(1.02)';
    });

    element.addEventListener('mouseleave', function () {
      this.style.transform = this.style.transform.replace(' scale(1.02)', '');
    });
  });
});
