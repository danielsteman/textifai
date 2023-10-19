import {
  Box,
  Button,
  Center,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import axios from "axios";
import { fetchProjectId } from "../../common/utils/getCurrentProjectId";
import { config } from "../../app/config";
import theme from "../../app/themes/theme";

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
  dropZoneText?: string;
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

const UploadForm: React.FC<UploadFormProps> = ({
  onUploadComplete,
  dropZoneText = "",
}) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeProject, setActiveProject] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
  }, []);

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const fetchActiveProject = async () => {
      const projectId = await fetchProjectId(currentUser!.uid);
      setActiveProject(projectId);
    };

    fetchActiveProject();
  }, [currentUser]);

  const acceptedFormats = { "application/pdf": [".pdf"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  const handleFileUpload = async (file: any) => {
    const fileRef = ref(
      storage,
      `users/${currentUser?.uid}/uploads/${file.name}`
    );

    const exists = await getDownloadURL(fileRef)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      setUploadStatusMessage("A file with this name already exists! 📄");
      console.log("File already exists:", file.name);
      return;
    }

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("userId", currentUser!.uid);

      const res = await axios.post(
        `${config.documents.url}/api/documents/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await uploadBytes(fileRef, file);
      console.log("Uploaded a blob or file:", file.name);

      console.log("File uploaded successfully:", file.name);
      setUploadStatusMessage("Done! ✅ Want to upload more?");

      const metadata: PdfMetadata = res.data.metadata;
      await uploadMetadataToFirestore(
        metadata,
        currentUser!.uid,
        activeProject!,
        uploadsCollection
      );
    } catch (error) {
      console.error(`An error occurred while processing ${file.name}:`, error);
    }
  };

  const handleSubmit = async () => {
    setFiles(undefined);
    setUploadStatusMessage("");

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

    setLoading(false);
    onUploadComplete();
  };
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Box
        {...getRootProps()}
        p={4}
        borderWidth={2}
        borderStyle="dashed"
        borderRadius="md"
        textAlign="center"
        borderColor={
          isDragActive
            ? theme.colors[colorMode].secondary
            : theme.colors[colorMode].primary
        }
        bg={
          isDragActive
            ? theme.colors[colorMode].surfaceContainer
            : theme.colors[colorMode].surfaceContainerLow
        }
        cursor="pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the files here ...</Text>
        ) : files && files.length > 0 ? (
          files.map((file, index) => <Text key={index}>{file.name}</Text>)
        ) : (
          <Text>{dropZoneText}</Text>
        )}
      </Box>
      <Center p={4}>
        <Button
          onClick={handleSubmit}
          isDisabled={files === undefined ? true : false}
        >
          {loading ? <Spinner /> : <Text>Upload</Text>}
        </Button>
      </Center>
      <Center height="100%" width="100%">
        {uploadStatusMessage}
      </Center>
    </Box>
  );
};

UploadForm.defaultProps = {
  dropZoneText: "Drag 'n' drop some files here, or click to select files",
};

export default UploadForm;
