// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkT3Q8WOuq-UE8UzKOndAWeHu2Oisl2Cc",
  authDomain: "inshorts-e79cd.firebaseapp.com",
  projectId: "inshorts-e79cd",
  storageBucket: "inshorts-e79cd.appspot.com",
  messagingSenderId: "505620936802",
  appId: "1:505620936802:android:3dcd63397a8a1f6642393b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
