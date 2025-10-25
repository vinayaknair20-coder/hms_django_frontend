import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  // Force cache bust on mount
  useEffect(() => {
    // This prevents React from caching state
    const preventCache = () => {
      window.history.replaceState(null, '', window.location.pathname);
    };
    preventCache();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
