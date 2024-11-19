// ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./Theme";

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            localStorage.setItem("theme", newTheme ? "dark" : "light");
            return newTheme;
        });
    };

    const theme: Theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark-theme", isDarkMode);
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
