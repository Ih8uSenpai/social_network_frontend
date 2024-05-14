import React, {useEffect, useRef, useState} from 'react';
import './Post.css';
import {PostData} from "../messages/Types";
import PostCreator from "./postCreator";
import {CommentCreator} from "../comments/CommentCreator";
import {Box, Container} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import {formatDate, formatDateStatus} from "../utils/formatDate";
import {red} from "@mui/material/colors";
import {ViewCarousel} from "@mui/icons-material";
import Carousel from 'react-material-ui-carousel'
import {useIntersectionObserver} from "./hooks/useIntersectionObserver";
import {useNavigate} from "react-router-dom";

interface PostProps {
    post: PostData;
    profileId: number;
    setPosts;
}


const Post: React.FC<PostProps> = ({post, profileId, setPosts}) => {
    const defaultProfileIcon = "http://localhost:8080/src/main/resources/static/standart_icon.jpg";
    const [liked, setLiked] = useState(post.liked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [commentOpen, setCommentOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const imgRef2 = useRef<HTMLImageElement>(null);
    const [height, setHeight] = useState<number>(0);
    const postRef = useRef(null);
    const navigate = useNavigate();

    const markPostAsViewed = async () => {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
            console.error('Пользователь не идентифицирован');
            return;
        }

        await fetch(`http://localhost:8080/api/posts/mark-viewed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(post.id)
        });
    };

    useEffect(() => {
        // Проверяем, загружено ли изображение и существует ли реф
        if (imgRef.current) {
            // Получаем высоту изображения
            const height = (600 * imgRef.current.height / imgRef.current.width);
            setHeight(height);
            if (height > 600)
                setHeight(600);
            // Обновляем состояние высоты
            console.log("height set = " + height)
        }
    }, [imgRef.current]);

    useIntersectionObserver(postRef, markPostAsViewed, {threshold: 0.1});

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const handleLike = async () => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('currentUserId');
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        const method = liked ? 'DELETE' : 'POST';
        const response = await fetch(`http://localhost:8080/api/posts/${post.id}/likes`, {
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


    const handleComment = async () => {
        if (!commentOpen)
            setCommentOpen(true);
        else
            setCommentOpen(false);
    };

    const handleCreateComment = async () => {

    };
    return (
        <div className="post" ref={postRef}>
            <div className="post-header">
                <img
                    src={post.profile.profilePictureUrl || defaultProfileIcon}
                    alt="avatar"
                    className="avatar"
                    style={{marginLeft: 13, cursor:"pointer"}}
                    onClick={() => navigate(`/profile/${post.profile.user.userId}`)}
                />
                <div className="user-details-post">
                    <strong>{post.profile.firstName + ' ' + post.profile.lastName}</strong>
                    @{post.profile.tag}
                    <span> · {formatDate(post.createdAt)}</span>
                </div>
            </div>
            <p style={{color: 'white', marginLeft: 23}}>{post.content}</p>

            {post.postAttachments.length < 2 ? post.postAttachments.length != 0 &&
                <Container sx={{maxWidth: 630, textAlign: 'center', display: "flex", justifyContent: "center"}}>
                    <Box sx={{width: 630, textAlign: 'center', position:'relative', background:"rgba(0,0,0,0.4)", borderRadius:4}}>
                        <img src={"http://localhost:8080/" + post.postAttachments.at(0)}
                             style={{maxWidth: "630px", maxHeight: "700px", objectFit: 'cover'}} alt={"error loading image"} ref={imgRef2}/>
                    </Box>
                </Container>

                :
                (<Carousel autoPlay={false} changeOnFirstRender={true}
                           height={400}>
                        {post.postAttachments.map((url, index) => (
                            <Box sx={{width: 630, textAlign: 'center', position:'relative', background:"rgba(0,0,0,0.4)", borderRadius:4}} marginLeft={2}>
                                <img src={"http://localhost:8080/" + url} alt={`Preview ${url}`}
                                     style={{maxWidth: 630, height: 390, objectFit: 'cover'}}
                                     ref={imgRef}/>
                            </Box>
                        ))}
                    </Carousel>
                )}

            <div className="post-actions" style={{marginTop: "10px"}}>
                <span onClick={() => handleComment()}>
                    {post.commentsCount}
                    <CommentIcon/>
                </span>
                <span>
                    {post.sharesCount}
                    <ShareIcon/>
                </span>
                <span
                    className={`like-button ${liked ? 'liked' : ''}`}
                    onClick={handleLike}>
                    {likesCount} {liked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                </span>
            </div>

            {commentOpen &&
                (<Box marginTop={2}>
                        <CommentCreator postId={post.id} profileId={profileId} setPosts={setPosts}/>
                    </Box>
                )}
        </div>
    );
};

export default Post;
