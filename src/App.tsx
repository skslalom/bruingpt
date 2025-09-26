import { Amplify } from 'aws-amplify';
import { Route, Routes, BrowserRouter } from 'react-router';
import './App.css';
import Header from './components/header';
import amplifyconfiguration from './lib/amplifyconfiguration';
import { ChatSessionsContextProvider } from './lib/contexts/ChatSessionsProvider';
import { UserInfoContextProvider } from './lib/contexts/UserInfoProvider';
import { Auth } from './pages/auth/auth';
import { Chat } from './pages/chat/chat';
import Unauthorized from './pages/unauthorized/unauthorized';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { bruinTheme } from './themes/bruin.theme';

export interface IAccessCreds {
  accessToken: string;
  refreshToken: string;
}

Amplify.configure(amplifyconfiguration);

const Root = () => {
  return (
    <Routes>
      <Route element={<UserInfoContextProvider />}>
        <Route element={<ChatSessionsContextProvider />}>
          <Route element={<Header />}>
            <Route element={<Auth />}>
              <Route path="/" element={<Chat />} />
              <Route path="/chat" element={<Chat />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={bruinTheme}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
