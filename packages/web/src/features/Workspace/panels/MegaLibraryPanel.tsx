import MegaLibrary, {
  MegaLibraryProps,
} from "../../DocumentCollection/MegaLibrary";

const MegaLibraryPanel: React.FC<MegaLibraryProps> = ({ setCurrentTab }) => {
  return <MegaLibrary setCurrentTab={setCurrentTab} />;
};

export default MegaLibraryPanel;
