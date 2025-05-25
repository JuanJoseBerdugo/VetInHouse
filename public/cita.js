import { db } from "./firebase-config.js";
import { doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Inicializar partículas
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 30,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4CAF50"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.3,
                "random": false
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4CAF50",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            }
        },
        "retina_detect": true
    });
    
    // Ocultar loader después de cargar
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
    
    // Inicializar navegación por pasos
    initStepNavigation();
});

// Navegación por pasos
function initStepNavigation() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    const toStep2Btn = document.getElementById('toStep2');
    const backToStep1Btn = document.getElementById('backToStep1');
    const toStep3Btn = document.getElementById('toStep3');
    const backToStep2Btn = document.getElementById('backToStep2');
    
    const progressBar = document.getElementById('formProgress');
    const steps = document.querySelectorAll('.step');
    
    // Ir al paso 2
    toStep2Btn.addEventListener('click', () => {
        // Validar campos del paso 1
        const nombreDueño = document.getElementById('nombreDueño').value;
        const telefonoDueño = document.getElementById('telefonoDueño').value;
        const emailDueño = document.getElementById('emailDueño').value;
        const direccionDueño = document.getElementById('direccionDueño').value;
        
        if (!nombreDueño || !telefonoDueño || !emailDueño || !direccionDueño) {
            showValidationError('Por favor, completa todos los campos del paso 1.');
            return;
        }
        
        step1.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '50%';
        updateStepStatus(2);
    });
    
    // Volver al paso 1
    backToStep1Btn.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        progressBar.style.width = '0%';
        updateStepStatus(1);
    });
    
    // Ir al paso 3
    toStep3Btn.addEventListener('click', () => {
        // Validar campos del paso 2
        const nombreMascota = document.getElementById('nombreMascota').value;
        const tipoMascota = document.getElementById('tipoMascota').value;
        const razaMascota = document.getElementById('razaMascota').value;
        const edadMascota = document.getElementById('edadMascota').value;
        const generoMascota = document.querySelector('input[name="generoMascota"]:checked');
        
        if (!nombreMascota || !tipoMascota || !razaMascota || !edadMascota || !generoMascota) {
            showValidationError('Por favor, completa todos los campos del paso 2.');
            return;
        }
        
        step2.classList.remove('active');
        step3.classList.add('active');
        progressBar.style.width = '100%';
        updateStepStatus(3);
    });
    
    // Volver al paso 2
    backToStep2Btn.addEventListener('click', () => {
        step3.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '50%';
        updateStepStatus(2);
    });
    
    // Actualizar estado de los pasos
    function updateStepStatus(activeStep) {
        steps.forEach((step, index) => {
            if (index + 1 <= activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Mostrar error de validación
    function showValidationError(message) {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-exclamation-circle" style="color: #FF5252;"></i>
            </div>
            <div class="notification-content">
                <h3>Error de Validación</h3>
                <p>${message}</p>
            </div>
            <div class="notification-progress">
                <div class="notification-progress-bar" style="background-color: #FF5252;"></div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
}

// Manejar envío del formulario
document.getElementById("citaForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue
    
    // Validar campos del paso 3
    const tipoServicio = document.getElementById('tipoServicio').value;
    const fechaCita = document.getElementById('fechaCita').value;
    const horaCita = document.getElementById('horaCita').value;
    const sintomasMascota = document.getElementById('sintomasMascota').value;
    const terminos = document.getElementById('terminos').checked;
    
    if (!tipoServicio || !fechaCita || !horaCita || !sintomasMascota || !terminos) {
        showValidationError('Por favor, completa todos los campos y acepta los términos.');
        return;
    }

    // Obtener valores del formulario completo
    const nombreDueño = document.getElementById("nombreDueño").value;
    const telefonoDueño = document.getElementById("telefonoDueño").value;
    const emailDueño = document.getElementById("emailDueño").value;
    const direccionDueño = document.getElementById("direccionDueño").value;
    const nombreMascota = document.getElementById("nombreMascota").value;
    const tipoMascota = document.getElementById("tipoMascota").value;
    const razaMascota = document.getElementById("razaMascota").value;
    const edadMascota = document.getElementById("edadMascota").value;
    const generoMascota = document.querySelector('input[name="generoMascota"]:checked').value;

    // Crear un objeto con los datos
    const nuevaCita = {
        // Datos del dueño
        nombreDueño,
        telefonoDueño,
        emailDueño,
        direccionDueño,
        
        // Datos de la mascota
        nombreMascota,
        tipoMascota,
        razaMascota,
        edadMascota,
        generoMascota,
        
        // Datos de la cita
        tipoServicio,
        fechaCita,
        horaCita,
        sintomasMascota,
        
        // Metadatos
        fechaRegistro: new Date().toISOString(),
        estado: "Pendiente"
    };

    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        // Crear un ID único para la cita
        const citaRef = doc(collection(db, "citas"));
        await setDoc(citaRef, nuevaCita);

        // Restaurar botón
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // Mostrar notificación de éxito
        const successNotification = document.getElementById('successNotification');
        successNotification.classList.add('show');
        
        setTimeout(() => {
            successNotification.classList.remove('show');
            
            // Redirigir a home.html después de mostrar la notificación
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        }, 5000);
        
    } catch (error) {
        console.error("❌ Error al guardar la cita:", error);
        showValidationError("Ocurrió un error al agendar la cita. Intenta de nuevo.");
    }
});

// Función para mostrar errores de validación
function showValidationError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-exclamation-circle" style="color: #FF5252;"></i>
        </div>
        <div class="notification-content">
            <h3>Error de Validación</h3>
            <p>${message}</p>
        </div>
        <div class="notification-progress">
            <div class="notification-progress-bar" style="background-color: #FF5252;"></div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}