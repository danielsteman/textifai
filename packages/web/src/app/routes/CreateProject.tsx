import {
  Button,
  Center,
  FormControl,
  FormLabel,
  // Heading,
  Input,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import theme from "../themes/theme";
import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "@shared/firestoreInterfaces/Project";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../providers/AuthProvider";

interface FormData {
  name: string;
  description: string;
  industry: string;
}

const CreateProject = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    industry: "",
  });

  const currentUser = useContext(AuthContext);

  const onChange = (
    field: keyof FormData,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFormData = { ...formData };
    updatedFormData[field] = e.target.value;
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const projectsCollection = collection(db, "projects");
    if (currentUser) {
      const projectData: Project = {
        ...formData,
        users: [currentUser?.uid],
        creationDate: Timestamp.fromDate(new Date()),
        active: true,
      };
      try {
        const docRef = await addDoc(projectsCollection, projectData);
        console.log("Project created with ID: ", docRef.id);
        navigate("/features/workspace");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.error("Current user not found");
    }
  };

  const gap: number = 4;

  return (
    <VStack
      flex="1"
      p={4}
      m={4}
      borderRadius={8}
      bgColor={theme.colors[colorMode].surface}
      justifyContent="center"
    >
      <Button
        variant="ghost"
        size="sm"
        position="absolute"
        top={"2em"}
        right={"2em"}
        onClick={() => navigate("/")}
      >
        Cancel
      </Button>
      <form>
        {/* <Heading mb={8} size="lg">
          Let's create a new project first 🙌
        </Heading> */}
        <FormControl isRequired mb={gap} w={"fit-content"}>
          <FormLabel>Project name</FormLabel>
          <Input
            type="text"
            placeholder="Project name"
            onChange={(e) => onChange("name", e)}
          />
        </FormControl>
        <FormControl mb={gap} w={"fit-content"}>
          <FormLabel>Project description</FormLabel>
          <Input
            type="text"
            placeholder="Project description"
            onChange={(e) => onChange("description", e)}
          />
        </FormControl>
        <FormControl mb={gap} w={"fit-content"}>
          <FormLabel>Industry</FormLabel>
          <Input
            type="text"
            placeholder="Industry"
            onChange={(e) => onChange("industry", e)}
          />
        </FormControl>
        <Center>
          <Button mt={4} type="submit" onClick={handleSubmit}>
            Create project
          </Button>
        </Center>
      </form>
    </VStack>
  );
};

export default CreateProject;
