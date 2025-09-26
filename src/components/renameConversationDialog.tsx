import { useState, useEffect, useMemo } from 'react';
import { useChatSessionsContext } from '../lib/contexts/ChatSessionsContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { useUserInfoContext } from '../lib/contexts/UserInfoContext';
import { useChat } from '../lib/hooks/UseChat';
import FormHelperText from '@mui/material/FormHelperText';

interface RenameConversationDialogProps {
  open: boolean;
  chatId: string | null;
  currentTitle: string;
  close: () => void;
}

export default function RenameConversationDialog(props: RenameConversationDialogProps) {
  const { open, chatId, currentTitle, close } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [responseError, setResponseError] = useState<string | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { userInfo } = useUserInfoContext();
  const { putRenameConversation } = useChat();
  const { renameChatTitle } = useChatSessionsContext();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSave = async () => {
    setLoading(true);

    if (userInfo && chatId) {
      const resp = await putRenameConversation(userInfo, chatId, title);

      if (resp === 'success') {
        // update chat sessions array in context to reflect change
        renameChatTitle(chatId, title);
        close();
      } else {
        setResponseError('Unable to rename conversation title. Please try again.');
      }
    }

    setLoading(false);
  };

  const formIsValid = useMemo(() => {
    if (title.length > 0) {
      return true;
    }
    return false;
  }, [title]);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  return (
    <>
      <Dialog
        id="raname-conversation-dialog"
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            close();
          }
        }}
        fullScreen={fullScreen}
        disableEscapeKeyDown
        aria-labelledby="rename-convseration-dialog"
        aria-describedby="rename the conversation title"
      >
        <DialogTitle id="rename-convseration-dialog-title">Rename chat</DialogTitle>
        <DialogContent id="rename-convseration-dialog-description" tabIndex={-1}>
          <Box component="form" sx={{ minWidth: '400px' }}>
            {responseError && <Alert severity="error">{responseError}</Alert>}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <TextField
                id="title"
                autoFocus
                label="Title"
                error={!formIsValid}
                fullWidth
                multiline
                maxRows={3}
                size="small"
                aria-describedby="title input"
                onChange={handleTitleChange}
                value={title}
                disabled={loading}
              />
              <FormHelperText id="error-message">
                {!formIsValid ? (
                  <Typography component="span" variant="body2" color="error">
                    Title cannot be empty.
                  </Typography>
                ) : (
                  ''
                )}
              </FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button id="cancel" variant="outlined" size="small" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            id="rename"
            variant="contained"
            size="small"
            onClick={handleSave}
            disabled={loading || !formIsValid}
            loading={loading}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
