import React, {useEffect, useRef, useState} from 'react';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../messages/Types";
import "./Style.css"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {TrackUpload} from "./TrackUpload";
import {Box, Modal} from "@mui/material";


interface NavigationButtonsPanelProps {
    onSectionChange: (section: string) => void;
    section: string;
    token: string;
}

export const MusicNavigationPanel: React.FC<NavigationButtonsPanelProps> = ({onSectionChange, section, token}) => {
    const [uploadOpen, setUploadOpen] = useState(false);


    return (
        <div className="music-navigation-panel"
             style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", margin: 0}}>
            <ul>
                <li className={section === "music_main" ? "active" : ""}
                    onClick={() => onSectionChange("music_main")}>Main
                </li>
                <li className={section === "music_my_music" ? "active" : ""}
                    onClick={() => onSectionChange("music_my_music")}>My music
                </li>
                <li className={section === "music_recommendations" ? "active" : ""}
                    onClick={() => onSectionChange("music_recommendations")}>Recommendations
                </li>
            </ul>

            <FileUploadIcon style={{marginTop: 35, marginRight: 20, color: '#777777'}} className={"additional-buttons"}
                            onClick={() => {
                                if (uploadOpen)
                                    setUploadOpen(false);
                                else
                                    setUploadOpen(true);
                            }}/>

            <Modal onClose={() => setUploadOpen(false)} open={uploadOpen} style={{
                margin: "auto auto",
                width: 550,
                height: 400,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div style={{display:"flex", justifyContent:"center", flexDirection:"column"}}>
                    <h2 style={{color:"#ddd"}}>Upload a new track</h2>
                    <TrackUpload token={token}/>
                </div>
            </Modal>
        </div>
    );
};