import {Box, Grid, Paper} from '@mui/material';
import React, {useState} from 'react';
import {inspect} from "util";
import PostsFeed from "./components/PostsFeed";
import {UserProfileOptionalData} from "../profile/components/UserProfileOptionalData";
import {TrackPlayer} from "../Music/components/TrackPlayer";
import NavigationList from "../common/navigationList";
import {ProfileBanner} from "../profile/components/ProfileBanner";
import {AdditionalInfo} from "../profile/components/Additionalnfo";
import {NavigationButtonsPanel} from "../profile/components/NavigationButtonsPanel";
import UserInfoSection from "../profile/components/UserInfoSection";
import {PhotoSection} from "../profile/components/PhotoSection";
import TrackList, {Track} from "../Music/components/TrackList";
import PostCreator from "./components/postCreator";
import {PostData, ProfileData} from "../utils/Types";
import {NavigateFunction} from "react-router-dom";
import styles from "../profile/styles/UserProfile.module.css"
// @ts-ignore
import video from '../resources/videos/bg3.mp4';
import {TrackPlayer2} from "../Music/components/TrackPlayer2";
import {NewsSidebar} from "./components/NewsSidebar";


interface NewsProps {

    profile: ProfileData;
    posts: PostData[];
    handlePostCreated;
    setPosts;
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
}

export const News: React.FC<NewsProps> = ({

                                              profile,
                                              posts,
                                              handlePostCreated,
                                              setPosts,
                                              selectedTrack,
                                              setSelectedTrack,
                                              isVisible,
                                              setIsVisible
                                          }) => {

    const [section, setSection] = useState("news");
    const handleSectionChange = (section: string) => {
        setSection(section);
    };

    return (
        <div style={{marginLeft: 10}}>

            <Grid container spacing={5} sx={{minWidth: "1200px"}}>
                <Grid item xs={7.4}>
                    <Box marginTop={2}>
                        <PostCreator profile={profile} onPostCreated={handlePostCreated}
                                     selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}
                                     isVisible={isVisible} setIsVisible={setIsVisible}/>
                    </Box>
                    <Box marginTop={2}>
                        <PostsFeed posts={posts} profileId={profile.profileId} setPosts={setPosts}
                                   selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}
                                   setIsVisible={setIsVisible} isVisible={isVisible}/>
                    </Box>
                </Grid>

                <Grid item xs={4.4} marginTop={2}>
                    <NewsSidebar section={section} setSection={setSection} onSectionChange={handleSectionChange}
                                 setPosts={setPosts}/>
                </Grid>


            </Grid>
        </div>
    );
};
