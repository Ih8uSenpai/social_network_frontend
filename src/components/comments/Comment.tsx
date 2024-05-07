import React, {useEffect, useRef, useState} from "react";
import {formatDate} from "../utils/formatDate";
import {Box, Container} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {CommentCreator} from "./CommentCreator";
import {PostComment} from "./CommentInput";
import {useProfile} from "../profile/hooks/useProfile";

interface CommentProps {
    comment: PostComment;
}


export const Comment: React.FC<CommentProps> = ({comment}) => {
    const defaultProfileIcon = "http://localhost:8080/src/main/resources/static/standart_icon.jpg";
    const [liked, setLiked] = useState(comment.userLiked);
    const [likesCount, setLikesCount] = useState(comment.likesCount);
    const imgRef = useRef<HTMLImageElement>(null);
    const token = localStorage.getItem('authToken');
    const {profile, fetchProfile} = useProfile(comment.userId.toString(), comment.userId.toString(), token, true);

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


    const handleCreateComment = async () => {

    };
    return (
        <>
            {profile &&
                <Box sx={{width: "600px", color: "#ddd", paddingLeft:2, marginTop:'20px'}}>

                    <div className="user-details-post">
                        <a href={`/profile/${profile.user.userId}`} style={{marginRight: '10px', alignSelf:"center"}}>
                        <img
                            src={profile.profilePictureUrl || defaultProfileIcon}
                            alt="avatar"
                            className="avatar"
                            style={{width: 40, height: 40}}
                        />
                        </a>
                        <strong>{profile.firstName + ' ' + profile.lastName}</strong>
                        @{profile.tag}
                        <span> · {formatDate(comment.createdAt)}</span>
                    </div>
                    {comment.content}
                </Box>
            }
        </>
    );
};

