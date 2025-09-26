import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { useClipboard } from '../lib/hooks/UseClipboard';
import { useAlertSnackbar } from '../lib/hooks/UseAlertSnackbar';
import MarkdownRenderer from './markdownRenderer';

interface LinkCreatorProps {
  line: string;
  rateResponse?: (value: string) => void | undefined;
  rating?: string;
}

export default function LinkCreator(props: LinkCreatorProps) {
  const { line, rateResponse, rating } = props;

  const { copied, clipboardError, copyToClipboard } = useClipboard();
  const { showAlert, AlertSnackbar } = useAlertSnackbar();

  return (
    <Box>
      <MarkdownRenderer content={line} />
      <Box mt={rateResponse ? 2 : 0}>
        {rateResponse && (
          <>
            <Tooltip title="Copy to clipboard" placement="bottom">
              <IconButton
                id="copy-clipboard-button"
                size="small"
                onClick={() => {
                  void copyToClipboard(line);
                  showAlert('Successfully copied to clipboard');
                }}
              >
                {copied ? <CheckOutlinedIcon color="success" /> : <ContentCopyOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="This response is helpful" placement="bottom">
              <IconButton
                id="thumbs-up-chat-button"
                size="small"
                onClick={() => rateResponse('THUMBS_UP')}
                disabled={rating === 'THUMBS_UP'}
              >
                {rating && rating === 'THUMBS_UP' ? (
                  <ThumbUpIcon color="info" />
                ) : (
                  <ThumbUpOffAltIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="This response is not helpful" placement="bottom">
              <IconButton
                id="thumbs-down-chat-button"
                size="small"
                onClick={() => rateResponse('THUMBS_DOWN')}
                disabled={rating === 'THUMBS_DOWN'}
              >
                {rating && rating === 'THUMBS_DOWN' ? (
                  <ThumbDownIcon color="info" />
                ) : (
                  <ThumbDownOffAltIcon />
                )}
              </IconButton>
            </Tooltip>
          </>
        )}
        {clipboardError && (
          <Typography variant="body2" color="error">
            {clipboardError}
          </Typography>
        )}
      </Box>
      <AlertSnackbar />
    </Box>
  );
}
