import { db } from "./firebase-config.js";
import { doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Inicializar AOS y partículas
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Inicializar partículas
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 50,
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

    // Loader
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
            showSuccessNotification('Sesión cerrada exitosamente');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } catch (error) {
            showValidationError('Error al cerrar sesión: ' + error.message);
        }
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }

    // Verificar autenticación
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "index.html";
        }
    });

    // Inicializar navegación por pasos
    initStepNavigation();
    
    // Inicializar selección de servicios
    initServiceSelection();
    
    // Inicializar formulario
    initForm();
    
    // Configurar fecha mínima
    setMinDate();

    // Efectos de animación adicionales
    initAnimationEffects();
});

// Configurar fecha mínima (hoy)
function setMinDate() {
    const fechaCita = document.getElementById('fechaCita');
    const today = new Date().toISOString().split('T')[0];
    fechaCita.min = today;
}

// Efectos de animación adicionales
function initAnimationEffects() {
    // Efecto de escritura en el título
    const titleElement = document.querySelector('.title h1');
    if (titleElement) {
        const titleText = titleElement.textContent;
        titleElement.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < titleText.length) {
                titleElement.textContent += titleText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    // Animación de conteo en los precios
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(price => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animatePrice(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(price);
    });
}

// Animación de precios
function animatePrice(element) {
    const finalPrice = element.textContent.replace(/[^\d]/g, '');
    const duration = 1000;
    const increment = finalPrice / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalPrice) {
            current = finalPrice;
            clearInterval(timer);
        }
        element.textContent = '$' + Math.floor(current).toLocaleString();
    }, 16);
}

// Navegación por pasos mejorada
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
            animateStepTransition(step1, step2, 66.66, 2);
        }
    });

    // Volver al paso 1
    backToStep1Btn.addEventListener('click', () => {
        animateStepTransition(step2, step1, 33.33, 1);
    });

    // Ir al paso 3
    toStep3Btn.addEventListener('click', () => {
        if (validateStep2()) {
            animateStepTransition(step2, step3, 100, 3);
        }
    });

    // Volver al paso 2
    backToStep2Btn.addEventListener('click', () => {
        animateStepTransition(step3, step2, 66.66, 2);
    });

    // Animación de transición entre pasos
    function animateStepTransition(fromStep, toStep, progressWidth, activeStepNumber) {
        // Animación de salida
        fromStep.style.transform = 'translateX(-50px)';
        fromStep.style.opacity = '0';
        
        setTimeout(() => {
            fromStep.classList.remove('active');
            toStep.classList.add('active');
            
            // Animación de entrada
            toStep.style.transform = 'translateX(50px)';
            toStep.style.opacity = '0';
            
            setTimeout(() => {
                toStep.style.transform = 'translateX(0)';
                toStep.style.opacity = '1';
            }, 50);
            
            // Actualizar progreso
            progressBar.style.width = progressWidth + '%';
            updateStepStatus(activeStepNumber);
            
        }, 300);
    }

    // Actualizar estado de los pasos con animación
    function updateStepStatus(activeStep) {
        steps.forEach((step, index) => {
            setTimeout(() => {
                if (index + 1 <= activeStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            }, index * 100);
        });
    }
}

// Validación mejorada del paso 1
function validateStep1() {
    const fields = [
        { id: 'nombreDueño', name: 'Nombre completo' },
        { id: 'telefonoDueño', name: 'Teléfono' },
        { id: 'emailDueño', name: 'Correo electrónico' },
        { id: 'direccionDueño', name: 'Dirección' }
    ];

    for (let field of fields) {
        const element = document.getElementById(field.id);
        const value = element.value.trim();
        
        if (!value) {
            showFieldError(element, `El campo ${field.name} es obligatorio`);
            return false;
        }
        
        clearFieldError(element);
    }

    // Validaciones específicas
    const email = document.getElementById('emailDueño').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError(document.getElementById('emailDueño'), 'Ingresa un correo electrónico válido');
        return false;
    }

    const phone = document.getElementById('telefonoDueño').value.trim();
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError(document.getElementById('telefonoDueño'), 'Ingresa un número de teléfono válido');
        return false;
    }

    return true;
}

// Validación mejorada del paso 2
function validateStep2() {
    const fields = [
        { id: 'nombreMascota', name: 'Nombre de la mascota' },
        { id: 'tipoMascota', name: 'Tipo de mascota' },
        { id: 'razaMascota', name: 'Raza' },
        { id: 'edadMascota', name: 'Edad' }
    ];

    for (let field of fields) {
        const element = document.getElementById(field.id);
        const value = element.value.trim();
        
        if (!value) {
            showFieldError(element, `El campo ${field.name} es obligatorio`);
            return false;
        }
        
        clearFieldError(element);
    }

    const genero = document.querySelector('input[name="generoMascota"]:checked');
    if (!genero) {
        showValidationError('Por favor, selecciona el género de la mascota');
        return false;
    }

    const edad = document.getElementById('edadMascota').value;
    if (edad < 1 || edad > 300) {
        showFieldError(document.getElementById('edadMascota'), 'La edad debe estar entre 1 y 300 meses');
        return false;
    }

    return true;
}

