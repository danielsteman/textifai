import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  keyframes,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useColorModeValue } from "@chakra-ui/react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../../app/config/firebase";

const UploadForm = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const acceptedFormats = { "application/pdf": [".pdf"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  const storage = getStorage(app);

  const resetForm = () => {
    setUploadSuccessful(false);
    setFiles(undefined);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        const data = new FormData();
        data.append("file", file);

        const docRef = ref(storage, `upload-form-documents/${file.name}`);
        uploadBytes(docRef, file).then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          setUploadSuccessful(true);
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
    onOpen();
  }, []);

  const animation = keyframes`
    to {
       background-position: 200%;
     }
  `;

  return (
    <>
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
      <Button
        onClick={handleSubmit}
        isDisabled={files === undefined ? true : false}
      >
        {loading && <Spinner />}
        Upload
      </Button>
      {uploadSuccessful ? <Text>Done!✅ Want to upload more?</Text> : <></>}
    </>
  );
};

export default UploadForm;
