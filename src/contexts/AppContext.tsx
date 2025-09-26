// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserPreferences, saveUserPreferences } from '../utils/userPreferences';

interface AppContextType {
  pageSize: number;
  setPageSize: (size: number) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.warn('useAppContext must be used within an AppProvider, using default values');
    return {
      pageSize: 25,
      setPageSize: () => {},
      isDarkMode: false,
      toggleTheme: () => {},
    };
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [pageSize, setPageSize] = useState(() => {
    const prefs = getUserPreferences();
    return prefs.pageSize;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const prefs = getUserPreferences();
    return prefs.theme === 'dark';
  });

  // Save page size to localStorage when it changes
  useEffect(() => {
    saveUserPreferences({ pageSize });
  }, [pageSize]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    saveUserPreferences({ theme: isDarkMode ? 'dark' : 'light' });
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider value={{
      pageSize,
      setPageSize,
      isDarkMode,
      toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
};
