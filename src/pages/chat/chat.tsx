import { useEffect, useRef, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import DrawerItems from '../../components/drawerItems';
import Footer from '../../components/footer';
import { useTheme } from '@mui/material/styles';
import { MessageWindow } from '../../components/messageWindow';
import { logout } from '../../lib/api/Auth';
import { useChatSessionsContext } from '../../lib/contexts/ChatSessionsContext';
import { useUserInfoContext } from '../../lib/contexts/UserInfoContext';
import { useChat } from '../../lib/hooks/UseChat';
import { Auth } from '../auth/auth';
import { useMediaQuery } from '@mui/material';
import { useLocalStorage } from '../../lib/hooks/UseLocalStorage';
import { useAlertSnackbar } from '../../lib/hooks/UseAlertSnackbar';
import { Source } from '../../lib/interfaces/Chat';

export function Chat() {
  const { getChatMessages, removeChatSession, getUpdatedSelectedChatSession, getHistory } =
    useChat();
  const { userInfo } = useUserInfoContext();
  const {
    chatSessions,
    updateSelectedChatSession,
    setChatSessions,
    selectedChatSession,
    setMessages,
    noMsgReset,
  } = useChatSessionsContext();

  const theme = useTheme();
  const { showAlert, AlertSnackbar } = useAlertSnackbar();
  const viewportIsMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [showChats] = useLocalStorage('showChatsDrawer', false);

  const [render, setRender] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState<string>('');
  const isLoading = useRef(false);

  useEffect(() => {
    // Wait 2 seconds for authentication
    const delay = setTimeout(() => {
      setRender(true);
    }, 2000);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    userInfo &&
      getHistory(userInfo).then(res => {
        if (res) setChatSessions(res);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    if (render && !userInfo) {
      setRender(false);
      logout();
    }
  }, [render, userInfo]);

  useEffect(() => {
    if (selectedChatSession && !noMsgReset.current) {
      const chatSession = chatSessions.find(session => {
        return session.chatInfo.chatId === selectedChatSession;
      });
      if (chatSession && chatSession.chatInfo.chatTitle !== 'Untitled' && userInfo) {
        getChatMessages(userInfo, chatSession.chatInfo.chatId).then(messages => {
          if (messages) setMessages(messages);
          else setMessages([]);
        });
      } else setMessages([]);
    } else noMsgReset.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatSession, userInfo]);

  const deleteChatSession = (chatId: string) => {
    setDeleteChatId(chatId);
    // delete chat session in the backend
    userInfo &&
      removeChatSession(userInfo, chatId).then(res => {
        setDeleteChatId('');
        if (res) {
          //if the user is deleting the currently selected chat session, we need to set a new selectedChatSession
          if (chatId === selectedChatSession) {
            const newlySelectedChatSessionId = getUpdatedSelectedChatSession(chatId, chatSessions);
            // if the user deleted the last chat session, a new chat session will be created when the user sends the next question
            // so the previous messages from the deleted chat session need to be cleared
            if (newlySelectedChatSessionId === '') setMessages([]);
            updateSelectedChatSession(newlySelectedChatSessionId);
          }
          // update UI if removing chat session in the backend was successful
          setChatSessions(chatSessions.filter(item => item.chatInfo.chatId !== chatId));

          showAlert('Successfully deleted chat session.');
        } else {
          showAlert('Sorry, the chat session could not be deleted. Please try again.', 'error');
        }
      });
  };

  const addMessage = (message: string, fromUser: boolean, exchangeId: string, sources?: Source[]) => {
    setMessages((prevMessages: any) => [...prevMessages, { message, fromUser, exchangeId, sources }]);
  };

  const drawerWidth = useMemo(() => {
    const { drawerWidthMobile, drawerWidthDesktop } = theme.constants;

    if (viewportIsMobile) {
      return `${drawerWidthMobile}vw`;
    } else {
      return `${drawerWidthDesktop}px`;
    }
  }, [viewportIsMobile, theme.constants]);

  return (
    <Box component="main">
      {render &&
        (userInfo ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Drawer
                variant={viewportIsMobile ? undefined : 'permanent'}
                open={showChats}
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    height: `calc(100vh - ${theme.constants.footerHeight}px)`,
                  },
                }}
              >
                <DrawerItems
                  handleDelete={deleteChatSession}
                  deleteChatId={deleteChatId}
                  isLoading={isLoading}
                />
              </Drawer>
              <MessageWindow
                chatId={selectedChatSession ?? ''}
                addMessage={addMessage}
                isLoading={isLoading}
              />
            </Box>
            <Footer />
          </>
        ) : (
          <Auth />
        ))}
      <AlertSnackbar />
    </Box>
  );
}
