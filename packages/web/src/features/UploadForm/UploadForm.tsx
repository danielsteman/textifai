import {
  Box,
  Button,
  Center,
  Spinner,
  Text,
  useColorMode,
  Progress
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../app/config/firebase";
import { AuthContext } from "../../app/providers/AuthProvider";
import { Document } from "@shared/interfaces/firebase/Document";
import { db } from "../../app/config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  CollectionReference,
} from "firebase/firestore";
import axios from "axios";
import { config } from "../../app/config";
import theme from "../../app/themes/theme";
import { setProjectId } from "../Workspace/projectSlice";
import fetchProjectUid from "../Projects/fetchProjectId";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";

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
  dropZoneText,
}) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const dispatch = useDispatch();
  const activeProjectName = useSelector((state: RootState) => state.activeProject.projectName);
  const activeProjectId = useSelector((state: RootState) => state.activeProject.projectId);

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log("Files dropped:", acceptedFiles);
    setFiles(acceptedFiles);
    const initialProgress = acceptedFiles.reduce((acc: { [x: string]: number; }, file: { name: string | number; }) => {
        acc[file.name] = 0;
        return acc;
    }, {});
    setUploadProgress(prev => ({ ...prev, ...initialProgress }));
  }, []);

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      const fetchAndSetProjectUid = async () => {
        const uid = await fetchProjectUid(currentUser.uid, activeProjectName!);
        dispatch(setProjectId(uid!));
      };

      fetchAndSetProjectUid();
    }
  }, [currentUser, activeProjectName]);

  const acceptedFormats = { "application/pdf": [".pdf"] };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  const handleFileUpload = async (file: any) => {
    const fileRef = ref(storage, `users/${currentUser?.uid}/uploads/${file.name}`);
    const exists = await getDownloadURL(fileRef).then(() => true).catch(() => false);

    if (exists) {
      setUploadStatusMessage("A file with this name already exists! 📄");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("userId", currentUser!.uid);

      const res = await axios.post(`${config.documents.url}/api/documents/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadTask = uploadBytesResumable(fileRef, file);

      // Monitor the progress of the upload
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`${file.name} upload progress: ${progress}%`); // Debugging line
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        },
        (error) => {
          console.error(`An error occurred while uploading ${file.name}:`, error);
        },
        () => {
          setUploadStatusMessage("Done! ✅ Want to upload more?");
          const metadata: PdfMetadata = res.data.metadata;
          uploadMetadataToFirestore(metadata, currentUser!.uid, activeProjectId!, uploadsCollection);
        }
      );

    } catch (error) {
      console.error(`An error occurred while processing ${file.name}:`, error);
    }
  };

  const handleSubmit = async () => {
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
    setFiles(undefined);
  };

  const { colorMode } = useColorMode();

  return (
    <Box>
        <Box {...getRootProps()} p={4} borderWidth={2} borderStyle="dashed" borderRadius="md" textAlign="center" borderColor={isDragActive ? theme.colors[colorMode].secondary : theme.colors[colorMode].primary} bg={isDragActive ? theme.colors[colorMode].surfaceContainer : theme.colors[colorMode].surfaceContainerLow} cursor="pointer">
            <input {...getInputProps()} />
            <Text mt={2}>
                {isDragActive ? "Drop the files here ..." : dropZoneText}
            </Text>
        </Box>
        <Box mt={4}>
            {files?.map((file, index) => (
                <Box key={index} mb={3}>
                    <Text>{file.name}</Text>
                    <Progress colorScheme="green" value={uploadProgress[file.name] || 0} />
                </Box>
            ))}
        </Box>
        <Center p={4}>
            <Button
                onClick={handleSubmit}
                isDisabled={!files || files.length === 0}
            >
                Upload
            </Button>
        </Center>
        <Center height="100%" width="100%" mt={4}>
            {uploadStatusMessage}
        </Center>
        {loading && (
            <Center>
                <Spinner />
            </Center>
        )}
    </Box>
  )
};

export default UploadForm;