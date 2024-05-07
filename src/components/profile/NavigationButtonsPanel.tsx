import React, {useEffect, useRef, useState} from 'react';
import './styles/NavigationButtonsPanel.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../messages/Types";



interface NavigationButtonsPanelProps {
    onSectionChange: (section: string) => void;
    section: string;
}

export const NavigationButtonsPanel: React.FC<NavigationButtonsPanelProps> = ({onSectionChange, section}) => {


    return (
        <div className="navigation-panel">
            <ul>
                <li className={section === "statistics" ? "active" : ""} onClick={() => onSectionChange("statistics")}>Statistics</li>
                <li className={section === "photo" ? "active" : ""} onClick={() => onSectionChange("photo")}>Photo</li>
                <li className={section === "music" ? "active" : ""} onClick={() => onSectionChange("music")}>Music</li>
            </ul>
        </div>
    );
};