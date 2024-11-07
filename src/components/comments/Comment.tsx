import React, {useEffect, useRef, useState} from "react";
import {formatDate, formatDate3} from "../utils/formatDate";
import {Box, Button, Container, IconButton, TextField} from "@mui/material";
import {PostComment} from "./CommentInput";
import {useProfile} from "../profile/hooks/useProfile";
import {fetchComments} from "./service/CommentService";
import {fetchPosts} from "../profile/service/PostService";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from '@mui/icons-material/Reply';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import {useNavigate} from "react-router-dom";

interface CommentProps {
    comment: PostComment;
    postId;
    setPostComments;
    setPostCommentCount
    profileId;
    setPosts;
    isCommentOpen;
    onToggleComment;
    commentRefs;
    scrollToParent;
}


export const Comment: React.FC<CommentProps> = ({comment, postId, setPostComments, setPostCommentCount, setPosts, profileId, isCommentOpen, onToggleComment, commentRefs, scrollToParent}) => {
    const defaultProfileIcon = "http://localhost:8080/src/main/resources/static/standart_icon.jpg";
    const [liked, setLiked] = useState(comment.userLiked);
    const [likesCount, setLikesCount] = useState(comment.likesCount);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const token = localStorage.getItem('authToken');
    const {profile, fetchProfile} = useProfile(comment.userId.toString(), comment.userId.toString(), token, true);
    const [image, setImage] = useState<File | null>(null);
    const [commentContent, setComment] = useState('');
    const navigate = useNavigate();
    const commentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        commentRefs.current[comment.id] = commentRef.current;
    }, [commentRefs, comment.id]);

    useEffect(() => {
        fetchProfile();
    }, [comment.userId]);

    const handleLike = async () => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('currentUserId');
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        const method = liked ? 'DELETE' : 'comment';
        const response = await fetch(`http://localhost:8080/api/comments/${comment.id}/likes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: method,
            body: JSON.stringify({userId: userId})
        });

        if (response.ok) {
            setLiked(!liked);
            setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        }
    };

    const handleClickAttachIcon = () => {
        fileInputRef.current?.click();
    };


    const createReplyToComment = async (parentCommentId) => {
        try {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('content', commentContent)
            const response = await axios.post(`http://localhost:8080/api/profiles/post/${postId}/${parentCommentId}/commentReply`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setPostCommentCount();
        } catch (error) {
            console.error('Error uploading comment:', error);
        }
    };
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


    const handleSubmit = () => {
        if (commentContent.trim() || image) {
            createReplyToComment(comment.id)
                .then(() => {
                        fetchComments(postId, token).then((comments) => {
                            setPostComments(comments);
                        });
                    }
                );
            setComment('');
            setImage(null);
            setPreviewUrl('');
        }
    };
    return (
        <div ref={commentRef}>
            {profile &&
                <Box sx={{
                    width: "600px",
                    color: "#ddd",
                    paddingLeft: 2,
                    marginTop: '5px',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '65px',
                        width: '80%',
                        borderBottom: '1px solid gray',
                    }
                }} className={"user-details-post-box"}>

                    <div className="user-details-post">
                        <img
                            src={profile.profilePictureUrl || defaultProfileIcon}
                            alt="avatar"
                            className="avatar"
                            style={{width: 40, height: 40, cursor: "pointer", marginRight: '10px', alignSelf: "center"}}
                            onClick={() => navigate('/profile/' + profile.user.userId)}
                        />

                        <div style={{display: "flex", flexDirection: "column", marginTop: 0, marginBottom: 4}}>
                            <div>
                                <strong>{profile.firstName + ' ' + profile.lastName}</strong>
                                @{profile.tag}
                                {comment.parentTag && <span style={{marginLeft: 2}}>replies to <span
                                    style={{color: "#1da1f2", marginLeft: 0}}>@{comment.parentTag}</span></span>}
                                {comment.parentId &&
                                <KeyboardReturnIcon style={{fontSize:18, marginLeft:10, cursor:"pointer"}} onClick={() => scrollToParent(comment.parentId)}/>}
                            </div>
                            <p style={{margin: 0, color: "#eee"}}>{comment.content}</p>
                            <Box sx={{marginTop: 0.5}}>
                            <span style={{
                                color: "#999",
                                marginLeft: 0,
                                fontSize: '14px',
                                fontFamily: 'sans-serif'
                            }}> {formatDate3(comment.createdAt)}</span>
                                <span style={{
                                    color: "#1da1f2",
                                    marginLeft: 2,
                                    fontSize: '14px',
                                    fontFamily: 'sans-serif',
                                    cursor: "pointer",
                                }} onClick={onToggleComment}> Reply</span>
                            </Box>
                        </div>
                    </div>


                    {isCommentOpen &&
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
                                    label="Reply"
                                    value={commentContent}
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
                                    <IconButton onClick={handleClickAttachIcon} color="primary"
                                                aria-label="attach file">
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
                        </Box>
                    }

                </Box>
            }
        </div>
    );
};

