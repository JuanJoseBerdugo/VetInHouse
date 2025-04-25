// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, startAfter, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0mMbM1lhMvSGf2BcXd3lt0HTINIoY6vQ",
    authDomain: "vetinhouse-97171.firebaseapp.com",
    projectId: "vetinhouse-97171",
    storageBucket: "vetinhouse-97171.appspot.com",
    messagingSenderId: "226468046837",
    appId: "1:226468046837:web:2c1ec9f9d66714870862bc",
    measurementId: "G-RJZR816SQ0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM elements
const uploadPetBtn = document.getElementById('upload-pet-btn');
const uploadPetModal = document.getElementById('upload-pet-modal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const uploadPetForm = document.getElementById('upload-pet-form');
const petPhotoInput = document.getElementById('pet-photo');
const photoPreview = document.getElementById('photo-preview');
const uploadPlaceholder = document.querySelector('.upload-placeholder');
const petCards = document.querySelector('.pet-cards');
const loadMoreBtn = document.getElementById('load-more-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const loader = document.getElementById('loader');
const loaderContainer = document.querySelector('.loader-container');

// Variables para paginación
let lastDoc = null;
let currentFilter = 'all';
const petsPerPage = 6;

// Inicializar particles.js para la animación del loader
document.addEventListener('DOMContentLoaded', function() {
    // Configurar particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#4CAF50" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#4CAF50", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        }
    });
    
    // Ocultar loader después de 2 segundos
    setTimeout(() => {
        if (loaderContainer) {
            loaderContainer.classList.add('hidden');
            setTimeout(() => {
                loaderContainer.style.display = 'none';
            }, 500);
        }
    }, 2000);
    
    // Cargar mascotas iniciales
    loadPets();
});

// Toggle del menú móvil
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Abrir modal de subida
if (uploadPetBtn) {
    uploadPetBtn.addEventListener('click', () => {
        uploadPetModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    });
}

// Cerrar modal
function closeModal() {
    if (uploadPetModal) {
        uploadPetModal.classList.remove('active');
        document.body.style.overflow = ''; // Habilitar scroll
        // Resetear formulario y vista previa
        uploadPetForm.reset();
        photoPreview.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
    }
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera
if (uploadPetModal) {
    uploadPetModal.addEventListener('click', (e) => {
        if (e.target === uploadPetModal) {
            closeModal();
        }
    });
}

// Vista previa de la foto de mascota
if (petPhotoInput) {
    petPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Enviar formulario de mascota
if (uploadPetForm) {
    uploadPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const petName = document.getElementById('pet-name').value;
        const petType = document.getElementById('pet-type').value;
        const petAge = document.getElementById('pet-age').value;
        const petDescription = document.getElementById('pet-description').value;
        const petPhoto = petPhotoInput.files[0];
        
        if (!petName || !petType || !petAge || !petDescription || !petPhoto) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Mostrar estado de carga
        const submitBtn = document.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';
        submitBtn.disabled = true;
        
        try {
            // Generar un nombre único para el archivo
            const fileName = `${Date.now()}_${petPhoto.name.replace(/\s+/g, '_')}`;
            
            // Crear referencia al storage
            const storageRef = ref(storage, `mascotas/${fileName}`);
            
            // Subir la foto a Firebase Storage
            const uploadTask = await uploadBytes(storageRef, petPhoto);
            console.log('Foto subida correctamente');
            
            // Obtener la URL de descarga
            const photoURL = await getDownloadURL(uploadTask.ref);
            console.log('URL de descarga obtenida:', photoURL);
            
            // Crear documento en Firestore
            const petData = {
                nombre: petName,
                tipo: petType,
                edad: parseInt(petAge),
                descripcion: petDescription,
                fotoURL: photoURL,
                likes: 0,
                comentarios: [],
                fechaCreacion: new Date()
            };
            
            // Añadir a Firestore
            const docRef = await addDoc(collection(db, "mascotas"), petData);
            console.log("Mascota añadida con ID:", docRef.id);
            
            // Cerrar modal y resetear formulario
            closeModal();
            
            // Mostrar notificación de éxito
            showNotification('¡Mascota publicada con éxito!', 'success');
            
            // Recargar mascotas
            lastDoc = null;
            loadPets(true);
            
        } catch (error) {
            console.error("Error al subir mascota:", error);
            showNotification('Error al subir la mascota: ' + error.message, 'error');
        } finally {
            // Resetear estado del botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Botones de filtro
if (filterButtons) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Actualizar estado activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Actualizar filtro
            currentFilter = button.dataset.filter;
            
            // Resetear y recargar
            lastDoc = null;
            loadPets(true);
        });
    });
}

// Botón de cargar más
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        loadPets(false);
    });
}

