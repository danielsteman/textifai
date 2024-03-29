import {
  Box,
  Button,
  Center,
  Text,
  useColorMode,
  Progress,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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
import axios, { AxiosResponse } from "axios";
import { config } from "../../app/config/config";
import theme from "../../app/themes/theme";
import { setProjectId } from "../Workspace/projectSlice";
import fetchProjectUid from "../Projects/fetchProjectId";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";

interface PdfMetadata {
  fileName: string;
  uploadName: string;
  fileType: string;
  author: string;
  creationDate: Date;
  fileSize: number;
  extractedText: string;
  topicText: string;
  wordCount: number;
  favoritedBy: Boolean;
}

interface UploadFormProps {
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

const UploadForm: React.FC<UploadFormProps> = ({ dropZoneText }) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const activeProjectName = useSelector(
    (state: RootState) => state.activeProject.projectName
  );
  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log("Files dropped:", acceptedFiles);
    setFiles(acceptedFiles);
    const initialProgress = acceptedFiles.reduce(
      (acc: { [x: string]: number }, file: { name: string | number }) => {
        acc[file.name] = 0;
        return acc;
      },
      {}
    );
    setUploadProgress((prev) => ({ ...prev, ...initialProgress }));
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
    setLoading(true);
    setUploadStatusMessage(
      `Preparing document${files!.length > 1 ? "s" : ""} ⚙️...`
    );

    const fileRef = ref(
      storage,
      `projects/${activeProjectId}/uploads/${file.name}`
    );
    const exists = await getDownloadURL(fileRef)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      setUploadStatusMessage("A file with this name already exists 📄");
      throw new Error("A file with this name already exists");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("userId", currentUser!.uid);

    let response: AxiosResponse<any>;

    try {
      response = await axios.post(
        `${config.documents.url}/api/documents/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(`response: ${response.data}`);
    } catch (error) {
      setUploadStatusMessage(
        "Something went wrong while uploading to backend."
      );
      console.log(error);
      return;
    }

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadStatusMessage(
          `Uploading document${files!.length > 1 ? "s" : ""} ⬆️`
        );
        setLoading(false);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`${file.name} upload progress: ${progress}%`);
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: progress,
        }));
      },
      (error) => {
        uploadTask.cancel();
        const errorMessage = `An error occurred while uploading ${file.name}`;
        setUploadStatusMessage(
          `${errorMessage}. Try again later or contact support if this problem persists.`
        );
        console.error(`${errorMessage}:`, error);
      },
      async () => {
        uploadTask.then(() => {
          const metadata: PdfMetadata = response.data.metadata;
          uploadMetadataToFirestore(
            metadata,
            currentUser!.uid,
            activeProjectId!,
            uploadsCollection
          );
        });
        setUploadStatusMessage("Done! ✅ Want to upload more?");
      }
    );
  };

  const handleSubmit = async () => {
    setUploadStatusMessage("");

    if (!currentUser) {
      console.warn("User not authenticated. Please login to upload.");
      return;
    }

    if (!files || files.length === 0) {
      console.warn("No files were uploaded");
      return;
    }

    const initialProgress = files.reduce<{ [key: string]: number }>(
      (acc, file) => {
        acc[file.name] = 0;
        return acc;
      },
      {}
    );
    setUploadProgress((prev) => ({ ...prev, ...initialProgress }));

    try {
      await Promise.all(files.map((file) => handleFileUpload(file)));
      console.log("All files uploaded");
    } catch (error) {
      setLoading(false);
      console.error("Error uploading files: ", error);
    }
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
        <Text mt={2}>
          {isDragActive ? "Drop the files here ..." : dropZoneText}
        </Text>
      </Box>
      <Box mt={4}>
        {files?.map((file, index) => (
          <Box key={index} mb={3}>
            <Text>{file.name}</Text>
            <Progress
              isIndeterminate={loading}
              colorScheme="green"
              value={uploadProgress[file.name] || 0}
            />
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
      <Center height="100%" width="100%" my={4}>
        {uploadStatusMessage}
      </Center>
    </Box>
  );
};

export default UploadForm;
