// Variables globales
let map;
let walkerMarker;
let petMarker;
let walkPath;
let plannedRoute;
let isEmergencyActive = false;
let emergencyTimer;
let emergencyStartTime;
let walkTimer;
let walkStartTime = new Date();
let currentEmergencyType = null;
let chatMessages = [];
let lastWalkerResponse = new Date();
let simulationInterval;

// Coordenadas simuladas
const initialPosition = [14.6349, -90.5069]; // Guatemala City
let currentWalkerPosition = [14.6349, -90.5069];
let currentPetPosition = [14.6349, -90.5069];
let plannedRoutePoints = [
    [14.6349, -90.5069],
    [14.6360, -90.5080],
    [14.6370, -90.5090],
    [14.6380, -90.5100],
    [14.6390, -90.5110]
];

// Datos simulados del paseo
const walkData = {
    walker: {
        name: "Carlos Mendoza",
        rating: 4.8,
        reviews: 127,
        phone: "+502 1234-5678",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isOnline: true,
        lastSeen: new Date()
    },
    pet: {
        name: "Max",
        breed: "Golden Retriever",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=face",
        heartRate: "Normal",
        activity: "Activo"
    }
};

// Tipos de emergencias
const emergencyTypes = {
    'ruta-incorrecta': {
        title: 'Desviación de Ruta',
        description: 'El paseador se ha desviado significativamente de la ruta acordada',
        severity: 'medium',
        icon: 'fas fa-route',
        actions: [
            'Notificación enviada al paseador',
            'Alerta enviada a supervisión',
            'Ruta alternativa calculada'
        ]
    },
    'comportamiento-sospechoso': {
        title: 'Comportamiento Sospechoso',
        description: 'Se ha detectado actividad inusual en el comportamiento del paseador',
        severity: 'high',
        icon: 'fas fa-user-times',
        actions: [
            'Supervisión activada inmediatamente',
            'Grabación de audio iniciada',
            'Paseador de respaldo contactado'
        ]
    },
    'mascota-perdida': {
        title: 'Mascota Extraviada',
        description: 'No se puede localizar a la mascota en el área del paseador',
        severity: 'high',
        icon: 'fas fa-search',
        actions: [
            'Búsqueda inmediata activada',
            'Policía local notificada',
            'Equipo de rescate en camino'
        ]
    },
    'falta-comunicacion': {
        title: 'Comunicación Perdida',
        description: 'El paseador no responde a mensajes ni llamadas',
        severity: 'medium',
        icon: 'fas fa-phone-slash',
        actions: [
            'Intentos de contacto múltiples',
            'Verificación de ubicación GPS',
            'Contacto con emergencias locales'
        ]
    },
    'tiempo-excedido': {
        title: 'Tiempo Excedido',
        description: 'El paseo ha superado el tiempo acordado sin notificación',
        severity: 'low',
        icon: 'fas fa-clock',
        actions: [
            'Recordatorio enviado al paseador',
            'Cliente notificado del retraso',
            'Ajuste de tarifa calculado'
        ]
    },
    'zona-peligrosa': {
        title: 'Zona de Riesgo',
        description: 'El paseador ha ingresado a una zona marcada como peligrosa',
        severity: 'high',
        icon: 'fas fa-exclamation-triangle',
        actions: [
            'Alerta inmediata enviada',
            'Solicitud de evacuación',
            'Servicios de emergencia alertados'
        ]
    }
};

// Mensajes automáticos del paseador según el tipo de emergencia
const emergencyResponses = {
    'ruta-incorrecta': [
        "Disculpe, tuve que desviarme por una obra en la calle",
        "Hay mucho tráfico, tomé una ruta alternativa",
        "El parque principal está cerrado, voy a otro lugar"
    ],
    'comportamiento-sospechoso': [
        "Todo está bien, Max está jugando",
        "Estamos descansando un momento",
        "¿Hay algún problema? Todo normal por aquí"
    ],
    'falta-comunicacion': [
        "Perdón, tenía el teléfono en silencio",
        "Estaba muy concentrado cuidando a Max",
        "No había señal en esa zona"
    ],
    'tiempo-excedido': [
        "Max está muy activo, necesita más ejercicio",
        "Perdón por el retraso, había mucha gente",
        "Casi terminamos, 10 minutos más"
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loader después de 2 segundos
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        document.getElementById('loader').style.visibility = 'hidden';
    }, 2000);

    initializeMap();
    initializeEventListeners();
    startWalkTimer();
    simulateWalk();
    initializeChat();
});

