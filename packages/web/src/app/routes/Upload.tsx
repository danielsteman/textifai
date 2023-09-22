import { Box } from "@chakra-ui/react";
import UploadForm from "../../features/UploadForm/UploadForm";

const Upload = () => {

  // Define the onUploadComplete callback
  const handleUploadComplete = () => {
    console.log('Upload complete!');
  };

  return (
    <Box textAlign="center" flex="1">
      {/* Pass the onUploadComplete prop to UploadForm */}
      <UploadForm onUploadComplete={handleUploadComplete} />
    </Box>
  );
};

export default Upload;
