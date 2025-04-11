import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Lógica para iniciar sesión
document.getElementById("loginBtn").addEventListener("click", async function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Por favor, ingresa tu correo y contraseña.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso.");
        window.location.href = "home.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Lógica para mostrar/ocultar la contraseña
const passwordInput = document.getElementById("loginPassword");
const togglePasswordIcon = document.querySelector(".toggle-password");

togglePasswordIcon.addEventListener("click", () => {
    // Alternar el tipo de input entre 'password' y 'text'
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