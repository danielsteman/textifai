import { App, initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { Storage, getStorage } from "firebase-admin/storage";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import path from "path";

// Loading environment variables
const envPath = path.resolve(__dirname, "../../.env.local");
dotenv.config({ path: envPath });

let app: App | null = null;
let storage: Storage | null = null;
let db: Firestore | null = null;

export const getFirebaseReference = () => {
  if (app === null) {
    app = initializeApp({
      credential: credential.cert({
        projectId: process.env.FIREBASE_PROJECTID!,
        clientEmail: process.env.FIREBASE_CLIENTMAIL!,
        privateKey: process.env.FIREBASE_PRIVATEKEY!.replace(/\\n/g, "\n"),
      }),
    });
  }
  return app;
};

export const getStorageReference = async () => {
  if (storage === null) {
    const app = await getFirebaseReference();
    storage = getStorage(app);
  }
  return storage;
};

export const getFirestoreReference = () => {
  if (db === null) {
    getFirebaseReference();
    db = getFirestore();
  }
  return db;
};
