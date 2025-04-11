import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Inicializar partículas
particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle"
      },
      "opacity": {
        "value": 0.5,
        "random": false
      },
      "size": {
        "value": 3,
        "random": true
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
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
          "mode": "repulse"
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

// Elementos DOM
const passwordInput = document.getElementById("registerPassword");
const togglePasswordIcon = document.querySelector(".toggle-password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const registerBtn = document.getElementById("registerBtn");
const lengthCheck = document.getElementById("length");
const uppercaseCheck = document.getElementById("uppercase");
const numberCheck = document.getElementById("number");
const specialCheck = document.getElementById("special");

// Toggle password visibility
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

// Validación de contraseña
passwordInput.addEventListener("input", validatePassword);

function validatePassword() {
    const password = passwordInput.value;
    let strength = 0;
    let allRequirementsMet = true;
    
    // Verificar longitud
    const hasLength = password.length >= 8;
    updateRequirement(lengthCheck, hasLength);
    if (hasLength) strength += 25;
    else allRequirementsMet = false;
    
    // Verificar mayúsculas
    const hasUppercase = /[A-Z]/.test(password);
    updateRequirement(uppercaseCheck, hasUppercase);
    if (hasUppercase) strength += 25;
    else allRequirementsMet = false;
    
    // Verificar números
    const hasNumber = /[0-9]/.test(password);
    updateRequirement(numberCheck, hasNumber);
    if (hasNumber) strength += 25;
    else allRequirementsMet = false;
    
    // Verificar caracteres especiales
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    updateRequirement(specialCheck, hasSpecial);
    if (hasSpecial) strength += 25;
    else allRequirementsMet = false;
    
    // Actualizar barra de fuerza
    strengthBar.style.width = strength + "%";
    
    // Cambiar color según fuerza
    if (strength <= 25) {
        strengthBar.style.backgroundColor = "#ff6b6b";
        strengthText.textContent = "Débil";
        strengthText.style.color = "#ff6b6b";
    } else if (strength <= 50) {
        strengthBar.style.backgroundColor = "#ffa502";
        strengthText.textContent = "Regular";
        strengthText.style.color = "#ffa502";
    } else if (strength <= 75) {
        strengthBar.style.backgroundColor = "#ffdd59";
        strengthText.textContent = "Buena";
        strengthText.style.color = "#ffdd59";
    } else {
        strengthBar.style.backgroundColor = "#4CAF50";
        strengthText.textContent = "Fuerte";
        strengthText.style.color = "#4CAF50";
    }
    
    // Habilitar/deshabilitar botón de registro
    registerBtn.disabled = !allRequirementsMet;
}

function updateRequirement(element, isValid) {
    if (isValid) {
        element.querySelector("i").classList.remove("fa-times-circle");
        element.querySelector("i").classList.add("fa-check-circle");
    } else {
        element.querySelector("i").classList.remove("fa-check-circle");
        element.querySelector("i").classList.add("fa-times-circle");
    }
}

// Registro de usuario
document.getElementById("registerBtn").addEventListener("click", async function () {
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!username || !email || !password) {
        showMessage("Por favor, llena todos los campos.", "error");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos en Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString()
        });

        showMessage("Registro exitoso. Redirigiendo...", "success");
        
        // Redirigir después de un breve retraso
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } catch (error) {
        let errorMessage = "Error al registrar: ";
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "Este correo ya está registrado.";
                break;
            case 'auth/invalid-email':
                errorMessage += "El correo electrónico no es válido.";
                break;
            case 'auth/weak-password':
                errorMessage += "La contraseña es demasiado débil.";
                break;
            default:
                errorMessage += error.message;
        }
        
        showMessage(errorMessage, "error");
    }
});

function showMessage(message, type) {
    const messageElement = document.getElementById("registerMessage");
    messageElement.textContent = message;
    
    if (type === "error") {
        messageElement.style.color = "#ff6b6b";
    } else if (type === "success") {
        messageElement.style.color = "#4CAF50";
    }
}