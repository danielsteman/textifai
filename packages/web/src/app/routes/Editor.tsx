import { Grid, GridItem } from "@chakra-ui/react";
import "react-quill/dist/quill.snow.css";
import Chat from "../../features/Chat/Chat";
import DocumentCollection from "../../features/DocumentCollection/MiniLibrary";
import TextEditor from "../../features/TextEditor/TextEditor";

function Editor() {
  return (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, 1fr)"
        gap={4}
        flex={1}
      >
        <GridItem colSpan={2} rowSpan={2} p={4}>
          <TextEditor />
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <DocumentCollection />
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Chat />
        </GridItem>
      </Grid>
    </>
  );
}

export default Editor;
