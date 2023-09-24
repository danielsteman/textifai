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
import { db, storage } from "../../app/config/firebase";
import { StorageReference, deleteObject, listAll, ref } from "firebase/storage";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { MdAnalytics, MdUpload } from "react-icons/md";
import { FaRocket, FaStar, FaTrash } from "react-icons/fa";
import theme from "../../app/themes/theme";
import UploadForm from "../UploadForm/UploadForm";
import { ITab } from "../Workspace/Workspace";
import PdfViewer from "../PdfViewer/PdfViewer";
import { shortenString } from "../../common/utils/shortenString";
import { useSelector } from "react-redux";
import { RootState } from "src/app/store";
import { useDispatch } from "react-redux";
import { disableDocument, enableDocument } from "./librarySlice";
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { Document } from "@shared/firestoreInterfaces/Document"
import { current } from "@reduxjs/toolkit";
import ChatPanel from "../Workspace/panels/ChatPanel";

export interface MegaLibraryProps {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
  setCurrentTab: Dispatch<SetStateAction<ITab | undefined>>;
}

const MegaLibrary: React.FC<MegaLibraryProps> = ({
  openTabs,
  setOpenTabs,
  setCurrentTab,
}) => {
  const { colorMode } = useColorMode();
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<Document[]>([]);
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

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const documentsCollection = collection(db, 'uploads');
    const q = query(documentsCollection, where("uploadedBy", "==", currentUser!.uid));
    
    const unsubscribe = onSnapshot(q, snapshot => {
        const fetchedDocuments: Document[] = [];
        snapshot.forEach(doc => {
            fetchedDocuments.push(doc.data() as Document);  
        });
        setDocuments(fetchedDocuments);
    });

    return () => unsubscribe();

}, [selectedDocuments]);

  const handleDocumentCheckboxChange = (documentName: string) => {
    selectedDocuments.includes(documentName)
      ? dispatch(disableDocument(documentName))
      : dispatch(enableDocument(documentName));
  };

  const handleChangeDocumentQuery = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDocumentQuery(e.target.value);
  };

  const handleUploadComplete = () => {
    console.log('Upload complete!');
  };

  const handleDeleteDocument = async () => {
    selectedDocuments.map((fullPath) => {
      const documentRef = ref(storage, fullPath);
      deleteObject(documentRef)
        .then(() => {
          dispatch(disableDocument(fullPath));
          onDeleteFileClose();
          console.log(`${fullPath} is deleted`);
        })
        .catch((error) => {
          console.log("Error deleting file");
          console.log(error);
        });
    });
  };

  // Refactor to use the uploads collection
  // Two options: 
    // 1. Use clickable link in collecion
    // 2. Map fileName to firestorage
  const handleOpenDocumentInTab = async (filename: string) => {
    const storageLocation = `users/${currentUser?.uid}/uploads/${filename}.pdf`;
    const fileRef = ref(storage, storageLocation);

    const tab: ITab = {
      name: shortenString(filename, 20),
      panel: <PdfViewer document={fileRef} />,  // Ensure PdfViewer can handle Firebase Storage ref
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

  const toggleFavourite = (fileName: string, isFavourite: boolean) => {
    const documentsCollection = collection(db, 'uploads');
    const q = query(
        documentsCollection, 
        where("uploadedBy", "==", currentUser!.uid),  
        where("fileName", "==", fileName)
    );

    getDocs(q).then(snapshot => {
        if (!snapshot.empty) {
            const docRef = doc(db, 'uploads', snapshot.docs[0].id);  
            updateDoc(docRef, { favoritedBy: isFavourite })
        } else {
            console.error("Document with the specified fileName not found or user mismatch!");
        }
    }).catch(error => {
        console.error("Error fetching documents:", error);
    });
  };

  const parseTopics = (topicsString: string): string => {
    try {
        // Convert single quotes to double quotes
        const correctedString = topicsString.replace(/'/g, '"');
        const topicsArray = JSON.parse(correctedString);
        if (Array.isArray(topicsArray)) {
            return topicsArray.join(', ');
        } else {
            console.error('Parsed value is not an array:', topicsArray);
            return '';
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error parsing topics: ${error.message}`);
        } else {
            console.error("An unknown error occurred while parsing topics.");
        }
        return ''; 
    }
  }

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
                <UploadForm onUploadComplete={handleUploadComplete} />
              </ModalBody>
            </ModalContent>
          </Modal>
          {/* <Tooltip label="Coming soon!">
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
          </Tooltip> */}
          <Button
              size="sm"
              aria-label={"ask tai"}
              leftIcon={<ChatIcon />}
              borderRadius={100}
              bgColor={theme.colors[colorMode].secondaryContainer}
              textColor={theme.colors[colorMode].onSecondaryContainer}
              onClick={() => {
                const chatTab: ITab = {
                    name: 'Chat',
                    panel: <ChatPanel />, 
                    openChatSupport: false,
                    openMiniLibrary: false,
                    openPdfViewer: false,
                };
        
                const existingTab = openTabs.find((t) => t.name === chatTab.name);
                if (!existingTab) {
                    setOpenTabs((prevTabs) => [...prevTabs, chatTab]);
                }
                setCurrentTab(chatTab);
            }}
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
                {/* <Th>Summary</Th> */}
                <Th>Topics</Th>
                <Th>Favorite</Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents.length > 0 &&
                documents
                  .filter((doc) => doc.fileName.includes(documentQuery))
                  .map((doc: Document) => (
                    <Tr
                      key={doc.fileName}
                      _hover={{
                        bgColor: theme.colors[colorMode].surfaceContainerHighest,
                        cursor: "pointer",
                      }}
                    >
                      <Td>
                        <Checkbox
                          isChecked={selectedDocuments.includes(doc.fileName)}
                          onChange={() => handleDocumentCheckboxChange(doc.fileName)}
                        />
                      </Td>
                      <Td>
                        <Button
                          variant="link"
                          onClick={() => handleOpenDocumentInTab(doc.fileName)}
                        >
                          {doc.fileName}
                        </Button>
                      </Td>
                      <Td>{doc.author}</Td>
                      <Td isNumeric>{doc.creationDate.toDate().getFullYear()}</Td>
                      <Td>CollectionName</Td>
                      {/* <Td>This is a summary</Td> */}
                      <Td>{parseTopics(doc.topics)}</Td>
                      <Td textAlign="center">
                        <Icon 
                          as={FaStar} 
                          color={doc.favoritedBy ? "teal" : "none"} 
                          onClick={() => toggleFavourite(doc.fileName, !doc.favoritedBy)}
                        />
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
