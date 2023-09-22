import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env.local");
dotenv.config({ path: envPath });

export const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_APIKEY,
  authDomain: process.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECTID,
  storageBucket: process.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.VITE_FIREBASE_APPID,
});

export const db = getFirestore(app);
