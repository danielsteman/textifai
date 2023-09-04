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
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  description?: string | undefined;
  industry?: string | undefined;
}

const CreateProject = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
  });

  const onChange = (
    field: keyof FormData,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFormData = { ...formData };
    updatedFormData[field] = e.target.value;
    setFormData(updatedFormData);
  };

  const handleSubmit = () => {
    console.log(formData);
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
        <FormControl isRequired mb={gap}>
          <FormLabel>Project name</FormLabel>
          <Input
            type="text"
            placeholder="Project name"
            onChange={(e) => onChange("name", e)}
          />
        </FormControl>
        <FormControl mb={gap}>
          <FormLabel>Project description</FormLabel>
          <Input
            type="text"
            placeholder="Project description"
            onChange={(e) => onChange("description", e)}
          />
        </FormControl>
        <FormControl mb={gap}>
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
