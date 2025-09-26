import { useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { MutableRefObject } from 'react';
import { useTheme } from '@mui/material/styles';
import { useChatSessionsContext } from '../lib/contexts/ChatSessionsContext';
import { ChatSession } from '../lib/interfaces/Chat';
import RenameConversationDialog from './renameConversationDialog';
import ViewFileUploadsDialog from './viewFileUploadsDialog';
import { useMediaQuery } from '@mui/material';
import { useLocalStorage } from '../lib/hooks/UseLocalStorage';
import { useChat } from '../lib/hooks/UseChat';
import { useUserInfoContext } from '../lib/contexts/UserInfoContext';

// TODO for future use
// import ContentCut from "@mui/icons-material/ContentCut";
// import ContentCopy from "@mui/icons-material/ContentCopy";
// import ContentPaste from "@mui/icons-material/ContentPaste";
// import Cloud from "@mui/icons-material/Cloud";
// import Paper from "@mui/material/Paper";
// import MenuList from "@mui/material/MenuList";

interface DrawerItemsProps {
  handleDelete: (chatId: string) => void;
  deleteChatId: string;
  isLoading: MutableRefObject<boolean>;
}
export default function DrawerItems({ handleDelete, deleteChatId, isLoading }: DrawerItemsProps) {
  const { userInfo } = useUserInfoContext();

  const [showRenameConversationDialog, setShowRenameConversationDialog] = useState<boolean>(false);

  const [showViewFilesDialog, setShowViewFilesDialog] = useState<boolean>(false);
  // for drawer items menu
  // MUI references menu trigger by element
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuActionChatId, setSelectedMenuActionChatId] = useState<string | null>(null);
  const [currentConversationTitle, setCurrentConversationTitle] = useState<string>('');
  const open = Boolean(menuAnchorEl);

  const theme = useTheme();
  const viewportIsMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [showChats, setShowChats] = useLocalStorage('showChatsOnMobile');

  // MUI references menu trigger by storing an element, not id
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);

    const dataChatId = event.currentTarget.getAttribute('data-chatid') ?? null;
    const dataTitle = event.currentTarget.getAttribute('data-chattitle') ?? '';

    if (dataChatId) {
      setSelectedMenuActionChatId(dataChatId);
      setCurrentConversationTitle(dataTitle);
    }
  };

  // for closing the menu after clickaway or
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // rename convo title option
  const handleMenuRenameClick = () => {
    setShowRenameConversationDialog(true);
    handleMenuClose();
  };

  // view files option
  const handleViewFilesClick = () => {
    setShowViewFilesDialog(true);
    handleMenuClose();
  };

  // delete convo option
  const handleMenuDeleteClick = () => {
    handleMenuClose();
    if (selectedMenuActionChatId) {
      handleDelete(selectedMenuActionChatId);
      setSelectedMenuActionChatId(null);
      setCurrentConversationTitle('');
    }
  };

  // dismisal of view uploaded files dialog
  const handleViewFilesDialogClose = () => {
    setShowViewFilesDialog(false);
    setSelectedMenuActionChatId(null);
  };

  // dismisal of rename title dialog
  const handleRenameConversationClose = () => {
    setShowRenameConversationDialog(false);
    setSelectedMenuActionChatId(null);
    setCurrentConversationTitle('');
  };

  // display chat sesion title
  const outputChatTitle = (title: string) => {
    return (
      <Typography
        variant="body1"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>
    );
  };

  // display the formatted datetime or delete message if deleting chat
  const outputDatetime = (chatId: string, timestamp: string) => {
    let outputString = '';
    if (deleteChatId === chatId) {
      outputString = 'Deleting chat...';
    } else {
      outputString = format(new Date(timestamp), 'PPpp');
    }

    return (
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.80rem',
        }}
      >
        {outputString}
      </Typography>
    );
  };

  const {
    chatSessions,
    updateSelectedChatSession,
    addNewChatSession,
    selectedChatSession,
    setFiles,
  } = useChatSessionsContext();

  const { getUploadedFiles } = useChat();

  const sessionsGroupedByMonths = chatSessions.reduce<Record<string, ChatSession[]>>(
    (groupedSessions, chatSession) => {
      const month = chatSession.month;
      if (!groupedSessions[month]) {
        groupedSessions[month] = [];
      }
      groupedSessions[month].push(chatSession);
      return groupedSessions;
    },
    {}
  );

  return (
    <>
      <Box
        component="aside"
        id="convo-drawer-items"
        sx={{
          mt: `${theme.constants.appBarHeight}px`,
        }}
      >
        <List>
          <ListItem>
            <Button
              id="add-new-chat-button"
              tabIndex={0}
              aria-label="add new chat"
              fullWidth
              variant="outlined"
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                isLoading.current = false;
                addNewChatSession();

                // for mobile
                if (viewportIsMobile && showChats) {
                  setShowChats(false);
                }
              }}
            >
              New chat
            </Button>
          </ListItem>
        </List>
        <Divider />
        <Box id="conversations-wrapper" component="nav">
          <List aria-label="conversations">
            {Object.keys(sessionsGroupedByMonths).map(month => (
              <Box key={month}>
                <ListSubheader color="default">
                  <Box
                    component="strong"
                    sx={{
                      color: theme.palette.slalomPrimaryBlue.main,
                    }}
                  >
                    {month}
                  </Box>
                </ListSubheader>
                <Divider />
                {sessionsGroupedByMonths[month].map((chatSession, i) => (
                  <ListItem
                    key={chatSession.chatInfo.chatId}
                    id={`chat-list-${i}`}
                    disableGutters
                    sx={{
                      p: 0,
                      '& .MuiIconButton-root': {
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                      },
                      '&:hover .MuiIconButton-root': {
                        opacity: 1,
                      },
                      '&:first-of-type': {
                        pt: '3px',
                      },
                    }}
                    secondaryAction={
                      <>
                        <IconButton
                          id={`drawer-item-menu-button-${i}`}
                          data-chatid={chatSession.chatInfo.chatId}
                          data-chattitle={chatSession.chatInfo.chatTitle}
                          aria-label="more"
                          aria-controls={open ? 'drawer-item-menu' : undefined}
                          aria-expanded={open ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={handleMenuClick}
                          size="small"
                          sx={{
                            mr: '10px',
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id={`drawer-item-menu-${i}`}
                          MenuListProps={{
                            'aria-labelledby': 'drawer-item-menu',
                          }}
                          anchorEl={menuAnchorEl}
                          open={open}
                          onClose={handleMenuClose}
                          slotProps={{
                            paper: {
                              elevation: 1,
                              style: {
                                maxHeight: 48 * 4.5,
                                width: '25ch',
                              },
                            },
                          }}
                          transitionDuration={0}
                        >
                          <MenuItem
                            disabled
                            sx={{
                              color: 'rgba(0, 0, 0, 0.6)',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              '&.Mui-disabled': {
                                opacity: 1,
                              },
                            }}
                          >
                            Chat options
                          </MenuItem>
                          <Divider />
                          <MenuItem onClick={() => handleMenuRenameClick()}>
                            <ListItemIcon>
                              <EditOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography variant="body2">Rename title</Typography>
                            </ListItemText>
                          </MenuItem>
                          <MenuItem onClick={() => handleViewFilesClick()}>
                            <ListItemIcon>
                              <Inventory2OutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography variant="body2">View files</Typography>
                            </ListItemText>
                          </MenuItem>
                          <MenuItem onClick={() => handleMenuDeleteClick()}>
                            <ListItemIcon>
                              <DeleteOutlineIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography variant="body2">Delete chat</Typography>
                            </ListItemText>
                          </MenuItem>
                        </Menu>
                      </>
                    }
                  >
                    <ListItemButton
                      id={`list-item-button-${i}`}
                      aria-label={chatSession.chatInfo.chatTitle}
                      disableRipple
                      selected={chatSession.chatInfo.chatId === selectedChatSession}
                      onClick={async () => {
                        isLoading.current = false;
                        updateSelectedChatSession(chatSession.chatInfo.chatId);

                        // get files for selected chat session and set in context
                        if (userInfo) {
                          const files = await getUploadedFiles(
                            userInfo,
                            chatSession.chatInfo.chatId
                          );
                          setFiles(files ?? []);
                        }

                        // setFiles(files);

                        // for mobile
                        if (viewportIsMobile && showChats) {
                          setShowChats(false);
                        }
                      }}
                      disabled={deleteChatId === chatSession.chatInfo.chatId}
                    >
                      <ListItemText
                        primary={outputChatTitle(chatSession.chatInfo.chatTitle)}
                        secondary={outputDatetime(
                          chatSession.chatInfo.chatId,
                          chatSession.chatInfo.timestamp
                        )}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            ))}
          </List>
        </Box>
      </Box>
      <RenameConversationDialog
        open={showRenameConversationDialog}
        chatId={selectedMenuActionChatId}
        currentTitle={currentConversationTitle}
        close={handleRenameConversationClose}
      />
      <ViewFileUploadsDialog
        open={showViewFilesDialog}
        chatId={selectedMenuActionChatId}
        chatTitle={currentConversationTitle}
        close={handleViewFilesDialogClose}
      />
    </>
  );
}
