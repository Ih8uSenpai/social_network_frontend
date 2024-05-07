// AudioPlayerContext.js
import React, {createContext, useContext, useState, useRef, useEffect} from 'react';

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({children}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(30);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const audioRef = useRef(new Audio());
    const [volumeOff, setVolumeOff] = useState(30);

    const setTrack = (track) => {
        if (currentTrack != track) {
            setCurrentTrack(track);
            audioRef.current.src = track.url;
            if (isPlaying) audioRef.current.play();
        }
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            setCurrentTime(audioRef.current.currentTime);
            setPlaybackProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        };

        const handleLoadedMetadata = () => {
            setDuration(audioRef.current.duration);
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volumeOff == 0 ? 0 : volume / 100;
        }
    }, [volume, volumeOff]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
        if (volumeOff != 0) {
            setVolume(newValue as number);
        } else {
            setVolume(newValue as number);
            setVolumeOff(30);
        }
    };


    const handleProgressChange = (_event: Event, newValue: number | number[]) => {
        const newProgress = newValue as number;
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = (audio.duration * newProgress) / 100;
            setPlaybackProgress(newProgress);
        }
    };

    return (
        <AudioPlayerContext.Provider value={{
            isPlaying, togglePlayPause, currentTrack, setTrack, volume, handleVolumeChange,
            currentTime, duration, playbackProgress, handleProgressChange, volumeOff, setVolumeOff, setVolume
        }}>
            {children}
            <audio ref={audioRef} hidden/>
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
