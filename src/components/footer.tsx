import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { config } from '../config';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
  const theme = useTheme();

  return (
    <AppBar
      component="footer"
      position="fixed"
      sx={{
        background: theme.palette.common.white,
        top: 'auto',
        bottom: 0,
      }}
    >
      <Toolbar variant="dense">
        <Box display="flex" justifyContent="center" sx={{ width: '100%' }}>
          <Typography variant="body2" color="textPrimary">
            &copy; {new Date().getFullYear()} {config.companyName}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
