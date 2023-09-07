import React, { useState, useEffect, useContext, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { AuthContext } from "../../app/providers/AuthProvider";
import { storage } from '../../app/config/firebase';
import { getDownloadURL, listAll, ref, StorageReference } from 'firebase/storage';
import { Input, InputGroup, InputLeftElement, Text, VStack, Box, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

// Importing required CSS files for react-pdf components
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Function to get PDF URL from storage
const getPdfUrl = async (doc: StorageReference) => {
  const pdfURL = await getDownloadURL(doc);
  return pdfURL;
};

function PdfViewer() {
  // Accessing the current user's context
  const currentUser = useContext(AuthContext);

  // State variables
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>("");
  const listRef = ref(storage, `users/${currentUser?.uid}/uploads`);
  // Reference to the PDF viewer container
  const pdfRef = useRef<HTMLDivElement>(null);

  // State variables for context menu
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // Fetch user's documents on component mount
  useEffect(() => {
    listAll(listRef)
      .then((res) => {
        setDocuments(res.items);
      })
      .catch((error) => {
        console.warn("Something went wrong listing your files");
        console.error(error);
      });

    // Handle mouse up event to show context menu
    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';

      // If text is selected, show context menu at mouse position and set selected text
      if (selectedText && pdfRef.current) {
        e.preventDefault(); // Prevent the default context menu
        const x = e.clientX;
        const y = e.clientY;
        setContextMenuPosition({ x, y });
        setContextMenuVisible(true);
        setSelectedText(selectedText);
        console.log("Selected Text:", selectedText); // Display selected text in the console
      } else {
        setContextMenuVisible(false);
        setSelectedText("");
      }
    };

    // Add mouse up event listener
    document.addEventListener("mouseup", handleMouseUp);

    // Remove event listener on component unmount
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentUser]);

  // Callback function when PDF is loaded successfully
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Handle search input change
  const handleChangeDocumentQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentQuery(e.target.value);
  };

  // JSX rendering
  return (
    <Box display="flex" height="100%">
      {/* Sidebar */}
      <VStack flex="1" borderRight="1px solid gray" overflowY="auto">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <span role="img" aria-label="Search">🔍</span>
          </InputLeftElement>
          <Input placeholder="Search" onChange={handleChangeDocumentQuery} />
        </InputGroup>
        {documents
          .filter((doc) => doc.name.includes(documentQuery) && doc.name.endsWith('.pdf'))
          .map((doc) => (
            <Box key={doc.fullPath} onClick={async () => {
              const url = await getPdfUrl(doc);
              setSelectedPdfUrl(url);
            }} cursor="pointer">
              <Text>{doc.name}</Text>
            </Box>
          ))
        }
      </VStack>

      {/* PDF Viewer */}
      <Box flex="2" padding="1rem" ref={pdfRef}>
        {selectedPdfUrl && (
          <Document 
            file={selectedPdfUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={window.innerWidth * 0.6} />
            ))}
          </Document>
        )}
      </Box>

      {/* Mock Context Menu */}
      {contextMenuVisible && (
        <Menu isOpen={contextMenuVisible}>
          <MenuButton
              position="fixed"
              top={contextMenuPosition.y}
              left={contextMenuPosition.x}
          >
            Right-click me
          </MenuButton>
          <MenuList
              background="#f0f0f0"
              border="1px solid #ccc"
              boxShadow="0px 0px 5px rgba(0, 0, 0, 0.2)"
              zIndex={9999}
              padding="5px"
              minWidth="120px"
          >
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
            <MenuItem>Option 3</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Box>
  );
}

export default PdfViewer;
