import React, {useEffect, useRef, useState} from 'react';
import '../styles/Post.css';
import {PostData} from "../../utils/Types";
import PostCreator from "./postCreator";
import {CommentCreator} from "../../comments/CommentCreator";
import {Box, Container} from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import {formatDate, formatDateStatus} from "../../utils/formatDate";
import {red} from "@mui/material/colors";
import {ViewCarousel} from "@mui/icons-material";
import Carousel from 'react-material-ui-carousel'
import {useIntersectionObserver} from "../hooks/useIntersectionObserver";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {fetchPosts} from "../../profile/service/PostService";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {CropBanner} from "../../profile/components/CropBanner";
import {CropAvatar} from "../../profile/components/CropAvatar";
import {useIntersectionObserverPosts} from "../hooks/useIntersectionObserverPosts";
import ClearIcon from '@mui/icons-material/Clear';
import AttachmentIcon from '@mui/icons-material/Attachment';
import axios from "axios";
import {formatText} from "../../utils/CommonFunctions";
import TrackList from "../../Music/components/TrackList";
import {useAudioPlayer} from "../../Music/components/AudioPlayerContext";

interface PostProps {
    post: PostData;
    profileId: number;
    setPosts;
    isCommentOpen;
    onToggleComment;
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
}


const Post: React.FC<PostProps> = ({
                                       post,
                                       profileId,
                                       setPosts,
                                       isCommentOpen,
                                       onToggleComment,
                                       setIsVisible,
                                       isVisible,
                                       selectedTrack,
                                       setSelectedTrack
                                   }) => {
    const defaultProfileIcon = "http://localhost:8080/src/main/resources/static/standart_icon.jpg";
    const [liked, setLiked] = useState(post.liked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const imgRef = useRef<HTMLImageElement>(null);
    const imgRef2 = useRef<HTMLImageElement>(null);
    const [height, setHeight] = useState<number>(0);
    const postRef = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('currentUserId');
    const settingsRef = useRef<HTMLDivElement>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [viewedTimer, setViewedTimer] = useState<number | null>(null);
    const startViewTime = useRef<number | null>(null);
    const [activeSection, setActiveSection] = useState('statistics');
    const token = localStorage.getItem('authToken');
    const {
        tracks,
        setTracks
    } = useAudioPlayer();
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };

    const calculateViewType = (viewDuration: number): string => {
        if (viewDuration < 5000) {
            return "QUICK";
        } else if (viewDuration >= 5000 && viewDuration < 15000) {
            return "MEDIUM";
        } else {
            return "LONG";
        }
    };
    const pinPost = async (postId: number) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Auth token not found');
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/api/profiles/pinPost/${postId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                console.log('Post pinned successfully');
                fetchPosts(profileId, token).then((posts) => {
                    setPosts(posts);
                });
            } else {
                console.error('Failed to pin post');
            }
        } catch (error) {
            console.error('Error pinning post:', error);
        }
    };

    const unpinPost = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Auth token not found');
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/api/profiles/unpinPost`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                console.log('Post unpinned successfully');
                fetchPosts(profileId, token).then((posts) => {
                    setPosts(posts);
                });
            } else {
                console.error('Failed to unpin post');
            }
        } catch (error) {
            console.error('Error unpinning post:', error);
        }
    };

    const markPostAsViewed = async (viewType: string) => {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
            console.error('Пользователь не идентифицирован');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/posts/mark-viewed`, {
                postId: post.id,
                userId: userId,
                viewType: viewType
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            console.log(`Post marked as viewed with type: ${viewType}`);
        } catch (error) {
            console.error('Error marking post as viewed:', error);
        }
    };

    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const markPostAsViewedDebounced = debounce(markPostAsViewed, 1000);

    let lastIsVisible = false;

    const handleVisibilityChange = (isVisible: boolean) => {
        if (isVisible && !post.viewed) {
            startViewTime.current = Date.now();
        } else if (!isVisible && startViewTime.current) {
            const viewDuration = Date.now() - startViewTime.current;
            const viewType = calculateViewType(viewDuration);
            markPostAsViewed(viewType);
            startViewTime.current = null;
        }
    };

    useIntersectionObserverPosts(postRef, handleVisibilityChange, {threshold: 0.7});


    const handleLike = async () => {
        const token = localStorage.getItem('authToken');
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


    const handleDeletePost = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        const response = await fetch(`http://localhost:8080/api/profiles/${post.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: 'DELETE',
            body: JSON.stringify(post.profile.user.userId)
        });

        if (response.ok) {
            await fetchPosts(profileId, token).then((posts) => setPosts(posts));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [settingsRef]);


    useEffect(() => {

        if (imgRef.current) {
            const height = (600 * imgRef.current.height / imgRef.current.width);
            setHeight(height);
            if (height > 600)
                setHeight(600);
            console.log("height set = " + height)
        }
    }, [imgRef.current]);


    return (
        <div className="post" ref={postRef} style={{position: "relative"}}>
            <div className="post-header">
                <img
                    src={post.profile?.profilePictureUrl || defaultProfileIcon}
                    alt="avatar"
                    className="avatar"
                    style={{marginLeft: 13, cursor: "pointer"}}
                    onClick={() => navigate(`/profile/${post.profile?.user?.userId}`)}
                />

                <div className="user-details-post">
                    <strong>{post.profile?.firstName + ' ' + post.profile?.lastName}</strong>
                    @{post.profile?.tag}
                    <span> · {formatDate(post.createdAt)}</span>
                </div>

                {post.pinned &&
                    <label style={{color: "#AAA", position: "absolute", top: 0, left: 5}}><AttachmentIcon/></label>}
                {Number(userId) == post.profile?.user?.userId &&
                    <div ref={settingsRef}>
                        <button className="settings-button"
                                style={{position: "absolute", top: 10, right: 10, background: "none"}}
                                onClick={() => setShowSettings(!showSettings)}><MoreHorizIcon/>
                        </button>
                        {showSettings && (
                            <div className="settings-menu" style={{top: 35}}>
                                <ul>
                                    <li>
                                        {post.pinned ?
                                            <button onClick={() => unpinPost()}>
                                                <AttachmentIcon style={{fontSize: 16}}/> Unpin</button>
                                            :
                                            <button onClick={() => pinPost(post.id)}>
                                                <AttachmentIcon style={{fontSize: 16}}/> Pin</button>
                                        }
                                    </li>
                                    <li>
                                        <button onClick={handleDeletePost} className={'delete-post-button'}>
                                            <ClearIcon style={{fontSize: 16}}/> Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                }

            </div>
            <p style={{color: 'white', marginLeft: 23}}>{formatText(post?.content)}</p>

            {post.postAttachments && post.postAttachments.length > 1 ? (
                <Carousel autoPlay={false} changeOnFirstRender={true} height={400}>
                    {post.postAttachments.map((url, index) => (
                        <Box key={index} sx={{
                            width: 630,
                            textAlign: 'center',
                            position: 'relative',
                            background: "rgba(0,0,0,0.4)",
                            borderRadius: 4
                        }} marginLeft={2}>
                            <img src={`http://localhost:8080/${url}`} alt={`Preview ${index}`}
                                 style={{maxWidth: 630, height: 390, objectFit: 'cover'}}
                                 ref={imgRef}/>
                        </Box>
                    ))}
                </Carousel>
            ) : post.postAttachments?.length === 1 && (
                <Container sx={{maxWidth: 630, textAlign: 'center', display: "flex", justifyContent: "center"}}>
                    <Box sx={{
                        width: 630,
                        textAlign: 'center',
                        position: 'relative',
                        background: "rgba(0,0,0,0.4)",
                        borderRadius: 4
                    }}>
                        <img src={`http://localhost:8080/${post.postAttachments[0]}`}
                             style={{maxWidth: "630px", maxHeight: "700px", objectFit: 'cover'}}
                             alt="error loading image" ref={imgRef2}/>
                    </Box>
                </Container>
            )}

            {post.postTracks?.length > 0 &&
                <Box sx={{marginTop:2}}>
                <TrackList token={token} OnSectionChange={handleSectionChange}
                           section={"post_tracks"} onSelectTrack={setSelectedTrack}
                           isProfilePage={true} setIsVisible={setIsVisible}
                           tracks={post.postTracks} setTracks={setTracks} selectedTracks={post.postTracks}/>
                </Box>
            }
            <div className="post-actions" style={{marginTop: "10px"}}>
                <span onClick={onToggleComment}>
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

            {isCommentOpen &&
                (<Box marginTop={2}>
                        <CommentCreator postId={post.id} profileId={profileId} setPosts={setPosts}/>
                    </Box>
                )}
        </div>
    );
};

export default Post;
