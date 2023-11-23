import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import {
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { db, storage } from "../../app/config/firebase";
import { ref } from "firebase/storage";
import { SearchIcon } from "@chakra-ui/icons";
import { RootState } from "../../app/store";
import { disableDocument, enableDocument } from "./librarySlice";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Document } from "@shared/interfaces/firebase/Document";

const MiniLibrary = () => {
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const listRef = ref(storage, `users/${currentUser?.uid}/uploads`);

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );

  const dispatch = useDispatch();

  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  // useEffect(() => {
  //   listAll(listRef)
  //     .then((res) => {
  //       setDocuments(res.items);
  //     })
  //     .catch((error) => {
  //       console.warn("Something went wrong listing your files");
  //       console.error(error);
  //     });
  // }, []);

  useEffect(() => {
    const documentsCollection = collection(db, "uploads");
    const q = query(
      documentsCollection,
      where("uploadedBy", "==", currentUser!.uid),
      where("projectId", "==", activeProjectId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDocuments: Document[] = [];
      snapshot.forEach((doc) => {
        fetchedDocuments.push(doc.data() as Document);
      });
      setDocuments(fetchedDocuments);
    });

    return () => unsubscribe();
  }, [selectedDocuments, currentUser, activeProjectId]);

  const handleDocumentCheckboxChange = (documentName: string) => {
    if (selectedDocuments.includes(documentName)) {
      dispatch(disableDocument(documentName));
    } else {
      dispatch(enableDocument(documentName));
    }
  };

  const handleChangeDocumentQuery = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocumentQuery(e.target.value);
  };

  return (
    <VStack h="100%">
      <Box w="100%" px={2}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            placeholder="Search"
            onChange={handleChangeDocumentQuery}
            rounded="full"
            bgColor={"grey"}
          />
        </InputGroup>
      </Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th />
            <Th>Title</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents
            .filter((doc) =>
              doc.fileName.toLowerCase().includes(documentQuery.toLowerCase())
            )
            .map((doc: Document) => (
              <Tr key={doc.fileName}>
                <Td>
                  <Checkbox
                    isChecked={selectedDocuments.includes(doc.uploadName)}
                    onChange={() =>
                      handleDocumentCheckboxChange(doc.uploadName)
                    }
                  />
                </Td>
                <Td>{doc.fileName}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default MiniLibrary;
