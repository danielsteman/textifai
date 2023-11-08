import { App, initializeApp } from "firebase-admin/app";
import { Storage, getStorage } from "firebase-admin/storage";

let app: App | null = null;

export const getFirebaseReference = () => {
  if (app === null) {
    app = initializeApp();
  }
  return app;
};

let db: Storage | null = null;

export const getDatabaseReference = () => {
  if (db === null) {
    const app = initializeApp();
    db = getStorage(app);
  }
  return db;
};
