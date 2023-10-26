import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../app/config/firebase";

export const fetchProjectId = async (currentUserUid: string): Promise<string | null> => {
  const projectsCollection = collection(db, "projects");
  const q = query(
    projectsCollection,
    where("users", "array-contains", currentUserUid),
    where("active", "==", true)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  } else {
    console.log("⚠️ Project not found for the specified user");
    return null;
  }
};
