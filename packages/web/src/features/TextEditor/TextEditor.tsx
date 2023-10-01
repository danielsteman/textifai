import { useState, useEffect, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { Timestamp, onSnapshot } from "firebase/firestore";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { WorkingDocument } from "@shared/firestoreInterfaces/WorkingDocument";
import { AuthContext } from "../../app/providers/AuthProvider";
import StyledTextEditor from "./StyledTextEditor";
import { useColorMode } from "@chakra-ui/react";
import theme from "../../app/themes/theme";

const TextEditor = () => {
  const [value, setValue] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const currentUser = useContext(AuthContext);
  const { colorMode } = useColorMode();

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

      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (value && currentUser) {
        if (!documentId) {
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
          await updateTextInFirestore(value);
        }
      }
    }, 10000); // save every 10 seconds

    return () => clearInterval(saveInterval);
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
      textColor={theme.colors[colorMode].inverseSurface}
      editorBackgroundColor={theme.colors[colorMode].surfaceContainerLowest}
      toolbarBackgroundColor={theme.colors[colorMode].surfaceContainerLow}
    />
  );
};

export default TextEditor;
