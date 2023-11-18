import { doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../app/config/firebase";

export const handleEditProjectName = async (
  projectId: string,
  newName: string
) => {
  try {
    const projectsCollection = collection(db, "projects");
    const projectRef = doc(projectsCollection, projectId);
    await updateDoc(projectRef, { name: newName.trim() });
  } catch (error) {
    console.error("Error updating project name:", error);
  }
};
