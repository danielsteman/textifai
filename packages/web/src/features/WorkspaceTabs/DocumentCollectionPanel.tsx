import DocumentCollection from "../DocumentCollection/DocumentCollection";
import { CustomTabPanelProps } from "./EditorPanel";

const DocumentCollectionPanel: React.FC<CustomTabPanelProps> = () => {
  return <DocumentCollection />;
};

export default DocumentCollectionPanel;
