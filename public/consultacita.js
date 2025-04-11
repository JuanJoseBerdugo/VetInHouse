import { db } from "./firebase-config.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Variables globales
let allCitas = [];
const citaTemplate = document.getElementById('cita-template');

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loader después de cargar
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Inicializar tabs
    initTabs();
    
    // Inicializar búsqueda
    initSearch();
    
    // Cargar todas las citas al inicio
    loadAllCitas();
    
    // Inicializar notificaciones
    initNotifications();
});

// Inicializar sistema de tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones y panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            // Mostrar el panel correspondiente
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Cargar datos específicos según la tab
            if (tabId === 'upcoming') {
                loadUpcomingCitas();
            } else if (tabId === 'past') {
                loadPastCitas();
            }
        });
    });
}

// Inicializar búsqueda
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    // Buscar al hacer clic en el botón
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// Inicializar notificaciones
function initNotifications() {
    const notification = document.getElementById('notification');
    const closeBtn = notification.querySelector('.notification-close');
    
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
    });
}

// Cargar todas las citas desde Firebase
async function loadAllCitas() {
    try {
        // Referencia a la colección "citas"
        const citasRef = collection(db, "citas");
        const querySnapshot = await getDocs(citasRef);
        
        // Limpiar array de citas
        allCitas = [];
        
        // Procesar resultados
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            allCitas.push({
                id: doc.id,
                ...data
            });
        });
        
        // Ordenar citas por fecha (más recientes primero)
        allCitas.sort((a, b) => {
            return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
        });
        
    } catch (error) {
        console.error("Error al cargar citas:", error);
        showNotification('Error', 'No se pudieron cargar tus citas. Intenta de nuevo más tarde.', 'error');
    }
}

// Cargar citas próximas
async function loadUpcomingCitas() {
    const upcomingContainer = document.getElementById('upcomingContainer');
    
    try {
        // Filtrar citas futuras (a partir de hoy)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingCitas = allCitas.filter(cita => {
            if (cita.fechaCita) {
                const citaDate = new Date(cita.fechaCita);
                return citaDate >= today;
            }
            return false;
        });
        
        // Ordenar por fecha (más cercanas primero)
        upcomingCitas.sort((a, b) => {
            return new Date(a.fechaCita) - new Date(b.fechaCita);
        });
        
        // Mostrar resultados
        renderCitas(upcomingCitas, upcomingContainer, 'No tienes citas próximas programadas.');
        
    } catch (error) {
        console.error("Error al cargar citas próximas:", error);
        upcomingContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle empty-icon"></i>
                <p>Ocurrió un error al cargar tus citas próximas.</p>
            </div>
        `;
    }
}

// Cargar historial de citas
async function loadPastCitas() {
    const pastContainer = document.getElementById('pastContainer');
    
    try {
        // Filtrar citas pasadas (anteriores a hoy)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const pastCitas = allCitas.filter(cita => {
            if (cita.fechaCita) {
                const citaDate = new Date(cita.fechaCita);
                return citaDate < today;
            }
            return false;
        });
        
        // Ordenar por fecha (más recientes primero)
        pastCitas.sort((a, b) => {
            return new Date(b.fechaCita) - new Date(a.fechaCita);
        });
        
        // Mostrar resultados
        renderCitas(pastCitas, pastContainer, 'No tienes citas anteriores en tu historial.');
        
    } catch (error) {
        console.error("Error al cargar historial de citas:", error);
        pastContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle empty-icon"></i>
                <p>Ocurrió un error al cargar tu historial de citas.</p>
            </div>
        `;
    }
}

// Realizar búsqueda
function performSearch(searchTerm) {
    const resultContainer = document.getElementById('resultContainer');
    const resultStats = document.getElementById('resultStats');
    
    // Validar término de búsqueda
    if (!searchTerm.trim()) {
        resultContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search empty-icon"></i>
                <p>Ingresa tu nombre o el de tu mascota para buscar tus citas</p>
            </div>
        `;
        resultStats.textContent = '';
        return;
    }
    
    try {
        // Normalizar término de búsqueda
        const term = searchTerm.trim().toLowerCase();
        
        // Filtrar citas que coincidan con el término
        const filteredCitas = allCitas.filter(cita => {
            const nombreDueño = cita.nombreDueño?.toLowerCase() || '';
            const nombreMascota = cita.nombreMascota?.toLowerCase() || '';
            
            return nombreDueño.includes(term) || nombreMascota.includes(term);
        });
        
        // Mostrar estadísticas de resultados
        if (filteredCitas.length > 0) {
            resultStats.textContent = `Se encontraron ${filteredCitas.length} cita(s) para "${searchTerm}"`;
        } else {
            resultStats.textContent = `No se encontraron citas para "${searchTerm}"`;
        }
        
        // Mostrar resultados
        renderCitas(filteredCitas, resultContainer, `No se encontraron citas para "${searchTerm}"`);
        
    } catch (error) {
        console.error("Error al buscar citas:", error);
        resultContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle empty-icon"></i>
                <p>Ocurrió un error al buscar tus citas.</p>
            </div>
        `;
        resultStats.textContent = '';
    }
}

