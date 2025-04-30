import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAH3LAWgfxH5gEFHwNxkB68Qu0Lo_PIHpU",
    authDomain: "ligi-fpl-faa34.firebaseapp.com",
    projectId: "ligi-fpl-faa34",
    storageBucket: "ligi-fpl-faa34.firebasestorage.app",
    messagingSenderId: "161455892",
    appId: "1:161455892:web:70a160b84d767d94ef2c01",
    measurementId: "G-WFGV0QM93S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};