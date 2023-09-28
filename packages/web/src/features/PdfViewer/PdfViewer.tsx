import { Box, Flex } from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";import { Document, Page } from "react-pdf";
import { getDownloadURL, StorageReference } from "firebase/storage";
import ChatPanel from "../Workspace/panels/ChatPanel";

interface Props {
  document: StorageReference;
}

export type ITab = {
  name: string;
  panel: ReactNode;
  openChatSupport: boolean;
  openMiniLibrary: boolean;
  openPdfViewer: boolean;
  isActive?: boolean;
};

export type OpenTabsContext = {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
};

const PdfViewer: React.FC<Props> = ({ document }) => {
  const [openTabs, setOpenTabs] = useState<ITab[]>([]);

  const [numPages, setNumPages] = useState<number>(0);
  const [pdfURL, setPdfURL] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showChatPanel, setShowChatPanel] = useState(false);

  useEffect(() => {
    const fetchDocumentUrl = async () => {
      try {
        const pdfDownloadURL = await getDownloadURL(document);
        setPdfURL(pdfDownloadURL);
      } catch (error) {
        console.error("Error fetching PDF URL", error);
      }
    };

    if (document) {
      fetchDocumentUrl();
    }
  }, [document]);

  const handleChatSupport = () => {
    const updatedOpenTabs = openTabs.map((tab) =>
      tab.name === "PdfViewer" ? { ...tab, openChatSupport: true } : tab
    );
    setOpenTabs(updatedOpenTabs);
    setShowChatPanel(true);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const showContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  
    const selection = window.getSelection();
  
    if (selection && selection.toString().trim() !== "") {
      setMenuPosition({
        x: (event.clientX + window.scrollX) / scale,
        y: (event.clientY + window.scrollY) / scale
      });
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
    }
  };  

  const menuRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    }

    window.document.addEventListener("mousedown", handleClickOutside);
    return () => window.document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Flex width="100%" height="100%">
      <Box flex="2" position="relative">
        <Box
          position="sticky"
          top="0"
          p="0.5rem"
          display="flex"
          justifyContent="center"
        >
          <button onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>-</button>
          <span style={{ margin: '0 1rem' }}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}>+</button>
        </Box>

        {menuVisible && (
          <Box
            ref={menuRef}
            position='absolute'
            top={`${menuPosition.y}px`}
            left={`${menuPosition.x}px`}
            zIndex={1000}
            bg="white"
            boxShadow="lg"
            borderRadius="md"
          >
            <Box 
              as="button"  
              display="block" 
              p="1rem" 
              color="black"
              onClick={() => setShowChatPanel(true)}
            >
                Summarise
            </Box>
            <Box as="button" display="block" p="1rem" color="black">Show key points</Box>
            <Box as="button" display="block" p="1rem" color="black">Explain</Box>
          </Box>
        )}

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100%"
          overflow="auto"
        >
          {pdfURL && (
            <Document
              file={pdfURL}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onContextMenu={showContextMenu}
            >
              {Array.from({ length: numPages }, (_, index) => (
                <Box
                  key={`page_${index + 1}`}
                  borderBottom="1px solid black"
                  marginBottom="1rem"
                >
                  <Page pageNumber={index + 1} scale={scale} />
                </Box>
              ))}
            </Document>
          )}
        </Box>
      </Box>
      
      {showChatPanel && (
        <Box flex="1" borderLeft="1px solid gray">
          <ChatPanel />
        </Box>
      )}
    </Flex>
  );
};

export default PdfViewer;
