import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Chat from "../../features/Chat/Chat";

function Editor() {
  const [value, setValue] = useState("");

  return (
    <>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, 1fr)"
        gap={4}
        flex={1}
      >
        <GridItem colSpan={2} rowSpan={2} p={4}>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            style={{ height: "100%", width: "100%" }}
          />
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Box>Document list</Box>
        </GridItem>
        <GridItem colSpan={1} rowSpan={1}>
          <Chat />
        </GridItem>
      </Grid>
    </>
  );
}

export default Editor;
