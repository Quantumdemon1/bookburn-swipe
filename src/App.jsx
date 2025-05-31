import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from './components/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import Routes from './Routes';
import AppStatus from './components/AppStatus';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ErrorBoundary>
            <UserProvider>
              <CartProvider>
                <AnimatePresence mode="wait">
                  <Routes />
                </AnimatePresence>
                <Toaster />
                <AppStatus />
              </CartProvider>
            </UserProvider>
          </ErrorBoundary>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;