import { db, storage } from "../../app/config/firebase";
import { deleteObject, ref } from "firebase/storage";
import { disableDocument } from "./librarySlice";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const handleDeleteDocument = async (
  currentUser: any,
  activeProjectId: string,
  selectedDocuments: string[],
  onDeleteFileClose: () => void,
  dispatch: Function
) => {
  for (const fullPath of selectedDocuments) {
    const documentRef = ref(
      storage,
      `users/${currentUser?.uid}/uploads/${fullPath}`
    );

    const documentsCollection = collection(db, "uploads");
    const q = query(
      documentsCollection,
      where("uploadedBy", "==", currentUser!.uid),
      where("uploadName", "==", fullPath),
      where("projectId", "==", activeProjectId)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((documentSnapshot) => {
        deleteDoc(doc(db, "uploads", documentSnapshot.id));
      });
      console.log(`Document with id ${fullPath} deleted from Firestore.`);
    } catch (error) {
      console.log("Error deleting document from Firestore:", error);
    }

    deleteObject(documentRef)
      .then(() => {
        dispatch(disableDocument(fullPath));
        onDeleteFileClose();
        console.log(`${fullPath} file is deleted from Firebase Storage.`);
      })
      .catch((error) => {
        console.log("Error deleting file from Firebase Storage:", error);
      });
  }
};

export const toggleFavourite = (
  currentUser: string,
  activeProjectId: string,
  fileName: string,
  isFavourite: boolean
) => {
  const documentsCollection = collection(db, "uploads");
  const q = query(
    documentsCollection,
    where("uploadedBy", "==", currentUser),
    where("uploadName", "==", fileName),
    where("projectId", "==", activeProjectId)
  );

  getDocs(q)
    .then((snapshot) => {
      if (!snapshot.empty) {
        const docRef = doc(db, "uploads", snapshot.docs[0].id);
        updateDoc(docRef, { favoritedBy: isFavourite });
      } else {
        console.error(
          "Document with the specified fileName not found or user mismatch!"
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });
};

export const addCollectionToDocument = (
  currentUser: string,
  activeProjectId: string,
  fileName: string,
  newCollection: string
) => {
  const documentsCollection = collection(db, "uploads");
  const q = query(
    documentsCollection,
    where("uploadedBy", "==", currentUser),
    where("uploadName", "==", fileName),
    where("projectId", "==", activeProjectId)
  );

  getDocs(q)
    .then((snapshot) => {
      if (!snapshot.empty) {
        const docRef = doc(db, "uploads", snapshot.docs[0].id);
        const currentCollections = snapshot.docs[0].data().tags || [];

        if (!currentCollections.includes(newCollection)) {
          updateDoc(docRef, { tags: [...currentCollections, newCollection] });
        } else {
          console.log("Collection already exists for this document!");
        }
      } else {
        console.error(
          "Document with the specified fileName not found or user mismatch!"
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });
};

export const deleteCollectionFromDocument = (
  currentUser: string,
  activeProjectId: string,
  fileName: string,
  collectionToDelete: string
) => {
  const documentsCollection = collection(db, "uploads");
  const q = query(
    documentsCollection,
    where("uploadedBy", "==", currentUser),
    where("uploadName", "==", fileName),
    where("projectId", "==", activeProjectId)
  );

  getDocs(q)
    .then((snapshot) => {
      if (!snapshot.empty) {
        const docRef = doc(db, "uploads", snapshot.docs[0].id);
        const currentCollections = snapshot.docs[0].data().tags || [];

        if (currentCollections.includes(collectionToDelete)) {
          const updatedCollections = currentCollections.filter(
            (tag: string) => tag !== collectionToDelete
          );
          updateDoc(docRef, { tags: updatedCollections });
        } else {
          console.log("Collection not found for this document!");
        }
      } else {
        console.error(
          "Document with the specified fileName not found or user mismatch!"
        );
      }
    })
    .catch((error: any) => {
      console.error("Error fetching documents:", error);
    });
};

export const parseTopics = (topicsString: string): string => {
  if (!topicsString) {
    return "";
  }
  try {
    const correctedString = topicsString.replace(/'/g, '"').replace(/-/g, " ");
    const topicsArray = JSON.parse(correctedString);
    if (Array.isArray(topicsArray)) {
      return topicsArray.join(", ");
    } else {
      console.error("Parsed value is not an array:", topicsArray);
    }
  } catch (error) {
    console.error("An unknown error occurred while parsing topics.");
  }
  return "";
};

export const parseSampleQuestions = (questionsString: string): string[] => {
  try {
    const correctedString = questionsString
      .replace(/'/g, '"')
      .replace(/-/g, " ");
    const questionsArray = JSON.parse(correctedString);
    if (Array.isArray(questionsArray)) {
      return questionsArray;
    } else {
      console.error("Parsed value is not an array:", questionsArray);
      return [];
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`Error parsing sample questions: ${error.message}`);
    } else {
      console.error(
        "An unknown error occurred while parsing sample questions."
      );
    }
    return [];
  }
};

export const updateFilename = async (
  currentUserUid: string,
  activeProjectId: string,
  oldFileName: string,
  newFileName: string
) => {
  // Define the collection
  const documentsCollection = collection(db, "uploads");

  // Create a query for the old file name
  const q = query(
    documentsCollection,
    where("uploadedBy", "==", currentUserUid),
    where("uploadName", "==", oldFileName),
    where("projectId", "==", activeProjectId)
  );

  try {
    // Attempt to get the document with the old file name
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      // Get the first document's reference
      const docRef = doc(db, "uploads", snapshot.docs[0].id);

      // Check if a file with the new file name already exists
      const newNameQuery = query(
        documentsCollection,
        where("uploadedBy", "==", currentUserUid),
        where("uploadName", "==", newFileName),
        where("projectId", "==", activeProjectId)
      );

      const newNameSnapshot = await getDocs(newNameQuery);
      if (newNameSnapshot.empty) {
        // No document with the new file name exists, safe to update
        await updateDoc(docRef, { fileName: newFileName });
        console.log("File name updated successfully!");
      } else {
        // A document with the new file name already exists
        throw new Error("A file with the new name already exists!");
      }
    } else {
      throw new Error(
        "Document with the specified file name not found or user mismatch!"
      );
    }
  } catch (error) {
    console.error("Error updating file name:", error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
};
