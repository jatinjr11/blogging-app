

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ Needed for login
import { getFirestore } from "firebase/firestore"; // ✅ If you're using Firestore
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBVKbo7Q7gD6QFn4PtXLcl1DHgtqeSIxOI",
  authDomain: "blogs-5833f.firebaseapp.com",
  projectId: "blogs-5833f",
  storageBucket: "blogs-5833f.firebasestorage.app",
  messagingSenderId: "346054278354",
  appId: "1:346054278354:web:97c92254d96b7457b9c10b",
  measurementId: "G-N4GKV8JM2M"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ These are important for sign-in and DB
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };