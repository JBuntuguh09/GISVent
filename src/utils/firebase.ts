// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCaqQhLmeTZYgH6i7vCVAx2jcKjky9sapU",
    authDomain: "gisvent-6e8b0.firebaseapp.com",
    databaseURL: "https://gisvent-6e8b0-default-rtdb.firebaseio.com",
    projectId: "gisvent-6e8b0",
    storageBucket: "gisvent-6e8b0.firebasestorage.app",
    messagingSenderId: "679574481728",
    appId: "1:679574481728:web:532491e090f49a2d5528a5",
    measurementId: "G-CLYQBPQFRF"
};

const app = initializeApp(firebaseConfig);

// Export Firebase Auth instance
export const auth = getAuth(app);
