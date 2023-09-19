import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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
  Tooltip,
  Tr,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { storage } from "../../app/config/firebase";
import { StorageReference, deleteObject, listAll, ref } from "firebase/storage";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { MdAnalytics, MdUpload } from "react-icons/md";
import { FaRocket, FaStar, FaTrash } from "react-icons/fa";
import theme from "../../app/themes/theme";
import UploadForm from "../UploadForm/UploadForm";
import { ITab } from "src/app/routes/Workspace";
import PdfViewer from "../PdfViewer/PdfViewer";
import { shortenString } from "../../common/utils/shortenString";

export interface MegaLibraryProps {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
  setCurrentTab: Dispatch<SetStateAction<ITab | undefined>>;
  selectedDocuments: string[];
  setSelectedDocuments: Dispatch<SetStateAction<string[]>>;
}

const MegaLibrary: React.FC<MegaLibraryProps> = ({
  openTabs,
  setOpenTabs,
  setCurrentTab,
  selectedDocuments,
  setSelectedDocuments,
}) => {
  const { colorMode } = useColorMode();
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const {
    isOpen: isDeleteFileOpen,
    onOpen: onDeleteFileOpen,
    onClose: onDeleteFileClose,
  } = useDisclosure();
  const {
    isOpen: isUploadFileOpen,
    onOpen: onUploadFileOpen,
    onClose: onUploadFileClose,
  } = useDisclosure();
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

  const handleDocumentCheckboxChange = (documentName: string) => {
    console.log(documentName);
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(documentName)
        ? prevSelected.filter((name) => name !== documentName)
        : [...prevSelected, documentName]
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
          onDeleteFileClose();
          console.log(`${fullPath} is deleted`);
        })
        .catch((error) => {
          console.log("Error deleting file");
          console.log(error);
        });
    });
  };

  const handleOpenDocumentInTab = (document: StorageReference) => {
    const tab: ITab = {
      name: shortenString(document.fullPath.split("/").pop() || "pdf", 20),
      panel: <PdfViewer document={ref(storage, document.fullPath)} />,
      openChatSupport: false,
      openMiniLibrary: false,
      openPdfViewer: false,
    };
    const existingTab = openTabs.find((t) => t.name === tab.name);
    if (!existingTab) {
      setOpenTabs((prevTabs) => [...prevTabs, tab]);
    }
    setCurrentTab(tab);
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
            aria-label={"upload"}
            leftIcon={<MdUpload />}
            borderRadius={100}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
            onClick={onUploadFileOpen}
          >
            Upload
          </Button>
          <Modal isOpen={isUploadFileOpen} onClose={onUploadFileClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload files</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <UploadForm />
              </ModalBody>
            </ModalContent>
          </Modal>
          <Tooltip label="Coming soon!">
            <Button
              disabled={true}
              size="sm"
              aria-label={"analyse"}
              leftIcon={<MdAnalytics />}
              borderRadius={100}
              bgColor={theme.colors[colorMode].secondaryContainer}
              textColor={theme.colors[colorMode].onSecondaryContainer}
            >
              Analyse
            </Button>
          </Tooltip>
          <Button
            size="sm"
            aria-label={"ask tai"}
            leftIcon={<ChatIcon />}
            borderRadius={100}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
          >
            {/* onClick(() => open chat window so user can chat with selected documents) */}
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
          <Tooltip label="Select documents in the table below!">
            <IconButton
              size="sm"
              aria-label={"delete"}
              icon={<FaTrash />}
              onClick={onDeleteFileOpen}
              isDisabled={!selectedDocuments?.length}
            />
          </Tooltip>
          <Modal
            isOpen={isDeleteFileOpen}
            onClose={onDeleteFileClose}
            size="xs"
          >
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
                <Button colorScheme="blue" mr={3} onClick={onDeleteFileClose}>
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
                    <Tr
                      key={doc.fullPath}
                      _hover={{
                        bgColor:
                          theme.colors[colorMode].surfaceContainerHighest,
                        cursor: "pointer",
                      }}
                    >
                      <Td>
                        <Checkbox
                          isChecked={selectedDocuments.includes(doc.name)}
                          onChange={() =>
                            handleDocumentCheckboxChange(doc.name)
                          }
                        />
                      </Td>
                      <Td>
                        <Button
                          variant="link"
                          onClick={() => handleOpenDocumentInTab(doc)}
                        >
                          {doc.name}
                        </Button>
                      </Td>
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
