import { useState, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { useTheme } from '@mui/material';

/**
 * Custom hook for managing alert notifications using Material-UI's Snackbar and Alert components.
 *
 * @returns {Object} An object containing:
 * @returns showAlert: (message: string, severity?: AlertSeverity) => void - Function to display an alert
 * @returns AlertSnackbar: () => JSX.Element - React component to render the alert inside a snackbar
 */

export type AlertSeverity = 'info' | 'error' | 'success' | 'warning';
export type AlertVariant = 'filled' | 'outlined';

export const useAlertSnackbar = () => {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(6000);
  const [severity, setSeverity] = useState<AlertSeverity>('success');
  const [variant, setVariant] = useState<AlertVariant>('filled');

  const showAlert = useCallback(
    (
      message: string,
      severity?: AlertSeverity,
      variant?: AlertVariant,
      title?: string,
      duration?: number
    ) => {
      setMessage(message);
      setSeverity(severity || 'success');
      setVariant(variant || 'filled');
      setTitle(title || '');
      setDuration(duration || 6000);
      setOpen(true);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }
      hideAlert();
    },
    [hideAlert]
  );

  const AlertSnackbar = useCallback(
    () => (
      <Snackbar
        key={message}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            background: variant === 'outlined' ? theme.palette.common.white : undefined,
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant={variant}
          elevation={6}
          sx={{ width: '100%' }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </Snackbar>
    ),
    [open, message, title, severity, variant, duration, handleClose, theme]
  );

  return {
    showAlert,
    AlertSnackbar,
  };
};
