import React, { useContext, useEffect, useRef, useState } from "react";
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
import { deleteObject, ref } from "firebase/storage";
import { ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { MdUpload } from "react-icons/md";
import { FaRocket, FaStar, FaTrash } from "react-icons/fa";
import theme from "../../app/themes/theme";
import UploadForm from "../UploadForm/UploadForm";
import { ITab } from "../Workspace/Workspace";
import PdfViewer from "../PdfViewer/PdfViewer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import {
  disableDocument,
  enableDocument,
  initializeSelectedDocuments,
  selectAllDocuments,
  clearAllSelections,
} from "./librarySlice";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Document } from "@shared/firestoreInterfaces/Document";
import ChatPanel from "../Workspace/panels/ChatPanel";
import TagInput from "../../common/components/CollectionTags";
import { fetchProjectId } from "../../common/utils/getCurrentProjectId";
import { openTab } from "../Workspace/tabsSlice";
import { useNavigate } from 'react-router-dom';
import { setProjectId, setProjectName } from "../Workspace/projectSlice";

const MegaLibrary = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<number | null>(null);

  const [collectionFilter, setCollectionFilter] = useState<string | null>(null);
  const [onlyFavoritesFilter, setOnlyFavoritesFilter] =
    useState<boolean>(false);
  const [customYearStart, setCustomYearStart] = useState<number | null>(null);
  const [customYearEnd, setCustomYearEnd] = useState<number | null>(null);
  const [isCustomRangeSelected, setIsCustomRangeSelected] = useState(false);

  const dispatch = useDispatch();

  const openTabs = useSelector((state: RootState) => state.tabs.openTabs);

  const didRunOnce = useRef(false);

  const activeProject = useSelector((state: RootState) => state.activeProject.projectId);

  useEffect(() => {
    if (documents.length === 0) {
      onUploadFileOpen();
    }
  }, [documents]);

  useEffect(() => {
    const fetchActiveProject = async () => {
      const projectId = await fetchProjectId(currentUser!.uid);
      dispatch(setProjectId(projectId!));
    };

    fetchActiveProject();
  }, [currentUser, activeProject]);

  const allCollections = Array.from(
    new Set(documents.flatMap((doc) => doc.tags))
  );

  const toggleAllDocuments = () => {
    if (selectedDocuments.length === documents.length) {
      dispatch(clearAllSelections());
    } else {
      const allDocumentNames = documents.map((doc) => doc.uploadName);
      dispatch(selectAllDocuments(allDocumentNames));
    }
  };

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

  const handleToggleFavoritesFilter = () => {
    setOnlyFavoritesFilter((prev) => !prev);
    if (onlyFavoritesFilter) setYearFilter(null);
  };

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );

  useEffect(() => {
    if (!didRunOnce.current && documents.length > 0) {
      const allUploadNames = documents.map((doc) => doc.uploadName);
      dispatch(initializeSelectedDocuments(allUploadNames));
      didRunOnce.current = true;
    }
  }, [documents, dispatch]);

  useEffect(() => {
    const documentsCollection = collection(db, "uploads");
    const q = query(
      documentsCollection,
      where("uploadedBy", "==", currentUser!.uid),
      where("projectId", "==", activeProject)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDocuments: Document[] = [];
      snapshot.forEach((doc) => {
        fetchedDocuments.push(doc.data() as Document);
      });
      setDocuments(fetchedDocuments);
    });

    return () => unsubscribe();
  }, [selectedDocuments, activeProject]);

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

  const handleUploadComplete = () => {
    console.log("Upload complete!");
  };

  const handleDeleteDocument = async () => {
    selectedDocuments.map(async (fullPath?) => {
      const documentRef = ref(
        storage,
        `users/${currentUser?.uid}/uploads/${fullPath}`
      );

      // Construct your Firestore query
      const documentsCollection = collection(db, "uploads");
      const q = query(
        documentsCollection,
        where("uploadedBy", "==", currentUser!.uid),
        where("uploadName", "==", fullPath),
        where("projectId", "==", activeProject)
      );

      // 1. Delete from Firestore
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((documentSnapshot) => {
          deleteDoc(doc(db, "uploads", documentSnapshot.id));
        });
        console.log(`Document with id ${fullPath} deleted from Firestore.`);
      } catch (error) {
        console.log("Error deleting document from Firestore:", error);
      }

      // 2. Delete from Firebase Storage
      deleteObject(documentRef)
        .then(() => {
          dispatch(disableDocument(fullPath));
          onDeleteFileClose();
          console.log(`${fullPath} file is deleted from Firebase Storage.`);
        })
        .catch((error) => {
          console.log("Error deleting file from Firebase Storage:", error);
        });
    });
  };

  const handleOpenDocumentInTab = async (uploadName: string) => {
    const storageLocation = `users/${currentUser?.uid}/uploads/${uploadName}`;
    const fileRef = ref(storage, storageLocation);

    const tab: ITab = {
      name: uploadName,
      panel: <PdfViewer document={fileRef} />,
      openChatSupport: false,
      openMiniLibrary: false,
      openPdfViewer: false,
    };
    dispatch(openTab(tab));
    dispatch(initializeSelectedDocuments([tab.name]));
  };

  const toggleFavourite = (fileName: string, isFavourite: boolean) => {
    const documentsCollection = collection(db, "uploads");
    const q = query(
      documentsCollection,
      where("uploadedBy", "==", currentUser!.uid),
      where("uploadName", "==", fileName),
      where("projectId", "==", activeProject)
    );

    getDocs(q)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const docRef = doc(db, "uploads", snapshot.docs[0].id);
          updateDoc(docRef, { favoritedBy: isFavourite });
        } else {
          console.error(
            "Document with the specified fileName not found or user mismatch!"
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const addCollectionToDocument = (fileName: string, newCollection: string) => {
    const documentsCollection = collection(db, "uploads");
    const q = query(
      documentsCollection,
      where("uploadedBy", "==", currentUser!.uid),
      where("uploadName", "==", fileName),
      where("projectId", "==", activeProject)
    );

    getDocs(q)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const docRef = doc(db, "uploads", snapshot.docs[0].id);
          const currentCollections = snapshot.docs[0].data().tags || [];

          if (!currentCollections.includes(newCollection)) {
            updateDoc(docRef, { tags: [...currentCollections, newCollection] });
          } else {
            console.log("Collection already exists for this document!");
          }
        } else {
          console.error(
            "Document with the specified fileName not found or user mismatch!"
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const deleteCollectionFromDocument = (
    fileName: string,
    collectionToDelete: string
  ) => {
    const documentsCollection = collection(db, "uploads");
    const q = query(
      documentsCollection,
      where("uploadedBy", "==", currentUser!.uid),
      where("uploadName", "==", fileName),
      where("projectId", "==", activeProject)
    );

    getDocs(q)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const docRef = doc(db, "uploads", snapshot.docs[0].id);
          const currentCollections = snapshot.docs[0].data().tags || [];

          if (currentCollections.includes(collectionToDelete)) {
            const updatedCollections = currentCollections.filter(
              (tag: string) => tag !== collectionToDelete
            );
            updateDoc(docRef, { tags: updatedCollections });
          } else {
            console.log("Collection not found for this document!");
          }
        } else {
          console.error(
            "Document with the specified fileName not found or user mismatch!"
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  };

  const parseTopics = (topicsString: string): string => {
    try {
      // Convert single quotes to double quotes and replace hyphens
      const correctedString = topicsString
        .replace(/'/g, '"')
        .replace(/-/g, " ");
      const topicsArray = JSON.parse(correctedString);
      if (Array.isArray(topicsArray)) {
        return topicsArray.join(", ");
      } else {
        console.error("Parsed value is not an array:", topicsArray);
        return "";
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`Error parsing topics: ${error.message}`);
      } else {
        console.error("An unknown error occurred while parsing topics.");
      }
      return "";
    }
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
            bgColor={
              yearFilter === null &&
              !onlyFavoritesFilter &&
              !isCustomRangeSelected
                ? theme.colors[colorMode].onPrimary
                : undefined
            }
            variant="ghost"
            size="xs"
            textColor={theme.colors[colorMode].onSurface}
            onClick={() => {
              setYearFilter(null);
              setIsCustomRangeSelected(false);
              setOnlyFavoritesFilter(false);
            }}
          >
            Any time
          </Button>
          <Button
            bgColor={
              yearFilter === 2023
                ? theme.colors[colorMode].onPrimary
                : undefined
            }
            variant="ghost"
            size="xs"
            textColor={theme.colors[colorMode].onSurface}
            onClick={() => {
              setIsCustomRangeSelected(false);
              setYearFilter(2023);
            }}
          >
            Since 2023
          </Button>
          <Button
            bgColor={
              yearFilter === 2022
                ? theme.colors[colorMode].onPrimary
                : undefined
            }
            variant="ghost"
            size="xs"
            textColor={theme.colors[colorMode].onSurface}
            onClick={() => {
              setIsCustomRangeSelected(false);
              setYearFilter(2022);
            }}
          >
            Since 2022
          </Button>
          <Button
            bgColor={
              yearFilter === 2021
                ? theme.colors[colorMode].onPrimary
                : undefined
            }
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
            onClick={() => {
              setYearFilter(2021);
              setIsCustomRangeSelected(false);
            }}
          >
            Since 2021
          </Button>
          <Button
            bgColor={
              isCustomRangeSelected
                ? theme.colors[colorMode].onPrimary
                : undefined
            }
            textColor={theme.colors[colorMode].onSurface}
            variant="ghost"
            size="xs"
            onClick={() => {
              setIsCustomRangeSelected(true);
              setYearFilter(null);
            }}
          >
            Custom range
          </Button>
          {isCustomRangeSelected && (
            <HStack spacing={2}>
              <Input
                placeholder="Start"
                size="xs"
                type="number"
                value={customYearStart || ""}
                onChange={(e) => setCustomYearStart(Number(e.target.value))}
                width="5em"
                height="2em"
              />
              <Text>-</Text>
              <Input
                placeholder="End"
                size="xs"
                type="number"
                value={customYearEnd || ""}
                onChange={(e) => setCustomYearEnd(Number(e.target.value))}
                width="5em"
                height="2em"
              />
            </HStack>
          )}
          <Button
            bgColor={
              onlyFavoritesFilter
                ? theme.colors[colorMode].onPrimary
                : undefined
            }
            variant="ghost"
            size="xs"
            textColor={theme.colors[colorMode].onSurface}
            onClick={handleToggleFavoritesFilter}
          >
            Only show favorites
          </Button>
          <Box h={4} />
          <Heading size="xs">Collections</Heading>
          {allCollections
            .filter((collection) => collection && collection.trim() !== "")
            .map((collection, index) => (
              <Button
                key={index}
                bgColor={
                  collectionFilter === collection
                    ? theme.colors[colorMode].onPrimary
                    : undefined
                }
                variant="ghost"
                size="xs"
                textColor={theme.colors[colorMode].onSurface}
                onClick={() => {
                  if (collectionFilter === collection) {
                    setCollectionFilter(null);
                  } else {
                    setCollectionFilter(collection);
                  }
                }}
              >
                {collection}
              </Button>
            ))}
          <Box h={4} />
          <Spacer />
          <Button
            textColor={theme.colors[colorMode].onTertiaryContainer}
            bgColor={theme.colors[colorMode].tertiaryContainer}
            size="sm"
            leftIcon={<FaRocket />}
            borderRadius={100}
            onClick={() => navigate("/features/onboarding")}
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
            <ModalContent position="fixed" top="20%">
              <ModalHeader>Upload files</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <UploadForm
                  onUploadComplete={handleUploadComplete}
                  dropZoneText="Uploaded files will appear in your personal library"
                />
              </ModalBody>
            </ModalContent>
          </Modal>
          <Button
            size="sm"
            aria-label={"ask tai"}
            leftIcon={<ChatIcon />}
            borderRadius={100}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
            onClick={() => {
              const chatTab: ITab = {
                name: "Chat",
                panel: <ChatPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };

              const existingTab = openTabs.find((t) => t.name === chatTab.name);
              if (!existingTab) {
                dispatch(openTab(chatTab));
              }
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
        <TableContainer width="100%">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox
                    isChecked={selectedDocuments.length === documents.length}
                    onChange={toggleAllDocuments}
                  />
                </Th>
                <Th>Title</Th>
                <Th>Author(s)</Th>
                <Th isNumeric>Year</Th>
                <Th>Collection</Th>
                <Th>Topics</Th>
                <Th>Favorite</Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents.length > 0 &&
                documents
                  .filter((doc) => {
                    let matchesQuery = doc.uploadName.includes(documentQuery);
                    let matchesYear =
                      (!yearFilter && !isCustomRangeSelected) ||
                      (yearFilter &&
                        doc.creationDate.toDate().getFullYear() ===
                          yearFilter) ||
                      (isCustomRangeSelected &&
                        customYearStart &&
                        customYearEnd &&
                        customYearStart <=
                          doc.creationDate.toDate().getFullYear() &&
                        doc.creationDate.toDate().getFullYear() <=
                          customYearEnd);
                    let matchesCollection =
                      !collectionFilter ||
                      (doc.tags && doc.tags.includes(collectionFilter));
                    //let matchesProject = activeProject;
                    let matchesFavorites = onlyFavoritesFilter
                      ? !!doc.favoritedBy
                      : true;
                    return (
                      matchesQuery &&
                      matchesYear &&
                      matchesCollection &&
                      //matchesProject &&
                      matchesFavorites
                    );
                  })
                  .map((doc: Document) => (
                    <Tr
                      key={doc.uploadName}
                      _hover={{
                        bgColor:
                          theme.colors[colorMode].surfaceContainerHighest,
                        cursor: "pointer",
                      }}
                    >
                      <Td>
                        <Checkbox
                          isChecked={selectedDocuments.includes(doc.uploadName)}
                          onChange={() =>
                            handleDocumentCheckboxChange(doc.uploadName)
                          }
                        />
                      </Td>
                      <Td>
                        <Button
                          variant="link"
                          onClick={() =>
                            handleOpenDocumentInTab(doc.uploadName)
                          }
                        >
                          {doc.uploadName}
                        </Button>
                      </Td>
                      <Td>{doc.author}</Td>
                      <Td isNumeric>
                        {doc.creationDate.toDate().getFullYear()}
                      </Td>
                      <Td>
                        <TagInput
                          tags={doc.tags}
                          onAddTag={(newTag) =>
                            addCollectionToDocument(doc.uploadName, newTag)
                          }
                          onDeleteTag={(tagToDelete) =>
                            deleteCollectionFromDocument(
                              doc.uploadName,
                              tagToDelete
                            )
                          }
                        />
                      </Td>
                      <Td>{parseTopics(doc.topics)}</Td>
                      <Td textAlign="center">
                        <Icon
                          as={FaStar}
                          color={doc.favoritedBy ? "teal" : "none"}
                          onClick={() =>
                            toggleFavourite(doc.uploadName, !doc.favoritedBy)
                          }
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
