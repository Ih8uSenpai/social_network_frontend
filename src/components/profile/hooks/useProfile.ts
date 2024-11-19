import { useState, useEffect, useCallback } from 'react';
import {ProfileData} from "../../utils/Types";
import {defaultProfileIcon} from "../../utils/Constants";
import {Simulate} from "react-dom/test-utils";

// Custom hook to fetch and manage profile data
export const useProfile = (userId: string | undefined, currentUserId: string | null, token: string | null, isFollowing: boolean | undefined) => {
    const [profile, setProfile] = useState<ProfileData | null>(null);


    const fetchProfile = async () => {
        try {
            const url = userId ? `${process.env.REACT_APP_API_BASE_URL}/profiles/other/${userId}` : `${process.env.REACT_APP_API_BASE_URL}/profiles/me`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                if (userId === currentUserId) {
                    localStorage.setItem("myProfilePicture", data.profilePictureUrl ? data.profilePictureUrl : defaultProfileIcon);
                    localStorage.setItem('currentProfileId', String(data.profileId));
                }

            } else {
                console.error('Ошибка при загрузке данных профиля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    // Effect to fetch profile data on mount and when dependencies change
    useEffect(() => {
        if (token) { // Only fetch profile if token is available
            fetchProfile();
        }
    }, [userId, currentUserId, token, isFollowing]);

    // Return the profile state and any other state or setters you might need
    return { profile, setProfile, fetchProfile };
};