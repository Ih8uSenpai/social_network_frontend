import React from 'react';
import { Box, Paper } from '@mui/material';
import {Comment} from "./Comment";

const RecursiveComment = ({ comment, postId, setPosts, setPostComments, profileId, level = 0 }) => {
    return (
        <Box sx={{ marginLeft: level === 1 ? 6 : 0, display: 'flex', flexDirection: 'column' }}>
            <Comment comment={comment} postId={postId} setPosts={setPosts} setPostComments={setPostComments}
                     profileId={profileId} />
            {comment.replies && comment.replies.map(reply => (
                <RecursiveComment key={reply.id} comment={reply} postId={postId} setPosts={setPosts}
                                  setPostComments={setPostComments} profileId={profileId} level={level + 1} />
            ))}
        </Box>
    );
};

export default RecursiveComment;
