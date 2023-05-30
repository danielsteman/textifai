import { Box, Button, Text } from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useColorModeValue } from "@chakra-ui/react";

const UploadForm = () => {
  const [files, setFiles] = useState<File[] | undefined>();

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = () => {
    if (files && files.length > 0) {
      console.log("uploading files...");

      files.forEach((file: any) => {
        const data = new FormData();
        data.append("file", file);
        axios
          .post(`http://localhost:3000/api/documents/upload`, data, {
            onUploadProgress: (progressEvent) => {
              console.log(`progress ${progressEvent}`);
            },
          })
          .then((res) => console.log(res));
      });
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
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
};

export default UploadForm;
