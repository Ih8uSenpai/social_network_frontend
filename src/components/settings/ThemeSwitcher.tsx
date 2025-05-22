import React from "react";
import "./styles/ThemeSwitcherStyles.css";
import {useAppTheme} from "../../features/theme/useAppTheme";

const ThemeSwitcher: React.FC = () => {
    const { isDarkMode, toggleTheme } = useAppTheme();

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
