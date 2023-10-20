import { getAuth, onAuthStateChanged } from "firebase/auth";

export async function isEmailVerified(): Promise<boolean> {
    const auth = getAuth();
  
    return new Promise<boolean>((resolve) => { 
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.emailVerified);
        } else {
          resolve(false);
        }
      });
    });
}
