// /src/firebase/config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";        // 👈 NEW: Import Auth service
import { getFirestore } from "firebase/firestore"; // 👈 NEW: Import Firestore service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-1Ccvec_h0MLC1-gUrMYNGmM4lNs_Zjs",
  authDomain: "k2glazier.firebaseapp.com",
  projectId: "k2glazier",
  storageBucket: "k2glazier.firebasestorage.app",
  messagingSenderId: "1004543312810",
  appId: "1:1004543312810:web:e5c91d02abe60c1bb321d3",
  measurementId: "G-W4X32QSQRL"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 👈 NEW: Initialize and export the services
export const auth = getAuth(app); 
export const db = getFirestore(app);

// Export the app (optional, but good practice)
export default app;



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC-1Ccvec_h0MLC1-gUrMYNGmM4lNs_Zjs",
//   authDomain: "k2glazier.firebaseapp.com",
//   projectId: "k2glazier",
//   storageBucket: "k2glazier.firebasestorage.app",
//   messagingSenderId: "1004543312810",
//   appId: "1:1004543312810:web:e5c91d02abe60c1bb321d3",
//   measurementId: "G-W4X32QSQRL"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);