import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById("searchBtn").addEventListener("click", async function () {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultContainer = document.getElementById("resultContainer");

    if (!searchInput) {
        resultContainer.innerHTML = "<p>Por favor, ingresa un nombre para buscar.</p>";
        return;
    }

    try {
        // Referencia a la colección "citas"
        const citasRef = collection(db, "citas");
        const querySnapshot = await getDocs(citasRef);

        // Limpiar resultados anteriores
        resultContainer.innerHTML = "";

        let found = false;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nombreDueñoDB = data.nombreDueño.trim().toLowerCase(); // Normalizar

            if (nombreDueñoDB.includes(searchInput)) { // Comparación insensible a mayúsculas
                found = true;
                resultContainer.innerHTML += `
                    <div class="cita-card">
                        <p><strong>Dueño:</strong> ${data.nombreDueño}</p>
                        <p><strong>Correo:</strong> ${data.emailDueño}</p>
                        <p><strong>Mascota:</strong> ${data.nombreMascota} (${data.tipoMascota})</p>
                        <p><strong>Edad:</strong> ${data.edadMascota} años</p>
                        <p><strong>Raza:</strong> ${data.razaMascota}</p>
                        <p><strong>Síntomas:</strong> ${data.sintomasMascota}</p>
                        <p><strong>Teléfono:</strong> ${data.telefonoDueño}</p>
                        <p><strong>Fecha de Registro:</strong> ${new Date(data.fechaRegistro).toLocaleString()}</p>
                    </div>
                `;
            }
        });

        if (!found) {
            resultContainer.innerHTML = "<p>No se encontraron citas con ese nombre.</p>";
        }
    } catch (error) {
        console.error("Error al buscar citas:", error);
        resultContainer.innerHTML = "<p>Ocurrió un error al buscar citas.</p>";
    }
});

// Botón de volver a home
document.getElementById("backBtn").addEventListener("click", function () {
    window.location.href = "home.html";
});