// Inicializar mapa
function initializeMap() {
    map = L.map('map').setView(initialPosition, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ruta planificada
    plannedRoute = L.polyline(plannedRoutePoints, { 
        color: '#2196F3', 
        weight: 3, 
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // Marcador del paseador
    const walkerIcon = L.divIcon({
        className: 'walker-marker',
        html: '<div style="background-color: #4CAF50; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-walking"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Marcador de la mascota
    const petIcon = L.divIcon({
        className: 'pet-marker',
        html: '<div style="background-color: #FF9800; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><i class="fas fa-paw"></i></div>',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
    });

    walkerMarker = L.marker(currentWalkerPosition, { icon: walkerIcon }).addTo(map);
    petMarker = L.marker(currentPetPosition, { icon: petIcon }).addTo(map);

    // Inicializar ruta del paseo
    walkPath = L.polyline([], { color: '#4CAF50', weight: 4, opacity: 0.7 }).addTo(map);

    // Popup del paseador
    walkerMarker.bindPopup(`
        <div style="text-align: center;">
            <img src="${walkData.walker.image}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px;">
            <h4>${walkData.walker.name}</h4>
            <p>⭐ ${walkData.walker.rating} (${walkData.walker.reviews} reseñas)</p>
            <p>Paseando a ${walkData.pet.name}</p>
        </div>
    `);

    // Popup de la mascota
    petMarker.bindPopup(`
        <div style="text-align: center;">
            <img src="${walkData.pet.image}" style="width: 50px; height: 50px; border-radius: 50%; margin-bottom: 10px;">
            <h4>${walkData.pet.name}</h4>
            <p>${walkData.pet.breed}</p>
        </div>
    `);
}

// Inicializar event listeners
function initializeEventListeners() {
    // Botón de emergencia
    document.getElementById('emergencyBtn').addEventListener('click', () => {
        document.getElementById('reportModal').classList.add('show');
    });

    // Botón de simulación automática
    document.getElementById('autoEmergencyBtn').addEventListener('click', () => {
        document.getElementById('emergencyTypeModal').classList.add('show');
    });

    // Botones del mapa
    document.getElementById('centerMapBtn').addEventListener('click', centerMap);
    document.getElementById('refreshBtn').addEventListener('click', refreshLocation);
    document.getElementById('routeBtn').addEventListener('click', togglePlannedRoute);

    // Botones de acción
    document.getElementById('callWalkerBtn').addEventListener('click', callWalker);
    document.getElementById('messageBtn').addEventListener('click', openChat);
    document.getElementById('reportBtn').addEventListener('click', () => {
        document.getElementById('reportModal').classList.add('show');
    });
    document.getElementById('vetBtn').addEventListener('click', contactVet);

    // Chat
    document.getElementById('closeChatBtn').addEventListener('click', closeChat);
    document.getElementById('sendMessageBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    document.getElementById('emergencyCallBtn').addEventListener('click', emergencyCall);

    // Modales de emergencia
    document.getElementById('cancelEmergencyBtn').addEventListener('click', cancelEmergency);
    document.getElementById('emergencyCallBtn').addEventListener('click', emergencyCall);

    // Modal de reporte
    document.getElementById('closeReportBtn').addEventListener('click', closeReportModal);
    document.getElementById('cancelReportBtn').addEventListener('click', closeReportModal);
    document.getElementById('submitReportBtn').addEventListener('click', submitReport);

    // Modal de tipos de emergencia
    document.getElementById('closeEmergencyTypeBtn').addEventListener('click', () => {
        document.getElementById('emergencyTypeModal').classList.remove('show');
    });

    // Botones de tipos de emergencia
    document.querySelectorAll('.emergency-type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            triggerEmergency(type);
            document.getElementById('emergencyTypeModal').classList.remove('show');
        });
    });

    // Botones de urgencia
    document.querySelectorAll('.urgency-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.urgency-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Inicializar chat
function initializeChat() {
    chatMessages = [
        {
            type: 'received',
            content: '¡Hola! Acabo de recoger a Max. Está muy emocionado por el paseo 🐕',
            time: '14:30'
        },
        {
            type: 'received',
            content: 'Vamos hacia el parque central como acordamos',
            time: '14:32'
        },
        {
            type: 'received',
            content: 'Max está jugando muy bien con otros perros',
            time: '14:45'
        }
    ];
    updateUnreadCount();
}

// Simular movimiento del paseo
function simulateWalk() {
    let routeIndex = 0;
    let isDeviating = false;

    simulationInterval = setInterval(() => {
        if (!isEmergencyActive || currentEmergencyType !== 'ruta-incorrecta') {
            // Movimiento normal hacia la ruta planificada
            if (routeIndex < plannedRoutePoints.length - 1) {
                const target = plannedRoutePoints[routeIndex];
                const deltaLat = (target[0] - currentWalkerPosition[0]) * 0.1;
                const deltaLng = (target[1] - currentWalkerPosition[1]) * 0.1;

                currentWalkerPosition[0] += deltaLat + (Math.random() - 0.5) * 0.0002;
                currentWalkerPosition[1] += deltaLng + (Math.random() - 0.5) * 0.0002;

                // Verificar si llegó cerca del punto objetivo
                const distance = Math.sqrt(
                    Math.pow(target[0] - currentWalkerPosition[0], 2) + 
                    Math.pow(target[1] - currentWalkerPosition[1], 2)
                );
                
                if (distance < 0.001) {
                    routeIndex++;
                }
            } else {
                // Movimiento aleatorio al final de la ruta
                currentWalkerPosition[0] += (Math.random() - 0.5) * 0.0005;
                currentWalkerPosition[1] += (Math.random() - 0.5) * 0.0005;
            }
        } else {
            // Movimiento errático durante emergencia de ruta incorrecta
            currentWalkerPosition[0] += (Math.random() - 0.5) * 0.002;
            currentWalkerPosition[1] += (Math.random() - 0.5) * 0.002;
        }

        // La mascota sigue al paseador con un pequeño retraso
        setTimeout(() => {
            if (currentEmergencyType !== 'mascota-perdida') {
                currentPetPosition[0] = currentWalkerPosition[0] + (Math.random() - 0.5) * 0.0002;
                currentPetPosition[1] = currentWalkerPosition[1] + (Math.random() - 0.5) * 0.0002;
                petMarker.setLatLng(currentPetPosition);
            }
        }, 2000);

        walkerMarker.setLatLng(currentWalkerPosition);
        
        // Agregar punto a la ruta
        walkPath.addLatLng(currentWalkerPosition);

        // Actualizar información de ubicación
        updateLocationInfo();

        // Verificar desviaciones de ruta
        checkRouteDeviation();

    }, 3000);
}

// Verificar desviación de ruta
function checkRouteDeviation() {
    if (currentEmergencyType === 'ruta-incorrecta') {
        document.getElementById('deviationInfo').style.display = 'flex';
        document.getElementById('deviationText').textContent = 'Desviación significativa detectada';
        
        // Actualizar indicadores
        updateBehaviorIndicator('routeIndicator', 'danger', 'Ruta: Desviada');
    } else {
        document.getElementById('deviationInfo').style.display = 'none';
        updateBehaviorIndicator('routeIndicator', 'success', 'Ruta: Normal');
    }
}

// Actualizar información de ubicación
function updateLocationInfo() {
    const locations = [
        "Parque Central, Zona 10",
        "Avenida Reforma, Zona 9",
        "Plaza Fontabella, Zona 10",
        "Parque de la Industria, Zona 9",
        "Centro Comercial Oakland, Zona 10"
    ];
    
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    document.getElementById('currentLocation').textContent = randomLocation;

    // Calcular distancia simulada
    const distance = (walkPath.getLatLngs().length * 0.05).toFixed(1);
    document.getElementById('walkDistance').textContent = `${distance} km recorridos`;
}

// Actualizar indicadores de comportamiento
function updateBehaviorIndicator(indicatorId, status, text) {
    const indicator = document.getElementById(indicatorId);
    const icon = indicator.querySelector('i');
    const span = indicator.querySelector('span');
    
    // Remover clases anteriores
    indicator.classList.remove('success', 'warning', 'danger');
    
    // Agregar nueva clase
    indicator.classList.add(status);
    span.textContent = text;
}

// Timer del paseo
function startWalkTimer() {
    walkTimer = setInterval(() => {
        const elapsed = Math.floor((new Date() - walkStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('walkTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} min`;
        
        // Simular tiempo excedido después de 5 minutos
        if (elapsed > 300 && !isEmergencyActive) {
            // Posibilidad de activar emergencia por tiempo
            if (Math.random() < 0.1) { // 10% de probabilidad cada segundo
                triggerEmergency('tiempo-excedido');
            }
        }
    }, 1000);
}

// Activar emergencia específica
function triggerEmergency(type) {
    if (isEmergencyActive) return;

    currentEmergencyType = type;
    isEmergencyActive = true;
    emergencyStartTime = new Date();

    const emergency = emergencyTypes[type];
    
    // Actualizar estado visual
    updateEmergencyStatus(emergency);
    
    // Mostrar modal de emergencia
    showEmergencyModal(emergency);
    
    // Iniciar timer de emergencia
    startEmergencyTimer();
    
    // Simular comportamientos específicos
    simulateEmergencyBehavior(type);
    
    // Mostrar alertas
    showEmergencyAlert(emergency);
    
    // Respuesta automática del paseador
    setTimeout(() => {
        if (emergencyResponses[type]) {
            const responses = emergencyResponses[type];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('received', randomResponse, getCurrentTime());
        }
    }, Math.random() * 10000 + 5000); // Entre 5-15 segundos
}

// Actualizar estado de emergencia
function updateEmergencyStatus(emergency) {
    const statusElement = document.getElementById('emergencyStatus');
    const statusIcon = statusElement.querySelector('.status-icon i');
    const statusInfo = statusElement.querySelector('.status-info');
    const riskBadge = statusElement.querySelector('.risk-badge');

    statusElement.classList.remove('emergency-active', 'warning-active');
    
    if (emergency.severity === 'high') {
        statusElement.classList.add('emergency-active');
        statusIcon.className = 'fas fa-exclamation-triangle';
        statusInfo.innerHTML = `<h3>¡EMERGENCIA!</h3><p>${emergency.title}</p>`;
        riskBadge.className = 'risk-badge high';
        riskBadge.textContent = 'Riesgo: Alto';
    } else if (emergency.severity === 'medium') {
        statusElement.classList.add('warning-active');
        statusIcon.className = 'fas fa-exclamation-circle';
        statusInfo.innerHTML = `<h3>Alerta</h3><p>${emergency.title}</p>`;
        riskBadge.className = 'risk-badge medium';
        riskBadge.textContent = 'Riesgo: Medio';
    } else {
        statusIcon.className = 'fas fa-info-circle';
        statusInfo.innerHTML = `<h3>Atención</h3><p>${emergency.title}</p>`;
        riskBadge.className = 'risk-badge low';
        riskBadge.textContent = 'Riesgo: Bajo';
    }

    // Actualizar estado del paseador
    const walkerStatus = document.getElementById('walkerStatus');
    if (emergency.severity === 'high') {
        walkerStatus.classList.add('danger');
        walkerStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    } else if (emergency.severity === 'medium') {
        walkerStatus.classList.add('warning');
        walkerStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
}

// Mostrar modal de emergencia
function showEmergencyModal(emergency) {
    const modal = document.getElementById('emergencyModal');
    const title = document.getElementById('emergencyTypeTitle');
    const description = document.getElementById('emergencyDescription');
    const severityBadge = document.getElementById('severityBadge');
    const actionsList = document.getElementById('emergencyActionsList');

    title.textContent = emergency.title;
    description.textContent = emergency.description;
    
    severityBadge.className = `severity-badge ${emergency.severity}`;
    severityBadge.textContent = emergency.severity === 'high' ? 'Alta' : 
                               emergency.severity === 'medium' ? 'Media' : 'Baja';

    // Actualizar lista de acciones
    actionsList.innerHTML = '';
    emergency.actions.forEach(action => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${action}`;
        actionsList.appendChild(li);
    });

    modal.classList.add('show');
}

// Simular comportamientos específicos de emergencia
function simulateEmergencyBehavior(type) {
    switch(type) {
        case 'ruta-incorrecta':
            updateBehaviorIndicator('routeIndicator', 'danger', 'Ruta: Desviada');
            break;
        case 'comportamiento-sospechoso':
            updateBehaviorIndicator('speedIndicator', 'warning', 'Velocidad: Irregular');
            updateBehaviorIndicator('communicationIndicator', 'warning', 'Comunicación: Limitada');
            break;
        case 'mascota-perdida':
            // Ocultar mascota del mapa
            map.removeLayer(petMarker);
            document.getElementById('petStatus').innerHTML = '<i class="fas fa-question"></i>';
            document.getElementById('petHeartRate').textContent = 'Desconocido';
            document.getElementById('petActivity').textContent = 'Sin señal';
            break;
        case 'falta-comunicacion':
            updateBehaviorIndicator('communicationIndicator', 'danger', 'Comunicación: Sin respuesta');
            walkData.walker.isOnline = false;
            document.querySelector('.chat-status').textContent = 'Sin conexión';
            document.querySelector('.chat-status').classList.remove('online');
            document.querySelector('.chat-status').classList.add('offline');
            break;
        case 'tiempo-excedido':
            document.getElementById('walkStatus').className = 'status-badge warning';
            document.getElementById('walkStatus').textContent = 'Tiempo excedido';
            break;
        case 'zona-peligrosa':
            updateBehaviorIndicator('routeIndicator', 'danger', 'Ruta: Zona peligrosa');
            break;
    }
}

// Mostrar alerta de emergencia
function showEmergencyAlert(emergency) {
    const alertsContainer = document.getElementById('emergencyAlerts');
    const alert = document.createElement('div');
    alert.className = `alert ${emergency.severity === 'high' ? 'critical' : emergency.severity === 'medium' ? 'warning' : 'info'}`;
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="${emergency.icon}"></i>
            <div>
                <h4>${emergency.title}</h4>
                <p>${emergency.description}</p>
            </div>
        </div>
    `;
    
    alertsContainer.appendChild(alert);
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 10000);
}

// Timer de emergencia
function startEmergencyTimer() {
    emergencyTimer = setInterval(() => {
        const elapsed = Math.floor((new Date() - emergencyStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('emergencyTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Cancelar emergencia
function cancelEmergency() {
    isEmergencyActive = false;
    currentEmergencyType = null;
    clearInterval(emergencyTimer);

    // Restaurar estado visual
    const statusElement = document.getElementById('emergencyStatus');
    const statusIcon = statusElement.querySelector('.status-icon i');
    const statusInfo = statusElement.querySelector('.status-info');
    const riskBadge = statusElement.querySelector('.risk-badge');

    statusElement.classList.remove('emergency-active', 'warning-active');
    statusIcon.className = 'fas fa-shield-check';
    statusInfo.innerHTML = '<h3>Estado: Normal</h3><p>Tu mascota está segura</p>';
    riskBadge.className = 'risk-badge low';
    riskBadge.textContent = 'Riesgo: Bajo';

    // Restaurar indicadores
    updateBehaviorIndicator('routeIndicator', 'success', 'Ruta: Normal');
    updateBehaviorIndicator('speedIndicator', 'success', 'Velocidad: Normal');
    updateBehaviorIndicator('communicationIndicator', 'success', 'Comunicación: Activa');

    // Restaurar estado del paseador
    const walkerStatus = document.getElementById('walkerStatus');
    walkerStatus.classList.remove('warning', 'danger');
    walkerStatus.innerHTML = '<i class="fas fa-circle"></i>';

    // Restaurar mascota si estaba perdida
    if (!map.hasLayer(petMarker)) {
        map.addLayer(petMarker);
        document.getElementById('petStatus').innerHTML = '<i class="fas fa-heart"></i>';
        document.getElementById('petHeartRate').textContent = 'Normal';
        document.getElementById('petActivity').textContent = 'Activo';
    }

    // Restaurar comunicación
    walkData.walker.isOnline = true;
    document.querySelector('.chat-status').textContent = 'En línea';
    document.querySelector('.chat-status').classList.remove('offline');
    document.querySelector('.chat-status').classList.add('online');

    // Restaurar estado del paseo
    document.getElementById('walkStatus').className = 'status-badge active';
    document.getElementById('walkStatus').textContent = 'En paseo';

    // Ocultar desviación
    document.getElementById('deviationInfo').style.display = 'none';

    // Cerrar modal
    document.getElementById('emergencyModal').classList.remove('show');

    showNotification('Emergencia resuelta', 'El estado ha vuelto a la normalidad', 'success');
}

// Funciones del chat
function openChat() {
    document.getElementById('chatModal').classList.add('show');
    updateChatMessages();
    resetUnreadCount();
}

function closeChat() {
    document.getElementById('chatModal').classList.remove('show');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('sent', message, getCurrentTime());
        input.value = '';
        
        // Simular respuesta del paseador
        setTimeout(() => {
            simulateWalkerResponse(message);
        }, Math.random() * 3000 + 1000);
    }
}

function addChatMessage(type, content, time) {
    chatMessages.push({ type, content, time });
    updateChatMessages();
    
    if (type === 'received' && !document.getElementById('chatModal').classList.contains('show')) {
        updateUnreadCount();
    }
}

function updateChatMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    chatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${msg.content}</p>
                <span class="message-time">${msg.time}</span>
            </div>
        `;
        container.appendChild(messageDiv);
    });
    
    container.scrollTop = container.scrollHeight;
}

function simulateWalkerResponse(userMessage) {
    const responses = [
        "Entendido, gracias por el mensaje",
        "Todo está bien por aquí",
        "Max está muy feliz",
        "Perfecto, seguimos con el paseo",
        "Gracias por preguntar",
        "Estamos en camino de regreso",
        "Max se está divirtiendo mucho"
    ];
    
    // Respuestas específicas según el mensaje del usuario
    if (userMessage.toLowerCase().includes('como') || userMessage.toLowerCase().includes('cómo')) {
        const statusResponses = [
            "Max está muy bien, jugando y corriendo",
            "Todo perfecto, está muy activo",
            "Excelente, se está portando muy bien"
        ];
        const response = statusResponses[Math.floor(Math.random() * statusResponses.length)];
        addChatMessage('received', response, getCurrentTime());
    } else if (userMessage.toLowerCase().includes('donde') || userMessage.toLowerCase().includes('dónde')) {
        const locationResponses = [
            "Estamos en el parque central",
            "Ahora mismo en la zona de juegos",
            "Caminando por el sendero principal"
        ];
        const response = locationResponses[Math.floor(Math.random() * locationResponses.length)];
        addChatMessage('received', response, getCurrentTime());
    } else {
        const response = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('received', response, getCurrentTime());
    }
}

function updateUnreadCount() {
    const unreadMessages = chatMessages.filter(msg => 
        msg.type === 'received' && 
        new Date(msg.time) > lastWalkerResponse
    ).length;
    
    const unreadElement = document.getElementById('unreadCount');
    if (unreadMessages > 0) {
        unreadElement.textContent = unreadMessages;
        unreadElement.style.display = 'flex';
    } else {
        unreadElement.style.display = 'none';
    }
}

function resetUnreadCount() {
    lastWalkerResponse = new Date();
    document.getElementById('unreadCount').style.display = 'none';
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

// Funciones de los botones de acción
function callWalker() {
    if (currentEmergencyType === 'falta-comunicacion') {
        showNotification('Sin respuesta', 'El paseador no contesta la llamada', 'error');
    } else {
        showNotification('Llamando...', `Conectando con ${walkData.walker.name}`, 'info');
        setTimeout(() => {
            showNotification('Llamada conectada', 'Hablando con el paseador', 'success');
        }, 2000);
    }
}

function emergencyCall() {
    showNotification('Llamada de emergencia', 'Conectando con servicios de emergencia...', 'info');
    setTimeout(() => {
        showNotification('Emergencia contactada', 'Servicios en camino', 'success');
    }, 3000);
}

function contactVet() {
    showNotification('Contactando veterinario', 'Buscando veterinario disponible...', 'info');
    setTimeout(() => {
        showNotification('Veterinario encontrado', 'Dr. García está disponible para consulta', 'success');
    }, 3000);
}

// Funciones del mapa
function centerMap() {
    map.setView(currentWalkerPosition, 16);
    showNotification('Mapa centrado', 'Vista centrada en la ubicación actual', 'info');
}

function refreshLocation() {
    showNotification('Actualizando...', 'Obteniendo ubicación más reciente', 'info');
    setTimeout(() => {
        showNotification('Ubicación actualizada', 'Datos de GPS actualizados', 'success');
    }, 2000);
}

function togglePlannedRoute() {
    if (map.hasLayer(plannedRoute)) {
        map.removeLayer(plannedRoute);
        showNotification('Ruta oculta', 'Ruta planificada ocultada', 'info');
    } else {
        map.addLayer(plannedRoute);
        showNotification('Ruta mostrada', 'Ruta planificada visible', 'info');
    }
}

// Modal de reporte
function closeReportModal() {
    document.getElementById('reportModal').classList.remove('show');
    document.getElementById('reportForm').reset();
    document.querySelectorAll('.urgency-btn').forEach(btn => btn.classList.remove('selected'));
}

function submitReport() {
    const problemType = document.getElementById('problemType').value;
    const description = document.getElementById('problemDescription').value;
    const urgencyBtn = document.querySelector('.urgency-btn.selected');

    if (!problemType || !description || !urgencyBtn) {
        showNotification('Error', 'Por favor completa todos los campos', 'error');
        return;
    }

    const urgency = urgencyBtn.dataset.urgency;
    
    showNotification('Reporte enviado', `Reporte de ${urgency} urgencia enviado correctamente`, 'success');
    closeReportModal();
    
    // Simular activación de emergencia basada en el reporte
    setTimeout(() => {
        if (urgency === 'alta' || urgency === 'critica') {
            const emergencyType = problemType === 'comportamiento' ? 'comportamiento-sospechoso' :
                                 problemType === 'ruta' ? 'ruta-incorrecta' :
                                 problemType === 'mascota-perdida' ? 'mascota-perdida' :
                                 problemType === 'comunicacion' ? 'falta-comunicacion' :
                                 'comportamiento-sospechoso';
            triggerEmergency(emergencyType);
        }
    }, 2000);
}

// Sistema de notificaciones
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
        border-left: 4px solid ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        animation: slideInRight 0.3s ease;
        margin-bottom: 10px;
    `;

    document.body.appendChild(notification);

    // Cerrar notificación
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Agregar estilos CSS para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-content h4 {
        margin: 0 0 5px 0;
        font-size: 14px;
        font-weight: 600;
    }
    
    .notification-content p {
        margin: 0;
        font-size: 12px;
        color: #666;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        padding: 0;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        color: #333;
    }
`;
document.head.appendChild(notificationStyles);

// Limpiar intervalos al salir
window.addEventListener('beforeunload', function() {
    if (simulationInterval) clearInterval(simulationInterval);
    if (walkTimer) clearInterval(walkTimer);
    if (emergencyTimer) clearInterval(emergencyTimer);
});
