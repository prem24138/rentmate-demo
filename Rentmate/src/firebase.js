import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBhhOOV1o9bTdHSBaXoCz1Y1fqaGrlElws",
    authDomain: "rentmate-8d87c.firebaseapp.com",
    projectId: "rentmate-8d87c",
    storageBucket: "rentmate-8d87c.firebasestorage.app",
    messagingSenderId: "1027744070946",
    appId: "1:1027744070946:web:fe9fde891907d11aa2397b",
    measurementId: "G-RGEJG9HNSF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
