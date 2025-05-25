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
    
    // Inicializar selección de servicios
    initServiceSelection();
    
    // Inicializar formulario
    initForm();
    
    // Configurar fecha mínima
    setMinDate();
});

// Configurar fecha mínima (hoy)
function setMinDate() {
    const fechaCita = document.getElementById('fechaCita');
    const today = new Date().toISOString().split('T')[0];
    fechaCita.min = today;
}

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
        if (validateStep1()) {
            step1.classList.remove('active');
            step2.classList.add('active');
            progressBar.style.width = '66.66%';
            updateStepStatus(2);
        }
    });

    // Volver al paso 1
    backToStep1Btn.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        progressBar.style.width = '33.33%';
        updateStepStatus(1);
    });

    // Ir al paso 3
    toStep3Btn.addEventListener('click', () => {
        if (validateStep2()) {
            step2.classList.remove('active');
            step3.classList.add('active');
            progressBar.style.width = '100%';
            updateStepStatus(3);
        }
    });

    // Volver al paso 2
    backToStep2Btn.addEventListener('click', () => {
        step3.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '66.66%';
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
}

// Validación del paso 1
function validateStep1() {
    const nombreDueño = document.getElementById('nombreDueño').value.trim();
    const telefonoDueño = document.getElementById('telefonoDueño').value.trim();
    const emailDueño = document.getElementById('emailDueño').value.trim();
    const direccionDueño = document.getElementById('direccionDueño').value.trim();

    if (!nombreDueño || !telefonoDueño || !emailDueño || !direccionDueño) {
        showValidationError('Por favor, completa todos los campos del propietario.');
        return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailDueño)) {
        showValidationError('Por favor, ingresa un correo electrónico válido.');
        return false;
    }

    // Validar formato de teléfono (básico)
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(telefonoDueño)) {
        showValidationError('Por favor, ingresa un número de teléfono válido.');
        return false;
    }

    return true;
}

// Validación del paso 2
function validateStep2() {
    const nombreMascota = document.getElementById('nombreMascota').value.trim();
    const tipoMascota = document.getElementById('tipoMascota').value;
    const razaMascota = document.getElementById('razaMascota').value.trim();
    const edadMascota = document.getElementById('edadMascota').value;
    const generoMascota = document.querySelector('input[name="generoMascota"]:checked');

    if (!nombreMascota || !tipoMascota || !razaMascota || !edadMascota || !generoMascota) {
        showValidationError('Por favor, completa todos los datos de la mascota.');
        return false;
    }

    if (edadMascota < 1 || edadMascota > 300) {
        showValidationError('Por favor, ingresa una edad válida para la mascota (1-300 meses).');
        return false;
    }

    return true;
}

