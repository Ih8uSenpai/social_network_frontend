import {Box, Grid, Paper} from '@mui/material';
import React, {useState} from 'react';
import {inspect} from "util";
import PostsFeed from "./PostsFeed";
import {UserProfileOptionalData} from "../profile/UserProfileOptionalData";
import {TrackPlayer} from "../Music/TrackPlayer";
import NavigationList from "../common/navigationList";
import {ProfileBanner} from "../profile/ProfileBanner";
import {AdditionalInfo} from "../profile/Additionalnfo";
import {NavigationButtonsPanel} from "../profile/NavigationButtonsPanel";
import UserInfoSection from "../profile/UserInfoSection";
import {PhotoSection} from "../profile/PhotoSection";
import TrackList, {Track} from "../Music/TrackList";
import PostCreator from "./postCreator";
import {PostData, ProfileData} from "../messages/Types";
import {NavigateFunction} from "react-router-dom";
import styles from "../new_design/styles/UserProfile.module.css"
// @ts-ignore
import video from '../resources/videos/bg3.mp4';
import {TrackPlayer2} from "../Music/TrackPlayer2";
import {NewsSidebar} from "./NewsSidebar";


interface NewsProps {

    profile: ProfileData;
    posts: PostData[];
    handlePostCreated;
    setPosts;
}

export const News: React.FC<NewsProps> = ({

                                              profile,
                                              posts,
                                              handlePostCreated,
                                              setPosts
                                          }) => {

    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [section, setSection] = useState("news");
    const handleSectionChange = (section: string) => {
        setSection(section);
    };

    return (
        <div style={{marginLeft: 10}}>

            <Grid container spacing={5} sx={{minWidth: "1200px"}}>
                <Grid item xs={7.4}>
                    <Box marginTop={2}>
                        <PostCreator profileId={profile.profileId} onPostCreated={handlePostCreated}/>
                    </Box>
                    <Box marginTop={2}>
                        <PostsFeed posts={posts} profileId={profile.profileId} setPosts={setPosts}/>
                    </Box>
                </Grid>

                <Grid item xs={4.4} marginTop={2}>
                    <NewsSidebar section={section} setSection={setSection} onSectionChange={handleSectionChange} setPosts={setPosts}/>
                </Grid>


            </Grid>
        </div>
    );
};
