import {NavigateFunction} from "react-router-dom";
import {ProfileData} from "../../utils/Types";

export const handleUserFollowNavigation = (userId: string, currentUserId: string, navigate: NavigateFunction, navigationType: 'followers' | 'following') => {
    const validatedUserId = userId || currentUserId; // This will use userId if it's truthy, otherwise it falls back to currentUserId
    navigate(`/profile/${validatedUserId}/${navigationType}`);
};

export const updateProfile = async (profileData: ProfileData, updates: Partial<ProfileData>, token: String) => {
    const body = { ...profileData, ...updates };
    try {
        const response = await fetch('http://localhost:8080/api/profiles/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const updatedProfile = await response.json();
        return updatedProfile;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const calculateAge = (birthdate) => {
    if (!birthdate) {
        return null;
    }
    const birthday = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }
    return age;
};


export async function fetchPhotos(profileId: number, token: string): Promise<string[]> {

    try {

        const response = await fetch(`http://localhost:8080/api/profiles/${profileId}/photos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching photos: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('fetchPhotos error:', error);
        throw error;
    }
}

export const registerVisit = async (userId:string, token: String) => {
    try {
        const response = await fetch(`http://localhost:8080/api/profiles/visit/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to register visit');
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering visit:', error);
        throw error;
    }
};


export async function fetchProfiles (query:string): Promise<ProfileData[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Токен не найден');
        // Обработка отсутствия токена, например, перенаправление на страницу входа
    }
    try {
        const response = await fetch(`http://localhost:8080/api/profiles/search?query=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                // Добавьте здесь любые другие заголовки, например, для аутентификации
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
    }
};