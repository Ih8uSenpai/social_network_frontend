import React, {useEffect, useRef, useState} from 'react';
import '../styles/profile.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../../utils/Types";
import {handleMessage} from "../service/ChatService";
import {defaultBannerImage, defaultProfileIcon} from "../../utils/Constants";
import {OnlineStatus} from "./OnlineStatus";
import {OfflineStatus} from "./OfflineStatus";

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

    return (
        <div className="user-info">
            <img
                src={profile.profilePictureUrl || defaultProfileIcon}
                alt="User Icon"
                className="user-icon"
            />

            <div className="user-details">
                <p className="tag" style={{color:"#d6d6ff"}}>@{profile.tag}</p>
                <h2>{profile.firstName} {profile.lastName}</h2>
                <p>Joined at: {profile.user.createdAt}</p>
                {!isOwnProfile && (
                    <div>
                        <button onClick={handleFollowToggle}
                                className={isFollowing ? "unfollow-btn" : "follow-btn"}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                        <button className="follow-btn"
                                onClick={() => handleMessage(profile, isExisting, token, currentUserId, userId, chatId, navigate)}>message
                        </button>
                    </div>
                )}

                <p className={"status"}>{profile.user.isOnline ? (<OnlineStatus/>): (<OfflineStatus label={profile.user.lastSeen}/>)}</p>
            </div>
        </div>
    );
};