// Importar funciones de Firebase
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
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
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
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
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Variables globales
let successAnimationActive = false;

// Funcionalidad de mostrar/ocultar contraseña
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('loginPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar el ícono
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Efectos de focus en los inputs
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
    });
    
    // Manejo del formulario de login
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Permitir login con Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
});

// Función para manejar el login
async function handleLogin() {
    console.log('Iniciando proceso de login...');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginMessage = document.getElementById('loginMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    // Validaciones básicas
    if (!email || !password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor, ingresa un correo electrónico válido', 'error');
        return;
    }
    
    // Deshabilitar botón durante el proceso
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span>Iniciando sesión...</span><i class="fas fa-spinner fa-spin"></i>';
    
    try {
        console.log('Intentando autenticar con Firebase...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('Login exitoso:', user.email);
        showMessage('¡Inicio de sesión exitoso!', 'success');
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        
        // Activar animación de éxito después de un breve delay
        setTimeout(() => {
            console.log('Activando animación de éxito...');
            activateSuccessAnimation();
        }, 1000);
        
    } catch (error) {
        console.error('Error en el login:', error);
        
        let errorMessage = 'Error al iniciar sesión';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este correo electrónico';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Correo electrónico inválido';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta cuenta ha sido deshabilitada';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Error de conexión. Verifica tu internet';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña';
                break;
            default:
                errorMessage = 'Error inesperado. Intenta nuevamente';
        }
        
        showMessage(errorMessage, 'error');
        
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
}

// FUNCIÓN DE ANIMACIÓN DE ÉXITO ÉPICA
function activateSuccessAnimation() {
    console.log('Ejecutando animación de éxito...');
    
    if (successAnimationActive) return;
    successAnimationActive = true;
    
    const successAnimation = document.getElementById('successAnimation');
    const loginContainer = document.getElementById('loginContainer');
    
    if (!successAnimation) {
        console.error('No se encontró el elemento successAnimation');
        // Redirigir directamente si no hay animación
        window.location.href = "home.html";
        return;
    }
    
    // Ocultar el formulario de login con animación
    loginContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
    loginContainer.style.opacity = '0';
    
    setTimeout(() => {
        // Mostrar animación de éxito
        successAnimation.classList.add('show');
        console.log('Animación de éxito activada');
        
        // Crear confetti
        createConfetti();
        
        // Crear fuegos artificiales
        createFireworks();
        
        // Sonido de éxito
        playSuccessSound();
        
        // Redirigir después de la animación
        setTimeout(() => {
            console.log('Redirigiendo a home.html...');
            window.location.href = "home.html";
        }, 4000);
        
    }, 300);
}

// Crear efecto confetti
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (!confettiContainer) return;
    
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
    if (!fireworksContainer) return;
    
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
    try {
        const audio = new Audio('sounds/success.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => {
            console.log('Audio no pudo reproducirse:', e);
            // Fallback: usar sonido generado si el archivo no está disponible
            playFallbackSound();
        });
    } catch (e) {
        console.log('Error al reproducir audio:', e);
        playFallbackSound();
    }
}

// Función de respaldo por si el archivo no carga
function playFallbackSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const frequencies = [800, 1000, 1200];
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
            }, index * 100);
        });
    } catch (e) {
        console.log('Error al generar sonido:', e);
    }
}

// Función para mostrar mensajes
function showMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = type;
        loginMessage.style.display = 'block';
        
        // Animación de entrada
        loginMessage.style.transform = 'translateY(-10px)';
        loginMessage.style.opacity = '0';
        
        setTimeout(() => {
            loginMessage.style.transform = 'translateY(0)';
            loginMessage.style.opacity = '1';
        }, 100);
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            loginMessage.style.display = 'none';
        }, 5000);
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Verificar si el usuario ya está logueado
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Usuario ya autenticado:', user.email);
        // Si el usuario ya está logueado, redirigir al dashboard
        // window.location.href = 'home.html';
    }
});

// Efectos adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de escritura en el título
    const title = document.querySelector('h2');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Efecto de ondas en el botón
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

// CSS para el efecto ripple
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(5px); }
    }
`;
document.head.appendChild(style);

console.log('🐾 VetInHouse Login System Loaded Successfully! 🐾');
