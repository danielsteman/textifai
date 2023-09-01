import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { storage } from "../../app/config/firebase";
import { StorageReference, listAll, ref } from "firebase/storage";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { MdAnalytics } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const MegaLibrary = () => {
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
    <Grid
      h="100%"
      templateRows="fit-content(100%) fit-content(100%) 1fr"
      templateColumns="auto 1fr"
      gap={2}
    >
      <GridItem rowSpan={1} colSpan={2}>
        <HStack w="100%" p={2} bgColor={"green.900"} borderRadius={8}>
          <Box w={2} />
          <Heading size="md">Library</Heading>
          <Box w={4} />
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
        </HStack>
      </GridItem>
      <GridItem rowSpan={2} colSpan={1}>
        <VStack p={4} bgColor={"yellow.900"} alignItems="left" borderRadius={8}>
          <Heading size="xs">Filters</Heading>
          <Button variant="ghost" size="xs">
            Any time
          </Button>
          <Button variant="ghost" size="xs">
            Since 2023
          </Button>
          <Button variant="ghost" size="xs">
            Since 2022
          </Button>
          <Button variant="ghost" size="xs">
            Since 2021
          </Button>
          <Button variant="ghost" size="xs">
            Custom range
          </Button>
          <Button variant="ghost" size="xs">
            Only show favorites
          </Button>
        </VStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <HStack borderRadius={8} bgColor="blue.900">
          <Heading size="sm">All documents</Heading>
          <Spacer />
          <IconButton aria-label={"analyse"} icon={<MdAnalytics />}>
            Analyse
          </IconButton>
          <IconButton aria-label={"ask tai"} icon={<ChatIcon />}>
            Ask TAI
          </IconButton>
          <Button>View selected documents</Button>
          <IconButton aria-label={"delete"} icon={<FaTrash />} />
        </HStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        {documents
          .filter((doc) => doc.name.includes(documentQuery))
          .map((doc) => (
            <Text key={doc.fullPath}>{doc.name}</Text>
          ))}
      </GridItem>
    </Grid>
  );
};

export default MegaLibrary;
