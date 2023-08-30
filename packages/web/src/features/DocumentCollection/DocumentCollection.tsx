import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { storage } from "../../app/config/firebase";
import { StorageReference, listAll, ref } from "firebase/storage";
import { SearchIcon } from "@chakra-ui/icons";

const DocumentCollection = () => {
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const listRef = ref(storage, `users/${currentUser?.uid}/uploads`);

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
      {documents
        .filter((doc) => doc.name.includes(documentQuery))
        .map((doc) => (
          <Text key={doc.fullPath}>{doc.name}</Text>
        ))}
    </VStack>
  );
};

export default DocumentCollection;
