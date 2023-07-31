import { Box, Button, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useColorModeValue } from "@chakra-ui/react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../../app/config/firebase";

const UploadForm = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadSuccessful, setUploadSuccessful] = useState(false);

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
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        const data = new FormData();
        data.append("file", file);

        const docRef = ref(storage, file.name);
        uploadBytes(docRef, file).then((snapshot) => {
          console.log("Uploaded a blob or file!");
          console.log(snapshot);
          setUploadSuccessful(true);
        });
      });
      resetForm();
    } else {
      console.warn("No files were uploaded");
    }
  };

  return (
    <>
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
        Upload
      </Button>
      {uploadSuccessful ? <Text>Done!✅ Want to upload more?</Text> : <></>}
    </>
  );
};

export default UploadForm;
