import React, {useEffect, useState} from 'react';
import {
    Box,
    IconButton,
    Slider,
    Typography,
    styled,
    ThemeProvider,
    createTheme,
    ListItemText,
    Paper
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {darkTheme} from "../../profile/themes/DarkTheme";
import {Slider1} from "../../common/Slider1";
import {VolumeOff} from "@mui/icons-material";
import {defaultMusicIcon} from "../../utils/Constants";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import {useAudioPlayer} from "./AudioPlayerContext";

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const TrackPlayer2: React.FC<{ selectedTrack } & { isVisible } & { setIsVisible }> = ({
                                                                                                 selectedTrack,
                                                                                                 isVisible,
                                                                                                 setIsVisible
                                                                                             }) => {
    // Определение состояний
    const {
        isPlaying,
        togglePlayPause,
        currentTrack,
        setTrack,
        handleTrackEnded,
        handleSkipPrev,
    } = useAudioPlayer();
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        if (selectedTrack) {
            setTrack(selectedTrack);
        }
    }, [selectedTrack]);

    if (!isVisible) return null;

    return (
        <ThemeProvider theme={darkTheme}>

            <Box display="flex" alignItems="center" padding={1} bgcolor={"rgba(0,0,0,0.3)"} borderRadius={5}
                 border={1}
                 borderColor={"gray"} width={250} flexDirection={"column"} paddingBottom={2} paddingTop={2} textAlign={"center"}>
                <Box width={250} height={120} position={"relative"} display={"flex"} justifyContent={"center"}>
                    <img src={currentTrack?.icon_url || defaultMusicIcon} alt="Track icon"
                         style={{
                             height: 100,
                             width: 100,
                             objectFit: 'cover',
                             position: "absolute",
                             top: 0,
                             bottom: 0,
                             left: 0,
                             right: 0,
                             margin: "auto"
                         }}/>

                </Box>
                <span style={{color: "#CCC"}}>{currentTrack?.title}</span>
                <span style={{color: "#AAA"}}>{currentTrack?.artist}</span>
                <Box display={"flex"} width={200} justifyContent={'space-around'} height={'100%'}
                     alignItems={"center"}>
                    <IconButton style={{color: "#AAA"}}>
                        <SkipPreviousIcon onClick={handleSkipPrev}/>
                    </IconButton>
                    <IconButton onClick={togglePlayPause} style={{color: "#AAA"}}>
                        {isPlaying ? <PauseIcon/> :
                            <PlayArrowIcon/>}
                    </IconButton>
                    <IconButton style={{color: "#AAA"}}>
                        <SkipNextIcon onClick={handleTrackEnded}/>
                    </IconButton>
                </Box>
                <IconButton onClick={() => setIsVisible(false)}
                            style={{color: '#999', position: "absolute", top: 0, right: 0}}>
                    <CloseIcon/>
                </IconButton>
            </Box>
        </ThemeProvider>
    );
};
