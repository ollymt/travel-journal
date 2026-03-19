import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Use the system default as the initial state
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === "dark");

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Define your color palettes
  const theme = {
    background: isDarkMode ? "#392E48" : "#DAC9F2",
    text: isDarkMode ? "#DAC9F2" : "#392E48",
    textSecondary: isDarkMode ? "#B1A0C8" : "#6F618C",
    card: isDarkMode ? "#333333" : "#eeeeee",
    primary: isDarkMode ? "#D8C3E0" : "#4F3673",
    primaryText: isDarkMode ? "#4F3673" : "#DAC9F2",
    inactive: isDarkMode ? "#6F618C" : "#6F618C",
    accent: isDarkMode ? "#AE7CB7" : "#8451A6", // Your brand color
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
