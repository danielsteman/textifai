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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../app/config/firebase";
import { AuthContext } from "../../app/providers/AuthProvider";
import axios from "axios";

const UploadForm: React.FC<{ onUploadComplete: () => void }> = ({
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
  }, []);

  const onDropFileExist = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
    setFileExists(false); // Reset the fileExists state
  }, []);

  const currentUser = useContext(AuthContext);

  const acceptedFormats = { "application/pdf": [".pdf"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  const resetForm = () => {
    setUploadSuccessful(false);
    setFiles(undefined);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (files && files.length > 0) {
      files.forEach(async (file: any) => {
        const fileRef = ref(
          storage,
          `users/${currentUser?.uid}/uploads/${file.name}`
        );
        getDownloadURL(fileRef)
          .then((url) => {
            // File exists, do nothing
            console.log("File already exists in Firebase");
            setFileExists(true); // Mark that file exists
            setLoading(false);
          })
          .catch(async () => {
            // File does not exist, upload to Firebase
            const docRef = ref(
              storage,
              `users/${currentUser?.uid}/uploads/${file.name}`
            );
            await uploadBytes(docRef, file).then((snapshot) => {
              console.log("Uploaded a blob or file!");
              console.log(snapshot);
            });

            onUploadComplete();

            // Create FormData and append the fileBlob
            const data = new FormData();
            data.append("file", file);
            if (currentUser && currentUser.uid) {
              data.append("userId", currentUser.uid); // appending userId to FormData
            }

            // Post the data to the server
            await axios({
              method: "post",
              baseURL: "http://localhost:3000/api/documents/upload",
              headers: { "Content-Type": "multipart/form-data" },
              data: data,
            })
              .then((response) => {
                console.log("File uploaded successfully:", response.data);
                setUploadSuccessful(true);
              })
              .catch((error) => {
                console.error(
                  "An error occurred while uploading the file:",
                  error
                );
              });
            setLoading(false);
          });
      });
      resetForm();
    } else {
      console.warn("No files were uploaded");
      setLoading(false);
    }
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
      {fileExists && !uploadSuccessful ? (
        <Text>File already exists!📄 Upload a new one!</Text>
      ) : uploadSuccessful && fileExists ? (
        <Text>Done!✅ Want to upload more?</Text>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default UploadForm;
