import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clamp, inRange, max, min } from 'lodash';
import {
  Stack,
  IconButton,
  InputBase,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  Drawer,
} from '@mui/material';
import { pdfjs, Document, Page } from 'react-pdf';
import { CustomTextRenderer, OnDocumentLoadSuccess } from 'react-pdf/src/shared/types.js';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import 'react-pdf/dist/Page/TextLayer.css';
import '../lib/styles/unstyledNumInput.css';

// init pdf.js worker - this is required for react-pdf to functional properly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const removeWhitespace = (value: string) => value.replace(/\s+/g, '');

interface DocumentViewerProps {
  url: string;
  name?: string;
  citation?: { content?: string; page?: number };
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * React component to render a pdf document.
 * @param url - URL to pdf file. In case of CORS issue, try downloading target file to temporary local storage and use URL to the local file instead.
 * @param name - [optional] Name of pdf file.
 * @param citation - [optional] Page number and content of citation.
 * @param open - Determines if component should be displayed.
 * @param onClose - Callback to handle closing of component.
 * @param isLoading - [optional] If true, component will render in a loading state.
 */
export const DocumentViewer = ({
  url,
  name,
  citation,
  open,
  onClose,
  isLoading,
}: DocumentViewerProps) => {
  const { palette } = useTheme();
  const [pageHeight, setPageHeight] = useState(0); // used to responsively set doc viewer height
  const [numPages, setNumPages] = useState(0); // total number of pages for current document
  const [pageNumber, setPageNumber] = useState(1); // number of currently loaded page
  const [selectedPage, setSelectedPage] = useState(pageNumber); // controls value in page number input field
  const [highlightedItemsRange, setHighlightedItemsRange] = useState({
    min: 0,
    max: 0,
  }); // range of items to be highlighted in loaded page

  const sourceFile = useMemo(() => ({ url }), [url]); // source file must be memoized in this fashion in order to prevent redundant re-renders. a quirk of react-pdf
  const searchQuery = useMemo(
    () => (citation?.content ? removeWhitespace(citation.content) : undefined),
    [citation]
  ); // unified format for citation/search query because react-pdf's method of text extraction is likely to differ from that supplied from backend

  const searchQueryMatched = useMemo(() => {
    return highlightedItemsRange.min !== highlightedItemsRange.max;
  }, [highlightedItemsRange]);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfTextContent = useRef(''); // used to search against for `searchQuery`
  const textItemStartIndices = useRef<number[]>([]); // used as buffer in the custom `textRender` callback to keep track of textItem indices to be highlighted before `highlightedItemsRange` is updated

  const changePage = (offset: number) => setPageNumber(prevPageNumber => prevPageNumber + offset);
  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);
  const goToPage = (page: number) => {
    setPageNumber(clamp(page, 1, numPages));
  };

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = doc => {
    setNumPages(doc.numPages);
    setPageNumber(citation?.page || 1);
  };

  const textRenderer: CustomTextRenderer = useCallback(
    textItem => {
      if (searchQuery) {
        if (searchQueryMatched) {
          if (
            textItem.str.trim().length &&
            inRange(
              textItem.itemIndex,
              max([highlightedItemsRange.min - 1, 0]) || 0,
              highlightedItemsRange.max + 1
            )
          ) {
            return `<mark>${textItem.str}</mark>`;
          } else {
            return textItem.str;
          }
        } else {
          const textItemStringIndex = pdfTextContent.current.length;

          pdfTextContent.current += removeWhitespace(textItem.str);
          textItemStartIndices.current.push(textItemStringIndex);

          const searchQueryMatchIndex = pdfTextContent.current.indexOf(searchQuery);

          if (searchQueryMatchIndex >= 0) {
            const highlightStartIndex = searchQueryMatchIndex;
            const highlightEndIndex = searchQueryMatchIndex + searchQuery.length;

            const highlightedItems = Object.entries(textItemStartIndices.current)
              .filter(entry => {
                const [_, value] = [Number(entry[0]), entry[1]];
                return value >= highlightStartIndex && value < highlightEndIndex;
              })
              .map(entry => Number(entry[0]));

            const highlightedRange = {
              min: min(highlightedItems) || 0,
              max: (max(highlightedItems) || 0) + 1,
            };

            setHighlightedItemsRange(highlightedRange);
          }
        }
      }
      return textItem.str;
    },
    [searchQuery, searchQueryMatched]
  );

  const navigateOnEnter = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToPage(selectedPage);
    }
  };

  const resizePage = () => {
    if (!containerRef.current) return;
    setPageHeight(containerRef.current.clientHeight);
  };

  useEffect(() => setSelectedPage(pageNumber), [pageNumber]);

  useEffect(
    () => () => {
      pdfTextContent.current = '';
      textItemStartIndices.current = [];
      setHighlightedItemsRange({ min: 0, max: 0 });
    },
    [searchQuery, pageNumber]
  );

  useEffect(() => {
    resizePage();
    window.addEventListener('resize', resizePage);
    return () => {
      window.removeEventListener('resize', resizePage);
    };
  }, []);

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Stack width="100%" alignItems="stretch" flexGrow={1}>
        <Stack
          minWidth={0}
          direction="row"
          alignItems="center"
          px="24px"
          py="16px"
          justifyContent="space-between"
          gap="24px"
        >
          <Stack flex="1 1 0" minWidth={0}>
            <Typography
              variant="body2"
              component="a"
              href={sourceFile.url}
              target="_blank"
              rel="noopener noreferrer"
              color="info"
              maxWidth="350px"
              noWrap
            >
              {name}
            </Typography>
          </Stack>
          <Stack direction="row" gap="8px" alignItems="center" flex="0 0 fit-content">
            <IconButton
              disabled={pageNumber <= 1}
              onClick={previousPage}
              aria-label="Previous Page"
              size="small"
            >
              <ArrowBackIosRoundedIcon fontSize="small" />
            </IconButton>
            <Stack direction="row" alignItems="center" gap="8px">
              <Typography variant="body2">Page</Typography>
              <InputBase
                type="number"
                inputMode="numeric"
                value={selectedPage}
                onFocus={e => e.target.select()}
                onChange={e => setSelectedPage(Number(e.target.value))}
                onBlur={() => goToPage(selectedPage)}
                onKeyDown={navigateOnEnter}
                sx={{ width: '40px', userSelect: 'all' }}
                inputProps={{
                  sx: {
                    p: 0,
                    borderBottom: '1px solid grey',
                    textAlign: 'center',
                    fontSize: '14px',
                    userSelect: 'all',
                  },
                }}
              />
              <Typography variant="body2">of {numPages || '--'}</Typography>
            </Stack>
            <IconButton
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              aria-label="Next Page"
              size="small"
            >
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Divider />
        <Stack ref={containerRef} minHeight={0} flex="1 0 0" alignItems="center">
          {sourceFile.url ? (
            <Document file={sourceFile} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer
                height={pageHeight}
                customTextRenderer={searchQuery ? textRenderer : undefined}
              />
            </Document>
          ) : (
            <Stack
              flex="1 0 0"
              width="100%"
              justifyContent="center"
              minWidth="600px"
              bgcolor={palette.background.default}
            >
              {isLoading ? (
                <Stack gap="8px" alignItems="center">
                  <CircularProgress color="info" size="32px" />
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Loading document...
                  </Typography>
                </Stack>
              ) : (
                <Stack gap="8px" alignItems="center">
                  <ErrorOutlineIcon color="error" fontSize="large" sx={{ height: '32px' }} />
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Failed to retrieve document.
                  </Typography>
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};
