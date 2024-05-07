// useChatExistence.ts
import { useState, useEffect } from 'react';

export const useChatExistence = (userId: string | undefined, token: string | null) => {
    const [isExisting, setIsExisting] = useState(false);
    const [chatId, setChatId] = useState(null);

    const checkIfChatExisting = async () => {
        if (!userId || !token) return;
        try {
            const response = await fetch(`http://localhost:8080/api/chats/isExisting/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            setIsExisting(data.isExisting);
            setChatId(data.chatId);
        } catch (error) {
            console.error('Error checking chat existence:', error);
        }
    };

    useEffect(() => {
        checkIfChatExisting();
    }, [userId, token]);

    return { isExisting, chatId, checkIfChatExisting };
};