// Renderizar citas en un contenedor
function renderCitas(citas, container, emptyMessage) {
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Verificar si hay citas
    if (citas.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times empty-icon"></i>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }
    
    // Crear fragmento para mejor rendimiento
    const fragment = document.createDocumentFragment();
    
    // Renderizar cada cita
    citas.forEach(cita => {
        const citaCard = createCitaCard(cita);
        fragment.appendChild(citaCard);
    });
    
    // Agregar todas las citas al contenedor
    container.appendChild(fragment);
    
    // Inicializar interacciones en las tarjetas
    initCardInteractions();
}

// Crear tarjeta de cita
function createCitaCard(cita) {
    // Clonar template
    const citaCard = citaTemplate.content.cloneNode(true);
    
    // Llenar datos básicos
    citaCard.querySelector('.mascota-nombre').textContent = cita.nombreMascota || 'Sin nombre';
    citaCard.querySelector('.cita-tipo').textContent = cita.tipoMascota || 'Mascota';
    
    // Estado de la cita
    const statusBadge = citaCard.querySelector('.status-badge');
    if (cita.estado) {
        statusBadge.textContent = cita.estado;
        statusBadge.classList.add(cita.estado.toLowerCase());
    } else {
        statusBadge.textContent = 'Pendiente';
        statusBadge.classList.add('pending');
    }
    
    // Información principal
    citaCard.querySelector('.dueno-nombre').textContent = cita.nombreDueño || 'Sin nombre';
    
    // Fecha y hora
    if (cita.fechaCita) {
        const fechaCita = new Date(cita.fechaCita);
        citaCard.querySelector('.cita-fecha').textContent = fechaCita.toLocaleDateString();
    } else {
        citaCard.querySelector('.cita-fecha').textContent = 'No especificada';
    }
    
    citaCard.querySelector('.cita-hora').textContent = cita.horaCita || 'No especificada';
    citaCard.querySelector('.cita-servicio').textContent = cita.tipoServicio || 'Consulta general';
    
    // Detalles de la mascota
    citaCard.querySelector('.mascota-tipo').textContent = cita.tipoMascota || 'No especificado';
    citaCard.querySelector('.mascota-raza').textContent = cita.razaMascota || 'No especificada';
    
    // Edad con formato
    if (cita.edadMascota) {
        const edad = parseInt(cita.edadMascota);
        if (edad < 12) {
            citaCard.querySelector('.mascota-edad').textContent = `${edad} meses`;
        } else {
            const años = Math.floor(edad / 12);
            const meses = edad % 12;
            if (meses === 0) {
                citaCard.querySelector('.mascota-edad').textContent = `${años} año${años !== 1 ? 's' : ''}`;
            } else {
                citaCard.querySelector('.mascota-edad').textContent = `${años} año${años !== 1 ? 's' : ''} y ${meses} mes${meses !== 1 ? 'es' : ''}`;
            }
        }
    } else {
        citaCard.querySelector('.mascota-edad').textContent = 'No especificada';
    }
    
    citaCard.querySelector('.mascota-genero').textContent = cita.generoMascota || 'No especificado';
    citaCard.querySelector('.mascota-sintomas').textContent = cita.sintomasMascota || 'No especificados';
    
    // Asignar ID a la tarjeta para referencia
    const card = citaCard.querySelector('.cita-card');
    card.setAttribute('data-id', cita.id);
    
    return citaCard;
}

// Inicializar interacciones en las tarjetas
function initCardInteractions() {
    // Toggle para mostrar/ocultar detalles
    const toggleButtons = document.querySelectorAll('.toggle-details');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const detailsContent = button.closest('.cita-details').querySelector('.details-content');
            detailsContent.classList.toggle('active');
            button.classList.toggle('active');
        });
    });
    
    // Botones de editar
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const citaId = button.closest('.cita-card').getAttribute('data-id');
            // Redirigir a página de edición (puedes implementar esto después)
            showNotification('Función en desarrollo', 'La edición de citas estará disponible próximamente.', 'info');
        });
    });
    
    // Botones de cancelar
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const citaId = button.closest('.cita-card').getAttribute('data-id');
            // Implementar lógica de cancelación (puedes implementar esto después)
            showNotification('Función en desarrollo', 'La cancelación de citas estará disponible próximamente.', 'info');
        });
    });
}

// Mostrar notificación
function showNotification(title, message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    // Establecer tipo de notificación
    notificationIcon.className = 'notification-icon';
    notificationIcon.classList.add(type);
    
    // Cambiar icono según el tipo
    const iconElement = notificationIcon.querySelector('i') || document.createElement('i');
    iconElement.className = 'fas';
    
    switch (type) {
        case 'success':
            iconElement.classList.add('fa-check-circle');
            break;
        case 'error':
            iconElement.classList.add('fa-exclamation-circle');
            break;
        default:
            iconElement.classList.add('fa-info-circle');
    }
    
    if (!notificationIcon.contains(iconElement)) {
        notificationIcon.appendChild(iconElement);
    }
    
    // Establecer contenido
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Mostrar notificación
    notification.classList.add('show');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Evento de búsqueda
document.getElementById("searchBtn").addEventListener("click", function() {
    const searchInput = document.getElementById("searchInput").value.trim();
    performSearch(searchInput);
});