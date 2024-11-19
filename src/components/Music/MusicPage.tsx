import React, {useState} from "react";
import TrackList, {Track} from "./components/TrackList";
import {TrackPlayer} from "./components/TrackPlayer";
import styles from "../profile/styles/UserProfile.module.css";
import NavigationList from "../common/navigationList";
import {MusicNavigationPanel} from "./components/MusicNavigationPanel";
// @ts-ignore
import {Paper} from "@mui/material";
import {useAudioPlayer} from "./components/AudioPlayerContext";
import axios from "../../config/axiosConfig";


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
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tracks/search`, {
                params: { query: search },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            response.data.map(track => {
                track.url = `${process.env.REACT_APP_BACK_BASE_URL}/` + track.url;
                if (track.icon_url)
                    track.icon_url = `${process.env.REACT_APP_BACK_BASE_URL}/` + track.icon_url;
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
            <div>
                {selectedTrack && (
                    <TrackPlayer selectedTrack={selectedTrack} isVisible={true}
                                 setIsVisible={() => {
                                 }}/>)}
                <Paper elevation={4} sx={{
                    padding: 2,
                    margin: 'auto',
                    background: 'var(--background-color3)',
                    color: 'var(--text-color)',
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
    );
};
