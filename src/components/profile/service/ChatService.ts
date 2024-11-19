import {Chat, ChatType, ProfileData} from "../../utils/Types";
import {NavigateFunction} from "react-router-dom";
import {PostComment} from "../../comments/CommentInput";

export async function createChat(name: string, token: string, currentUserId: string, userId: string): Promise<Chat>{

    if (!token || !currentUserId) {
        console.error('Токен или ID пользователя не найдены');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chats/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                userIds: [currentUserId, userId],
                chatType: ChatType[ChatType.PRIVATE]
            })
        });

        if (response.ok) {
            return response.json();
        } else {
            console.error('Ошибка при создании чата');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export const handleMessage = (profile: ProfileData, isExisting: Boolean, token: string, currentUserId: string, userId: string, chatId: number, navigate: NavigateFunction) => {
    if (profile != undefined) {
        if (!isExisting) {
            createChat(profile?.tag, token, currentUserId, userId).then(chat => navigate(`/messages/${chat.id}`));
        } else
            navigate(`/messages/${chatId}`);
    }
};

export const fetchChats = async (setChats) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Токен не найден');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const chatsData = await response.json();
            setChats(chatsData);
        } else {
            console.error('Ошибка при загрузке чатов');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
};