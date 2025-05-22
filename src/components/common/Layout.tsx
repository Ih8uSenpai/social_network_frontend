import React, {useEffect} from 'react';
import {Box} from '@mui/material';
import styles from "../profile/styles/UserProfile.module.css";
import {TrackPlayer2} from "../Music/components/TrackPlayer2";
import NavigationList from "./navigationList";
// @ts-ignore
import {fetchFollowers} from "../followers/Followers";
import {useProfile} from "../profile/hooks/useProfile";
import {useAppTheme} from "../../features/theme/useAppTheme";

const Layout = ({children, selectedTrack, isVisible, setIsVisible, isMusicPage, setIsMusicPage}) => {
    const currentUserId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('authToken');
    const {profile, fetchProfile} = useProfile(currentUserId, currentUserId, token, false);
    const { isDarkMode, toggleTheme } = useAppTheme();
    const video = isDarkMode ? "/video/bg1.mp4" : "/video/bg4.mp4";
    useEffect(() => {
        setIsMusicPage(false);
        fetchProfile();
    }, []);

    return (
        <div className={styles.windowWrapper}>
            <div className="video-background" style={{filter: "blur(7px)"}}>
                <video src={video} autoPlay loop muted/>
            </div>
            {isMusicPage == false &&
                <Box marginTop={3} marginBottom={3} position="fixed" bottom={0} right={0} zIndex={999}>
                    {selectedTrack &&
                        <TrackPlayer2 isVisible={isVisible}
                                      setIsVisible={setIsVisible} selectedTrack={selectedTrack}/>}
                </Box>}
            <div style={{position: "relative"}}>
                <NavigationList setIsMusicPage={setIsMusicPage} profile={profile}/>
            </div>
            <div className={styles.userProfile} style={{backgroundColor: "var(--background-color)"}}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
