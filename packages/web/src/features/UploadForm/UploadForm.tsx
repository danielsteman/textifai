import {
  Box,
  Button,
  Center,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  keyframes,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useColorModeValue } from "@chakra-ui/react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import { storage } from "../../app/config/firebase";
import { AuthContext } from "../../app/providers/AuthProvider";
import { Document } from "@shared/firestoreInterfaces/Document";
import { db } from "../../app/config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  CollectionReference,
} from "firebase/firestore";
import { ProjectContext } from "../../app/providers/ProjectProvider";
import { fetchProjectId } from "../../common/utils/getCurrentProjectId";
import axios from "axios";

interface PdfMetadata {
  fileName: string;
  author: string;
  creationDate: Date;
  fileSize: number;
  extractedText: string;
  topicText: string;
  wordCount: number;
}

interface UploadFormProps {
  onUploadComplete: () => void;
}

const uploadsCollection = collection(db, "uploads");

const uploadMetadataToFirestore = async (
  metadata: PdfMetadata,
  userId: string,
  projectId: string,
  uploadsCollection: CollectionReference
) => {
  try {
    const firestoreDocument: Partial<Document> = {
      ...metadata,
      uploadedBy: userId,
      uploadDate: Timestamp.now(),
      projectId: projectId,
      creationDate: Timestamp.fromDate(new Date(metadata.creationDate)),
    };

    await addDoc(uploadsCollection, firestoreDocument);
  } catch (error) {
    console.error("Failed to write metadata to Firestore:", error);
    throw new Error("Failed to write metadata to Firestore");
  }
};

const UploadForm: React.FC<UploadFormProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [uploadRef, setUploadRef] = useState<StorageReference>();

  const userProjects = useContext(ProjectContext);
  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const fetchActiveProject = async () => {
      const projectId = await fetchProjectId(currentUser!.uid);
      setActiveProject(projectId);
    };

    fetchActiveProject();
  }, [currentUser]);

  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
  }, []);

  const acceptedFormats = { "application/pdf": [".pdf"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  const resetForm = () => {
    setUploadSuccessful(false);
    setFiles(undefined);
  };

  const checkIfFileExists = async (fileRef: StorageReference) => {
    try {
      await getDownloadURL(fileRef);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFileUpload = async (file: any) => {
    if (currentUser && currentUser.uid) {
      const fileRef = ref(
        storage,
        `users/${currentUser.uid}/uploads/${file.name}`
      );

      const fileExists = await checkIfFileExists(fileRef);

      if (fileExists) {
        console.log("File already exists:", file.name);
        setFileExists(true);
        return;
      } else {
        console.log("File does not exist yet");
        setUploadRef(fileRef);
      }
    }

    if (uploadRef) {
      try {
        await uploadBytes(uploadRef, file);
        console.log("Uploaded a blob or file:", file.name);

        const data = new FormData();
        data.append("file", file);
        data.append("userId", currentUser!.uid);

        const res = await axios.post(
          "http://localhost:3000/api/documents/upload",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("File uploaded successfully:", file.name);
        setUploadSuccessful(true);

        const metadata: PdfMetadata = res.data.metadata;
        await uploadMetadataToFirestore(
          metadata,
          currentUser!.uid,
          activeProject!,
          uploadsCollection
        );
      } catch (error) {
        console.error(
          `An error occurred while processing ${file.name}:`,
          error
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      console.warn("User not authenticated. Please login to upload.");
      return;
    }

    setLoading(true);

    if (!files || files.length === 0) {
      console.warn("No files were uploaded");
      setLoading(false);
      return;
    }

    await Promise.all(files.map((file) => handleFileUpload(file)));

    resetForm();
    setLoading(false);
    onUploadComplete();
  };

  useEffect(() => {
    const shouldOpen = localStorage.getItem("showNewsLetterOffer");
    if (!shouldOpen || JSON.parse(shouldOpen) === true) {
      onOpen();
    }
  }, []);

  const animation = keyframes`
    to {
       background-position: 200%;
     }
  `;

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Upload PDF documents. Textifai is a text analytics platform so we
              only accept text based documents, for now... Sign up to our
              newsletter to receive updates about new features!
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <VStack gap={4} p={0}>
              <HStack p={0}>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  bgGradient="linear(to-l, #7928CA,#FF0080)"
                  fontSize="md"
                  backgroundSize="200% auto"
                  animation={`${animation} 2s ease-in-out infinite alternate`}
                  colorScheme="blue"
                  textColor="white"
                >
                  Sign up for newsletter
                </Button>
              </HStack>
              <Checkbox
                value="dontShowAgain"
                onChange={(e) => {
                  localStorage.setItem(
                    "showNewsLetterOffer",
                    JSON.stringify(!e.target.checked)
                  );
                  console.log(e.target.checked);
                }}
              >
                Don't show again
              </Checkbox>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        {...getRootProps()}
        p={4}
        borderWidth={2}
        borderStyle="dashed"
        borderRadius="md"
        textAlign="center"
        borderColor={isDragActive ? "green.400" : "gray.200"}
        bg={
          isDragActive
            ? useColorModeValue("green.50", "green.800")
            : useColorModeValue("white", "gray.800")
        }
        cursor="pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the files here ...</Text>
        ) : files && files.length > 0 ? (
          files.map((file, index) => <Text key={index}>{file.name}</Text>)
        ) : (
          <Text>Drag 'n' drop some files here, or click to select files</Text>
        )}
      </Box>
      <Center p={4}>
        <Button
          onClick={handleSubmit}
          isDisabled={files === undefined ? true : false}
        >
          {loading && <Spinner />}
          Upload
        </Button>
      </Center>
      <Center height="100%" width="100%">
        {fileExists && !uploadSuccessful ? (
          <Text>File already exists!📄 Upload a new one!</Text>
        ) : uploadSuccessful && fileExists ? (
          <Text>Done!✅ Want to upload more?</Text>
        ) : (
          <></>
        )}
      </Center>
    </Box>
  );
};

export default UploadForm;
