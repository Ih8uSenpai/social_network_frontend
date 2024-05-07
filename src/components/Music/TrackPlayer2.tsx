import React, {useState} from 'react';
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
import {darkTheme} from "../profile/DarkTheme";
import {Slider1} from "../common/Slider1";
import {VolumeOff} from "@mui/icons-material";
import {defaultMusicIcon} from "../utils/Constants";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import {useAudioPlayer} from "./AudioPlayerContext";

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const TrackPlayer2: React.FC<{
    track: {
        id: number;
        title: string;
        artist: string;
        url: string;
        icon_url?: string;
    }
} & { selectedTrack } & { isVisible } & { setIsVisible }> = ({track, selectedTrack, isVisible, setIsVisible}) => {
    // Определение состояний
    const {
        isPlaying,
        togglePlayPause,
        volume,
        handleVolumeChange,
        currentTime,
        duration,
        playbackProgress,
        handleProgressChange,
        setTrack,
        volumeOff,
        setVolumeOff,
        setVolume
    } = useAudioPlayer();
    const [isCompact, setIsCompact] = useState(false);

    React.useEffect(() => {
        if (track) {
            setTrack(track);
        }
    }, [track]);

    if (!isVisible) return null;

    return (
        <ThemeProvider theme={darkTheme}>


            {!isCompact &&
                <Box display="flex" alignItems="center" padding={2} bgcolor={'#4b4c57'} borderRadius={5}
                     border={1}
                     borderColor={"gray"} boxShadow={20}>
                    <IconButton onClick={() => setIsCompact(true)}
                                style={{position: "absolute", top: -40, right: 30, color: '#999'}}>
                        <MoreHorizIcon/>
                    </IconButton>
                    <IconButton>
                        <SkipPreviousIcon/>
                    </IconButton>
                    <IconButton onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon/> : <PlayArrowIcon/>}
                    </IconButton>
                    <IconButton>
                        <SkipNextIcon/>
                    </IconButton>
                    <img src={track.icon_url || defaultMusicIcon} alt="Track icon"
                         style={{height: 72, width: 72, objectFit: 'cover', marginLeft: '16px'}}/>
                    <Box flex={1} display="flex" alignItems="center" marginLeft={2} flexDirection={"column"}
                         height={"72px"} width={400}>
                        <div style={{display: "flex", width: "100%"}}>
                            <ListItemText
                                primary={track.title}
                                secondary={track.artist}
                                sx={{color: 'text.primary', flexGrow: 1}}
                                style={{alignSelf: "self-start"}}
                            />
                            <Typography variant="caption" color="textSecondary" alignSelf={"flex-end"}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </Typography>
                        </div>
                        <Slider1 handleProgressChange={handleProgressChange} playbackProgress={playbackProgress}/>

                    </Box>

                    <Box display="flex" alignItems="center" marginLeft={1}>
                        {(volumeOff > 0 && volume > 0) &&
                            (<VolumeUpIcon
                                color={"action"}
                                onClick={() => setVolumeOff(0)}
                                sx={{
                                    color: 'action',
                                    '&:hover': {
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                    },
                                    '&:active': {
                                        color: 'primary.dark',
                                    },
                                }}
                            />)}
                        {(volume === 0 || volumeOff === 0) &&
                            (<VolumeOff
                                color={"action"}
                                onClick={() => setVolumeOff(volume)}
                                sx={{
                                    zIndex: 2,
                                    color: 'action',
                                    '&:hover': {
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                    },
                                    '&:active': {
                                        color: 'primary.dark',
                                    },
                                }}
                            />)}
                        <Slider1 playbackProgress={volumeOff == 0 ? 0 : volume}
                                 handleProgressChange={handleVolumeChange}
                                 width={"100px"}/>
                    </Box>

                    <IconButton onClick={() => setIsVisible(false)}
                                style={{position: "absolute", top: -40, right: 0, color: '#999'}}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            }
            {isCompact && (
                <Box display="flex" alignItems="center" padding={1} bgcolor={"rgba(0,0,0,0.3)"} borderRadius={5}
                     border={1}
                     borderColor={"gray"} width={250}>
                    <IconButton onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon/> : <PlayArrowIcon/>}
                    </IconButton>
                    <Typography variant="caption" color="textSecondary" className="marquee" marginLeft={1}>
                        <span>{track.title} / {track.artist}</span>
                    </Typography>

                    <IconButton onClick={() => setIsCompact(false)} style={{marginLeft: "auto", color: '#999'}}>
                        <MoreHorizIcon/>
                    </IconButton>
                    <IconButton onClick={() => setIsVisible(false)} style={{color: '#999'}}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            )}
        </ThemeProvider>
    );
};
