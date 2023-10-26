import { db } from "../../app/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function fetchProjectUid(userId: string, projectName: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const projectsRef = collection(db, "projects");
        const projectQuery = query(
            projectsRef,
            where("users", "array-contains", userId),
            where("name", "==", projectName)
        );

        getDocs(projectQuery)
            .then((snapshot) => {
                if (!snapshot.empty) {
                    const projectId = snapshot.docs[0].id;
                    resolve(projectId);
                } else {
                    console.log("No project found with the specified name for the user");
                    resolve(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching project:", error);
                reject(error);
            });
    });
}

export default fetchProjectUid;
