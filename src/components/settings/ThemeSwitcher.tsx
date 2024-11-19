import React from "react";
import { useTheme } from "../themes/ThemeContext";
import "./styles/ThemeSwitcherStyles.css"; // Добавим стили

const ThemeSwitcher: React.FC = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="theme-switcher-container">
            <button
                className={`theme-switcher-button ${isDarkMode ? "dark" : "light"}`}
                onClick={toggleTheme}
            >
                Переключить на {isDarkMode ? "светлую" : "тёмную"} тему
            </button>
        </div>
    );
};

export default ThemeSwitcher;
