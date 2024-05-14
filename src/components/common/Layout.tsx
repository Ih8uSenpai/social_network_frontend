import React, {useEffect} from 'react';
import {Box} from '@mui/material';
import styles from "../new_design/styles/UserProfile.module.css";
import {TrackPlayer2} from "../Music/TrackPlayer2";
import NavigationList from "./navigationList";
// @ts-ignore
import video from "../resources/videos/bg3.mp4";
import {fetchFollowers} from "../followers/Followers"; // Убедись, что пути и имена файлов указаны правильно

const Layout = ({children, selectedTrack, isVisible, setIsVisible, isMusicPage, setIsMusicPage}) => {

    useEffect(() => {
        setIsMusicPage(false);
    }, []);

    return (
        <div className={styles.windowWrapper}>
            <div className="video-background" style={{filter: "blur(7px)"}}>
                <video src={video} autoPlay loop muted/>
            </div>
            {isMusicPage == false && <Box marginTop={3} marginBottom={3} position="fixed" bottom={0} right={0} zIndex={999}>
                {selectedTrack &&
                    <TrackPlayer2 track={selectedTrack} selectedTrack={selectedTrack} isVisible={isVisible}
                                  setIsVisible={setIsVisible}/>}
            </Box>}
            <NavigationList setIsMusicPage={setIsMusicPage}/>
            <div className={styles.userProfile}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
