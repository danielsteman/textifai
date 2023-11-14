import { 
    doc, 
    updateDoc, 
    collection
} from "firebase/firestore";
import { db } from "../../app/config/firebase";

const projectsCollection = collection(db, "projects");

export const handleEditProjectName = async (projectId: string, newName: string) => {
    try {
      const projectRef = doc(projectsCollection, projectId);
      await updateDoc(projectRef, { name: newName.trim() });
    } catch (error) {
      console.error('Error updating project name:', error);
    }
  };