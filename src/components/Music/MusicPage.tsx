import React, {useState} from "react";
import TrackList, {Track} from "./TrackList";
import {TrackPlayer} from "./TrackPlayer";
import styles from "../new_design/styles/UserProfile.module.css";
import NavigationList from "../common/navigationList";
import {MusicNavigationPanel} from "./MusicNavigationPanel";
// @ts-ignore
import video from "../resources/videos/bg3.mp4";
import {Paper} from "@mui/material";

interface MusicPageProps {
    OnSectionChange;
    section;
    token: string;
}

export const MusicPage: React.FC = () => {
    const token = localStorage.getItem('authToken');
    const track: Track = {
        artist: "artist1",
        icon_url: "http://localhost:8080/uploads/1709513768509_blob",
        id: 0,
        url: "http://localhost:8080/uploads/K_DA,%20Madison%20Beer%20feat.%20Kim%20Petras,%20League%20of%20Legends%20-%20VILLAIN.mp3",
        title: "title1"
    }
    const [activeSection, setActiveSection] = useState('music_main');
    const [search, setSearch] = useState('')
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    return (

        <>
            <div>
                {selectedTrack && (
                    <TrackPlayer track={selectedTrack} selectedTrack={selectedTrack} isVisible={true}
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
                    <form onSubmit={handleSearch} className="music-search">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                        />
                    </form>
                </Paper>
                <TrackList token={token} OnSectionChange={handleSectionChange} section={activeSection}
                           onSelectTrack={setSelectedTrack} isProfilePage={false} setIsVisible={() => {
                }}/>
            </div>
        </>

    );
};
