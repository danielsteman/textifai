import { useContext } from "react";
import { AuthContext } from "../../app/providers/AuthProvider";
import { Box } from "@chakra-ui/react";
import { collection, query, where } from "firebase/firestore";

const DocumentCollection = () => {
  const currentUser = useContext(AuthContext);

  return <Box>Hi {currentUser?.email}</Box>;
};

export default DocumentCollection;
