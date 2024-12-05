import React, {useEffect, useRef, useState} from 'react';
import '../styles/profile.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../../utils/Types";
import {handleMessage} from "../service/ChatService";
import {defaultBannerImage, defaultProfileIcon} from "../../utils/Constants";
import {OnlineStatus} from "./OnlineStatus";
import {OfflineStatus} from "./OfflineStatus";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface UserInfoProps {
    userId: string
    currentUserId: string;
    chatId: number;
    token: string;
    profile: ProfileData;
    isExisting: boolean;
    navigate: NavigateFunction;
    isFollowing: boolean;
    handleFollowToggle;
}

export const UserInfo: React.FC<UserInfoProps> = ({
                                                                userId,
                                                                currentUserId,
                                                                chatId,
                                                                token,
                                                                profile,
                                                                isExisting,
                                                                navigate,
                                                                isFollowing,
                                                                handleFollowToggle
                                                            }) => {


    const isOwnProfile = currentUserId === userId || userId == null;
    const [hover, setHover] = useState(false);
    return (
        <div className="user-info">
            <img
                src={`${process.env.REACT_APP_STATIC_URL}/` + (profile.profilePictureUrl || defaultProfileIcon)}
                alt="User Icon"
                className="user-icon"
            />

            <div className="user-details">
                <span style={{fontWeight:"bold", color:"var(--text-color1)"}}>{profile.firstName} {profile.lastName}</span>
                <span className="tag" style={{color:"rgb(113, 118, 123)"}}>@{profile.tag}</span>
                <span style={{color:"rgb(113, 118, 123)", display:"flex", marginTop:"15px"}}>
                    <CalendarMonthIcon style={{fontSize:"1.3em", marginRight:"5px"}}/>
                    Joined at: {profile.user.createdAt}</span>
                {!isOwnProfile && (
                    <div style={{position:"absolute", top:-5, right:"-250px", display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <button className="message-btn">
                            <MoreHorizIcon/>
                        </button>
                        <button className="message-btn"
                                onClick={() => handleMessage(profile, isExisting, token, currentUserId, userId, chatId, navigate)}><MailOutlineIcon/>
                        </button>
                        <button onClick={handleFollowToggle}
                                className={isFollowing ? "unfollow-btn" : "follow-btn"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                            {isFollowing ? hover ? 'Unfollow' : 'Following' : 'Follow'}
                        </button>
                    </div>
                )}

                <p className={"status"}>{profile.user.isOnline ? (<OnlineStatus/>): (<OfflineStatus label={profile.user.lastSeen}/>)}</p>
            </div>
        </div>
    );
};