import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import theme from "../themes/theme";
import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "@shared/interfaces/firebase/Project";
import { updateDoc, Timestamp, addDoc, collection, getDocs, query, where, doc } from "firebase/firestore";
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
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    const projectsCollection = collection(db, "projects");

    if (currentUser) {
        const existingProjectSnapshot = await getDocs(query(projectsCollection, where("name", "==", formData.name), where("users", "array-contains", currentUser.uid)));
        
        if (!existingProjectSnapshot.empty) {
            console.error("A project with this name already exists.");
            setError("A project with this name already exists."); 
            return;
        }

        const projectData: Project = {
            ...formData,
            users: [currentUser?.uid],
            creationDate: Timestamp.fromDate(new Date()),
        };

        try {
            const docRef = await addDoc(projectsCollection, projectData);
            console.log("Project created with ID: ", docRef.id);

            const userDocRef = doc(db, "users", currentUser?.uid); 
            await updateDoc(userDocRef, {
                activeProject: formData.name
            });

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
        {/* Display the error message if it exists */}
        {error && <div style={{ color: "red", marginBottom: '16px' }}>{error}</div>}
        
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
