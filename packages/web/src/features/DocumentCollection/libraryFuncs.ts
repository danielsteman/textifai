import { db, storage } from "../../app/config/firebase";
import { deleteObject, ref } from "firebase/storage";
import {
  disableDocument
} from "./librarySlice";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const handleUploadComplete = () => {
    console.log("Upload complete!");
  };

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
    isFavourite: boolean) => {
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
    newCollection: string) => {
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
    try {
      // Convert single quotes to double quotes and replace hyphens
      const correctedString = topicsString
        .replace(/'/g, '"')
        .replace(/-/g, " ");
      const topicsArray = JSON.parse(correctedString);
      if (Array.isArray(topicsArray)) {
        return topicsArray.join(", ");
      } else {
        console.error("Parsed value is not an array:", topicsArray);
        return "";
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`Error parsing topics: ${error.message}`);
      } else {
        console.error("An unknown error occurred while parsing topics.");
      }
      return "";
    }
  };