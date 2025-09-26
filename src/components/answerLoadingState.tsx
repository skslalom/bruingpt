import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import botIcon from '../../src/public/bot.png';
import { useTheme } from '@mui/material/styles';

export default function AnswerLoadingState() {
  const theme = useTheme();

  return (
    <Fade in>
      <Box sx={{ display: 'flex', flexDirection: 'row', p: '25px 25px' }}>
        <Avatar
          variant="square"
          sx={{
            bgcolor: theme.palette.slalomSecondaryRed.dark,
            marginRight: '40px',
            fontSize: '0.6em',
            borderRadius: '5px',
            padding: '2px',
          }}
        >
          <img src={botIcon} alt="botIcon" style={{ width: '25px', height: '25px' }} />
        </Avatar>
        <Box
          sx={{
            position: 'relative',
            top: '8px',
          }}
        >
          <svg width="80" height="28" viewBox="0 0 80 20">
            <circle cx="10" cy="10" r="4" fill={`${theme.palette.slalomSecondaryChartreuse.dark}`}>
              <animate
                attributeName="cy"
                from="10"
                to="0"
                dur="0.5s"
                begin="0s"
                repeatCount="indefinite"
                values="10; 0; 10"
                keyTimes="0; 0.5; 1"
              />
            </circle>
            <circle cx="30" cy="10" r="4" fill={`${theme.palette.slalomSecondaryCyan.dark}`}>
              <animate
                attributeName="cy"
                from="10"
                to="0"
                dur="0.5s"
                begin="0.1s"
                repeatCount="indefinite"
                values="10; 0; 10"
                keyTimes="0; 0.5; 1"
              />
            </circle>
            <circle cx="50" cy="10" r="4" fill={`${theme.palette.slalomSecondaryPurple.dark}`}>
              <animate
                attributeName="cy"
                from="10"
                to="0"
                dur="0.5s"
                begin="0.2s"
                repeatCount="indefinite"
                values="10; 0; 10"
                keyTimes="0; 0.5; 1"
              />
            </circle>
            <circle cx="70" cy="10" r="4" fill={`${theme.palette.slalomSecondaryRed.dark}`}>
              <animate
                attributeName="cy"
                from="10"
                to="0"
                dur="0.5s"
                begin="0.3s"
                repeatCount="indefinite"
                values="10; 0; 10"
                keyTimes="0; 0.5; 1"
              />
            </circle>
          </svg>
        </Box>
      </Box>
    </Fade>
  );
}
