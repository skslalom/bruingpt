import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import botIcon from '../../src/public/bot.png';
import { useTheme } from '@mui/material/styles';
import { Message } from '../lib/interfaces/Chat';
import LinkCreator from './linkCreator';
import { useUserInfoContext } from '../lib/contexts/UserInfoContext';
import { useChat } from '../lib/hooks/UseChat';
import { useAlertSnackbar } from '../lib/hooks/UseAlertSnackbar';
import SourcesAccordion from './sourcesAccordion';

interface ChatBubbleProps {
  index: number;
  message: Message;
  previousMessage: Message;
  chatId: string;
}

export default function ChatBubble(props: ChatBubbleProps) {
  const { chatId, message } = props;

  const theme = useTheme();
  const { putResponseFeedback } = useChat();
  const { userInfo } = useUserInfoContext();
  const { showAlert, AlertSnackbar } = useAlertSnackbar();
  const [rating, setRating] = useState<string | undefined>(message?.rating);

  const answer = message?.message;

  const handleResponseFeedback = (value: string) => {
    const { exchangeId } = message;

    putResponseFeedback(userInfo?.accessToken, chatId, exchangeId, value)
      .then(res => {
        if (res === 'success') {
          showAlert('Successfully rated response');
          setRating(value);
        }
      })
      .catch(() => {
        showAlert('There was an error rating the response. Please try again.', 'error');
      });
  };

  return (
    <Box
      key={props.index}
      style={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        textAlign: 'left',
        padding: '20px 25px',
      }}
    >
      {/** If the message is from the user, render their avatar. Otherwise, render FA's avatar */}
      {props.message.fromUser ? (
        <Box sx={{ display: 'flex' }}>
          <Avatar
            variant="square"
            sx={{
              bgcolor: theme.palette.slalomSecondaryCyan.dark,
              marginRight: '20px',
              fontSize: '0.7em',
              borderRadius: '5px',
              padding: '2px',
              fontWeight: 400,
            }}
          >
            USER
          </Avatar>
        </Box>
      ) : (
        <Avatar
          variant="square"
          sx={{
            bgcolor: theme.palette.slalomSecondaryRed.dark,
            marginRight: '20px',
            fontSize: '0.6em',
            borderRadius: '5px',
            padding: '2px',
          }}
        >
          <Box
            component="img"
            src={botIcon}
            alt="botIcon"
            style={{ width: '25px', height: '25px' }}
          />
        </Avatar>
      )}
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          borderRadius: '10px',
          background: theme.palette.common.white,
        }}
      >
        <CardContent
          sx={{
            '&.MuiCardContent-root': {
              pb: 2,
            },
          }}
        >
          <LinkCreator
            line={answer}
            rating={rating}
            rateResponse={!props.message.fromUser ? handleResponseFeedback : undefined}
          />
          {!props.message.fromUser && (
            <>
              {message?.sources && message?.sources.length > 0 && <SourcesAccordion sources={message.sources} />}
            </>
          )}
        </CardContent>
      </Card>
      <AlertSnackbar />
    </Box>
  );
}
