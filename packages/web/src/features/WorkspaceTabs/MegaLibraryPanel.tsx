import MegaLibrary, {
  MegaLibraryProps,
} from "../DocumentCollection/MegaLibrary";

const MegaLibraryPanel: React.FC<MegaLibraryProps> = ({
  openTabs,
  setOpenTabs,
}) => {
  return <MegaLibrary openTabs={openTabs} setOpenTabs={setOpenTabs} />;
};

export default MegaLibraryPanel;
