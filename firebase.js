// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBua394laXIi8TWKkmRN5IA02KUuyjpWw",
  authDomain: "inventory-counter-96eae.firebaseapp.com",
  projectId: "inventory-counter-96eae",
  storageBucket: "inventory-counter-96eae.appspot.com",
  messagingSenderId: "230496433685",
  appId: "1:230496433685:web:29edc5b3d5748bba7b801c",
  measurementId: "G-0HSST53GC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}