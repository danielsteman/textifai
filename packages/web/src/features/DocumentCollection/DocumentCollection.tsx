import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import { Box, Text, VStack } from "@chakra-ui/react";
import { storage } from "../../app/config/firebase";
import { StorageReference, listAll, ref } from "firebase/storage";

const DocumentCollection = () => {
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const listRef = ref(storage, `users/${currentUser?.uid}/uploads`);

  useEffect(() => {
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          setDocuments([...documents, itemRef]);
        });
      })
      .catch((error) => {
        console.log("Something went wrong listing your files");
        console.log(error);
      });
  }, []);

  return (
    <Box>
      Hi {currentUser?.email}
      <VStack>
        {documents.map((doc) => (
          <Text key={doc.fullPath}>{doc.name}</Text>
        ))}
      </VStack>
    </Box>
  );
};

export default DocumentCollection;
