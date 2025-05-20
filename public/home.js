 import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Inicializar AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Inicializar partículas
    particlesJS('particles-js',
      {
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
      }
    );
});

// Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

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