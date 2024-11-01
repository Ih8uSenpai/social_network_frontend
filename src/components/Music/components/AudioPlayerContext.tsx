// AudioPlayerContext.js
import React, {createContext, useContext, useState, useRef, useEffect, useCallback} from 'react';
import {Track} from "./TrackList";

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({children, selectedTrack, setSelectedTrack}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [volume, setVolume] = useState(30);

    const [duration, setDuration] = useState(0);

    const audioRef = useRef(new Audio());
    const [volumeOff, setVolumeOff] = useState(30);
    const [isTrackEnded, setIsTrackEnded] = useState(false);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentAlbum, setCurrentAlbum] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [activeTrackId, setActiveTrackId] = useState<number | null>(null); // Идентификатор активного трека

    const setTrack = (track) => {
        if (currentTrack !== track) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setCurrentTrack(track);
            setSelectedTrack(track);
            setCurrentIndex(currentAlbum.indexOf(track));
            setActiveTrackId(track?.id);
            audioRef.current.src = track?.url;
            setIsTrackEnded(false);
            if (isPlaying) audioRef.current.play();
        }
    };



    const handleTrackEnded = () => {
        setIsTrackEnded(true);
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;

            if (nextIndex < currentAlbum.length) {
                setTrack(currentAlbum[nextIndex]);
                return nextIndex;
            } else {
                audioRef.current.pause();
                setCurrentTrack(currentAlbum[0]);
                setSelectedTrack(currentAlbum[0]);
                setCurrentIndex(currentAlbum.indexOf(currentAlbum[0]));
                setActiveTrackId(currentAlbum[0]?.id);
                audioRef.current.src = currentAlbum[0]?.url;

                setIsTrackEnded(false);
                return 0;
            }
        });



    };

    const handleSkipPrev = () => {

        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;

            if (nextIndex >= 0) {
                setTrack(currentAlbum[nextIndex]);
                return nextIndex;
            }
        });
    };




    useEffect(() => {

        const handleLoadedMetadata = () => {
            setDuration(audioRef.current.duration);
        };

        audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, []);


    useEffect(() => {
        const audio = audioRef.current;

        audio.addEventListener('ended', handleTrackEnded);

        return () => {
            audio.removeEventListener('ended', handleTrackEnded);
        };
    }, [currentIndex, isPlaying, currentAlbum, currentTrack]);

    useEffect(() => {
        if (audioRef.current.src && isPlaying) {
            audioRef.current.play().catch((error) => {
                console.error('Error while playing the track:', error);
            });
        }
    }, [currentTrack]);

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
        setIsTrackEnded(false); // Сбросим флаг завершения трека при повторном воспроизведении
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
            setIsTrackEnded(false); // Сбросим флаг завершения трека при перемотке
        }
    };

    return (
        <AudioPlayerContext.Provider value={{
            isPlaying,
            togglePlayPause,
            currentTrack,
            setCurrentTrack,
            setTrack,
            volume,
            handleVolumeChange,
            duration,
            handleProgressChange,
            volumeOff,
            setVolumeOff,
            setVolume,
            isTrackEnded,
            handleTrackEnded,
            handleSkipPrev,
            tracks,
            setTracks,
            activeTrackId,
            setActiveTrackId,
            currentAlbum,
            setCurrentAlbum,
            audioRef,
            currentIndex,
            setCurrentIndex,
            setIsTrackEnded
        }}>
            {children}
            <audio ref={audioRef} hidden/>
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
