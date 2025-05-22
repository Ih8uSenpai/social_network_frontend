import React, { useEffect, useMemo, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { lightTheme, darkTheme } from "./Theme";

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const mode = useSelector((state: RootState) => state.theme.mode);
    const isDarkMode = mode === "dark";

    useEffect(() => {
        document.documentElement.classList.toggle("dark-theme", isDarkMode);
    }, [isDarkMode]);

    const theme: Theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
