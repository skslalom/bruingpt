import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns/format';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useChat } from '../lib/hooks/UseChat';
import { UserInfo, useUserInfoContext } from '../lib/contexts/UserInfoContext';
import { GetDocumentRes } from '../lib/models/Chat';
import { useTheme, useMediaQuery } from '@mui/material';
import { useClipboard } from '../lib/hooks/UseClipboard';
import { useAlertSnackbar } from '../lib/hooks/UseAlertSnackbar';

interface ViewFileUploadsDialogProps {
  open: boolean;
  chatId: string | null;
  chatTitle: string | null;
  close: () => void;
}

export default function ViewFileUploadsDialog(props: ViewFileUploadsDialogProps) {
  const { open, chatId, chatTitle, close } = props;

  const { userInfo } = useUserInfoContext();
  const { getUploadedFiles } = useChat();
  const { copied, copyToClipboard } = useClipboard();
  const { showAlert, AlertSnackbar } = useAlertSnackbar();

  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [files, setFiles] = useState<GetDocumentRes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getFiles = async (userInfo: UserInfo, chatId: string) => {
    setLoading(true);
    const res = await getUploadedFiles(userInfo, chatId);
    if (res) {
      const sorted = res.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      setFiles(sorted);
    }
    setLoading(false);
  };

  const renderEmptyState = () => {
    return <Alert severity="info">There are no files uploaded for this chat session.</Alert>;
  };

  const renderTableContent = () => {
    return (
      <TableContainer component={Paper}>
        <Table
          stickyHeader
          aria-label="uploaded files for chat session"
          size="small"
          sx={{
            borderTop: `4px solid ${theme.palette.slalomSecondaryPurple.main}`,
          }}
        >
          <Box component="caption">These are all files uploaded to this chat session.</Box>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((row, i) => (
              <TableRow
                key={`${row.fileName}-${i}`}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell padding="checkbox">
                  <Tooltip title="Copy to clipboard" placement="bottom" arrow>
                    <IconButton
                      id={`copy-clipboard-button-${i}`}
                      size="small"
                      onClick={() => {
                        copyToClipboard(JSON.stringify(row), i);
                        showAlert('Successfully copied to clipboard');
                      }}
                    >
                      {copied === i ? (
                        <CheckOutlinedIcon color="success" />
                      ) : (
                        <ContentCopyOutlinedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                {/** TODO for future use */}
                {/* <TableCell padding="checkbox">
                  <Tooltip title="Download file" placement="bottom" arrow>
                    <IconButton
                      id="download-file-button"
                      size="small"
                      onClick={() => {
                        handleDownloadFile(row.documentId);
                      }}
                    >
                      <DownloadOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
                <TableCell padding="checkbox">
                  {row.fileName.endsWith('.txt') && (
                    <Chip size="small" label="Text" variant="outlined" color="warning" />
                  )}
                  {row.fileName.endsWith('.md') && (
                    <Chip size="small" label="Markdown" variant="outlined" color="info" />
                  )}
                  {row.fileName.endsWith('.html') && (
                    <Chip size="small" label="HTML" variant="outlined" color="warning" />
                  )}
                  {(row.fileName.endsWith('.doc') || row.fileName.endsWith('.docx')) && (
                    <Chip size="small" label="Word" variant="outlined" color="primary" />
                  )}
                  {(row.fileName.endsWith('.xls') || row.fileName.endsWith('.xlsx')) && (
                    <Chip size="small" label="Excel" variant="outlined" color="success" />
                  )}
                  {row.fileName.endsWith('.csv') && (
                    <Chip size="small" label="CSV" variant="outlined" />
                  )}
                  {row.fileName.endsWith('.pdf') && (
                    <Chip size="small" label="PDF" variant="outlined" color="error" />
                  )}
                </TableCell>
                <TableCell>{row.fileName}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell
                  sx={{
                    minWidth: '28ch',
                  }}
                >
                  {format(new Date(row.createdAt), 'PPpp')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  useEffect(() => {
    userInfo && chatId && getFiles(userInfo, chatId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, chatId]);

  return (
    <Dialog
      id="view-files-dialog"
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          close();
        }
      }}
      fullScreen={fullscreen}
      maxWidth="xl"
      aria-labelledby="view-files-dialog"
      aria-describedby="rename the conversation title"
    >
      <DialogTitle id="view-files-dialog-title">
        Files for:{' '}
        <Typography component="span" sx={{ fontWeight: 700 }}>
          {chatTitle}
        </Typography>
      </DialogTitle>
      <DialogContent id="view-files-description" tabIndex={-1}>
        {files.length > 0 ? renderTableContent() : renderEmptyState()}
      </DialogContent>
      <DialogActions>
        <Button
          id="cancel"
          variant="outlined"
          size="small"
          onClick={close}
          disabled={loading}
          loading={loading}
        >
          Close
        </Button>
      </DialogActions>
      <AlertSnackbar />
    </Dialog>
  );
}
