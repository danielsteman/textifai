import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import {
  Box,
  Button,
  Checkbox,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { storage } from "../../app/config/firebase";
import { StorageReference, listAll, ref } from "firebase/storage";
import { ChatIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { MdAnalytics } from "react-icons/md";
import { FaRocket, FaStar, FaTrash } from "react-icons/fa";

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
        <VStack
          p={4}
          bgColor={"yellow.900"}
          borderRadius={8}
          align="flex-start"
        >
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
          <Box h={4} />
          <Heading size="xs">Collections</Heading>
          <Box h={4} />
          <Heading size="xs">Projects</Heading>
          <Button size="sm" leftIcon={<FaRocket />}>
            New project
          </Button>
        </VStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <HStack borderRadius={8} bgColor="blue.900" p={2}>
          <Heading size="xs">Documents</Heading>
          <Spacer />
          <Button size="sm" aria-label={"analyse"} leftIcon={<MdAnalytics />}>
            Analyse
          </Button>
          <Button size="sm" aria-label={"ask tai"} leftIcon={<ChatIcon />}>
            Ask TAI
          </Button>
          <Button size="sm">View selected documents</Button>
          <IconButton size="sm" aria-label={"delete"} icon={<FaTrash />} />
        </HStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} overflow="auto">
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th />
                <Th>Title</Th>
                <Th>Author</Th>
                <Th isNumeric>Year</Th>
                <Th>Collection</Th>
                <Th>Summary</Th>
                <Th>Topics</Th>
                <Th>Favorite</Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents
                .filter((doc) => doc.name.includes(documentQuery))
                .map((doc) => (
                  <Tr key={doc.fullPath}>
                    <Td>
                      <Checkbox />
                    </Td>
                    <Td>{doc.name}</Td>
                    <Td>Henk</Td>
                    <Td isNumeric>1995</Td>
                    <Td>Collection1</Td>
                    <Td>This is summarized</Td>
                    <Td>Topic1, topic2, topic3</Td>
                    <Td textAlign="center">
                      <Icon as={FaStar} color="teal" />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </GridItem>
    </Grid>
  );
};

export default MegaLibrary;
