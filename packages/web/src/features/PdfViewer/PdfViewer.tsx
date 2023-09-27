import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { getDownloadURL, StorageReference } from "firebase/storage";

interface Props {
  document: StorageReference;
}

const PdfViewer: React.FC<Props> = ({ document }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfURL, setPdfURL] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

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

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const contextMenuStyles: React.CSSProperties = {
    position: 'absolute',
    top: `${menuPosition.y}px`,
    left: `${menuPosition.x}px`,
    zIndex: 1000, 
  };

  const captureTextSelection = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    event.preventDefault();

    if (selectedText && selection!.rangeCount > 0) {
        const rect = selection!.getRangeAt(0).getBoundingClientRect();
        
        setMenuPosition({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY  // position it just below the selected text
        });
        setMenuVisible(true);
    } else {
        setMenuVisible(false);
    }
  };

  const handleClickOutside = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    // This listener still closes the menu on a regular click anywhere
    window.document.addEventListener("click", handleClickOutside);
    return () => {
        window.document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Box position="relative" height="100%" width="100%">
      <Box
        position="sticky"
        top="0"
        p="0.5rem"
        display="flex"
        justifyContent="center"
      >
        <button onClick={zoomOut}>-</button>
        <span style={{ margin: '0 1rem' }}>{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn}>+</button>
      </Box>

      {menuVisible && (
        <Box
          position='absolute'
          top='${menuPosition.y}px'
          left='${menuPosition.x}px'
          zIndex={1000}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
        >
          <Box as="button" display="block" p="1rem">Option 1</Box>
          <Box as="button" display="block" p="1rem">Option 2</Box>
          <Box as="button" display="block" p="1rem">Option 3</Box>
          <Box as="button" display="block" p="1rem">Option 4</Box>
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
            onContextMenu={captureTextSelection}
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
  );
};

export default PdfViewer;
