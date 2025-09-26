import { lighten, darken } from '@mui/material/styles';

// module augmentation required for adding custom colors to palette
// Both Palette and PaletteOptions interfaces is required
// Set color name definition in this module and set the color value in the Palette object below under its named key
declare module '@mui/material/styles' {
  interface Palette {
    backgroundColor: Palette['primary'];
    slalomPrimaryBlue: Palette['primary'];
    slalomSecondaryCyan: Palette['primary'];
    slalomSecondaryRed: Palette['primary'];
    slalomSecondaryPurple: Palette['primary'];
    slalomSecondaryChartreuse: Palette['primary'];
    neutralWhite: Palette['primary'];
    neutralLightGray: Palette['primary'];
    neutralDarkGray: Palette['primary'];
    neutralBlack: Palette['primary'];
  }

  interface PaletteOptions {
    backgroundColor?: PaletteOptions['primary'];
    slalomPrimaryBlue?: PaletteOptions['primary'];
    slalomSecondaryCyan?: PaletteOptions['primary'];
    slalomSecondaryRed?: PaletteOptions['primary'];
    slalomSecondaryPurple?: PaletteOptions['primary'];
    slalomSecondaryChartreuse?: PaletteOptions['primary'];
    neutralWhite?: PaletteOptions['primary'];
    neutralLightGray?: PaletteOptions['primary'];
    neutralDarkGray?: PaletteOptions['primary'];
    neutralBlack?: PaletteOptions['primary'];
  }
}

/**
 * These are the names for colors that are refered to in Typescript with theme.palette.<color_name>.[main, light, dark, contrast]
 *
 * MUI has default colors defined under:
 * common, primary, secondary, error, success, info, and warning.
 *
 * Each of these entries have a main property. This is the default color for the specified key.  Each of these though, can have a light variation, a dark variation, and a contrast text color
 */
export const palette = {
  common: {
    white: '#FFF',
    black: '#000',
  },
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#A4BCC2',
    light: lighten('#A4BCC2', 0.8),
    dark: darken('#A4BCC2', 0.8),
  },
  error: {
    main: '#d32f2f',
  },
  success: {
    main: '#2e7d32',
  },
  info: {
    main: '#0288d1',
  },
  warning: {
    main: '#ed6c02',
  },
  // custom colors go here
  backgroundColor: {
    main: '#f9f9f9',
  },
  slalomPrimaryBlue: {
    light: '#0C62FB',
    main: '#0C62FB',
    dark: '#002FAF',
  },
  slalomSecondaryCyan: {
    main: '#1BE1F2',
    dark: '#00BAD6', // Cyan - Dark 3
    light: '#8DF0F9', // Cyan - Light 2 (50%)
  },
  slalomSecondaryRed: {
    main: '#FF4D5F',
    dark: '#E6154A', // Red - Dark 3
    light: '#FFA6AF', // Red - Light 2 (50%)
  },
  slalomSecondaryPurple: {
    main: '#C7B9FF',
    dark: '#9488F0', // Purple - Dark 3
    light: '#E3DCFF', // Purple - Light 2 (50%)
  },
  slalomSecondaryChartreuse: {
    main: '#DEFF4D',
    dark: '#B3CC3E', // Chartruese - Dark 3
    light: '#EFFFA6', // Chartruese - Light 2 (50%)
  },
  neutralWhite: {
    main: '#FFF',
  },
  neutralLightGray: {
    main: '#E6E6E6',
  },
  neutralDarkGray: {
    main: '#666666',
  },
  neutralBlack: {
    main: '#000',
  },
};
