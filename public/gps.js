import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    // Botón de volver arriba
    const scrollToTopBtn = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    async function handleLogout() {
        try {
            await signOut(auth);
            alert("Sesión cerrada exitosamente.");
            window.location.href = "index.html";
        } catch (error) {
            alert("Error al cerrar sesión: " + error.message);
        }
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }

    // Verificar si el usuario está autenticado
    auth.onAuthStateChanged(user => {
        if (!user) {
            // Si no hay usuario autenticado, redirigir al login
            window.location.href = "index.html";
        }
    });

    // Inicializar el mapa de Leaflet
    initMap();
});

// Inicializar el mapa
function initMap() {
    // Coordenadas de Medellín
    const medellinCoords = [6.2442, -75.5812];
    
    // Crear el mapa
    const map = L.map('map').setView(medellinCoords, 13);
    
    // Añadir capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Datos de agentes (simulación)
    const agentes = [
        {
            id: 1,
            nombre: "Martina Vargas",
            edad: 24,
            tipo: "paseador",
            coords: [6.2632, -75.5802],
            ubicacion: "Estadio",
            telefono: "311 620 1606",
            paseos: 134,
            rating: 4.8,
            reviews: 42,
            disponible: true,
            foto: "https://randomuser.me/api/portraits/women/65.jpg",
            experiencia: "3 años",
            especialidad: "Perros grandes",
            descripcion: "Apasionada por los animales, especialmente perros. Ofrezco paseos divertidos y seguros para mantener a tu mascota activa y feliz.",
            reseñas: [
                {
                    autor: "Carlos Gómez",
                    fecha: "15/04/2025",
                    rating: 5,
                    texto: "Martina es excelente con mi bulldog. Siempre regresa feliz y cansado después de sus paseos."
                },
                {
                    autor: "Laura Pérez",
                    fecha: "02/05/2025",
                    rating: 4,
                    texto: "Muy puntual y responsable. Mi perro la adora."
                }
            ]
        },
        {
            id: 2,
            nombre: "Laura Blanco",
            edad: 26,
            tipo: "paseador",
            coords: [6.2512, -75.5652],
            ubicacion: "Centro",
            telefono: "302 241 6269",
            paseos: 142,
            rating: 4.6,
            reviews: 38,
            disponible: true,
            foto: "https://randomuser.me/api/portraits/women/45.jpg",
            experiencia: "2 años",
            especialidad: "Perros pequeños y medianos",
            descripcion: "Amante de los animales con experiencia en entrenamiento básico. Ofrezco paseos personalizados según las necesidades de cada mascota.",
            reseñas: [
                {
                    autor: "María Jaramillo",
                    fecha: "10/05/2025",
                    rating: 5,
                    texto: "Laura es muy cariñosa con mi pomerania. La recomiendo totalmente."
                },
                {
                    autor: "Andrés Soto",
                    fecha: "28/04/2025",
                    rating: 4,
                    texto: "Excelente servicio, siempre envía fotos durante el paseo."
                }
            ]
        },
        {
            id: 3,
            nombre: "Julián Gómez",
            edad: 30,
            tipo: "paseador",
            coords: [6.2565, -75.5859],
            ubicacion: "Laureles",
            telefono: "313 620 9876",
            paseos: 198,
            rating: 4.9,
            reviews: 56,
            disponible: true,
            foto: "https://randomuser.me/api/portraits/men/32.jpg",
            experiencia: "5 años",
            especialidad: "Todo tipo de perros",
            descripcion: "Entrenador canino certificado. Ofrezco paseos educativos que combinan ejercicio con entrenamiento básico de obediencia.",
            reseñas: [
                {
                    autor: "Patricia Vélez",
                    fecha: "18/05/2025",
                    rating: 5,
                    texto: "Julián ha ayudado mucho con el comportamiento de mi labrador. Ahora es mucho más obediente."
                },
                {
                    autor: "Diego Ramírez",
                    fecha: "05/05/2025",
                    rating: 5,
                    texto: "Excelente profesional, muy puntual y responsable."
                }
            ]
        },
        {
            id: 4,
            nombre: "Ana María Restrepo",
            edad: 32,
            tipo: "veterinario",
            coords: [6.2380, -75.5720],
            ubicacion: "El Poblado",
            telefono: "300 456 7890",
            consultas: 312,
            rating: 4.9,
            reviews: 87,
            disponible: true,
            foto: "https://randomuser.me/api/portraits/women/28.jpg",
            experiencia: "7 años",
            especialidad: "Medicina general y emergencias",
            descripcion: "Veterinaria especializada en medicina general y atención de emergencias. Servicio a domicilio para mayor comodidad de tus mascotas.",
            reseñas: [
                {
                    autor: "Camila Botero",
                    fecha: "12/05/2025",
                    rating: 5,
                    texto: "La Dra. Ana María salvó a mi gato cuando tuvo una emergencia. Excelente profesional."
                },
                {
                    autor: "Juan Pablo Mejía",
                    fecha: "01/05/2025",
                    rating: 5,
                    texto: "Muy atenta y cariñosa con los animales. Mi perro no le teme como a otros veterinarios."
                }
            ]
        },
        {
            id: 5,
            nombre: "Carlos Martínez",
            edad: 35,
            tipo: "veterinario",
            coords: [6.2490, -75.5960],
            ubicacion: "Belén",
            telefono: "317 789 4561",
            consultas: 278,
            rating: 4.7,
            reviews: 65,
            disponible: true,
            foto: "https://randomuser.me/api/portraits/men/45.jpg",
            experiencia: "8 años",
            especialidad: "Dermatología y nutrición",
            descripcion: "Especialista en problemas dermatológicos y nutrición animal. Ofrezco diagnósticos precisos y tratamientos efectivos para mejorar la calidad de vida de tu mascota.",
            reseñas: [
                {
                    autor: "Sofía Álvarez",
                    fecha: "16/05/2025",
                    rating: 5,
                    texto: "El Dr. Carlos resolvió los problemas de piel de mi bulldog que otros veterinarios no pudieron solucionar."
                },
                {
                    autor: "Roberto Sánchez",
                    fecha: "03/05/2025",
                    rating: 4,
                    texto: "Muy profesional y detallista en sus diagnósticos."
                }
            ]
        }
    ];
    
    // Crear marcadores personalizados
    const paseadorIcon = L.divIcon({
        className: 'custom-marker paseador-marker',
        html: '<i class="fas fa-walking" style="color: #fff;"></i>',
        iconSize: [30, 30]
    });
    
    const veterinarioIcon = L.divIcon({
        className: 'custom-marker veterinario-marker',
        html: '<i class="fas fa-user-md" style="color: #fff;"></i>',
        iconSize: [30, 30]
    });
    
    // Añadir marcadores al mapa
    agentes.forEach(agente => {
        const icon = agente.tipo === 'paseador' ? paseadorIcon : veterinarioIcon;
        
        const marker = L.marker(agente.coords, { icon: icon }).addTo(map);
        
        // Contenido del popup
        const popupContent = `
            <div class="map-popup">
                <h3>${agente.nombre}</h3>
                <p><strong>${agente.tipo === 'paseador' ? 'Paseador' : 'Veterinario'}</strong></p>
                <p><i class="fas fa-map-marker-alt"></i> ${agente.ubicacion}</p>
                <p><i class="fas fa-star"></i> ${agente.rating} (${agente.tipo === 'paseador' ? agente.reviews : agente.reviews} reseñas)</p>
                <button class="popup-btn" onclick="showAgentDetails(${agente.id})">Ver detalles</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
    
    // Estilo para los popups
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            width: 30px !important;
            height: 30px !important;
        }
        
        .paseador-marker {
            background-color: #4CAF50;
        }
        
        .veterinario-marker {
            background-color: #2196F3;
        }
        
        .map-popup {
            text-align: center;
            padding: 5px;
        }
        
        .map-popup h3 {
            margin: 0 0 5px;
            color: #4CAF50;
        }
        
        .map-popup p {
            margin: 5px 0;
        }
        
        .popup-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 5px;
        }
        
        .popup-btn:hover {
            background-color: #388E3C;
        }
    `;
    document.head.appendChild(style);
    
    // Añadir funcionalidad para mostrar detalles del agente
    window.showAgentDetails = function(agentId) {
        const agente = agentes.find(a => a.id === agentId);
        if (agente) {
            openAgentModal(agente);
        }
    };
    
    // Cargar agentes en la sección de agentes
    loadAgents(agentes);
    
    // Configurar filtros
    setupFilters(agentes, map);
    
    // Configurar botón de encontrar el más cercano
    setupFindNearest(agentes, map);
}

// Cargar agentes en la sección de agentes
function loadAgents(agentes) {
    const agentsContainer = document.getElementById('agentsContainer');
    agentsContainer.innerHTML = '';
    
    agentes.forEach(agente => {
        const agentCard = document.createElement('div');
        agentCard.className = 'agent-card';
        agentCard.dataset.tipo = agente.tipo;
        agentCard.dataset.ubicacion = agente.ubicacion.toLowerCase();
        
        const stars = generateStars(agente.rating);
        
        agentCard.innerHTML = `
            <span class="agent-type ${agente.tipo}">${agente.tipo === 'paseador' ? 'Paseador' : 'Veterinario'}</span>
            <img src="${agente.foto}" alt="${agente.nombre}" class="agent-image">
            <h3>${agente.nombre}</h3>
            <p class="agent-age">${agente.edad} años</p>
            <div class="agent-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>${agente.ubicacion}</p>
                </div>
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <p>${agente.telefono}</p>
                </div>
                <div class="info-item">
                    <i class="${agente.tipo === 'paseador' ? 'fas fa-route' : 'fas fa-stethoscope'}"></i>
                    <p>${agente.tipo === 'paseador' ? `${agente.paseos} paseos realizados` : `${agente.consultas} consultas realizadas`}</p>
                </div>
            </div>
            <div class="agent-rating">
                ${stars}
                <span>(${agente.reviews} reseñas)</span>
            </div>
            <div class="agent-buttons">
                <a href="cita.html" class="btn-agendar">
                    <i class="fas fa-calendar-plus"></i> Agendar
                </a>
                <button class="btn-ver-mas" data-id="${agente.id}">
                    <i class="fas fa-info-circle"></i> Ver más
                </button>
            </div>
        `;
        
        agentsContainer.appendChild(agentCard);
        
        // Añadir evento para ver más detalles
        const verMasBtn = agentCard.querySelector('.btn-ver-mas');
        verMasBtn.addEventListener('click', () => {
            openAgentModal(agente);
        });
    });
}

// Generar estrellas para la calificación
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Abrir modal con detalles del agente
function openAgentModal(agente) {
    const agentModal = document.getElementById('agentModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const agentModalBody = document.getElementById('agentModalBody');
    
    const stars = generateStars(agente.rating);
    
    // Generar reseñas HTML
    let reviewsHTML = '';
    if (agente.reseñas && agente.reseñas.length > 0) {
        agente.reseñas.forEach(review => {
            const reviewStars = generateStars(review.rating);
            reviewsHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${review.autor}</span>
                        <span class="review-date">${review.fecha}</span>
                    </div>
                    <div class="review-rating">
                        ${reviewStars}
                    </div>
                    <p class="review-text">${review.texto}</p>
                </div>
            `;
        });
    } else {
        reviewsHTML = '<p>No hay reseñas disponibles.</p>';
    }
    
    agentModalBody.innerHTML = `
        <div class="modal-agent-header">
            <img src="${agente.foto}" alt="${agente.nombre}" class="modal-agent-image">
            <div class="modal-agent-info">
                <h3>${agente.nombre}</h3>
                <p>${agente.edad} años | ${agente.tipo === 'paseador' ? 'Paseador' : 'Veterinario'}</p>
                <div class="modal-agent-rating">
                    ${stars}
                    <span>(${agente.reviews} reseñas)</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Información de contacto</h4>
            <div class="modal-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <p>Ubicación: ${agente.ubicacion}</p>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-phone"></i>
                <p>Teléfono: ${agente.telefono}</p>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Experiencia</h4>
            <div class="modal-info-item">
                <i class="fas fa-clock"></i>
                <p>${agente.experiencia} de experiencia</p>
            </div>
            <div class="modal-info-item">
                <i class="${agente.tipo === 'paseador' ? 'fas fa-route' : 'fas fa-stethoscope'}"></i>
                <p>${agente.tipo === 'paseador' ? `${agente.paseos} paseos realizados` : `${agente.consultas} consultas realizadas`}</p>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-certificate"></i>
                <p>Especialidad: ${agente.especialidad}</p>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Descripción</h4>
            <p>${agente.descripcion}</p>
        </div>
        
        <div class="modal-section modal-reviews">
            <h4>Reseñas</h4>
            ${reviewsHTML}
        </div>
        
        <div class="modal-actions">
            <a href="cita.html" class="modal-btn modal-btn-primary">
                <i class="fas fa-calendar-plus"></i> Agendar cita
            </a>
            <button class="modal-btn modal-btn-secondary" id="closeModalBtn">
                <i class="fas fa-times"></i> Cerrar
            </button>
        </div>
    `;
    
    // Mostrar el modal
    agentModal.classList.add('active');
    modalOverlay.classList.add('active');
    
    // Configurar botón de cerrar
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    closeModal.addEventListener('click', () => {
        agentModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    });
    
    closeModalBtn.addEventListener('click', () => {
        agentModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    });
    
    modalOverlay.addEventListener('click', () => {
        agentModal.classList.remove('active');
        modalOverlay.classList.remove('active');
    });
}

// Configurar filtros
function setupFilters(agentes, map) {
    const agentTypeFilter = document.getElementById('agentType');
    const zoneFilter = document.getElementById('zoneFilter');
    
    // Filtrar agentes
    function filterAgents() {
        const agentType = agentTypeFilter.value;
        const zone = zoneFilter.value;
        
        const agentCards = document.querySelectorAll('.agent-card');
        
        agentCards.forEach(card => {
            const cardType = card.dataset.tipo;
            const cardZone = card.dataset.ubicacion;
            
            let showCard = true;
            
            if (agentType !== 'all' && cardType !== agentType) {
                showCard = false;
            }
            
            if (zone !== 'all' && cardZone !== zone) {
                showCard = false;
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
    }
    
    agentTypeFilter.addEventListener('change', filterAgents);
    zoneFilter.addEventListener('change', filterAgents);
}

// Configurar botón de encontrar el más cercano
function setupFindNearest(agentes, map) {
    const findNearestBtn = document.getElementById('findNearestBtn');
    
    findNearestBtn.addEventListener('click', () => {
        // Solicitar ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    const userCoords = [userLat, userLng];
                    
                    // Añadir marcador de usuario
                    const userIcon = L.divIcon({
                        className: 'custom-marker user-marker',
                        html: '<i class="fas fa-user" style="color: #fff;"></i>',
                        iconSize: [30, 30]
                    });
                    
                    // Eliminar marcador de usuario anterior si existe
                    if (window.userMarker) {
                        map.removeLayer(window.userMarker);
                    }
                    
                    window.userMarker = L.marker(userCoords, { icon: userIcon }).addTo(map);
                    window.userMarker.bindPopup('Tu ubicación').openPopup();
                    
                    // Encontrar el agente más cercano
                    let nearestAgent = null;
                    let minDistance = Infinity;
                    
                    const agentType = document.getElementById('agentType').value;
                    
                    agentes.forEach(agente => {
                        if (agentType !== 'all' && agente.tipo !== agentType) {
                            return;
                        }
                        
                        const distance = calculateDistance(
                            userLat, userLng,
                            agente.coords[0], agente.coords[1]
                        );
                        
                        if (distance < minDistance) {
                            minDistance = distance;
                            nearestAgent = agente;
                        }
                    });
                    
                    if (nearestAgent) {
                        // Centrar mapa entre usuario y agente más cercano
                        const bounds = L.latLngBounds([userCoords, nearestAgent.coords]);
                        map.fitBounds(bounds, { padding: [50, 50] });
                        
                        // Mostrar línea entre usuario y agente más cercano
                        if (window.routeLine) {
                            map.removeLayer(window.routeLine);
                        }
                        
                        window.routeLine = L.polyline([userCoords, nearestAgent.coords], {
                            color: '#FF5722',
                            weight: 3,
                            opacity: 0.7,
                            dashArray: '10, 10'
                        }).addTo(map);
                        
                        // Mostrar información del agente más cercano
                        const distance = (minDistance * 1000).toFixed(0); // Convertir a metros
                        
                        // Encontrar el marcador del agente más cercano y abrir su popup
                        map.eachLayer(layer => {
                            if (layer instanceof L.Marker && 
                                layer.getLatLng().lat === nearestAgent.coords[0] && 
                                layer.getLatLng().lng === nearestAgent.coords[1]) {
                                layer.openPopup();
                            }
                        });
                        
                        // Mostrar alerta con información
                        alert(`El ${nearestAgent.tipo} más cercano es ${nearestAgent.nombre} a ${distance} metros de tu ubicación.`);
                    }
                },
                (error) => {
                    alert('Error al obtener tu ubicación: ' + error.message);
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización');
        }
    });
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distancia en km
    return distance;
}
