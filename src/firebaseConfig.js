// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA5ySL8VjVirT61v-2q0sachsOGmaeF0g",
  authDomain: "fuegolandia-dd421.firebaseapp.com",
  projectId: "fuegolandia-dd421",
  storageBucket: "fuegolandia-dd421.firebasestorage.app",
  messagingSenderId: "123243688493",
  appId: "1:123243688493:web:5f714c662ecba6c5fdbea4",
  measurementId: "G-YV4KSP623H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};