// Cargar mascotas desde Firestore
async function loadPets(reset = false) {
    try {
        // Mostrar estado de carga
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            loadMoreBtn.disabled = true;
        }
        
        if (reset && petCards) {
            petCards.innerHTML = '';
        }
        
        // Crear consulta
        let petsQuery;
        
        if (currentFilter === 'all') {
            petsQuery = query(
                collection(db, "mascotas"),
                orderBy("fechaCreacion", "desc"),
                limit(petsPerPage)
            );
        } else {
            petsQuery = query(
                collection(db, "mascotas"),
                where("tipo", "==", currentFilter),
                orderBy("fechaCreacion", "desc"),
                limit(petsPerPage)
            );
        }
        
        // Añadir startAfter si estamos paginando
        if (lastDoc && !reset) {
            if (currentFilter === 'all') {
                petsQuery = query(
                    collection(db, "mascotas"),
                    orderBy("fechaCreacion", "desc"),
                    startAfter(lastDoc),
                    limit(petsPerPage)
                );
            } else {
                petsQuery = query(
                    collection(db, "mascotas"),
                    where("tipo", "==", currentFilter),
                    orderBy("fechaCreacion", "desc"),
                    startAfter(lastDoc),
                    limit(petsPerPage)
                );
            }
        }
        
        const querySnapshot = await getDocs(petsQuery);
        
        // Verificar si tenemos resultados
        if (querySnapshot.empty) {
            if (reset && petCards) {
                petCards.innerHTML = `
                    <div class="no-pets">
                        <i class="fas fa-search"></i>
                        <p>No se encontraron mascotas. ¡Sé el primero en publicar!</p>
                    </div>
                `;
            } else {
                showNotification('No hay más mascotas para mostrar', 'info');
            }
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Actualizar lastDoc para paginación
        lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        // Mostrar mascotas
        querySnapshot.forEach(doc => {
            const pet = doc.data();
            const petId = doc.id;
            
            // Crear tarjeta de mascota
            const petCard = document.createElement('div');
            petCard.className = 'pet-card animate__animated animate__fadeIn';
            
            // Formatear timestamp
            const timestamp = pet.fechaCreacion?.toDate() || new Date();
            const formattedDate = new Intl.DateTimeFormat('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(timestamp);
            
            // Determinar icono de tipo de mascota
            let typeIcon = 'fa-paw';
            let typeClass = 'other';
            
            if (pet.tipo === 'perro') {
                typeIcon = 'fa-dog';
                typeClass = 'dog';
            } else if (pet.tipo === 'gato') {
                typeIcon = 'fa-cat';
                typeClass = 'cat';
            }
            
            petCard.innerHTML = `
                <div class="pet-card-header">
                    <div class="owner-info">
                        <h4>Mascota en adopción</h4>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="pet-type ${typeClass}">
                        <i class="fas ${typeIcon}"></i>
                    </div>
                </div>
                <div class="pet-card-image">
                    <img src="${pet.fotoURL}" alt="${pet.nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
                    <div class="pet-card-actions">
                        <button class="action-btn like" data-id="${petId}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn comment" data-id="${petId}">
                            <i class="fas fa-comment"></i>
                        </button>
                    </div>
                </div>
                <div class="pet-card-content">
                    <h3>${pet.nombre}</h3>
                    <p class="pet-description">${pet.descripcion}</p>
                    <div class="pet-stats">
                        <div class="stat">
                            <i class="fas fa-birthday-cake"></i>
                            <span>${pet.edad} meses</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-heart"></i>
                            <span>${pet.likes || 0} likes</span>
                        </div>
                    </div>
                </div>
            `;
            
            if (petCards) petCards.appendChild(petCard);
        });
        
        // Añadir event listeners a los botones de like
        document.querySelectorAll('.action-btn.like').forEach(button => {
            button.addEventListener('click', handleLike);
        });
        
        // Mostrar/ocultar botón de cargar más
        if (loadMoreBtn) {
            loadMoreBtn.style.display = querySnapshot.size < petsPerPage ? 'none' : 'block';
        }
        
    } catch (error) {
        console.error("Error al cargar mascotas:", error);
        showNotification('Error al cargar mascotas: ' + error.message, 'error');
    } finally {
        // Resetear botón de cargar más
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = 'Cargar Más <i class="fas fa-paw"></i>';
            loadMoreBtn.disabled = false;
        }
    }
}

// Manejar clic en botón de like
async function handleLike(e) {
    const button = e.currentTarget;
    const petId = button.dataset.id;
    
    // Prevenir múltiples clics
    if (button.classList.contains('active')) {
        return;
    }
    
    try {
        // Actualizar UI inmediatamente para mejor UX
        button.classList.add('active');
        const likeCount = button.closest('.pet-card').querySelector('.pet-stats .fa-heart + span');
        const currentLikes = parseInt(likeCount.textContent);
        likeCount.textContent = `${currentLikes + 1} likes`;
        
        // Mostrar notificación
        showNotification('¡Te gusta esta mascota!', 'success');
        
        // Aquí actualizarías el contador de likes en Firestore
        // Esta es una versión simplificada - en una app real, rastrearías qué usuarios
        // dieron like a qué mascotas para evitar likes múltiples del mismo usuario
        
    } catch (error) {
        console.error("Error al dar like:", error);
        showNotification('Error al dar like: ' + error.message, 'error');
        
        // Revertir cambios de UI en caso de error
        button.classList.remove('active');
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Buscar o crear el contenedor de notificaciones
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Establecer icono según el tipo
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress">
            <div class="notification-progress-bar"></div>
        </div>
    `;
    
    // Añadir al contenedor
    notificationContainer.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Animar barra de progreso
    const progressBar = notification.querySelector('.notification-progress-bar');
    progressBar.style.animation = 'progress 5s linear forwards';
    
    // Botón de cerrar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

// Cerrar notificación
function closeNotification(notification) {
    notification.classList.add('closing');
    setTimeout(() => {
        notification.remove();
    }, 300);
}