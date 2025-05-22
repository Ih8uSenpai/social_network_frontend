import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, TextField, IconButton, Paper} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import axios from "../../config/axiosConfig";
import {fetchComments} from "./service/CommentService";
import {useParams} from "react-router-dom";
import RecursiveComment from "./RecursiveComment";
import './styles/Style.css'

interface CommentInputProps {
    postId: number;
    profileId: number;
    setPosts;
    setPostCommentCount;
}

export interface PostComment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: string;
    url?: string;
    userLiked?: boolean;
    likesCount?: number;
    replies: PostComment[];
    parentTag: string;
    parentId?: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({postId, profileId, setPosts, setPostCommentCount}) => {
    const [comment, setComment] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem('authToken');
    const [postComments, setPostComments] = useState<PostComment[]>([]);
    const {userId} = useParams();
    const [openCommentId, setOpenCommentId] = useState<number | null>(null);
    const commentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});


    const isElementInViewport = (element: HTMLDivElement) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        const fullyVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= windowWidth
        );

        return fullyVisible;
    };

    const scrollToParent = (parentId: number) => {
        const parentRef = commentRefs.current[parentId];
        if (parentRef) {
            if (!isElementInViewport(parentRef))
                parentRef.scrollIntoView({behavior: 'smooth', block: 'start'});
            parentRef.classList.add('highlight');

            setTimeout(() => {
                parentRef.classList.remove('highlight');
            }, 2000);
        }
    };

    const handleCommentSectionToggle = (commentId: number) => {
        if (openCommentId === commentId) {
            setOpenCommentId(null);
        } else {
            setOpenCommentId(commentId);
        }
    };

    useEffect(() => {
        fetchComments(postId, token).then((comments) => {
            setPostComments(comments);
        });
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const createComment = async () => {
        try {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('content', comment)
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profiles/post/${postId}/comment`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error uploading comment:', error);
        }
    };

    const createReplyToComment = async (parentCommentId) => {
        try {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('content', comment)
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profiles/post/${postId}/${parentCommentId}/commentReply`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error uploading comment:', error);
        }
    };

    const handleClickAttachIcon = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (comment.trim() || image) {
            createComment()
                .then(() => {
                        fetchComments(postId, token).then((comments) => {
                            setPostComments(comments);
                        });
                        setPostCommentCount();
                    }
                );
            setComment('');
            setImage(null);
            setPreviewUrl('');
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    maxWidth: 650,
                }}
            >
                <TextField
                    fullWidth={true}
                    variant="outlined"
                    label="Add a comment"
                    value={comment}
                    onChange={handleInputChange}
                />
                <input
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                    style={{display: 'none'}}
                    ref={fileInputRef}
                />
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <IconButton onClick={handleClickAttachIcon} color="primary" aria-label="attach file">
                        <AttachFileIcon/>
                    </IconButton>
                    <Button variant="contained" onClick={handleSubmit}><SendIcon/></Button>
                </Box>
            </Box>
            {previewUrl && (
                <Box sx={{margin: '8px 0', width: '100%', textAlign: 'center'}}>
                    <img src={previewUrl} alt="Preview" style={{maxWidth: '100%', maxHeight: '100px'}}/>
                </Box>
            )}


            <Paper elevation={0}
                   sx={{padding: 2, margin: 'auto', maxWidth: 700,background:'transparent', color: 'black'}}>
                {postComments.map(comment => (
                    <RecursiveComment key={comment.id} comment={comment} postId={postId} setPosts={setPosts}
                                      setPostComments={setPostComments} profileId={profileId}
                                      isCommentOpen={openCommentId}
                                      setPostCommentCount={setPostCommentCount}
                                      onToggleComment={handleCommentSectionToggle} commentRefs={commentRefs}
                                      scrollToParent={scrollToParent}/>
                ))}
            </Paper>
        </Box>
    );
};

