import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,  
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button
} from "@chakra-ui/react";
import { useSelector, useDispatch } from 'react-redux';
import { storage } from "../../app/config/firebase";
import { StorageReference, listAll, ref } from "firebase/storage";
import { SearchIcon } from "@chakra-ui/icons";
import { RootState } from "../../app/store";
import { disableDocument, enableDocument } from "./librarySlice";

const MiniLibrary = () => {
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const listRef = ref(storage, `users/${currentUser?.uid}/uploads`);

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );
  
  const dispatch = useDispatch();

  useEffect(() => {
    listAll(listRef)
      .then((res) => {
        setDocuments(res.items);
      })
      .catch((error) => {
        console.warn("Something went wrong listing your files");
        console.error(error);
      });
  }, []);

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

      <Table size="sm">
        <Thead>
          <Tr>
            <Th />
            <Th>Title</Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents
            .filter((doc) => doc.name.toLowerCase().includes(documentQuery.toLowerCase()))
            .map((doc) => (
              <Tr key={doc.fullPath}>
                <Td>
                  <Checkbox
                    isChecked={selectedDocuments.includes(doc.name)}
                    onChange={() => handleDocumentCheckboxChange(doc.name)}
                  />
                </Td>
                <Td>{doc.name}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default MiniLibrary;
