import React, {useState} from "react";
import TrackList, {Track} from "./components/TrackList";
import {TrackPlayer} from "./components/TrackPlayer";
import styles from "../profile/styles/UserProfile.module.css";
import NavigationList from "../common/navigationList";
import {MusicNavigationPanel} from "./components/MusicNavigationPanel";
// @ts-ignore
import video from "../resources/videos/bg3.mp4";
import {Paper} from "@mui/material";
import {useAudioPlayer} from "./components/AudioPlayerContext";
import axios from "axios";


export const MusicPage = ({selectedTrack, setSelectedTrack}) => {
    const token = localStorage.getItem('authToken');
    const [activeSection, setActiveSection] = useState('music_main');
    const [search, setSearch] = useState('')

    const {
        tracks,
        setTracks,
        setTrack,
        audioRef,
        currentAlbum,
        setActiveTrackId,
        setCurrentIndex,
        setIsTrackEnded,
        isPlaying,
        currentTrack,
        setCurrentTrack
    } = useAudioPlayer();



    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/api/tracks/search', {
                params: { query: search },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            response.data.map(track => {
                track.url = "http://localhost:8080/" + track.url;
                if (track.icon_url)
                    track.icon_url = "http://localhost:8080/" + track.icon_url;
            });
            setTracks(response.data);
        } catch (error) {
            console.error('Ошибка при поиске треков:', error);
        }
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    return (

        <>
            <div>
                {selectedTrack && (
                    <TrackPlayer selectedTrack={selectedTrack} isVisible={true}
                                 setIsVisible={() => {
                                 }}/>)}
                <Paper elevation={4} sx={{
                    padding: 2,
                    margin: 'auto',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'black',
                    marginBottom: 2,
                    borderRadius: 5,
                    border: '1px solid grey'
                }}>
                    <MusicNavigationPanel onSectionChange={handleSectionChange} section={activeSection}
                                          token={token}/>
                    <form onSubmit={handleSearch} className="messages-search"
                          style={{margin: 0, padding: 0, width: "100%"}}>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                        />
                    </form>
                </Paper>
                <TrackList token={token} OnSectionChange={handleSectionChange} section={activeSection}
                          onSelectTrack={setTrack} isProfilePage={false} setIsVisible={() => {
                }} setTracks={setTracks} tracks={tracks} selectedTracks={[]}/>
            </div>
        </>

    );
};
