import { App, initializeApp } from "firebase-admin/app";
import { Storage, getStorage } from "firebase-admin/storage";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let app: App | null = null;

export const getFirebaseReference = () => {
  if (app === null) {
    app = initializeApp();
  }
  return app;
};

let storage: Storage | null = null;

export const getStorageReference = () => {
  if (storage === null) {
    const app = getFirebaseReference();
    storage = getStorage(app);
  }
  return storage;
};

let db: Firestore | null = null;

export const getFirestoreReference = () => {
  if (db === null) {
    getFirebaseReference();
    db = getFirestore();
  }
  return db;
};
