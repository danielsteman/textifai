import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import { Text, VStack } from "@chakra-ui/react";
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
    <VStack bgColor={"lightgrey"}>
      {documents.map((doc) => (
        <Text key={doc.fullPath}>{doc.name}</Text>
      ))}
    </VStack>
  );
};

export default DocumentCollection;
