import { db } from "./firebase-config.js";
import { doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById("citaForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener valores del formulario
    const nombreDueño = document.getElementById("nombreDueño").value;
    const telefonoDueño = document.getElementById("telefonoDueño").value;
    const emailDueño = document.getElementById("emailDueño").value;
    const nombreMascota = document.getElementById("nombreMascota").value;
    const tipoMascota = document.getElementById("tipoMascota").value;
    const razaMascota = document.getElementById("razaMascota").value;
    const edadMascota = document.getElementById("edadMascota").value;
    const sintomasMascota = document.getElementById("sintomasMascota").value;

    if (!nombreDueño || !telefonoDueño || !emailDueño || !nombreMascota || !tipoMascota || !razaMascota || !edadMascota || !sintomasMascota) {
        alert("⚠️ Por favor, llena todos los campos.");
        return;
    }

    // Crear un objeto con los datos
    const nuevaCita = {
        nombreDueño,
        telefonoDueño,
        emailDueño,
        nombreMascota,
        tipoMascota,
        razaMascota,
        edadMascota,
        sintomasMascota,
        fechaRegistro: new Date().toISOString()
    };

    try {
        // Crear un ID único para la cita
        const citaRef = doc(collection(db, "citas"));
        await setDoc(citaRef, nuevaCita);

        // Mostrar notificación de éxito
        alert("✅ Cita agendada con éxito.");

        // Redirigir a home.html
        window.location.href = "home.html";
    } catch (error) {
        console.error("❌ Error al guardar la cita:", error);
        alert("⚠️ Ocurrió un error al agendar la cita. Intenta de nuevo.");
    }
});
