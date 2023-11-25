import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Input } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";
import { getDownloadURL, StorageReference } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setSelectedText } from "./pdfSlice";
import { openChatSupport } from "../Workspace/tabsSlice";

interface Props {
  document: StorageReference;
}

function highlightPattern(text: string, pattern: string) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

function getTextItemWithNeighbors(textItems: any, itemIndex: any, span = 25) {
  return textItems
    .slice(Math.max(0, itemIndex - span), itemIndex + 1 + span)
    .map((item: any) => item.str.trim())
    .filter((str: any) => str.length > 0)
    .join(" ");
}

function getIndexRange(string: any, substring: any) {
  const indexStart = string.indexOf(substring);
  const indexEnd = indexStart + substring.length;

  return [indexStart, indexEnd];
}

const PdfViewer: React.FC<Props> = ({ document }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfURL, setPdfURL] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [userQuestion, setUserQuestion] = useState("");
  const [isCustomHovered, setIsCustomHovered] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const [textItems, setTextItems] = useState({});

  const searchString = `Drawing upon new institutional theory, we developed and tested a model on how digital transformational.`;

  // const onPageLoadSuccess = useCallback(
  //   async (pageData: any, pageNumber: any) => {
  //     console.log("Page data:", pageData);
  //     console.log("Page number:", pageNumber);

  //     // Call getTextContent() on the pageData object, not pageNumber
  //     const textContent = await pageData.getTextContent();

  //     setTextItems((prevItems) => {
  //       const updatedItems = { ...prevItems, [pageNumber]: textContent.items };
  //       console.log("Updated text items for page " + pageNumber, updatedItems);
  //       return updatedItems;
  //     });
  //   },
  //   []
  // );

  // useEffect(() => {
  //   const fetchTextCoordinates = async () => {
  //     if (!pdfURL) {
  //       console.log("PDF URL not set");
  //     }
  //     console.log("PDF URL:", pdfURL);

  //     const loadingTask = pdfjs.getDocument(pdfURL!);
  //     const pdf = await loadingTask.promise;

  //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //       const page = await pdf.getPage(pageNum);
  //       const textContent = await page.getTextContent();
  //       console.log("Text found: ", textContent);

  //       const pageText = textContent.items
  //         .map((item) => ("str" in item ? item.str : ""))
  //         .join(" ")
  //         .replace(/\s+/g, " ");

  //       if (pageText.includes(searchString.replace(/\s+/g, " "))) {
  //         console.log(`Found text on page ${pageNum}`);
  //       }
  //     }
  //   };
  //   fetchTextCoordinates();
  // }, [pdfURL, searchString]);

  console.log(`text items: ${textItems}`);

  const customTextRenderer = useCallback(
    (textItem: { str?: any; itemIndex?: any }) => {
      if (!textItems) {
        return;
      }

      const { itemIndex } = textItem;

      const matchInTextItem = textItem.str.match(searchString);

      if (matchInTextItem) {
        return highlightPattern(textItem.str, searchString);
      }

      const textItemWithNeighbors = getTextItemWithNeighbors(
        textItems,
        itemIndex
      );

      const matchInTextItemWithNeighbors =
        textItemWithNeighbors.match(searchString);

      if (!matchInTextItemWithNeighbors) {
        return textItem.str;
      }

      const [matchIndexStart, matchIndexEnd] = getIndexRange(
        textItemWithNeighbors,
        searchString
      );
      const [textItemIndexStart, textItemIndexEnd] = getIndexRange(
        textItemWithNeighbors,
        textItem.str
      );

      if (
        matchIndexEnd < textItemIndexStart ||
        matchIndexStart > textItemIndexEnd
      ) {
        return textItem.str;
      }

      const indexOfCurrentTextItemInMergedLines = textItemWithNeighbors.indexOf(
        textItem.str
      );

      const matchIndexStartInTextItem = Math.max(
        0,
        matchIndexStart - indexOfCurrentTextItemInMergedLines
      );
      const matchIndexEndInTextItem =
        matchIndexEnd - indexOfCurrentTextItemInMergedLines;

      const partialStringToHighlight = textItem.str.slice(
        matchIndexStartInTextItem,
        matchIndexEndInTextItem
      );

      return highlightPattern(textItem.str, partialStringToHighlight);
    },
    [searchString, textItems]
  );

  useEffect(() => {
    if (!document) return;

    const fetchDocumentUrl = async () => {
      try {
        const pdfDownloadURL = await getDownloadURL(document);
        setPdfURL(pdfDownloadURL);
      } catch (error) {
        console.error("Error fetching PDF URL", error);
      }
    };

    fetchDocumentUrl();
  }, [document]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    }
    window.document.addEventListener("mousedown", handleClickOutside);
    return () =>
      window.document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCustomHovered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomHovered]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const direction = e.deltaY < 0 ? 0.1 : -0.1;

        setScale((prev) => {
          const newScale = prev + direction;
          return newScale < 0.5 ? 0.5 : newScale > 3 ? 3 : newScale;
        });
      }
    };

    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const showContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const selection = window.getSelection();

    if (!selection || selection.toString().trim() === "") return;

    setMenuPosition({
      x: (event.clientX + window.scrollX) / scale,
      y: (event.clientY + window.scrollY) / scale,
    });
    setMenuVisible(true);
  };

  const handleCustomHover = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
  };

  const handleContextMenuOption = (
    option: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString();
    let message = "";

    switch (option) {
      case "summarise":
        message = `Summarise the following piece of text: ${text}`;
        break;
      case "key":
        message = `Show the key points of the following piece of text: ${text}`;
        break;
      case "explain":
        message = `Explain the following piece of text: ${text}`;
        break;
      default:
        console.error("Invalid option");
        return;
    }

    dispatch(setSelectedText(message));
    dispatch(openChatSupport(document.name));
    setMenuVisible(false);
  };

  const handleSubmitQuestion = () => {
    const selectedText = savedSelection ? savedSelection.toString() : "";
    const message = `${userQuestion} ${selectedText}`;

    dispatch(setSelectedText(message));
    dispatch(openChatSupport(document.name));
    setMenuVisible(false);
    setIsCustomHovered(false);
    setUserQuestion("");
  };

  return (
    <Flex width="100%" height="100%" direction="column">
      <Box
        position="sticky"
        top="0"
        zIndex={1}
        p="0.5rem"
        display="flex"
        justifyContent="center"
      >
        <button onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}>
          -
        </button>
        <span style={{ margin: "0 1rem" }}>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale((prev) => Math.min(prev + 0.1, 3))}>
          +
        </button>
      </Box>

      <Box flex="1" position="relative" overflowY="auto">
        {menuVisible && (
          <Box
            ref={menuRef}
            position="fixed"
            top={menuPosition.y}
            left={menuPosition.x}
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
              onClick={(e: any) => handleContextMenuOption("summarise", e)}
            >
              Summarise
            </Box>
            <Box
              as="button"
              display="block"
              p="1rem"
              color="black"
              onClick={(e: any) => handleContextMenuOption("key", e)}
            >
              Show key points
            </Box>
            <Box
              as="button"
              display="block"
              p="1rem"
              color="black"
              onClick={(e: any) => handleContextMenuOption("explain", e)}
            >
              Explain
            </Box>
            <Flex
              position="relative"
              p="1rem"
              color="black"
              alignItems="center"
              direction="row"
              onMouseEnter={() => {
                handleCustomHover();
                setIsCustomHovered(true);
              }}
              onMouseLeave={() => {
                if (!userQuestion) {
                  setIsCustomHovered(false);
                }
              }}
            >
              <Box>Your own question...</Box>
              {isCustomHovered && (
                <Input
                  size="sm"
                  ref={inputRef}
                  value={userQuestion}
                  autoFocus
                  height="100%"
                  paddingY="0"
                  backgroundColor="white"
                  border="1px solid #E2E8F0"
                  placeholder="Type your question and hit Enter"
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onBlur={() => {
                    if (savedSelection && window.getSelection) {
                      const selection = window.getSelection();
                      selection!.removeAllRanges();
                      selection!.addRange(savedSelection);
                      setSavedSelection(null);
                      if (!userQuestion) setIsCustomHovered(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmitQuestion();
                    }
                  }}
                  position="absolute"
                  top="50%"
                  left="100%"
                  transform="translateY(-50%)"
                />
              )}
            </Flex>
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100%"
          overflow="auto"
          ref={pdfContainerRef}
        >
          {pdfURL && (
            <Document
              file={pdfURL}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onContextMenu={showContextMenu}
              renderMode="canvas"
            >
              {Array.from({ length: numPages }, (_, index) => (
                <Box
                  key={`page_${index + 1}`}
                  borderBottom="1px solid black"
                  marginBottom="1rem"
                >
                  <Page
                    key={index + 1}
                    pageNumber={index + 1}
                    scale={scale}
                    renderTextLayer={true}
                    // onLoadSuccess={(pageData) =>
                    //   onPageLoadSuccess(pageData, index + 1)
                    // }
                    customTextRenderer={customTextRenderer}
                  />
                </Box>
              ))}
            </Document>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default PdfViewer;
