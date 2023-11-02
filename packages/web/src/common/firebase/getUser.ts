import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/config/firebase";

export const getUser = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.warn("No found for current user!");
  }
};
