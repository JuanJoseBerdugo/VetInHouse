import { db } from "./firebase-config.js";
import { doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
    
    // Inicializar navegación por pasos
    initStepNavigation();
    
    // Inicializar slider de tarifa
    initTarifaSlider();
    
    // Inicializar selector de días específicos
    initDiasEspecificos();
});

// Navegación por pasos
function initStepNavigation() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    
    const toStep2Btn = document.getElementById('toStep2');
    const backToStep1Btn = document.getElementById('backToStep1');
    const toStep3Btn = document.getElementById('toStep3');
    const backToStep2Btn = document.getElementById('backToStep2');
    const toStep4Btn = document.getElementById('toStep4');
    const backToStep3Btn = document.getElementById('backToStep3');
    
    const progressBar = document.getElementById('formProgress');
    const steps = document.querySelectorAll('.step');
    
    // Ir al paso 2
    toStep2Btn.addEventListener('click', () => {
        // Validar campos del paso 1
        const nombre = document.getElementById('nombre').value;
        const documento = document.getElementById('documento').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const direccion = document.getElementById('direccion').value;
        
        if (!nombre || !documento || !fechaNacimiento || !telefono || !email || !direccion) {
            showValidationError('Por favor, completa todos los campos del paso 1.');
            return;
        }
        
        step1.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '33%';
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
        const experiencia = document.getElementById('experiencia').value;
        const nivelEducativo = document.getElementById('nivelEducativo').value;
        const experienciaPrevia = document.getElementById('experienciaPrevia').value;
        
        if (!experiencia || !nivelEducativo || !experienciaPrevia) {
            showValidationError('Por favor, completa todos los campos obligatorios del paso 2.');
            return;
        }
        
        step2.classList.remove('active');
        step3.classList.add('active');
        progressBar.style.width = '66%';
        updateStepStatus(3);
    });
    
    // Volver al paso 2
    backToStep2Btn.addEventListener('click', () => {
        step3.classList.remove('active');
        step2.classList.add('active');
        progressBar.style.width = '33%';
        updateStepStatus(2);
    });
    
    // Ir al paso 4
    toStep4Btn.addEventListener('click', () => {
        // Validar campos del paso 3
        const tamanoPerros = document.querySelectorAll('input[name="tamanoPerros"]:checked');
        const horasDisponibles = document.getElementById('horasDisponibles').value;
        const diasDisponibles = document.getElementById('diasDisponibles').value;
        const transporte = document.querySelector('input[name="transporte"]:checked');
        const habilidadesEspeciales = document.getElementById('habilidadesEspeciales').value;
        
        if (tamanoPerros.length === 0 || !horasDisponibles || !diasDisponibles || !transporte || !habilidadesEspeciales) {
            showValidationError('Por favor, completa todos los campos obligatorios del paso 3.');
            return;
        }
        
        // Si seleccionó "Días específicos", validar que haya seleccionado al menos un día
        if (diasDisponibles === 'Días específicos') {
            const diasEspecificos = document.querySelectorAll('input[name="diasEspecificos"]:checked');
            if (diasEspecificos.length === 0) {
                showValidationError('Por favor, selecciona al menos un día específico.');
                return;
            }
        }
        
        step3.classList.remove('active');
        step4.classList.add('active');
        progressBar.style.width = '100%';
        updateStepStatus(4);
    });
    
    // Volver al paso 3
    backToStep3Btn.addEventListener('click', () => {
        step4.classList.remove('active');
        step3.classList.add('active');
        progressBar.style.width = '66%';
        updateStepStatus(3);
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

// Inicializar slider de tarifa
function initTarifaSlider() {
    const tarifaSlider = document.getElementById('tarifaHora');
    const tarifaValue = document.getElementById('tarifaValue');
    
    // Actualizar valor al cargar
    updateTarifaValue(tarifaSlider.value);
    
    // Actualizar valor al mover el slider
    tarifaSlider.addEventListener('input', () => {
        updateTarifaValue(tarifaSlider.value);
    });
    
    function updateTarifaValue(value) {
        // Formatear como moneda
        const formattedValue = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
        
        tarifaValue.textContent = formattedValue;
        
        // Posicionar el valor
        const percent = ((value - tarifaSlider.min) / (tarifaSlider.max - tarifaSlider.min)) * 100;
        tarifaValue.style.left = `calc(${percent}%)`;
    }
}

// Inicializar selector de días específicos
function initDiasEspecificos() {
    const diasDisponibles = document.getElementById('diasDisponibles');
    const diasEspecificosContainer = document.getElementById('diasEspecificosContainer');
    
    diasDisponibles.addEventListener('change', () => {
        if (diasDisponibles.value === 'Días específicos') {
            diasEspecificosContainer.style.display = 'block';
        } else {
            diasEspecificosContainer.style.display = 'none';
        }
    });
}

// Mostrar error de validación
function showValidationError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = `
        <div class="notification-icon" style="background-color: rgba(255, 82, 82, 0.2);">
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

// Manejar envío del formulario
document.getElementById("paseadorForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue
    
    // Validar campos del paso 4
    const porque = document.getElementById('porque').value;
    const terminosCondiciones = document.getElementById('terminosCondiciones').checked;
    const politicaPrivacidad = document.getElementById('politicaPrivacidad').checked;
    
    if (!porque || !terminosCondiciones || !politicaPrivacidad) {
        showValidationError('Por favor, completa todos los campos obligatorios y acepta los términos.');
        return;
    }

    try {
        // Mostrar indicador de carga
        const submitBtn = document.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
        
        // Recopilar todos los datos del formulario
        const formData = {
            // Datos personales
            nombre: document.getElementById('nombre').value,
            documento: document.getElementById('documento').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            direccion: document.getElementById('direccion').value,
            
            // Experiencia
            experiencia: document.getElementById('experiencia').value,
            nivelEducativo: document.getElementById('nivelEducativo').value,
            certificaciones: Array.from(document.querySelectorAll('input[name="certificaciones"]:checked')).map(el => el.value),
            experienciaPrevia: document.getElementById('experienciaPrevia').value,
            
            // Habilidades
            tamanoPerros: Array.from(document.querySelectorAll('input[name="tamanoPerros"]:checked')).map(el => el.value),
            horasDisponibles: document.getElementById('horasDisponibles').value,
            diasDisponibles: document.getElementById('diasDisponibles').value,
            transporte: document.querySelector('input[name="transporte"]:checked').value,
            habilidadesEspeciales: document.getElementById('habilidadesEspeciales').value,
            
            // Si seleccionó días específicos
            diasEspecificos: document.getElementById('diasDisponibles').value === 'Días específicos' 
                ? Array.from(document.querySelectorAll('input[name="diasEspecificos"]:checked')).map(el => el.value)
                : [],
            
            // Finalización
            porque: document.getElementById('porque').value,
            comentariosAdicionales: document.getElementById('comentariosAdicionales').value,
            tarifaHora: document.getElementById('tarifaHora').value,
            
            // Metadatos
            fechaRegistro: new Date().toISOString(),
            estado: "Pendiente de revisión"
        };
        
        // Crear un ID único para el paseador
        const paseadorRef = doc(collection(db, "paseadores"));
        await setDoc(paseadorRef, formData);
        
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
        console.error("❌ Error al guardar los datos del paseador:", error);
        showValidationError("Ocurrió un error al enviar tu solicitud. Intenta de nuevo.");
    }
});