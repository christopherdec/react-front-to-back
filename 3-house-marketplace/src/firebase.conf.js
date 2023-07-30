import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyCC4dkAClha1In5FBSo7_B2kls6OTgYVuY",
    authDomain: "house-marketplace-app-d5f84.firebaseapp.com",
    projectId: "house-marketplace-app-d5f84",
    storageBucket: "house-marketplace-app-d5f84.appspot.com",
    messagingSenderId: "145871936347",
    appId: "1:145871936347:web:142482c823d58d5219987e"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();