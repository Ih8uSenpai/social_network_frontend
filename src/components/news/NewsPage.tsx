import React, {useEffect, useState} from 'react';
import styles from './styles/UserInfo.module.css';
import {useNavigate, useParams} from "react-router-dom";
import {useFollowingStatus} from "../profile/hooks/useFollowingStatus";
import {useProfile} from "../profile/hooks/useProfile";
import {PostData, ProfileData} from "../utils/Types";
import {useChatExistence} from "../profile/hooks/useChatExistence";
import {fetchPosts} from "../profile/service/PostService";
import {News} from "./News";
import {fetchNewsFeed} from "./service/NewsService";
import {color} from "framer-motion";

interface NewsProps {

    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
}

export const NewsPage: React.FC<NewsProps> = ({
                                                  selectedTrack,
                                                  setSelectedTrack,
                                                  isVisible,
                                                  setIsVisible
                                              }) => {
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

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    useEffect(() => {
        fetchProfile();
        const currentUserId = localStorage.getItem('currentUserId');
        setCurrentUserId(currentUserId);
    }, [userId]);

    useEffect(() => {
        if (profile) {
            fetchNewsFeed(Number(currentUserId), token)
                .then((posts) => {
                    setPosts(posts);
                });

        }
    }, [profile]);



    const handlePostCreated = (newPost: PostData) => {
        setPosts([...posts, newPost]);
        if (profile) {
            fetchPosts(profile.profileId, token)
                .then((posts) => {
                    setPosts(posts);
                });

        }
    };

    if (!profile) {
        return <></>;
    }

    return (
        <News profile={profile} posts={posts} handlePostCreated={handlePostCreated} setPosts={setPosts}
              selectedTrack={selectedTrack}
              setSelectedTrack={setSelectedTrack}
              isVisible={isVisible} setIsVisible={setIsVisible}/>
    );
};

