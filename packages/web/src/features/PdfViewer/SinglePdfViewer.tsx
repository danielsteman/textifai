import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { getDownloadURL, ref, StorageReference } from "firebase/storage";

interface Props {
  document: StorageReference;
}

const SinglePdfViewer: React.FC<Props> = async ({ document }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const pdfRef = useRef<HTMLDivElement>(null);

  const pdfURL = await getDownloadURL(document);
  return (
    <Box flex="1" padding="1rem" ref={pdfRef} overflowY="auto">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100%"
      >
        {document && (
          <Document
            file={document}
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
