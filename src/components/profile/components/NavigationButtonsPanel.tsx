import React, {useEffect, useRef, useState} from 'react';
import '../styles/NavigationButtonsPanel.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../../utils/Types";


interface NavigationButtonsPanelProps {
    onSectionChange: (section: string) => void;
    section: string;
}

export const NavigationButtonsPanel: React.FC<NavigationButtonsPanelProps> = ({onSectionChange, section}) => {


    return (
        <div className="navigation-panel">
            <ul>
                <li className={section === "statistics" ? "active" : ""} onClick={() => onSectionChange("statistics")}
                    style={{cursor: "pointer"}}>Statistics
                </li>
                <li className={section === "photo" ? "active" : ""} onClick={() => onSectionChange("photo")}
                    style={{cursor: "pointer"}}>Photo
                </li>
                <li className={section === "music" ? "active" : ""} onClick={() => onSectionChange("music")}
                    style={{cursor: "pointer"}}>Music
                </li>
            </ul>
        </div>
    );
};