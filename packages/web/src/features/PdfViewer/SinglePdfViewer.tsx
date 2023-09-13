import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { getDownloadURL, StorageReference } from "firebase/storage";

interface Props {
  document: StorageReference;
}

const SinglePdfViewer: React.FC<Props> = ({ document }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [pdfURL, setPdfURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentUrl = async () => {
      try {
        const pdfURL = await getDownloadURL(document);
        setPdfURL(pdfURL);
      } catch (error) {
        console.error("Error fetching PDF URL", error);
      }
    };

    if (document) {
      fetchDocumentUrl();
    }
  }, [document]);

  return (
    <Box flex="1" padding="1rem" overflowY="auto">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100%"
      >
        {pdfURL && (
          <Document
            file={pdfURL}
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
  );
};

export default SinglePdfViewer;
