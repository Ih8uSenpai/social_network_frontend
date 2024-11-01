import React, {useEffect, useState} from 'react';
import {Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import TrackList from "../../Music/components/TrackList";
import {useAudioPlayer} from "../../Music/components/AudioPlayerContext";

interface ChooseTrackMenuProps {
    showTrackMenu: boolean;
    setShowTrackMenu: (show: boolean) => void;
    token;
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
    onSaveTrack;
}

export const ChooseTrackMenu: React.FC<ChooseTrackMenuProps> = ({
                                                                    showTrackMenu,
                                                                    setShowTrackMenu,
                                                                    token,
                                                                    selectedTrack,
                                                                    setSelectedTrack,
                                                                    isVisible,
                                                                    setIsVisible,
                                                                    onSaveTrack
                                                                }) => {
    const [activeSection, setActiveSection] = useState('statistics');
    const {
        tracks,
        setTracks
    } = useAudioPlayer();
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    const handleClose = () => {
        setShowTrackMenu(false);
    };

    return (
        <div>
            <Dialog open={showTrackMenu} onClose={handleClose} maxWidth="lg">
                <DialogTitle>Choose Track</DialogTitle>
                <DialogContent>
                    <TrackList token={token} OnSectionChange={handleSectionChange}
                               section={"music_my_music"} onSelectTrack={setSelectedTrack}
                               isProfilePage={true} setIsVisible={setIsVisible}
                               tracks={tracks} setTracks={setTracks} selectedTracks={[]}/>
                </DialogContent>
                <Button onClick={onSaveTrack}>Save</Button>
                <Button onClick={handleClose}>Close</Button>
            </Dialog>
        </div>
    );
};
