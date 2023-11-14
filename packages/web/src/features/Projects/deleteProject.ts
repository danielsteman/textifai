import { 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    arrayRemove,
    collection
} from "firebase/firestore";
import { db } from "../../app/config/firebase";

const projectsCollection = collection(db, "projects");

export const deleteProject = async (projectId: string, currentUserUid: string) => {
  const projectRef = doc(projectsCollection, projectId);

  try {
    const projectSnapshot = await getDoc(projectRef);

    const projectData = projectSnapshot.data();

    if (projectData!.users.length === 1 && projectData!.users[0] === currentUserUid) {
      await deleteDoc(projectRef);
    } else {
      await updateDoc(projectRef, {
        users: arrayRemove(currentUserUid)
      });
    }
  } catch (error) {
    console.error("Error updating or removing project: ", error);
  }
};
