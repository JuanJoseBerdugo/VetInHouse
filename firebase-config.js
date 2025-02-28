import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA0mMbM1lhMvSGf2BcXd3lt0HTINIoY6vQ",
    authDomain: "vetinhouse-97171.firebaseapp.com",
    projectId: "vetinhouse-97171",
    storageBucket: "vetinhouse-97171.appspot.com",
    messagingSenderId: "226468046837",
    appId: "1:226468046837:web:2c1ec9f9d66714870862bc",
    measurementId: "G-RJZR816SQ0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
