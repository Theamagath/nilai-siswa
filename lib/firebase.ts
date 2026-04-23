import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVw7u_1aZJM3SuwxEbpH5quqqcCUi6gHk",
  authDomain: "ujkthea.firebaseapp.com",
  projectId: "ujkthea",
  storageBucket: "ujkthea.firebasestorage.app",
  messagingSenderId: "76929070164",
  appId: "1:76929070164:web:6f5cb8359a06d4f39e69c1",
  measurementId: "G-24ZPC40RTM",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);