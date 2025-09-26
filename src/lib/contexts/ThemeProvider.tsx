import { useTheme } from '@mui/material';
import { Outlet } from 'react-router';
import { customTheme } from '../../themes/themes';
import CustomThemeContext from './ThemeContext';

export function CustomThemeContextProvider() {
  const theme = useTheme();
  const custom = customTheme(theme);

  return (
    <CustomThemeContext.Provider value={{ custom }}>
      <Outlet />
    </CustomThemeContext.Provider>
  );
}
