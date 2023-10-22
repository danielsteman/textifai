import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../app/config/firebase";

export const getCurrentProjectTitle = async (uid: string): Promise<string> => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);
  
  if (!userDocSnap.exists()) {
    return "⚠️ Project title not found";
  }
  
  const userData = userDocSnap.data();
  
  if (!userData || !userData.activeProject) {
    return "⚠️ Project title not found";
  }

  return userData.activeProject;
};
