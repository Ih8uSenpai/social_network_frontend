import React, {useEffect, useState} from "react";
import {useAudioPlayer} from "./AudioPlayerContext";
import {Box, IconButton, ListItemIcon, ListItemText, Paper, ThemeProvider, Typography} from "@mui/material";
import {darkTheme} from "../../profile/themes/DarkTheme";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {defaultMusicIcon} from "../../utils/Constants";
import {Slider1} from "../../common/Slider1";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {VolumeOff} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

export const TrackIcon: React.FC<{ track }> = ({ track}) => {
    const {isPlaying, activeTrackId, togglePlayPause} = useAudioPlayer();

    return (
        <ListItemIcon style={{position: "relative"}}
                      className={track.id == activeTrackId ? 'active-track-icon' : ''}>
            <img src={track.icon_url || defaultMusicIcon}
                 style={{
                     height: 50,
                     width: 50,
                     objectFit: "cover",
                     borderRadius:'3px',
                     marginRight:'10px',
                     position: "relative"
                 }}/>
            {track.id == activeTrackId &&
                <>
                    {isPlaying ?
                        <PauseIcon
                            onClick={togglePlayPause}
                            style={{
                                color: "#555",
                                background:"white",
                                borderRadius:'50%',
                                border:'5px solid white',
                                zIndex:2,
                                height: 25, width: 25, position: "absolute",
                                left: 0, right: 10, marginLeft: "auto", marginRight: "auto",
                                top: 0, bottom: 0, marginTop: "auto", marginBottom: "auto"
                            }}/>
                        :
                        <PlayArrowIcon
                            onClick={togglePlayPause}
                            style={{
                                color: "#555",
                                background:"white",
                                borderRadius:'50%',
                                border:'5px solid white',
                                zIndex:2,
                                height: 25, width: 25, position: "absolute",
                                left: 0, right: 10, marginLeft: "auto", marginRight: "auto",
                                top: 0, bottom: 0, marginTop: "auto", marginBottom: "auto"
                            }}/>}
                </>
            }
        </ListItemIcon>
    );
};