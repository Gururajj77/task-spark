
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGP7NyLzdwtR3VuIL5Rs9SAtNUGKUxCZY",
  authDomain: "task-spark-a4309.firebaseapp.com",
  projectId: "task-spark-a4309",
  storageBucket: "task-spark-a4309.firebasestorage.app",
  messagingSenderId: "837691689947",
  appId: "1:837691689947:web:ebb3e566a3001076d8b5fe",
  measurementId: "G-DKZJQBEHQY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
