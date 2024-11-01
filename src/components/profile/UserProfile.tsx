import React, {useEffect, useState} from 'react';
import SocialPanel from './components/SocialPanel';
// Import other components as needed
import styles from "./styles/UserProfile.module.css";
import WidgetList from "./unused_components/WidgetList";
import {PostData, ProfileData} from "../utils/Types";
import {NavigateFunction} from "react-router-dom";
import {ProfileBanner} from "./components/ProfileBanner";
import {AdditionalInfo} from "./components/Additionalnfo";
import Header from "../common/header";
import NavigationList from "../common/navigationList";
import {NavigationButtonsPanel} from "./components/NavigationButtonsPanel";
import PostCreator from "../news/components/postCreator";
import PostsFeed from "../news/components/PostsFeed";
import {UserProfileOptionalData} from "./components/UserProfileOptionalData";
import UserInfoSection from "./components/UserInfoSection";
import {updateProfile} from "./service/ProfileService";
import {MusicPage} from "../Music/MusicPage";
import {CropAvatar} from "./components/CropAvatar";
import {Box, Grid, Paper} from "@mui/material";
import {PhotoSection} from "./components/PhotoSection";
import TrackList, {Track} from "../Music/components/TrackList";
import {TrackPlayer} from "../Music/components/TrackPlayer";
import {Followers} from "../followers/Followers";
// @ts-ignore
import video from "../resources/videos/bg3.mp4";
import {TrackPlayer2} from "../Music/components/TrackPlayer2";


interface ProfileProps {
    userId: string
    currentUserId: string;
    chatId: number;
    token: string;
    profile: ProfileData;
    isExisting: boolean;
    fetchProfile;
    navigate: NavigateFunction;
    isFollowing: boolean;
    handleFollowToggle;
    posts: PostData[];
    handlePostCreated;
    section: string;
    handleSectionChange: (section: string) => void;
    update: number;
    setUpdate;
    setPosts;
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
    tracks;
    setTracks;
}

const UserProfile: React.FC<ProfileProps> = ({
                                                 userId,
                                                 currentUserId,
                                                 chatId,
                                                 token,
                                                 profile,
                                                 isExisting,
                                                 fetchProfile,
                                                 navigate,
                                                 isFollowing,
                                                 handleFollowToggle,
                                                 posts,
                                                 handlePostCreated,
                                                 section,
                                                 handleSectionChange,
                                                 update,
                                                 setUpdate,
                                                 setPosts,
                                                 selectedTrack,
                                                 setSelectedTrack,
                                                 isVisible,
                                                 setIsVisible,
                                                 tracks,
                                                 setTracks
                                             }) => {


    return (

        <div style={{overflow: "auto", border: '1px solid transparent'}}>
            <ProfileBanner userId={userId} currentUserId={currentUserId}
                           profile={profile} navigate={navigate}
                           fetchProfile={fetchProfile}
                           token={token} isExisting={isExisting}
                           chatId={chatId} handleFollowToggle={handleFollowToggle}
                           isFollowing={isFollowing} height={"400px"}
            />
            <p style={{height: "130px", margin: "0"}}>
                <AdditionalInfo userId={userId} currentUserId={currentUserId}
                                profile={profile} navigate={navigate}
                                height={"100%"} width={"20%"}/>
            </p>

            <Grid container spacing={-2} marginTop={2}
                  sx={{minWidth: "1100px", overflow: 'auto', border: '1px solid transparent'}}>
                <Grid item xs={7.5}>
                    <Paper elevation={4}
                           sx={{padding: 2, margin: 'auto', maxWidth: 700, bgcolor: 'rgba(0, 0, 0, 0.4)'}}>
                        <NavigationButtonsPanel onSectionChange={handleSectionChange} section={section}/>

                        {section == 'statistics' && (
                            <Box marginTop={2}>
                                <UserInfoSection profileId={profile.profileId} token={token}
                                                 userId={profile.user.userId}/>
                            </Box>
                        )}
                        {section == 'photo' && (
                            <Box marginTop={2}>
                                <PhotoSection profileId={profile.profileId}/>
                            </Box>
                        )}
                        {section == 'music' && (
                            <div style={{marginTop: 15}}>
                                <TrackList token={token} OnSectionChange={handleSectionChange}
                                           section={"profile_my_music"} onSelectTrack={setSelectedTrack}
                                           isProfilePage={true} setIsVisible={setIsVisible}
                                           tracks={tracks} setTracks={setTracks} selectedTracks={[]}/>
                            </div>
                        )}
                    </Paper>

                    <Box marginTop={2}>
                        <PostCreator profileId={profile.profileId}
                                     onPostCreated={handlePostCreated} selectedTrack={selectedTrack}
                                     setSelectedTrack={setSelectedTrack} isVisible={isVisible}
                                     setIsVisible={setIsVisible}></PostCreator>
                    </Box>

                    <Box marginTop={2}>
                        <PostsFeed posts={posts} profileId={profile.profileId} setPosts={setPosts}
                        setIsVisible={setIsVisible} setSelectedTrack={setSelectedTrack} selectedTrack={selectedTrack} isVisible={isVisible}/>
                    </Box>
                </Grid>

                <Grid item xs={4.0} marginLeft={2.5}>
                    <UserProfileOptionalData profile={profile} token={token} fetchProfile={fetchProfile}/>
                    <Paper elevation={4} sx={{
                        padding: 2,
                        margin: 'auto',
                        maxWidth: 600,
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        marginTop: 5
                    }}> <Followers fullSize={false} size={4} update={update} setUpdate={setUpdate}/> </Paper>
                    <Paper elevation={4}
                           sx={{padding: 2, margin: 'auto', maxWidth: 600, bgcolor: 'rgba(0, 0, 0, 0.4)'}}> Last
                        followers</Paper>
                </Grid>

            </Grid>

        </div>

    );
};

export default UserProfile;
