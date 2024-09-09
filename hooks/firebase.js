// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAkT3Q8WOuq-UE8UzKOndAWeHu2Oisl2Cc",
  authDomain: "inshorts-e79cd.firebaseapp.com",
  databaseURL:
    "https://inshorts-e79cd-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "inshorts-e79cd",
  storageBucket: "inshorts-e79cd.appspot.com",
  messagingSenderId: "505620936802",
  appId: "1:505620936802:android:3dcd63397a8a1f6642393b",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getDatabase(app);

export { auth, db };
