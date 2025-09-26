import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

// module augmentation to add custom variables to the theme
declare module '@mui/material/styles' {
  interface Theme {
    constants: {
      drawerWidthDesktop: number;
      drawerWidthMobile: number;
      appBarHeight: number;
      appBarHeightDense: number;
      footerHeight: number;
    };
  }

  interface ThemeOptions {
    constants?: {
      drawerWidthDesktop?: number;
      drawerWidthMobile?: number;
      appBarHeight?: number;
      appBarHeightDense?: number;
      footerHeight?: number;
    };
  }
}

export const bruinTheme = createTheme({
  // CONSTANT VARIABLES
  constants: {
    drawerWidthDesktop: 300,
    drawerWidthMobile: 100,
    appBarHeight: 64,
    appBarHeightDense: 48,
    footerHeight: 48,
  },
  // COLOR PALETTE
  palette,
  // COMPONENT OVERRIDES BY COMPONENT: Mui<ComponentName>
  components: {
    MuiButtonBase: {
      defaultProps: {
        // disableRipple: true,
        // disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          position: 'relative',
          outline: 'none',
          '&:focus-visible': {
            outline: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -4,
              right: -4,
              bottom: -4,
              left: -4,
              border: '2px solid',
              borderColor: 'orange',
              borderRadius: 'inherit',
              padding: '6px',
              pointerEvents: 'none',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
        contained: {
          background: palette.slalomPrimaryBlue.main,
          color: palette.common.white,
          '&.Mui-disabled': {
            background: palette.neutralLightGray.main,
          },
        },
        outlined: {
          '&.Mui-disabled': {
            color: palette.slalomPrimaryBlue.main,
            borderColor: palette.slalomPrimaryBlue.main,
          },
        },
      },
    },
  },
});
