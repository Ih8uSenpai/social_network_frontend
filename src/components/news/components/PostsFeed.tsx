import React, { useEffect, useRef, useState } from 'react';
import Post from './Post';
import { PostData } from "../../utils/Types";
import { Box, Paper } from "@mui/material";
import { fetchLikedPosts, fetchPosts, fetchRecommendedPosts } from "../../profile/service/PostService";
import {useIntersectionObserverPosts} from "../hooks/useIntersectionObserverPosts";
import {markPostAsViewed} from "../service/NewsService";

interface PostsFeedProps {
    posts: PostData[];
    profileId: number;
    setPosts: React.Dispatch<React.SetStateAction<PostData[]>>;
    selectedTrack: any;
    setSelectedTrack: React.Dispatch<any>;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    section: string;
}

const PostsFeed: React.FC<PostsFeedProps> = ({
                                                 posts,
                                                 profileId,
                                                 setPosts,
                                                 setIsVisible,
                                                 isVisible,
                                                 setSelectedTrack,
                                                 selectedTrack,
                                                 section
                                             }) => {
    const [isLoading, setIsLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [openCommentPostId, setOpenCommentPostId] = useState<number | null>(null)
    const token = localStorage.getItem('authToken');
    const [recommendedPostsEmpty, setRecommendedPostsEmpty] = useState(false);
    const handleCommentSectionToggle = (postId: number) => {
        if (openCommentPostId === postId) {
            setOpenCommentPostId(null);
        } else {
            setOpenCommentPostId(postId);
        }
    };

    const fetchMorePosts = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            let newPosts: PostData[] = [];
            if (section === "recommendations") {
                newPosts = await fetchRecommendedPosts(token);
            }
            if (newPosts.length > 0) {
                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            }
            else {
                setRecommendedPostsEmpty(true);
            }
        } catch (error) {
            console.error("Ошибка загрузки постов:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useIntersectionObserverPosts(
        [loaderRef],
        (element, isIntersecting) => {
            if (element === loaderRef.current && isIntersecting) {
                console.log('Loader in view');
                markPostAsViewed(posts.at(posts.length - 1), "QUICK").then(() => fetchMorePosts())
            }
        },
        { threshold: 1.0 }
    );

    return (
        <Paper elevation={4} sx={{
            padding: 2,
            margin: 'auto',
            maxWidth: 700,
            bgcolor: 'var(--background-color3)',
            color: 'black',
            marginBottom: 2
        }}>
            {posts.length > 0 && posts.map((post, index) => (
                <React.Fragment key={post.id}>
                    <Post
                        post={post}
                        profileId={profileId}
                        setPosts={setPosts}
                        isCommentOpen={openCommentPostId === post.id}
                        onToggleComment={() => handleCommentSectionToggle(post.id)}
                        setIsVisible={setIsVisible}
                        setSelectedTrack={setSelectedTrack}
                        selectedTrack={selectedTrack}
                        isVisible={isVisible}
                    />
                    {/* Элемент для отслеживания последнего поста */}
                    {index === posts.length - 1 && section == "recommendations" && (!recommendedPostsEmpty ? (
                        <div ref={loaderRef} style={{ height: '50px', background: 'transparent' }} />
                    ) :
                        <div style={{textAlign:"center", color:"var(--text-color)"}}>You have viewed all recommended posts! Wait new publications or try searching something</div>
                    )}
                </React.Fragment>
            ))}
            {posts.length === 0 && (
                <Box sx={{ width: '100%', color: '#999', textAlign: 'center', marginTop: 5, marginBottom: 5 }}>
                    This wall is empty :(
                </Box>
            )}
        </Paper>
    );
};

export default PostsFeed;
