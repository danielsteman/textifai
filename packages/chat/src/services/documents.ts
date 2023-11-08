import {
  getFirestoreReference,
  getStorageReference,
} from "../db/getFirebaseReference";

export const getDocumentContent = async (userId: string) => {
  const db = getFirestoreReference();
  const uploadedDocumentsRef = db.collection("uploads");
  const snapshot = await uploadedDocumentsRef
    .select("extractedText")
    .where("uploadedBy", "==", userId)
    .get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  const documents: any = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    documents.push(data);
  });

  return documents;
};

export const listDocumentNames = async (userId: string) => {
  const db = getStorageReference();
  const users = db.bucket("textifai-g5njdml004.appspot.com");

  const uploads = await users.getFiles({
    prefix: `users/${userId}/uploads`,
  });

  const fileNames = uploads[0].map((doc) => doc.name);

  return fileNames;
};