// Selección de servicios
function initServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    const tipoServicioInput = document.getElementById('tipoServicio');
    const paseoDetails = document.getElementById('paseoDetails');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remover selección previa
            serviceCards.forEach(c => c.classList.remove('selected'));
            
            // Seleccionar tarjeta actual
            card.classList.add('selected');
            
            // Añadir efecto de pulso
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
            
            // Obtener el tipo de servicio
            const serviceType = card.dataset.service;
            tipoServicioInput.value = serviceType;
            
            // Mostrar detalles del paseo si es necesario
            if (serviceType.includes('paseo')) {
                paseoDetails.style.display = 'block';
                paseoDetails.style.opacity = '0';
                paseoDetails.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    paseoDetails.style.opacity = '1';
                    paseoDetails.style.transform = 'translateY(0)';
                }, 100);
                
                paseoDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hacer campos requeridos
                document.getElementById('duracionPaseo').required = true;
                document.getElementById('zonaPaseo').required = true;
            } else {
                paseoDetails.style.display = 'none';
                
                // Remover campos requeridos
                document.getElementById('duracionPaseo').required = false;
                document.getElementById('zonaPaseo').required = false;
                
                // Limpiar valores
                document.getElementById('duracionPaseo').value = '';
                document.getElementById('zonaPaseo').value = '';
                document.getElementById('serviciosExtra').checked = false;
                document.getElementById('transporteIncluido').checked = false;
            }
        });

        // Efecto hover mejorado
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Inicializar formulario
function initForm() {
    const form = document.getElementById('citaForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar paso 3
        const tipoServicio = document.getElementById('tipoServicio').value;
        const fechaCita = document.getElementById('fechaCita').value;
        const horaCita = document.getElementById('horaCita').value;
        const terminos = document.getElementById('terminos').checked;
        
        if (!tipoServicio) {
            showValidationError('Por favor, selecciona un servicio.');
            return;
        }
        
        if (!fechaCita || !horaCita) {
            showValidationError('Por favor, selecciona fecha y hora para la cita.');
            return;
        }
        
        if (!terminos) {
            showValidationError('Debes aceptar los términos y condiciones.');
            return;
        }
        
        // Validar campos específicos de paseo
        if (tipoServicio.includes('paseo')) {
            const duracionPaseo = document.getElementById('duracionPaseo').value;
            const zonaPaseo = document.getElementById('zonaPaseo').value;
            
            if (!duracionPaseo || !zonaPaseo) {
                showValidationError('Por favor, completa todos los detalles del paseo.');
                return;
            }
        }
        
        // Recopilar datos del formulario
        const formData = {
            // Datos del propietario
            nombreDueño: document.getElementById('nombreDueño').value,
            telefonoDueño: document.getElementById('telefonoDueño').value,
            emailDueño: document.getElementById('emailDueño').value,
            direccionDueño: document.getElementById('direccionDueño').value,
            
            // Datos de la mascota
            nombreMascota: document.getElementById('nombreMascota').value,
            tipoMascota: document.getElementById('tipoMascota').value,
            razaMascota: document.getElementById('razaMascota').value,
            edadMascota: document.getElementById('edadMascota').value,
            generoMascota: document.querySelector('input[name="generoMascota"]:checked').value,
            
            // Datos del servicio
            tipoServicio: tipoServicio,
            fechaCita: fechaCita,
            horaCita: horaCita,
            motivoCita: document.getElementById('motivoCita').value,
            
            // Datos específicos de paseo (si aplica)
            duracionPaseo: document.getElementById('duracionPaseo')?.value || null,
            zonaPaseo: document.getElementById('zonaPaseo')?.value || null,
            serviciosExtra: document.getElementById('serviciosExtra')?.checked || false,
            transporteIncluido: document.getElementById('transporteIncluido')?.checked || false,
            
            // Metadatos
            fechaCreacion: new Date().toISOString(),
            estado: 'pendiente',
            clinica: 'VetInHouse'
        };
        
        try {
            // Mostrar loading en el botón
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Procesando...</span>';
            submitBtn.disabled = true;
            
            // Guardar en Firebase
            const citaId = 'cita_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            await setDoc(doc(db, 'citas', citaId), formData);
            
            // Mostrar notificación de éxito
            showSuccessNotification();
            
            // Resetear formulario después de un delay
            setTimeout(() => {
                form.reset();
                // Volver al paso 1
                document.getElementById('step3').classList.remove('active');
                document.getElementById('step1').classList.add('active');
                document.getElementById('formProgress').style.width = '33.33%';
                updateStepStatus(1);
                
                // Limpiar selección de servicios
                document.querySelectorAll('.service-card').forEach(card => {
                    card.classList.remove('selected');
                });
                document.getElementById('tipoServicio').value = '';
                const paseoDetails = document.getElementById('paseoDetails');
                if (paseoDetails) {
                    paseoDetails.style.display = 'none';
                }
                
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Error al guardar la cita:', error);
            showValidationError('Error al agendar la cita. Por favor, intenta nuevamente.');
            
            // Restaurar botón
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Mostrar error de validación
function showValidationError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.style.background = 'linear-gradient(135deg, rgba(255, 23, 68, 0.9), rgba(255, 107, 53, 0.9))';
    notification.style.backdropFilter = 'blur(20px)';
    notification.style.border = '1px solid rgba(255, 23, 68, 0.3)';
    notification.innerHTML = `
        <div class="notification-icon" style="background: linear-gradient(45deg, #ff1744, #ff6b35);">
            <i class="fas fa-exclamation-triangle" style="color: white;"></i>
        </div>
        <div class="notification-content">
            <h3 style="color: white;">Error de Validación</h3>
            <p style="color: rgba(255, 255, 255, 0.8);">${message}</p>
        </div>
        <div class="notification-progress">
            <div class="notification-progress-bar" style="background: linear-gradient(90deg, #ff1744, #ff6b35);"></div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

// Mostrar notificación de éxito
function showSuccessNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Función auxiliar para actualizar estado de pasos
function updateStepStatus(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
});

function validateField(field) {
    const isValid = field.checkValidity() && field.value.trim() !== '';
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        field.style.borderColor = 'var(--primary-color)';
        field.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.3)';
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        field.style.borderColor = '#ff1744';
        field.style.boxShadow = '0 0 10px rgba(255, 23, 68, 0.3)';
    }
    
    setTimeout(() => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }, 2000);
}

// Animación de entrada para las tarjetas de servicio
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar las tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});
