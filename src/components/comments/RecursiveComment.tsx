import React, {useEffect, useRef, useState} from 'react';
import {Box, Paper} from '@mui/material';
import {Comment} from "./Comment";

const RecursiveComment = ({
                              comment,
                              postId,
                              setPosts,
                              setPostComments,
                              setPostCommentCount,
                              profileId,
                              level = 0,
                              isCommentOpen,
                              onToggleComment,
                              commentRefs,
                              scrollToParent
                          }) => {



    return (
        <Box sx={{marginLeft: level === 1 ? 6 : 0, display: 'flex', flexDirection: 'column'}}>
            <Comment comment={comment} postId={postId} setPosts={setPosts} setPostComments={setPostComments}
                     setPostCommentCount={setPostCommentCount}
                     profileId={profileId} isCommentOpen={isCommentOpen == comment.id}
                     onToggleComment={() => onToggleComment(comment.id)} commentRefs={commentRefs} scrollToParent={() => scrollToParent(comment.parentId)}/>
            {comment.replies && comment.replies.map(reply => (
                <RecursiveComment key={reply.id} comment={reply} postId={postId} setPosts={setPosts}
                                  setPostComments={setPostComments} profileId={profileId} level={level + 1}
                                  isCommentOpen={isCommentOpen}
                                  setPostCommentCount={setPostCommentCount}
                                  onToggleComment={onToggleComment} commentRefs={commentRefs} scrollToParent={scrollToParent}/>
            ))}
        </Box>
    );
};

export default RecursiveComment;
