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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { storage } from "../../app/config/firebase";
import { StorageReference, deleteObject, listAll, ref } from "firebase/storage";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { MdAnalytics } from "react-icons/md";
import { FaRocket, FaStar, FaTrash } from "react-icons/fa";
import theme from "../../app/themes/theme";

const MegaLibrary = () => {
  const { colorMode } = useColorMode();
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userDocumentsRef = ref(storage, `users/${currentUser?.uid}/uploads`);

  useEffect(() => {
    listAll(userDocumentsRef)
      .then((res) => {
        setDocuments(res.items);
      })
      .catch((error) => {
        console.warn("Something went wrong listing your files");
        console.error(error);
      });
  }, [selectedDocuments]);

  const handleDocumentCheckboxChange = (documentId: string) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(documentId)
        ? prevSelected.filter((id) => id !== documentId)
        : [...prevSelected, documentId]
    );
  };

  const handleChangeDocumentQuery = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocumentQuery(e.target.value);
  };

  const handleDeleteDocument = async () => {
    selectedDocuments.map((fullPath) => {
      const documentRef = ref(storage, fullPath);
      deleteObject(documentRef)
        .then(() => {
          const updatedSelectedDocuments = selectedDocuments.filter(
            (str) => str !== fullPath
          );
          setSelectedDocuments(updatedSelectedDocuments);
          onClose();
          console.log(`${fullPath} is deleted`);
        })
        .catch((error) => {
          console.log("Error deleting file");
          console.log(error);
        });
    });
  };

  return (
    <Grid
      h="100%"
      templateRows="fit-content(100%) fit-content(100%) 1fr"
      templateColumns="auto 1fr"
      gap={2}
    >
      <GridItem rowSpan={1} colSpan={2}>
        <HStack
          w="100%"
          p={2}
          bgColor={theme.colors[colorMode].surfaceContainerLow}
          borderRadius={8}
        >
          <Box w={2} />
          <Heading size="md" textColor={theme.colors[colorMode].onSurface}>
            Library
          </Heading>
          <Box w={4} />
          <InputGroup
            borderColor={theme.colors[colorMode].surfaceContainerHigh}
          >
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              placeholder="Search"
              onChange={handleChangeDocumentQuery}
              rounded="full"
              bgColor={theme.colors[colorMode].surfaceContainerHigh}
              _placeholder={{ color: theme.colors[colorMode].onSurfaceVariant }}
            />
          </InputGroup>
        </HStack>
      </GridItem>
      <GridItem rowSpan={2} colSpan={1}>
        <VStack
          p={4}
          bgColor={theme.colors[colorMode].surfaceContainer}
          borderRadius={8}
          align="flex-start"
          textColor={theme.colors[colorMode].onSurface}
          h="100%"
        >
          <Heading size="xs">Filters</Heading>
          <Button
            variant="ghost"
            size="xs"
            textColor={theme.colors[colorMode].onSurface}
          >
            Any time
          </Button>
          <Button
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
          >
            Since 2023
          </Button>
          <Button
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
          >
            Since 2022
          </Button>
          <Button
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
          >
            Since 2021
          </Button>
          <Button
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
          >
            Custom range
          </Button>
          <Button
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
          >
            Only show favorites
          </Button>
          <Box h={4} />
          <Heading size="xs">Collections</Heading>
          <Box h={4} />
          <Heading size="xs">Projects</Heading>
          <Spacer />
          <Button
            textColor={theme.colors[colorMode].onTertiaryContainer}
            bgColor={theme.colors[colorMode].tertiaryContainer}
            size="sm"
            leftIcon={<FaRocket />}
            borderRadius={100}
          >
            New project
          </Button>
        </VStack>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <HStack
          borderRadius={8}
          bgColor={theme.colors[colorMode].surfaceContainer}
          textColor={theme.colors[colorMode].onSurface}
          p={2}
        >
          <Heading size="xs">Documents</Heading>
          <Spacer />
          <Button
            size="sm"
            aria-label={"analyse"}
            leftIcon={<MdAnalytics />}
            borderRadius={100}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
          >
            Analyse
          </Button>
          <Button
            size="sm"
            aria-label={"ask tai"}
            leftIcon={<ChatIcon />}
            borderRadius={100}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
          >
            Ask TAI
          </Button>
          <Button
            size="sm"
            borderRadius={100}
            bgColor={theme.colors[colorMode].tertiaryContainer}
            textColor={theme.colors[colorMode].onTertiaryContainer}
          >
            View selected documents
          </Button>
          <IconButton
            size="sm"
            aria-label={"delete"}
            icon={<FaTrash />}
            onClick={onOpen}
          />
          <Modal isOpen={isOpen} onClose={onClose} size="xs">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <ModalCloseButton />
              </ModalHeader>
              <ModalBody>
                <VStack>
                  <Text>
                    Are you sure that you want to delete the selected document?
                  </Text>
                  {selectedDocuments.map((doc) => (
                    <Text key={doc}>{doc}</Text>
                  ))}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleDeleteDocument}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
              {documents.length > 0 &&
                documents
                  .filter((doc) => doc.name.includes(documentQuery))
                  .map((doc) => (
                    <Tr key={doc.fullPath}>
                      <Td>
                        <Checkbox
                          onChange={() =>
                            handleDocumentCheckboxChange(doc.fullPath)
                          }
                        />
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
