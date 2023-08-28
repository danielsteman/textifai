import React from "react";
import { OpenTabsContext } from "../../app/layouts/WorkspaceLayout";
import { IconButton } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import EditorPanel from "./EditorPanel";

const OpenEditorTab: React.FC<OpenTabsContext> = (props) => {
  return (
    <IconButton
      aria-label={"editor"}
      icon={<FaEdit />}
      onClick={() =>
        props.setOpenTabs(
          addItemIfNotExist(
            props.openTabs,
            { name: "Editor", panel: <EditorPanel /> },
            "name"
          )
        )
      }
    />
  );
};

export default OpenEditorTab;
