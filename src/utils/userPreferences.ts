// src/utils/userPreferences.ts

export interface UserPreferences {
  theme: 'light' | 'dark';
  pageSize: number;
}

// Current implementation using localStorage
export const getUserPreferences = (): UserPreferences => {
  const theme = localStorage.getItem('bt-console-theme') === 'dark' ? 'dark' : 'light';
  const pageSize = parseInt(localStorage.getItem('bt-console-page-size') || '25', 10);
  
  return { theme, pageSize };
};

export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  if (preferences.theme !== undefined) {
    localStorage.setItem('bt-console-theme', preferences.theme);
  }
  if (preferences.pageSize !== undefined) {
    localStorage.setItem('bt-console-page-size', preferences.pageSize.toString());
  }
};

// Future DB implementation (commented out for now)
/*
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export const getUserPreferencesFromDB = async (userId: string): Promise<UserPreferences> => {
  try {
    const response = await axios.get(`${API_BASE}/user-preferences/${userId}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to load preferences from DB, using localStorage fallback');
    return getUserPreferences();
  }
};

export const saveUserPreferencesToDB = async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
  try {
    await axios.put(`${API_BASE}/user-preferences/${userId}`, preferences);
    // Also save to localStorage as backup
    saveUserPreferences(preferences);
  } catch (error) {
    console.warn('Failed to save preferences to DB, using localStorage fallback');
    saveUserPreferences(preferences);
  }
};
*/
