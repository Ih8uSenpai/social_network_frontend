import React, {useState, useEffect, useRef} from 'react';
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

export const TrackPlayer: React.FC<{ selectedTrack } & { isVisible } & { setIsVisible }> = ({ selectedTrack, isVisible, setIsVisible}) => {
    // Определение состояний
    const {
        isPlaying,
        togglePlayPause,
        currentTrack,
        volume,
        handleVolumeChange,
        duration,
        handleProgressChange,
        setTrack,
        volumeOff,
        setVolumeOff,
        setVolume,
        isTrackEnded,
        handleTrackEnded,
        handleSkipPrev,
        tracks,
        setTracks,
        audioRef
    } = useAudioPlayer();
    const [isCompact, setIsCompact] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackProgress, setPlaybackProgress] = useState(0);

    useEffect(() => {
        const handleTimeUpdate = () => {
            setCurrentTime(audioRef.current.currentTime);
            setPlaybackProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [audioRef]);

    useEffect(() => {
        if (selectedTrack) {
            setTrack(selectedTrack);
        }
    }, [selectedTrack]);


    if (!isVisible) return null;

    return (
        <ThemeProvider theme={darkTheme}>


            {!isCompact &&
                <Paper elevation={4} sx={{
                    padding: 2,
                    margin: 'auto',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'black',
                    marginBottom: 2,
                    borderRadius: 5,
                    border:'1px solid grey',
                    display:'flex',
                    alignItems:'center'
                }}>

                    <IconButton onClick={() => setIsCompact(true)}
                                style={{position: "absolute", top: -40, right: 30, color: '#999'}}>
                        <MoreHorizIcon/>
                    </IconButton>
                    <IconButton>
                        <SkipPreviousIcon  onClick={() =>
                        {
                            handleSkipPrev();
                            setPlaybackProgress(0);
                        }}/>
                    </IconButton>
                    <IconButton onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <IconButton>
                        <SkipNextIcon onClick={() =>
                        {
                            handleTrackEnded();
                            setPlaybackProgress(0);
                        }}/>
                    </IconButton>
                    <img src={currentTrack?.icon_url || defaultMusicIcon} alt="Track icon"
                         style={{height: 72, width: 72, objectFit: 'cover', marginLeft: '16px'}}/>
                    <Box flex={1} display="flex" alignItems="center" marginLeft={2} flexDirection={"column"}
                         height={"72px"} width={400}>
                        <div style={{display: "flex", width: "100%"}}>
                            <ListItemText
                                primary={currentTrack?.title || selectedTrack.title}
                                secondary={currentTrack?.artist || selectedTrack.artist}
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
                </Paper>
            }
            {isCompact && (
                <Box display="flex" alignItems="center" padding={1} bgcolor={"rgba(0,0,0,0.3)"} borderRadius={5}
                     border={1}
                     borderColor={"gray"} width={250}>
                    <IconButton onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon/> : <PlayArrowIcon/>}
                    </IconButton>
                    <Typography variant="caption" color="textSecondary" className="marquee" marginLeft={1}>
                        <span>{currentTrack?.title || selectedTrack.title} / {currentTrack?.artist || selectedTrack.artist}</span>
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
