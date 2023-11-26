import { DocumentData } from "firebase-admin/firestore";
import {
  getFirestoreReference,
  getStorageReference,
} from "../db/getFirebaseReference";

export const textExtractor = async (
  userId: string,
  uploadNames: string[]
): Promise<string> => {
  try {
    const db = getFirestoreReference();
    const uploadedDocumentsRef = db.collection("uploads");

    let combinedText = "";

    for (const uploadName of uploadNames) {
      const snapshot = await uploadedDocumentsRef
        .where("uploadedBy", "==", userId)
        .where("uploadName", "==", uploadName)
        .get();

      if (!snapshot.empty) {
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.extractedText) {
            combinedText += data.extractedText + "\n";
          }
        });
      }
    }

    if (combinedText === "") {
      throw new Error(
        `No documents found for ${userId} with specified upload names.`
      );
    }

    return combinedText;
  } catch (error) {
    console.error(`Error retrieving documents: ${error}`);
    throw error;
  }
};

export const listDocumentNames = async (userId: string) => {
  const db = getStorageReference();
  const users = (await db).bucket("textifai-g5njdml004.appspot.com");

  const uploads = await users.getFiles({
    prefix: `users/${userId}/uploads`,
  });

  const fileNames = uploads[0].map((doc) => doc.name);

  return fileNames;
};
