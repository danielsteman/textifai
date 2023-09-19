import MegaLibrary, {
  MegaLibraryProps,
} from "../../DocumentCollection/MegaLibrary";

const MegaLibraryPanel: React.FC<MegaLibraryProps> = ({
  openTabs,
  setOpenTabs,
  setCurrentTab,
  selectedDocuments,
  setSelectedDocuments,
}) => {
  return (
    <MegaLibrary
      openTabs={openTabs}
      setOpenTabs={setOpenTabs}
      setCurrentTab={setCurrentTab}
      selectedDocuments={selectedDocuments}
      setSelectedDocuments={setSelectedDocuments}
    />
  );
};

export default MegaLibraryPanel;
