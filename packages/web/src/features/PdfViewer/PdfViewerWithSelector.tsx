import { useState, useEffect, useContext, useRef } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { AuthContext } from "../../app/providers/AuthProvider";
import { storage } from "../../app/config/firebase";
import {
  getDownloadURL,
  listAll,
  ref,
  StorageReference,
} from "firebase/storage";
import { Select, Box } from "@chakra-ui/react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const getPdfUrl = async (doc: StorageReference) => {
  const pdfURL = await getDownloadURL(doc);
  return pdfURL;
};

function PdfViewerWithSelector() {
  const currentUser = useContext(AuthContext);
  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const listRef = ref(storage, `projects/${activeProjectId}/uploads`);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedPdfUrl(null);
    listAll(listRef)
      .then((res) => {
        setDocuments(res.items);
      })
      .catch((error) => {
        console.warn("Something went wrong listing your files");
        console.error(error);
      });
  }, [currentUser, activeProjectId]);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box padding="1rem">
        <Select
          placeholder="Select a PDF"
          onChange={async (e) => {
            const selectedDoc = documents.find(
              (doc) => doc.name === e.target.value
            );
            if (selectedDoc) {
              const url = await getPdfUrl(selectedDoc);
              setSelectedPdfUrl(url);
            }
          }}
        >
          {documents
            .filter((doc) => doc.name.endsWith(".pdf"))
            .map((doc) => (
              <option key={doc.fullPath} value={doc.name}>
                {doc.name}
              </option>
            ))}
        </Select>
      </Box>

      <Box flex="1" padding="1rem" ref={pdfRef} overflowY="auto">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          minHeight="100%"
        >
          {selectedPdfUrl && (
            <Document
              file={selectedPdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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
    </Box>
  );
}

export default PdfViewerWithSelector;
