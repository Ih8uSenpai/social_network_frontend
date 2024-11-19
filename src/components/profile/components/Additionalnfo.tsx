import React, {useEffect, useRef, useState} from 'react';
import '../styles/profile.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../../utils/Types";
import {handleMessage} from "../service/ChatService";
import {defaultBannerImage, defaultProfileIcon} from "../../utils/Constants";
import {UserInfo} from "./UserInfo";
import {handleUserFollowNavigation} from "../service/ProfileService";

interface AdditionalInfoProps {
    userId: string
    currentUserId: string;
    profile: ProfileData;
    navigate: NavigateFunction;
    height?: string;
    width?: string;
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
                                                                  userId,
                                                                  currentUserId,
                                                                  profile,
                                                                  navigate,
                                                                  height = "100px",
                                                                  width = "100px",
                                                              }) => {


    return (
        <div className="additional-info" style={{height: height}}>



            <p onClick={() => {
                handleUserFollowNavigation(userId, currentUserId, navigate, "followers");
            }} style={{
                cursor: "pointer",
                padding: "5px 5px 0 5px",
                marginRight:"100px",
                width: width
            }}>
                <span>{profile.followersCount}</span>
                <span style={{color:"rgb(113, 118, 123)", marginTop:"5px"}}>Followers</span>
            </p>


            <p onClick={() => {
                handleUserFollowNavigation(userId, currentUserId, navigate, "following");
            }} style={{
                cursor: "pointer",
                padding: "5px 5px 0 5px",
                marginRight:"50px",
                width: width
            }}>
                <span>{profile.followingCount}</span>
                <span style={{color:"rgb(113, 118, 123)", marginTop:"5px"}}>Following</span>
            </p>
        </div>
    );
};