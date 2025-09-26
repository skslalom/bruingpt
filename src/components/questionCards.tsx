import { Card, CardActionArea, CardContent, Grid2 as Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { exampleQuestions } from '../config';

interface QuestionCardsProps {
  handleSubmit: any;
}

const QuestionCards: React.FC<QuestionCardsProps> = ({ handleSubmit }) => {
  return (
    <Grid container spacing={3}>
      {exampleQuestions.map((question, index) => (
        <Grid key={index} size={{ xs: 12, sm: 12, md: 6, lg: 3, xl: 3 }}>
          <Card
            key={index}
            onClick={event => {
              handleSubmit(event, question);
            }}
            sx={{ height: '100%' }}
          >
            <CardActionArea sx={{ height: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="body1" mb={0}>
                  {question}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuestionCards;
