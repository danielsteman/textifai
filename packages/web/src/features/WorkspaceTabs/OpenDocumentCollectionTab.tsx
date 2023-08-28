import { IconButton } from "@chakra-ui/react";
import React from "react";
import { FaBook } from "react-icons/fa";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import DocumentCollection from "../DocumentCollection/DocumentCollection";
import { OpenTabsContext } from "../../app/layouts/WorkspaceLayout";

const OpenDocumentCollectionTab: React.FC<OpenTabsContext> = (props) => {
  return (
    <IconButton
      aria-label={"documents"}
      icon={<FaBook />}
      onClick={() =>
        props.setOpenTabs(
          addItemIfNotExist(
            props.openTabs,
            { name: "Documents", panel: <DocumentCollection /> },
            "name"
          )
        )
      }
    />
  );
};

export default OpenDocumentCollectionTab;
