import React from "react";
import { OpenTabsContext } from "../../app/layouts/WorkspaceLayout";
import { ChatIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import Chat from "../Chat/Chat";

const OpenChatTab: React.FC<OpenTabsContext> = (props) => {
  return (
    <IconButton
      aria-label={"chat"}
      icon={<ChatIcon />}
      onClick={() =>
        props.setOpenTabs(
          addItemIfNotExist(
            props.openTabs,
            { name: "Chat", panel: <Chat /> },
            "name"
          )
        )
      }
    />
  );
};

export default OpenChatTab;
