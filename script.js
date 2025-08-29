// Fuel station data
const stationData = [
    {
        id: 1,
        name: "Posto Petrobras",
        address: "Av Prof Luiz A.de Oliveira, 366 - Vila Marina",
        distance: "150m de distância",
        rating: 3.5,
        fuels: {
            gasolina: 5.99,
            etanol: 5.99,
            diesel: 5.99
        }
    },
    {
        id: 2,
        name: "Posto Shell",
        address: "Rua das Flores, 123 - Centro",
        distance: "220m de distância",
        rating: 4.2,
        fuels: {
            gasolina: 6.15,
            etanol: 6.05,
            diesel: 6.20
        }
    },
    {
        id: 3,
        name: "Posto Ipiranga",
        address: "Av. Brasil, 789 - Vila Nova",
        distance: "350m de distância",
        rating: 4.0,
        fuels: {
            gasolina: 5.89,
            etanol: 5.95,
            diesel: 6.10
        }
    },
    {
        id: 4,
        name: "Posto BR",
        address: "Rua São Paulo, 456 - Jardim",
        distance: "480m de distância",
        rating: 3.8,
        fuels: {
            gasolina: 6.05,
            etanol: 6.00,
            diesel: 6.25
        }
    }
];

let currentStationIndex = 0;

// DOM Elements
const configButton = document.getElementById('configButton');
const searchInput = document.getElementById('searchInput');
const seeMoreButton = document.getElementById('seeMoreButton');
const prevButton = document.getElementById('prevStation');
const nextButton = document.getElementById('nextStation');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
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
        { top: '85%', left: '20%' }
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
    fuelCards.forEach(card => {
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
    currentStationIndex = currentStationIndex === 0 ? stationData.length - 1 : currentStationIndex - 1;
    updateStationCard();
}

// Setup event listeners
function setupEventListeners() {
    // Config button
    configButton.addEventListener('click', function() {
        showMessage('Configurações em desenvolvimento', 'info');
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            performSearch(searchTerm);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase();
            performSearch(searchTerm);
        }
    });

    // See more button
    seeMoreButton.addEventListener('click', function() {
        showStationDetails();
    });

    // Navigation buttons
    nextButton.addEventListener('click', goToNextStation);
    prevButton.addEventListener('click', goToPrevStation);

    // Fuel card interactions
    document.querySelectorAll('.fuel-card').forEach(card => {
        card.addEventListener('click', function() {
            const fuelType = this.getAttribute('data-fuel');
            showFuelDetails(fuelType);
        });
    });

    // Touch gestures for mobile
    let startX = 0;
    let endX = 0;

    document.querySelector('.station-card').addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });

    document.querySelector('.station-card').addEventListener('touchend', function(e) {
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
    const filteredStations = stationData.filter(station => 
        station.name.toLowerCase().includes(searchTerm) ||
        station.address.toLowerCase().includes(searchTerm)
    );

    if (filteredStations.length > 0) {
        const stationIndex = stationData.findIndex(station => station.id === filteredStations[0].id);
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
        diesel: 'Diesel'
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
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : 'var(--Cinza)'};
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
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, isHTML ? 5000 : 3000);

    // Allow click to dismiss
    messageDiv.addEventListener('click', () => {
        messageDiv.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => messageDiv.remove(), 300);
    });
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.fuel-card, .see-more-button, .config-button, .nav-arrow');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform || '';
            this.style.transform += ' scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });
});
