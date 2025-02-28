import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById("registerBtn").addEventListener("click", async function () {
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!username || !email || !password) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos en Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email
        });

        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error al registrar: " + error.message);
    }
});
