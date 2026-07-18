import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRJmjZNuVl0LIJZycvpxCEHD6h3oE1s0c",
  authDomain: "cryptopulse-6f2b7.firebaseapp.com",
  projectId: "cryptopulse-6f2b7",
  storageBucket: "cryptopulse-6f2b7.firebasestorage.app",
  messagingSenderId: "1009439642082",
  appId: "1:1009439642082:web:3534804f02754b5ae329bb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
