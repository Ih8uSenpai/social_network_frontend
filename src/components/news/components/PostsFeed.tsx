// PostsFeed.tsx
import React, {useState} from 'react';
import Post from './Post';
import {PostData} from "../../utils/Types";
import {Box, Paper} from "@mui/material";

interface PostsFeedProps {
    posts: PostData[];
    profileId:number;
    setPosts;
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
}

const PostsFeed: React.FC<PostsFeedProps> = ({ posts, profileId, setPosts, setIsVisible, isVisible, setSelectedTrack, selectedTrack }) => {
    const [openCommentPostId, setOpenCommentPostId] = useState<number | null>(null);

    const handleCommentSectionToggle = (postId: number) => {
        if (openCommentPostId === postId) {
            setOpenCommentPostId(null);  // Закрыть секцию, если она уже открыта
        } else {
            setOpenCommentPostId(postId);  // Открыть новую секцию
        }
    };

    return (
        <Paper elevation={4} sx={{padding: 2, margin: 'auto', maxWidth: 700, bgcolor: 'var(--background-color3)', color:'black', marginBottom:2  }}>
            {posts.length > 0 && posts.map(post => post ?
                <Post key={post.id} post={post} profileId={profileId} setPosts={setPosts}
                      isCommentOpen={openCommentPostId === post.id}
                      onToggleComment={() => handleCommentSectionToggle(post.id)}
                setIsVisible={setIsVisible} setSelectedTrack={setSelectedTrack} selectedTrack={selectedTrack} isVisible={isVisible}/> : '')}
            {posts.length == 0 &&
            <Box sx={{width:'100%', color:'#999', textAlign:'center', marginTop:5, marginBottom:5}}>This wall is empty :(</Box>}
        </Paper>
    );
};

export default PostsFeed;
