import { Box, Typography } from '@mui/material';
import { useCustomThemeContext } from '../../lib/contexts/ThemeContext';

export default function Unauthorized() {
  const { custom } = useCustomThemeContext();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: custom.palette.primary.main,
      }}
    >
      <Typography
        sx={{
          width: '100%',
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        You are not authorized to access this page.
      </Typography>
    </Box>
  );
}
