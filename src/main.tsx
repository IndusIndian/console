// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import App from './App';
import './index.css';

// Suppress Ant Design compatibility warning for React 19
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('antd v5 support React is 16 ~ 18')) {
    return; // Suppress this specific warning
  }
  originalConsoleWarn(...args);
};

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
