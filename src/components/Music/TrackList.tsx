import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {List, ListItem, ListItemText, ListItemIcon, Avatar, Box, Container, Paper} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import {MusicNavigationPanel} from "./MusicNavigationPanel";
import {defaultMusicIcon} from "../utils/Constants";
import Button from "@mui/material/Button";
import {addTrack, createPlaylist, deleteTrack} from "./service/TrackService";
import {useAudioPlayer} from "./AudioPlayerContext";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';
import {useParams} from "react-router-dom";

export interface Track {
    id: number;
    title: string;
    artist: string;
    url: string;
    icon_url?: string;
}

interface TrackListProps {
    OnSectionChange;
    section;
    token: string;
    isProfilePage: boolean;
    setIsVisible;
}

const TrackList: React.FC<TrackListProps & { onSelectTrack: (track: Track) => void }> = ({
                                                                                             OnSectionChange,
                                                                                             section,
                                                                                             token,
                                                                                             onSelectTrack,
                                                                                             isProfilePage,
                                                                                             setIsVisible
                                                                                         }) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [myTracks, setMyTracks] = useState<Track[]>([]);
    const [activeTrackId, setActiveTrackId] = useState<number | null>(null); // Идентификатор активного трека
    const {isPlaying, currentTrack} = useAudioPlayer();
    const {userId} = useParams();

    const fetchTracks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tracks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            response.data.map(track => {
                track.url = "http://localhost:8080/" + track.url;
                if (track.icon_url)
                    track.icon_url = "http://localhost:8080/" + track.icon_url;
            });
            setTracks(response.data);
            if (response.data.length > 0 && isPlaying == false) {
                onSelectTrack(response.data[0]);
                setIsVisible(true);
                setActiveTrackId(response.data[0].id); // Установка активного трека по умолчанию
            }
            if (isPlaying){
                onSelectTrack(currentTrack);
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    };

    async function fetchMyPlaylist(): Promise<Track[]> {

        const param = userId ? userId : "my";
        try {
            const response = await axios.get(`http://localhost:8080/api/playlists/${param}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            response.data.map(track => {
                track.url = "http://localhost:8080/" + track.url;
                if (track.icon_url)
                    track.icon_url = "http://localhost:8080/" + track.icon_url;
            });

            setMyTracks(response.data);
            if (response.data.length > 0 && isPlaying == false) {
                onSelectTrack(response.data[0]);
                setIsVisible(true);
                setActiveTrackId(response.data[0].id); // Установка активного трека по умолчанию
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    };
    useEffect(() => {
        fetchTracks();
        fetchMyPlaylist();
    }, [token, onSelectTrack]);

    async function addTracktoMyPlaylist(track: Track) {
        createPlaylist("@me", "@me", token);
        addTrack(0, track, token).then((value) => fetchMyPlaylist());
    }

    async function deleteTrackFromMyPlaylist(track: Track) {
        deleteTrack(0, track, token).then((value) => fetchMyPlaylist());
    }

    return (
        <Paper elevation={4} sx={{padding: 2, margin: 'auto', bgcolor: 'rgba(0, 0, 0, 0.6)', color:'black', marginBottom:2, borderRadius:5, border:'1px solid grey'  }}>
        <List sx={{width: '100%', bgcolor: 'transparent'}}>
            {section == "music_main" && tracks.map((track) => (
                <ListItem
                    key={track.id}
                    alignItems="flex-start"
                    sx={{width: '100%'}}
                    className={activeTrackId === track.id ? "active" : ""}
                    onClick={() => {
                        onSelectTrack(track);
                        setIsVisible(true);
                        setActiveTrackId(track.id); // Обновление активного трека
                    }}>
                    <ListItemIcon>
                        <img src={track.icon_url || defaultMusicIcon}
                             style={{height: 50, width: 50, objectFit: "cover", marginRight: 10}}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={track.title}
                        secondary={track.artist}
                        sx={{color: 'text.primary', flexGrow: 1}}
                    />
                    <Button onClick={() => addTracktoMyPlaylist(track)}><PlaylistAddIcon/></Button>
                </ListItem>
            ))}

            {section == "music_my_music" && myTracks.length > 0 && myTracks.map((track) => (
                <ListItem
                    key={track.id}
                    alignItems="flex-start"
                    sx={{width: '100%'}}
                    className={activeTrackId === track.id ? "active" : ""}
                    onClick={() => {
                        onSelectTrack(track);
                        setIsVisible(true);
                        setActiveTrackId(track.id); // Обновление активного трека
                    }}>
                    <ListItemIcon>
                        <img src={track.icon_url || defaultMusicIcon}
                             style={{height: 50, width: 50, objectFit: "cover", marginRight: 10}}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={track.title}
                        secondary={track.artist}
                        sx={{color: 'text.primary', flexGrow: 1}}
                    />
                    {!isProfilePage &&
                        <Button onClick={() => deleteTrackFromMyPlaylist(track)} sx={{background:"transparent"}}><CloseIcon/></Button>}
                </ListItem>
            ))}

            {section == "music_my_music" && myTracks.length == 0 &&
                <Box sx={{width: "100%", textAlign: "center", color: '#999', marginTop: 5, marginBottom: 5}}>This playlist is empty :(</Box>
            }

            {section == "music_recommendations" &&
                <Box sx={{width: "100%", textAlign: "center", color: '#999', marginTop: 5, marginBottom: 5}}>Recommendations will be available in the future!</Box>
            }
        </List>
        </Paper>
    );
};
export default TrackList;
