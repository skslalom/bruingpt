import { Theme } from '@mui/material';
import { createContext, useContext } from 'react';

interface CustomThemeContextType {
  custom: Theme;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export function useCustomThemeContext() {
  const context = useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}

export default CustomThemeContext;
