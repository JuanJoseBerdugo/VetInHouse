import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Configuración de partículas
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#4CAF50'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#4CAF50',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// Variables globales
let successAnimationActive = false;

// Lógica para iniciar sesión
document.getElementById("loginBtn").addEventListener("click", async function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginMessage = document.getElementById("loginMessage");
    const loginBtn = document.getElementById("loginBtn");

    if (!email || !password) {
        showMessage("Por favor, ingresa tu correo y contraseña.", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Por favor, ingresa un correo electrónico válido.", "error");
        return;
    }

    // Deshabilitar botón durante el proceso
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>Iniciando sesión...</span><i class="fas fa-spinner fa-spin"></i>';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showMessage("Inicio de sesión exitoso.", "success");
        
        // Guardar información del usuario
        localStorage.setItem('userEmail', userCredential.user.email);
        localStorage.setItem('userId', userCredential.user.uid);
        
        // Activar animación de éxito épica
        setTimeout(() => {
            activateSuccessAnimation();
        }, 500);
        
    } catch (error) {
        console.error('Error en el login:', error);
        
        let errorMessage = "Error al iniciar sesión";
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "No existe una cuenta con este correo electrónico";
                break;
            case 'auth/wrong-password':
                errorMessage = "Contraseña incorrecta";
                break;
            case 'auth/invalid-email':
                errorMessage = "Correo electrónico inválido";
                break;
            case 'auth/user-disabled':
                errorMessage = "Esta cuenta ha sido deshabilitada";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Demasiados intentos fallidos. Intenta más tarde";
                break;
            default:
                errorMessage = "Error inesperado. Intenta nuevamente";
        }
        
        showMessage(errorMessage, "error");
        
        // Efecto de shake en error
        const loginContainer = document.getElementById('loginContainer');
        loginContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);
        
    } finally {
        // Rehabilitar botón
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span>Ingresar</span><i class="fas fa-paw"></i>';
    }
});

// FUNCIÓN DE ANIMACIÓN DE ÉXITO ÉPICA
function activateSuccessAnimation() {
    if (successAnimationActive) return;
    successAnimationActive = true;
    
    const successAnimation = document.getElementById('successAnimation');
    const loginContainer = document.getElementById('loginContainer');
    
    // Ocultar el formulario de login con animación
    loginContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
    loginContainer.style.opacity = '0';
    
    setTimeout(() => {
        // Mostrar animación de éxito
        successAnimation.classList.add('show');
        
        // Crear confetti
        createConfetti();
        
        // Crear fuegos artificiales
        createFireworks();
        
        // Sonido de éxito (opcional)
        playSuccessSound();
        
        // Redirigir después de la animación
        setTimeout(() => {
            window.location.href = "home.html";
        }, 4000);
        
    }, 300);
}

// Crear efecto confetti
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#4CAF50', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 50);
    }
}

// Crear fuegos artificiales
function createFireworks() {
    const fireworksContainer = document.getElementById('fireworksContainer');
    const colors = ['#4CAF50', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.2;
            
            for (let j = 0; j < 12; j++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = centerX + 'px';
                firework.style.top = centerY + 'px';
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                const angle = (j * 30) * Math.PI / 180;
                const distance = 100;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;
                
                firework.style.setProperty('--end-x', endX + 'px');
                firework.style.setProperty('--end-y', endY + 'px');
                
                fireworksContainer.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }
        }, i * 800);
    }
}

// Sonido de éxito (opcional)
function playSuccessSound() {
    // Usar un archivo de audio real (más recomendado)
    const audio = new Audio('sounds/success.mp3'); // Coloca tu archivo en carpeta sounds/
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio no pudo reproducirse:', e));
}



// Lógica para mostrar/ocultar la contraseña
const passwordInput = document.getElementById("loginPassword");
const togglePasswordIcon = document.querySelector(".toggle-password");

if (togglePasswordIcon && passwordInput) {
    togglePasswordIcon.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.classList.remove("fa-eye-slash");
            togglePasswordIcon.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.classList.remove("fa-eye");
            togglePasswordIcon.classList.add("fa-eye-slash");
        }
    });
}

// Función para mostrar mensajes
function showMessage(message, type) {
    const loginMessage = document.getElementById("loginMessage");
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = type;
        loginMessage.style.display = "block";
        
        // Animación de entrada
        loginMessage.style.transform = 'translateY(-10px)';
        loginMessage.style.opacity = '0';
        
        setTimeout(() => {
            loginMessage.style.transform = 'translateY(0)';
            loginMessage.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            loginMessage.style.display = "none";
        }, 5000);
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Permitir login con Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !successAnimationActive) {
        document.getElementById("loginBtn").click();
    }
});

// Efectos de focus en los inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Efecto de escritura
        input.addEventListener('input', function() {
            createTypingEffect(this);
        });
    });
    
    // Efecto ripple en el botón
    const button = document.querySelector('button');
    if (button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
});

// Efecto de escritura en inputs
function createTypingEffect(input) {
    const rect = input.getBoundingClientRect();
    const spark = document.createElement('div');
    spark.style.position = 'absolute';
    spark.style.width = '4px';
    spark.style.height = '4px';
    spark.style.background = '#4CAF50';
    spark.style.borderRadius = '50%';
    spark.style.left = (rect.left + rect.width - 20) + 'px';
    spark.style.top = (rect.top + rect.height / 2) + 'px';
    spark.style.pointerEvents = 'none';
    spark.style.zIndex = '10001';
    spark.style.boxShadow = '0 0 10px #4CAF50';
    
    document.body.appendChild(spark);
    
    setTimeout(() => {
        spark.remove();
    }, 300);
}

// Animación de shake para errores
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(5px); }
}`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// Efecto de hover mejorado en inputs
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('mouseleave', function() {
            if (document.activeElement !== this) {
                this.style.transform = 'scale(1)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

console.log('🐾 VetInHouse Login System Loaded Successfully! 🐾');