// Mostrar error en campo específico
function showFieldError(element, message) {
    clearFieldError(element);
    
    element.style.borderColor = '#F44336';
    element.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#F44336';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.style.animation = 'fadeInUp 0.3s ease';
    
    element.parentNode.appendChild(errorDiv);
    
    // Scroll al campo con error
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Limpiar error de campo
function clearFieldError(element) {
    element.style.borderColor = '';
    element.style.boxShadow = '';
    
    const existingError = element.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Selección de servicios mejorada
function initServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    const tipoServicioInput = document.getElementById('tipoServicio');
    const paseoDetails = document.getElementById('paseoDetails');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            selectService(card, serviceCards, tipoServicioInput, paseoDetails);
        });

        // Efectos hover mejorados
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('selected')) {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Seleccionar servicio con animaciones
function selectService(selectedCard, allCards, tipoServicioInput, paseoDetails) {
    // Remover selección previa con animación
    allCards.forEach(card => {
        if (card.classList.contains('selected')) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.classList.remove('selected');
                card.style.transform = 'scale(1)';
            }, 150);
        }
    });
    
    // Seleccionar nueva tarjeta con animación
    setTimeout(() => {
        selectedCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            selectedCard.classList.add('selected');
            selectedCard.style.transform = 'scale(1.02) translateY(-8px)';
            
            // Efecto de pulso
            selectedCard.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                selectedCard.style.animation = '';
            }, 600);
        }, 150);
    }, 200);

    // Obtener el tipo de servicio
    const serviceType = selectedCard.dataset.service;
    tipoServicioInput.value = serviceType;

    // Mostrar/ocultar detalles del paseo
    if (serviceType && serviceType.includes('paseo')) {
        showPaseoDetails(paseoDetails);
    } else {
        hidePaseoDetails(paseoDetails);
    }

    // Scroll suave al siguiente elemento
    setTimeout(() => {
        const nextElement = selectedCard.closest('.service-category').nextElementSibling || 
                           document.querySelector('.datetime-container');
        if (nextElement) {
            nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 800);
}

// Mostrar detalles del paseo con animación
function showPaseoDetails(paseoDetails) {
    paseoDetails.style.display = 'block';
    paseoDetails.style.opacity = '0';
    paseoDetails.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        paseoDetails.style.opacity = '1';
        paseoDetails.style.transform = 'translateY(0)';
        paseoDetails.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 100);

    // Hacer campos requeridos
    document.getElementById('duracionPaseo').required = true;
    document.getElementById('zonaPaseo').required = true;
}

// Ocultar detalles del paseo
function hidePaseoDetails(paseoDetails) {
    paseoDetails.style.opacity = '0';
    paseoDetails.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        paseoDetails.style.display = 'none';
    }, 300);
    
    // Remover campos requeridos y limpiar valores
    document.getElementById('duracionPaseo').required = false;
    document.getElementById('zonaPaseo').required = false;
    document.getElementById('duracionPaseo').value = '';
    document.getElementById('zonaPaseo').value = '';
    document.getElementById('serviciosExtra').checked = false;
    document.getElementById('transporteIncluido').checked = false;
}

// Inicializar formulario mejorado
function initForm() {
    const form = document.getElementById('citaForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit();
    });

    // Validación en tiempo real
    addRealTimeValidation();
}

// Validación en tiempo real
function addRealTimeValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            clearFieldError(input);
        });
        
        input.addEventListener('input', () => {
            if (input.style.borderColor === 'rgb(244, 67, 54)') {
                clearFieldError(input);
            }
        });
    });
}

