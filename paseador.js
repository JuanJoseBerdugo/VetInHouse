import { db } from "./firebase-config.js";
import { doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById("paseadorForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value;
    const edad = document.getElementById("edad").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const experiencia = document.getElementById("experiencia").value;
    const porque = document.getElementById("porque").value;

    // Validación: Verificar que todos los campos estén llenos
    if (!nombre || !edad || !telefono || !email || !experiencia || !porque) {
        alert("⚠️ Por favor, llena todos los campos.");
        return;
    }

    // Crear un objeto con los datos
    const nuevoPaseador = {
        nombre,
        edad,
        telefono,
        email,
        experiencia,
        porque,
        fechaRegistro: new Date().toISOString()
    };

    try {
        // Crear un ID único para el paseador
        const paseadorRef = doc(collection(db, "paseadores"));
        await setDoc(paseadorRef, nuevoPaseador);

        // Mostrar notificación de éxito
        alert("✅ Datos enviados con éxito. ¡Gracias por postularte!");

        // Redirigir a home.html
        window.location.href = "home.html";
    } catch (error) {
        console.error("❌ Error al guardar los datos del paseador:", error);
        alert("⚠️ Ocurrió un error al enviar los datos. Intenta de nuevo.");
    }
});
