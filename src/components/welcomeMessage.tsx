import Box from '@mui/material/Box';
import { Grid2 as Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import photoIcon from '../../src/public/BruinBiometrics.png';
import { config } from '../config';
import QuestionCards from './questionCards';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
//import { ChooseAIModel } from "./chooseAIModel";

interface WelcomeMessageProps {
  chatId: string;
  handleNewChat?: any;
  handleSubmit?: any;
  setSelectedQ?: any;
  setCurrentMessage?: any;
  onModelChange: (model: string) => void;
}

export default function WelcomeMessage(props: WelcomeMessageProps) {
  const theme = useTheme();
  const viewportIsMobile = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  const handleModelChange = (model: string) => {
    props.onModelChange(model);
  };

  return (
    <Box id="welcome-container" component="section" height="100%">
      <Box id="welcome" p={4}>
        <Grid container spacing={3} mb={15}>
          <Grid pr="20px" flexGrow={1} size={{ sm: 12, md: 4 }}>
            <Box
              component="img"
              src={photoIcon}
              alt="welcome screen phone image"
              width="100%"
              maxHeight="300px"
            />
          </Grid>
          <Grid size={{ sm: 12, md: 8 }}>
            <Typography variant="h4" mb={2}>
              Welcome to {config.applicationName}
            </Typography>
            <Divider />
            <Typography mt={3}>{config.applicationSummary}</Typography>
            {/* <ChooseAIModel onModelChange={handleModelChange}/> */}
          </Grid>
        </Grid>
        <Box id="things-to-ask">
          <Typography variant="h5" mb={3}>
            Some things you can ask
          </Typography>
          <QuestionCards handleSubmit={props.handleSubmit} />
        </Box>
      </Box>
      {/* flex spacer */}
      <Box display="flex" flexGrow={1} />
      {viewportIsMobile && <Box height="45px" />}
    </Box>
  );
}
