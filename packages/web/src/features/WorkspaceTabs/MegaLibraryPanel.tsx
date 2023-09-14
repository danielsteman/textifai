import MegaLibrary, {
  MegaLibraryProps,
} from "../DocumentCollection/MegaLibrary";

const MegaLibraryPanel: React.FC<MegaLibraryProps> = ({
  openTabs,
  setOpenTabs,
  setCurrentTab,
}) => {
  return (
    <MegaLibrary
      openTabs={openTabs}
      setOpenTabs={setOpenTabs}
      setCurrentTab={setCurrentTab}
    />
  );
};

export default MegaLibraryPanel;
