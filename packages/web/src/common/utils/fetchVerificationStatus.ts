import { getAuth, onAuthStateChanged, User, reload } from "firebase/auth";

export function isEmailVerified(currentUser?: User | null): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
        if (currentUser) {
            await reload(currentUser);
            resolve(currentUser.emailVerified);
        } else {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if (user) {
                    await reload(user);
                    resolve(user.emailVerified);
                } else {
                    reject(new Error("User not found"));
                }
            });
        }
    });
}
