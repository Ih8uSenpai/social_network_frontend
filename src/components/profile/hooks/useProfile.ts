import { useState, useEffect, useCallback } from 'react';
import {ProfileData} from "../../utils/Types";
import {defaultProfileIcon} from "../../utils/Constants";

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
                    localStorage.setItem("myProfilePicture", data.profilePictureUrl ? `${process.env.REACT_APP_STATIC_URL}/` + data.profilePictureUrl : `${process.env.REACT_APP_STATIC_URL}/` + defaultProfileIcon);
                    localStorage.setItem('currentProfileId', String(data.profileId));
                }

            } else {
                console.error('Ошибка при загрузке данных профиля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [userId, currentUserId, token, isFollowing]);

    return { profile, setProfile, fetchProfile };
};