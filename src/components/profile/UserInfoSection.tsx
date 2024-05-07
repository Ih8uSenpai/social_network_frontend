import React, {useState} from 'react';
import './styles/UserInfoSection.css';
import {ProfileStatistics} from "./ProfileStatistics";
import {Paper} from "@mui/material";
import {countPostsPerPeriod} from "./service/StatisticsService";
import {PostData, ProfileData} from "../messages/Types";
import {NavigateFunction} from "react-router-dom";

interface UserInfoProps {
    profileId: number;
    userId: number;
    token: string;
}

const UserInfoSection: React.FC<UserInfoProps> = ({
                                                      profileId,
                                                      userId,
                                                      token
                                                  }) => {

    return (
        <ProfileStatistics token={token} profileId={profileId} userId={userId}/>
    );
};

export default UserInfoSection;

