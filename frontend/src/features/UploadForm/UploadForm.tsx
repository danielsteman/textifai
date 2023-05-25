import { Box, Button, Center, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";

const UploadForm = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const saveFile = (e: any) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e: any) => {
    const formData = new FormData();
    if (file && fileName) {
      formData.append("file", file);
      formData.append("fileName", fileName);
    } else {
      throw new Error("No file was found");
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/api/documents/upload",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <Center>
      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <Box
          borderColor="grey"
          borderWidth={1}
          w="fit-content"
          p={8}
          flex={1}
          bgColor={dragActive ? "green.100" : "green.200"}
        >
          <Input
            type="file"
            onChange={saveFile}
            multiple={true}
            display="none"
          />
          <MdOutlineCloudUpload size={36} />
          <Button onClick={uploadFile}>Click to upload</Button>
          <Text>or drag and drop</Text>
          <Text>PDF up to 2MB</Text>
        </Box>
      </form>
    </Center>
  );
};

export default UploadForm;
