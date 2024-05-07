// PostsFeed.tsx
import React from 'react';
import Post from './Post';
import {PostData} from "../messages/Types";
import {Box, Paper} from "@mui/material";

interface PostsFeedProps {
    posts: PostData[];
    profileId:number;
    setPosts;
}

const PostsFeed: React.FC<PostsFeedProps> = ({ posts, profileId, setPosts }) => {
    return (
        <Paper elevation={4} sx={{padding: 2, margin: 'auto', maxWidth: 700, bgcolor: 'rgba(0, 0, 0, 0.4)', color:'black', marginBottom:2  }}>
            {posts.length > 0 && posts.map(post => post ?
                <Post key={post.id} post={post} profileId={profileId} setPosts={setPosts}/> : '')}
            {posts.length == 0 &&
            <Box sx={{width:'100%', color:'#999', textAlign:'center', marginTop:5, marginBottom:5}}>This wall is empty :(</Box>}
        </Paper>
    );
};

export default PostsFeed;
