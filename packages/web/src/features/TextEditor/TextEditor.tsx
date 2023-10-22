import { useState, useEffect, useContext } from "react";
import "react-quill/dist/quill.snow.css";
import "./textEditor.css";
import { Timestamp, onSnapshot } from "firebase/firestore";
import { doc, updateDoc, addDoc, collection, query, where } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { WorkingDocument } from "@shared/firestoreInterfaces/WorkingDocument";
import { AuthContext } from "../../app/providers/AuthProvider";
import StyledTextEditor from "./StyledTextEditor";
import { useColorMode } from "@chakra-ui/react";
import { getCurrentProjectTitle } from "../../common/utils/getCurrentProjectTitle";
import theme from "../../app/themes/theme";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { setProjectName } from "../Workspace/projectSlice";

const TextEditor = () => {
  const [value, setValue] = useState("");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const currentUser = useContext(AuthContext);
  const { colorMode } = useColorMode();

  const dispatch = useDispatch();

  const activeProjectId = useSelector((state: RootState) => state.activeProject.projectId);
  const activeProjectName = useSelector((state: RootState) => state.activeProject.projectName);

  useEffect(() => {
    const fetchActiveProject = async () => {
      const projectName = await getCurrentProjectTitle(currentUser!.uid)

      dispatch(setProjectName(projectName!));
    };

    fetchActiveProject();
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser && activeProjectId) { 
        const workingDocumentsRef = collection(db, "workingdocuments");

        const queryRef = query(
            workingDocumentsRef,
            where("users", "array-contains", currentUser.uid),
            where("projectId", "==", activeProjectId) 
        );

        const unsubscribe = onSnapshot(queryRef, async (querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    setValue(doc.data().content);
                    setDocumentId(doc.id);
                });
            } else if (value) {
                const newDocument: WorkingDocument = {
                    projectId: activeProjectId!,
                    name: activeProjectName!,
                    creationDate: Timestamp.fromDate(new Date()),
                    users: [currentUser.uid],
                    modifiedDate: Timestamp.fromDate(new Date()),
                    content: value,
                };

                const docRef = await addDoc(workingDocumentsRef, newDocument);
                setDocumentId(docRef.id);
            }
        });

        return () => unsubscribe();
      }
  }, [currentUser, documentId, activeProjectId]);
  
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

  useEffect(() => {
    if (value && documentId) {
      updateTextInFirestore(value);
    }
  }, [value, documentId]);

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