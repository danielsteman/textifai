import { getAuth, onAuthStateChanged } from "firebase/auth";

export async function isEmailVerified() {
    const auth = getAuth();
  
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.emailVerified);
        } else {
          resolve(false);
        }
      });
    });
  }


  