import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {List, ListItem, ListItemText, ListItemIcon, Avatar, Box, Container, Paper} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import {MusicNavigationPanel} from "./MusicNavigationPanel";
import {defaultMusicIcon} from "../../utils/Constants";
import Button from "@mui/material/Button";
import {addTrack, createPlaylist, deleteTrack} from "../service/TrackService";
import {useAudioPlayer} from "./AudioPlayerContext";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';
import {useParams} from "react-router-dom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import '../styles/Style.css'
import {TrackIcon} from "./TrackIcon";
import {TrackView} from "./TrackView";

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
    tracks;
    setTracks;
    selectedTracks;
}


const TrackList: React.FC<TrackListProps & { onSelectTrack: (track: Track) => void }> = ({
                                                                                             OnSectionChange,
                                                                                             section,
                                                                                             token,
                                                                                             onSelectTrack,
                                                                                             isProfilePage,
                                                                                             setIsVisible,
                                                                                             tracks,
                                                                                             setTracks,
                                                                                             selectedTracks
                                                                                         }) => {
    const [myTracks, setMyTracks] = useState<Track[]>([]);
    const {
        isPlaying,
        currentTrack,
        setActiveTrackId,
        activeTrackId,
        setCurrentAlbum,
        currentAlbum,
        togglePlayPause
    } = useAudioPlayer();
    const {userId} = useParams();

    const fetchTracks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            response.data.map(track => {
                track.url = `${process.env.REACT_APP_STATIC_URL}/` + track.url;
                if (track.icon_url)
                    track.icon_url = `${process.env.REACT_APP_STATIC_URL}/` + track.icon_url;
            });
            setTracks(response.data);
            if (!currentTrack && response.data.length > 0 && isPlaying == false) {
                onSelectTrack(response.data[0]);
                setIsVisible(true);
                setActiveTrackId(response.data[0].id);
                if (currentAlbum?.length == 0)
                    setCurrentAlbum(response.data);
            }
            if (isPlaying) {
                onSelectTrack(currentTrack);
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    };

    async function fetchMyPlaylist(): Promise<Track[]> {

        const param = userId ? userId : "my";
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/playlists/${param}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            response.data.map(track => {
                track.url = `${process.env.REACT_APP_BACK_BASE_URL}/` + track.url;
                if (track.icon_url)
                    track.icon_url = `${process.env.REACT_APP_BACK_BASE_URL}/` + track.icon_url;
            });

            setMyTracks(response.data);
            if (!currentTrack && response.data.length > 0 && isPlaying == false) {
                onSelectTrack(response.data[0]);
                setIsVisible(true);
                setActiveTrackId(response.data[0].id);
                setCurrentAlbum(response.data);
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    }

    useEffect(() => {
        fetchTracks();
        fetchMyPlaylist();
    }, []);

    async function addTracktoMyPlaylist(track: Track) {
        createPlaylist("@me", "@me", token);
        addTrack(0, track, token).then((value) => fetchMyPlaylist());
    }

    async function deleteTrackFromMyPlaylist(track: Track) {
        deleteTrack(0, track, token).then((value) => fetchMyPlaylist());
    }

    return (
        section == "music_my_music" && myTracks.length == 0 ?
            <Box sx={{width: "100%", textAlign: "center", color: '#999', marginTop: 5, marginBottom: 5}}>This playlist
                is empty :(</Box>
            :
            section == "post_tracks" && selectedTracks.length > 0 ? selectedTracks.map((track) => (
                    <TrackView key={track.id} activeTrackId={activeTrackId} track={track} onClick={() => {
                        onSelectTrack(track);
                        setCurrentAlbum(selectedTracks);
                        setIsVisible(true);
                        setActiveTrackId(track.id);
                        if (!isPlaying)
                            togglePlayPause();
                    }} profilePage={isProfilePage} onClick1={() => deleteTrackFromMyPlaylist(track)}/>
                ))
                :
                section == "profile_my_music" && myTracks.length > 0 ? myTracks.map((track) => (
                        <TrackView key={track.id} activeTrackId={activeTrackId} track={track} onClick={() => {
                            onSelectTrack(track);
                            setCurrentAlbum(myTracks);
                            setIsVisible(true);
                            setActiveTrackId(track.id);
                            if (!isPlaying)
                                togglePlayPause();
                        }} profilePage={isProfilePage} onClick1={() => deleteTrackFromMyPlaylist(track)}/>
                    ))
                    :
                    <Paper elevation={4} sx={{
                        padding: 2,
                        margin: 'auto',
                        background: 'var(--background-color3)',
                        color: 'var(--text-color4)',
                        marginBottom: 2,
                        borderRadius: 5,
                        border: '1px solid grey'
                    }}>
                        <List sx={{width: '100%', bgcolor: 'transparent'}}>
                            {section == "music_main" && tracks.map((track) => (
                                <ListItem
                                    key={track.id}
                                    alignItems="flex-start"
                                    sx={{width: '100%', cursor: 'pointer'}}
                                    className={activeTrackId === track.id ? "active" : ""}
                                    onClick={() => {
                                        onSelectTrack(track);
                                        setCurrentAlbum(tracks);
                                        setIsVisible(true);
                                        setActiveTrackId(track.id);
                                        if (!isPlaying)
                                            togglePlayPause();
                                    }}>
                                    <TrackIcon track={track}/>
                                    <ListItemText
                                        primary={track.title}
                                        secondary={track.artist}
                                        sx={{color: 'text.primary', flexGrow: 1}}
                                    />
                                    <Button onClick={() => addTracktoMyPlaylist(track)}><PlaylistAddIcon/></Button>
                                </ListItem>
                            ))}

                            {section == "music_my_music" && myTracks.length > 0 && myTracks.map((track) => (
                                <TrackView key={track.id} activeTrackId={activeTrackId} track={track} onClick={() => {
                                    onSelectTrack(track);
                                    setCurrentAlbum(myTracks);
                                    setIsVisible(true);
                                    setActiveTrackId(track.id);
                                    if (!isPlaying)
                                        togglePlayPause();
                                }} profilePage={isProfilePage} onClick1={() => deleteTrackFromMyPlaylist(track)}/>
                            ))}

                            {section == "music_recommendations" &&
                                <Box sx={{
                                    width: "100%",
                                    textAlign: "center",
                                    color: '#999',
                                    marginTop: 5,
                                    marginBottom: 5
                                }}>Recommendations
                                    will be available in the future!</Box>
                            }

                            {section == "post_creator_preview" && selectedTracks.length > 0 && selectedTracks.map((track) => (
                                <TrackView key={track.id} activeTrackId={activeTrackId} track={track} onClick={() => {
                                    onSelectTrack(track);
                                    setCurrentAlbum(selectedTracks);
                                    setIsVisible(true);
                                    setActiveTrackId(track.id);
                                    if (!isPlaying)
                                        togglePlayPause();
                                }} profilePage={isProfilePage} onClick1={() => deleteTrackFromMyPlaylist(track)}/>
                            ))}


                        </List>
                    </Paper>
    );
};
export default TrackList;
