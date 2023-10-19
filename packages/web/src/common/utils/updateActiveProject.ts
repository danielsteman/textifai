import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../app/config/firebase";


export const updateProjectActiveState = async (
  projectName: string,
  userId: string,
  isActive: boolean
) => {
  const projectsRef = collection(db, "projects");
  const q = query(
    projectsRef,
    where("name", "==", projectName),
    where("users", "array-contains", userId)
  );

  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const projectDoc = querySnapshot.docs[0];
    const projectRef = doc(db, "projects", projectDoc.id);
    await updateDoc(projectRef, {
      active: isActive
    });
  } else {
    console.warn(`No project found with the name ${projectName} for the user with ID ${userId}`);
  }
};