// Manejar envío del formulario
async function handleFormSubmit() {
    // Validar paso 3
    if (!validateStep3()) {
        return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;
    
    try {
        // Mostrar loading
        showLoadingButton(submitBtn);
        
        // Recopilar datos
        const formData = collectFormData();
        
        // Guardar en Firebase
        const citaId = generateCitaId();
        await setDoc(doc(db, 'citas', citaId), formData);
        
        // Mostrar éxito
        showSuccessNotification('¡Cita agendada exitosamente!');
        
        // Reset después de delay
        setTimeout(() => {
            resetForm();
            restoreButton(submitBtn, originalContent);
        }, 3000);
        
    } catch (error) {
        console.error('Error al guardar la cita:', error);
        showValidationError('Error al agendar la cita. Por favor, intenta nuevamente.');
        restoreButton(submitBtn, originalContent);
    }
}

// Validar paso 3
function validateStep3() {
    const tipoServicio = document.getElementById('tipoServicio').value;
    const fechaCita = document.getElementById('fechaCita').value;
    const horaCita = document.getElementById('horaCita').value;
    const terminos = document.getElementById('terminos').checked;

    if (!tipoServicio) {
        showValidationError('Por favor, selecciona un servicio');
        document.querySelector('.service-category').scrollIntoView({ behavior: 'smooth' });
        return false;
    }

    if (!fechaCita) {
        showFieldError(document.getElementById('fechaCita'), 'La fecha es obligatoria');
        return false;
    }

    if (!horaCita) {
        showFieldError(document.getElementById('horaCita'), 'La hora es obligatoria');
        return false;
    }

    if (!terminos) {
        showValidationError('Debes aceptar los términos y condiciones');
        document.getElementById('terminos').scrollIntoView({ behavior: 'smooth' });
        return false;
    }

    // Validar campos específicos de paseo
    if (tipoServicio.includes('paseo')) {
        const duracionPaseo = document.getElementById('duracionPaseo').value;
        const zonaPaseo = document.getElementById('zonaPaseo').value;
        
        if (!duracionPaseo) {
            showFieldError(document.getElementById('duracionPaseo'), 'La duración es obligatoria');
            return false;
        }
        
        if (!zonaPaseo) {
            showFieldError(document.getElementById('zonaPaseo'), 'La zona es obligatoria');
            return false;
        }
    }

    return true;
}

// Mostrar botón de carga
function showLoadingButton(button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    button.disabled = true;
    button.style.opacity = '0.8';
}

// Restaurar botón
function restoreButton(button, originalContent) {
    button.innerHTML = originalContent;
    button.disabled = false;
    button.style.opacity = '1';
}

// Recopilar datos del formulario
function collectFormData() {
    const tipoServicio = document.getElementById('tipoServicio').value;
    
    const formData = {
        // Datos del propietario
        nombreDueño: document.getElementById('nombreDueño').value.trim(),
        telefonoDueño: document.getElementById('telefonoDueño').value.trim(),
        emailDueño: document.getElementById('emailDueño').value.trim(),
        direccionDueño: document.getElementById('direccionDueño').value.trim(),
        
        // Datos de la mascota
        nombreMascota: document.getElementById('nombreMascota').value.trim(),
        tipoMascota: document.getElementById('tipoMascota').value,
        razaMascota: document.getElementById('razaMascota').value.trim(),
        edadMascota: parseInt(document.getElementById('edadMascota').value),
        generoMascota: document.querySelector('input[name="generoMascota"]:checked').value,
        
        // Datos del servicio
        tipoServicio: tipoServicio,
        fechaCita: document.getElementById('fechaCita').value,
        horaCita: document.getElementById('horaCita').value,
        motivoCita: document.getElementById('motivoCita').value.trim(),
        
        // Metadatos
        fechaCreacion: new Date().toISOString(),
        estado: 'pendiente',
        clinica: 'VetInHouse'
    };

    // Datos específicos de paseo
    if (tipoServicio.includes('paseo')) {
        formData.duracionPaseo = document.getElementById('duracionPaseo').value;
        formData.zonaPaseo = document.getElementById('zonaPaseo').value.trim();
        formData.serviciosExtra = document.getElementById('serviciosExtra').checked;
        formData.transporteIncluido = document.getElementById('transporteIncluido').checked;
    }

    return formData;
}

// Generar ID único para la cita
function generateCitaId() {
    return 'cita_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Reset del formulario
function resetForm() {
    const form = document.getElementById('citaForm');
    form.reset();
    
    // Volver al paso 1
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('formProgress').style.width = '33.33%';
    updateStepStatus(1);
    
    // Limpiar selección de servicios
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
        card.style.transform = '';
    });
    
    document.getElementById('tipoServicio').value = '';
    
    const paseoDetails = document.getElementById('paseoDetails');
    if (paseoDetails) {
        paseoDetails.style.display = 'none';
    }
    
    // Limpiar errores
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    });
}

// Actualizar estado de pasos
function updateStepStatus(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            if (index + 1 <= activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        }, index * 100);
    });
}

// Mostrar notificación de error mejorada
function showValidationError(message) {
    showNotification(message, 'error');
}

// Mostrar notificación de éxito mejorada
function showSuccessNotification(message) {
    showNotification(message, 'success');
}

// Sistema de notificaciones mejorado
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    
    const colors = {
        success: {
            bg: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))',
            icon: 'fas fa-check-circle'
        },
        error: {
            bg: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(211, 47, 47, 0.95))',
            icon: 'fas fa-exclamation-triangle'
        }
    };
    
    notification.style.background = colors[type].bg;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${colors[type].icon}"></i>
        </div>
        <div class="notification-content">
            <h3>${type === 'success' ? '¡Éxito!' : 'Error'}</h3>
            <p>${message}</p>
        </div>
        <div class="notification-progress">
            <div class="notification-progress-bar"></div>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remover
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
}
