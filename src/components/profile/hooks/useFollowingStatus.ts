// useFollowingStatus.ts
import { useState, useEffect } from 'react';

export const useFollowingStatus = (userId: string | undefined, token: string | null, update: number, setUpdate) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const checkIfFollowing = async () => {
        if (!userId || !token) return;
        try {
            const response = await fetch(`http://localhost:8080/api/profiles/isFollowing/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            const { isFollowing } = await response.json();
            setIsFollowing(isFollowing);
        } catch (error) {
            console.error('Error checking following status:', error);
        }
    };

    const handleFollowToggle = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || !userId) {
            console.error('Токен не найден или userId отсутствует');
            return;
        }

        try {
            const method = isFollowing ? 'DELETE' : 'POST';
            const response = await fetch(`http://localhost:8080/api/profiles/${method === 'POST' ? 'follow' : 'unfollow'}/${userId}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
                setUpdate(update + 1);
            } else {
                console.error('Ошибка при выполнении запроса');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    useEffect(() => {
        checkIfFollowing();
    }, [userId, token]);

    return { isFollowing, handleFollowToggle };
};
