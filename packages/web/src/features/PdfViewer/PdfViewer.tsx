import '../../../node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../../../node_modules/react-pdf/dist/esm/Page/TextLayer.css';

import React, { useState, useEffect, useContext } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { AuthContext } from "../../app/providers/AuthProvider";
import { storage } from '../../app/config/firebase';
import { getDownloadURL, listAll, ref, StorageReference } from 'firebase/storage';
import { Input, InputGroup, InputLeftElement, Text, VStack } from "@chakra-ui/react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const getPdfUrl = async (doc: StorageReference) => {
  const pdfURL = await getDownloadURL(doc);
  return pdfURL;
};

function PdfCollection() {
  const currentUser = useContext(AuthContext);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [documents, setDocuments] = useState<StorageReference[]>([]);
  const [documentQuery, setDocumentQuery] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const listRef = ref(storage, `users/${currentUser?.uid}/uploads`);

  useEffect(() => {
    listAll(listRef)
      .then((res) => {
        setDocuments(res.items);
      })
      .catch((error) => {
        console.warn("Something went wrong listing your files");
        console.error(error);
      });
  }, [currentUser]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleChangeDocumentQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentQuery(e.target.value);
  };

  const pageContainerStyle = {
    borderBottom: '1px solid black',
    marginBottom: '10px'
  };


  return (
    <div style={{ display: 'flex', height: '100%' }}>
        {/* Sidebar */}
        <VStack style={{ flex: '1', borderRight: '1px solid gray', overflowY: 'auto' }}>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <span role="img" aria-label="Search">🔍</span>
                </InputLeftElement>
                <Input placeholder="Search" onChange={handleChangeDocumentQuery} />
            </InputGroup>
            {documents
                .filter((doc) => doc.name.includes(documentQuery) && doc.name.endsWith('.pdf'))
                .map((doc) => (
                    <div key={doc.fullPath}>
                        <Text
                            onClick={async () => {
                                const url = await getPdfUrl(doc);
                                setSelectedPdfUrl(url);
                            }}
                            cursor="pointer"
                        >
                            {doc.name}
                        </Text>
                    </div>
                ))
            }
        </VStack>

        {/* PDF Viewer */}
        <div style={{ flex: '2', padding: '1rem' }}>
            {selectedPdfUrl && (
                <Document 
                    file={selectedPdfUrl} 
                    onLoadSuccess={onDocumentLoadSuccess}
                    // renderMode="svg"
                >
                    {Array.from(new Array(numPages), (_, index) => (
                        <div style={pageContainerStyle} key={`page-container_${index + 1}`}>  {/* Wrap the Page component */}
                            <Page 
                                key={`page_${index + 1}`} 
                                pageNumber={index + 1} 
                                width={window.innerWidth * 0.6}
                            />
                        </div>
                    ))}
                </Document>
            )}
        </div>
    </div>
  );
}

export default PdfCollection;
