import { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { Timestamp, onSnapshot } from "firebase/firestore";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { WorkingDocument } from "@shared/firestoreInterfaces/WorkingDocument";
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";
import styled from "styled-components";
import StyledTextEditor from "./StyledTextEditor";

const TextEditor = () => {
  const [value, setValue] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const currentUser: User | null | undefined = useContext(AuthContext);

  // Fetching the document ID based on the current user
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, "workingdocuments"),
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().users.includes(currentUser.uid)) {
              setValue(doc.data().content);
              setDocumentId(doc.id);
            }
          });
        }
      );

      return () => unsubscribe(); // Cleanup listener on component unmount
    }
  }, [currentUser]);

  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (value && currentUser) {
        if (!documentId) {
          // Create new document if it doesn't exist
          const newDocument: WorkingDocument = {
            projectId: "your_project_id", // This needs to be provided or determined somehow
            name: "Document Name", // This might need to be adjusted
            creationDate: Timestamp.fromDate(new Date()),
            users: [currentUser.uid],
            modifiedDate: Timestamp.fromDate(new Date()),
            content: value,
          };

          const docRef = await addDoc(
            collection(db, "workingdocuments"),
            newDocument
          );
          setDocumentId(docRef.id);
        } else {
          // Update existing document
          await updateTextInFirestore(value);
        }
      }
    }, 10000); // save every 10 seconds

    return () => clearInterval(saveInterval); // Cleanup on component unmount
  }, [value, documentId, currentUser]);

  const updateTextInFirestore = async (textContent: string) => {
    if (documentId) {
      try {
        const documentUpdate: Partial<WorkingDocument> = {
          content: textContent,
          modifiedDate: Timestamp.fromDate(new Date()),
        };

        await updateDoc(
          doc(db, "workingdocuments", documentId),
          documentUpdate
        );
        console.log("Document updated successfully");
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  };

  return (
    <StyledTextEditor
      className="react-quill"
      theme="snow"
      value={value}
      onChange={setValue}
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }],
          ["bold", "italic", "underline"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image"],
          ["clean"],
        ],
      }}
    />
  );
};

export default TextEditor;
