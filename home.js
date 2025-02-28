import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", async function () {
    try {
        await signOut(auth);
        alert("Sesión cerrada.");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada correctamente.");
});

