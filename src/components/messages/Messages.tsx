import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavigationList from "../common/navigationList"; // Импортируйте компонент списка навигации

import {ChatListView} from "./ChatListView";
import {ChatView} from "./ChatView";
import Header from "../common/header";
import MessagesCreator from "./MessagesCreator";
import {Chat, ChatMessage, PostData} from "./Types";
import {ChatType} from "./Types";
import styles from "../new_design/styles/UserProfile.module.css";
import {fetchChats} from "../profile/service/ChatService";
// @ts-ignore
import video from "../resources/videos/bg3.mp4";


export const Messages = () => {
    const [chats, setChats] = useState<Chat[]>([]); // chats теперь содержит объекты типа Chat с сообщениями
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const navigate = useNavigate();
    const {chatId} = useParams();
    const token = localStorage.getItem('authToken');
    useEffect(() => {

        fetchChats(setChats);
    }, []);

    useEffect(() => {
        if (chatId && chats.length) {
            const foundChat = chats.find(chat => chat.id.toString() === chatId);
            if (foundChat) {
                setSelectedChat(foundChat);
            }
        }
        if (chatId == null)
            setSelectedChat(null);
    }, [chatId, chats]);

    const handleChatSelect = (chatId: number) => {
        navigate(`/messages/${chatId}`);
        localStorage.setItem("selectedChatId", chatId.toString());
    };

    const handleBack = () => {
        setSelectedChat(null);
        navigate(`/messages`);
    };

    async function createChat(name: string) {
        const currentUserId = localStorage.getItem('currentUserId'); // Получаем ID текущего пользователя

        if (!token || !currentUserId) {
            console.error('Токен или ID пользователя не найдены');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/chats/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    userIds: [currentUserId],
                    chatType: ChatType[ChatType.GENERAL]
                }),
            });

            if (response.ok) {
                const newChat = await response.json();
                fetchChats(setChats);

            } else {
                console.error('Ошибка при создании чата');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }


    async function fetchMessages(token: string): Promise<String> {
        try {
            const response = await fetch(`http://localhost:8080/api/chats/${selectedChat?.id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const fetchedMessages: ChatMessage[] = await response.json();
                return await response.json();
            } else {
                console.error('Ошибка при получении сообщений');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    function handleCreateChatSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const chatName = formData.get('chatName') as string; // Здесь предполагается, что chatName - это строка

        createChat(chatName);
    }


    return (
        <>
            {!selectedChat ? (
                <>

                    <ChatListView chats={chats} onChatSelect={handleChatSelect} token={token}/></>
            ) : (
                <>
                    <ChatView chat={selectedChat} onBack={handleBack} setMessages={setMessages}/>
                </>
            )}
        </>
    );
};

