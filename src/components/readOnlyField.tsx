import { Typography } from '@mui/material';

interface ReadOnlyFieldProps {
  title: string;
  value: string;
}

export function ReadOnlyField(props: ReadOnlyFieldProps) {
  return (
    <>
      <Typography
        variant="body2"
        width={'32%'}
        sx={{ margin: '15px 15px 15px 0px', fontWeight: 'bold' }}
      >
        {props.title}
        <Typography variant="subtitle1" color="grey" sx={{ margin: '15px 15px 15px 0px' }}>
          {props.value}
        </Typography>
      </Typography>
    </>
  );
}
