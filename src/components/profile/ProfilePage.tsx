import React, {useEffect, useState} from 'react';
import styles from './styles/UserInfo.module.css';
import {NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {useFollowingStatus} from "./hooks/useFollowingStatus";
import {useProfile} from "./hooks/useProfile";
import {PostData, ProfileData} from "../utils/Types";
import {useChatExistence} from "./hooks/useChatExistence";
import {fetchPosts} from "./service/PostService";
import {registerVisit} from "./service/ProfileService";
import {fetchFollowers} from "../followers/Followers";
import UserProfile from "./UserProfile";
import {Track} from "../Music/components/TrackList";
import {useAudioPlayer} from "../Music/components/AudioPlayerContext";

interface ProfilePageProps {
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
}


export const ProfilePage: React.FC<ProfilePageProps> = ({selectedTrack, setSelectedTrack, isVisible, setIsVisible}) => {
    const {userId} = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [updateFollowers, setUpdateFollowers] = useState<number>(0);
    const {isFollowing, handleFollowToggle} = useFollowingStatus(userId, token, updateFollowers, setUpdateFollowers);
    const {profile, fetchProfile} = useProfile(userId, currentUserId, token, isFollowing);
    const [posts, setPosts] = useState<PostData[]>([]);
    const {isExisting, chatId} = useChatExistence(userId, token);
    const [activeSection, setActiveSection] = useState('statistics');
    const {
        tracks,
        setTracks
    } = useAudioPlayer();
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    useEffect(() => {
        const currentUserId = localStorage.getItem('currentUserId');
        setUpdateFollowers(updateFollowers + 1);
        fetchProfile();
        setCurrentUserId(currentUserId);
        if (!(currentUserId === userId || userId == null))
            registerVisit(userId, token);
    }, [userId]);

    useEffect(() => {
        if (profile) {
            fetchPosts(profile.profileId, token)
                .then((posts) => {
                    setPosts(posts);
                });

        }
    }, [profile]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navigate]);

    if (!profile) {
        return <></>;
    }

    const handlePostCreated = (newPost: PostData) => {
        setPosts([...posts, newPost]);
        if (profile) {
            fetchPosts(profile.profileId, token)
                .then((posts) => {
                    setPosts(posts);
                });

        }
    };
    return (
        <UserProfile userId={userId}
                     currentUserId={currentUserId}
                     chatId={chatId}
                     token={token}
                     profile={profile}
                     isExisting={isExisting}
                     fetchProfile={fetchProfile}
                     navigate={navigate}
                     isFollowing={isFollowing}
                     handleFollowToggle={handleFollowToggle}
                     posts={posts}
                     handlePostCreated={handlePostCreated}
                     section={activeSection}
                     handleSectionChange={handleSectionChange}
                     update={updateFollowers}
                     setUpdate={setUpdateFollowers}
                     setPosts={setPosts}
                     selectedTrack={selectedTrack}
                     setSelectedTrack={setSelectedTrack}
                     isVisible={isVisible}
                     setIsVisible={setIsVisible}
                     tracks={tracks}
                     setTracks={setTracks}
        />
    );
};

