import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';
// TODO import with real logo file
// import logo from "../public/logo.png";
import { config } from '../config';
import { logout } from '../lib/api/Auth';
import { useUserInfoContext } from '../lib/contexts/UserInfoContext';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useLocalStorage } from '../lib/hooks/UseLocalStorage';

export default function Header() {
  const { userInfo, updateUserInfo } = useUserInfoContext();
  const theme = useTheme();
  const viewportIsMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const [_showChatsOnMobile, setShowChatsOnMobile] = useLocalStorage('showChatsDrawer', false);

  const handleToggleChats = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setShowChatsOnMobile((prev: any) => !prev);
  };

  const handleLogout = () => {
    logout();
    updateUserInfo(undefined);
  };

  return (
    <>
      <Box>
        <AppBar
          position="fixed"
          sx={{
            background: theme.palette.common.blue,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{
              maxWidth: '100vw',
            }}
          >
            {viewportIsMobile && (
              <IconButton
                size="large"
                edge="start"
                color="primary"
                aria-label="menu"
                onClick={handleToggleChats}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {/* TODO brand with a logo */}
            {/* <Box component="img" src={logo} width="100px" alt="logo alt text" /> */}
            {viewportIsMobile ? (
              <Box
                width="100%"
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  color={theme.palette.common.white}
                  sx={{ ml: '-20px', textTransform: 'uppercase', fontSize: '1rem' }}
                >
                  {config.styledText}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  color={theme.palette.common.white}
                  ml="16px"
                  sx={{ ml: '16px', textTransform: 'uppercase'}}
                >
                  {config.styledText}
                </Typography>
              </>
            )}
            <Box flexGrow={1} />
            {userInfo != null ? (
              <MenuIcon 
                onClick={handleLogout}
                >
                <Button
                  id="logout"
                  tabIndex={0}
                  aria-label="logout"
                  variant="contained"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </MenuIcon>
            ) : (
              // TODO refactor
              <Box sx={{ width: '70px' }} />
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}
