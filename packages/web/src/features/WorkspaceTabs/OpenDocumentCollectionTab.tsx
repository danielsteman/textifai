import { IconButton } from "@chakra-ui/react";
import React from "react";
import { FaBook } from "react-icons/fa";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import { OpenTabsContext } from "../../app/layouts/WorkspaceLayout";
import DocumentCollectionPanel from "./DocumentCollectionPanel";

const OpenDocumentCollectionTab: React.FC<OpenTabsContext> = (props) => {
  return (
    <IconButton
      aria-label={"documents"}
      icon={<FaBook />}
      onClick={() =>
        props.setOpenTabs(
          addItemIfNotExist(
            props.openTabs,
            { name: "Documents", panel: <DocumentCollectionPanel /> },
            "name"
          )
        )
      }
    />
  );
};

export default OpenDocumentCollectionTab;
