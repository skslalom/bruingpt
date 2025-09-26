import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import LinkIcon from '@mui/icons-material/Link';
import { Alert, Box, Chip, Link } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Source } from '../lib/interfaces/Chat';
import SourcesLoadingState from './sourcesLoadingState';

interface SourcesAccordionProps {
  sources: Source[];
  isLoading?: boolean;
}
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `white`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ExpandCircleDownOutlinedIcon
        transform={'rotate(-180deg)'}
        color={'primary'}
        sx={{ marginLeft: 0 }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0)',
  flexDirection: 'row-reverse',
  paddingLeft: 0,
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingLeft: 0,
  paddingTop: 0,
}));

export default function SourcesAccordion(props: SourcesAccordionProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Accordion elevation={0} expanded={expanded === 'sources'} onChange={handleChange('sources')}>
      <AccordionSummary aria-controls="sources-content" id="sources-header" color={'primary'}>
        <Typography color={'#1976D2'}>Sources</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {props.isLoading ? (
          <SourcesLoadingState />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {props.sources.map((source, index) => {
              // Extract filename from S3 URI for display
              const filename = source.name;
              
              return (
                <Alert 
                  icon={false} 
                  key={index} 
                  sx={{ 
                    marginBottom: 0,
                    padding: 2,
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    border: '1px solid rgba(25, 118, 210, 0.12)',
                    borderRadius: 2
                  }} 
                  severity="info"
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Header with title and page chip */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Link
                        href={source.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          textDecoration: 'none',
                          color: 'primary.main',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <LinkIcon fontSize="small" />
                        <Typography variant="body2" component="span">
                          {filename}
                        </Typography>
                      </Link>
                      
                      <Chip
                        label={`Page ${source.page_number}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    
                    {/* Quote section */}
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        borderLeft: '3px solid',
                        borderLeftColor: 'primary.main',
                        padding: 1.5,
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          color: 'text.secondary',
                        }}
                      >
                        &ldquo;{source.content}&rdquo;
                      </Typography>
                    </Box>
                  </Box>
                </Alert>
              );
            })}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
