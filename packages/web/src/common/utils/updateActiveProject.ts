import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../app/config/firebase";

export const setActiveProjectForUser = async (
  projectName: string,
  userId: string
) => {
  const projectsRef = collection(db, "projects");
  const q = query(
    projectsRef,
    where("name", "==", projectName),
    where("users", "array-contains", userId)
  );

  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      activeProject: projectName
    });
  } else {
    console.warn(`No project found with the name ${projectName} for the user with ID ${userId}`);
  }
};
