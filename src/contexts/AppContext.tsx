// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getUserPreferences, saveUserPreferences } from '../utils/userPreferences';

interface AppContextType {
  pageSize: number;
  setPageSize: (size: number) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  sessionExpiryTime: number | null;
  timeRemaining: string;
  resetSession: () => void;
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
      sessionExpiryTime: null,
      timeRemaining: '',
      resetSession: () => {},
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

  const [sessionExpiryTime, setSessionExpiryTime] = useState<number | null>(() => {
    const stored = localStorage.getItem('sessionExpiryTime');
    return stored ? parseInt(stored, 10) : null;
  });

  const [timeRemaining, setTimeRemaining] = useState('');

  // Save page size to localStorage when it changes
  useEffect(() => {
    saveUserPreferences({ pageSize });
  }, [pageSize]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    saveUserPreferences({ theme: isDarkMode ? 'dark' : 'light' });
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Reset session (30 minutes from now)
  const resetSession = useCallback(() => {
    const expiryTime = Date.now() + (30 * 60 * 1000); // 30 minutes
    setSessionExpiryTime(expiryTime);
    localStorage.setItem('sessionExpiryTime', expiryTime.toString());
  }, []);

  // Update time remaining every second (only when page is visible)
  useEffect(() => {
    if (!sessionExpiryTime) return;

    const updateTimeRemaining = () => {
      // Only update if page is visible
      if (document.hidden) return;
      
      const now = Date.now();
      const remaining = sessionExpiryTime - now;

      if (remaining <= 0) {
        setTimeRemaining('Session expired');
        setSessionExpiryTime(null);
        localStorage.removeItem('sessionExpiryTime');
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`Session expires in ${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`Session expires in ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`Session expires in ${seconds}s`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    // Update immediately when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTimeRemaining();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionExpiryTime]);

  const contextValue = useMemo(() => ({
    pageSize,
    setPageSize,
    isDarkMode,
    toggleTheme,
    sessionExpiryTime,
    timeRemaining,
    resetSession,
  }), [pageSize, isDarkMode, toggleTheme, sessionExpiryTime, timeRemaining, resetSession]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
