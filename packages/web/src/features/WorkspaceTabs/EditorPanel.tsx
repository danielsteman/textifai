import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import TextEditor from "../TextEditor/TextEditor";

interface Props {
  openChatSupport: boolean;
  openMiniLibrary: boolean;
}

const EditorPanel: React.FC<Props> = (props) => {
  return (
    <Grid
      h="100%"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap={2}
    >
      <GridItem rowSpan={2} colSpan={3}>
        <Box h="100%" position="relative" overflow="hidden">
          <HStack mb={2}>
            <Text ml={4}>Project title</Text>
            <Spacer />
            <Button size="sm">Templates</Button>
            <Button size="sm">Refine</Button>
            <Button size="sm">Settings</Button>
          </HStack>
          <TextEditor />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default EditorPanel;
