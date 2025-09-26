import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, Theme } from '@mui/material/styles';

/**
 * TODO marked for removal
 */

export const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
      primary: {
        main: 'rgba(245, 245, 245, 1)', // milky white
        light: '#00000099', // light grey
        dark: 'rgba(32, 32, 32, 1)', //dark grey
      },
      error: {
        main: '#D32F2F', //red
      },
      secondary: {
        main: '#1976D2', //blue
      },
    },

    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            color: 'white', // color of text
            '--TextField-brandBorderColor': 'white',
            '--TextField-brandBorderHoverColor': 'white',
            '--TextField-brandBorderFocusedColor': 'white',
            '& .MuiInputLabel-root': {
              color: 'white', // color of label
            },
            '& .MuiOutlinedInput-input': {
              color: 'white', // color of input
            },
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-brandBorderColor)',
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&:before, &:after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&:before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });
