import { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { Timestamp, DocumentReference, query, collection, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { WorkingDocument } from "@shared/firestoreInterfaces/WorkingDocument";
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";

const TextEditor = () => {
  const [value, setValue] = useState("");
  const currentUser: User | null | undefined = useContext(AuthContext);
  const [documentRef, setDocumentRef] = useState<DocumentReference | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (currentUser) {
        const docQuery = query(
          collection(db, "workingdocuments"),
          where("users", "array-contains", currentUser.uid)
        );
        const querySnapshot = await getDocs(docQuery);
        
        if (!querySnapshot.empty) {
          // Set the first matching document reference
          setDocumentRef(querySnapshot.docs[0].ref);
        } else {
          // Create a new document for the user
          const newDocumentData: WorkingDocument = {
            projectId: "your_project_id",  // Replace with appropriate project ID
            name: "some_name",  // Replace with desired document name
            creationDate: Timestamp.fromDate(new Date()),
            users: [currentUser.uid],
            modifiedDate: Timestamp.fromDate(new Date()),
            content: value
          };
          const newDocRef = await addDoc(collection(db, "workingdocuments"), newDocumentData);
          setDocumentRef(newDocRef);
        }
      }
    };

    fetchDocument();
  }, [currentUser, value]);

  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (documentRef) {
        await updateTextInFirestore(value, documentRef);
      }
    }, 10000);  // save every 10 seconds
    
    return () => clearInterval(saveInterval);  // Cleanup on component unmount
  }, [value, documentRef]);

  const updateTextInFirestore = async (textContent: string, docRef: DocumentReference) => {
    try {
      // Create the document data using type checking
      const documentUpdate: Partial<WorkingDocument> = {
        content: textContent,
        modifiedDate: Timestamp.fromDate(new Date())
      };

      await updateDoc(docRef, documentUpdate);
      console.log("Document updated successfully");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="react-quill"
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
