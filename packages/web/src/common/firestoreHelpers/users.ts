import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { User } from "@shared/interfaces/firebase/User";

export const getUser = async (uid: string): Promise<User | undefined> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    console.warn("No found for current user!");
    return;
  }
};

export const updateUser = async (uid: string, fields: Partial<User>) => {
  const docRef = doc(db, "users", uid);
  try {
    await updateDoc(docRef, fields as any);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
