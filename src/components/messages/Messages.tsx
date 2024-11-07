import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavigationList from "../common/navigationList"; // Импортируйте компонент списка навигации

import {ChatListView} from "./components/ChatListView";
import {ChatView} from "./components/ChatView";
import Header from "../common/header";
import MessagesCreator from "./components/MessagesCreator";
import {Chat, ChatMessage, PostData} from "../utils/Types";
import {ChatType} from "../utils/Types";
import styles from "../profile/styles/UserProfile.module.css";
import {fetchChats} from "../profile/service/ChatService";
// @ts-ignore
import video from "../resources/videos/bg3.mp4";
import {ProfileBanner} from "../profile/components/ProfileBanner";
import {AdditionalInfo} from "../profile/components/Additionalnfo";
import {Box, Grid, Paper} from "@mui/material";
import {NavigationButtonsPanel} from "../profile/components/NavigationButtonsPanel";
import UserInfoSection from "../profile/components/UserInfoSection";
import {PhotoSection} from "../profile/components/PhotoSection";
import TrackList from "../Music/components/TrackList";
import PostCreator from "../news/components/postCreator";
import PostsFeed from "../news/components/PostsFeed";
import {UserProfileOptionalData} from "../profile/components/UserProfileOptionalData";
import {Followers} from "../followers/Followers";
import SearchMessages from "./components/SearchMessages";
import axios from "axios";


export const Messages = () => {
    const [chats, setChats] = useState<Chat[]>([]); // chats теперь содержит объекты типа Chat с сообщениями
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const navigate = useNavigate();
    const {chatId} = useParams();
    const token = localStorage.getItem('authToken');
    const [search, setSearch] = useState('');
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

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/api/chats/search', {
                params: { query: search },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setChats(response.data);
        } catch (error) {
            console.error('Ошибка при поиске треков:', error);
        }
    };

    return (
        <div >
            {!selectedChat ? (
                <>
                    <Grid container spacing={-2} marginTop={2}
                          sx={{minWidth: "1100px", overflow: 'auto', border: '1px solid transparent'}}>
                        <Grid item xs={7.5}>
                            <Paper elevation={4}
                                   sx={{
                                       padding: 2,
                                       minHeight: "90vh",
                                       margin: 'auto',
                                       maxWidth: 700,
                                       bgcolor: 'rgba(0, 0, 0, 0.4)'
                                   }}>
                                <form onSubmit={handleSearch} className="messages-search"
                                      style={{margin: 0, padding: 0, width: "100%"}}>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search..."
                                    />
                                </form>

                                <div style={{height: "100%", marginTop:15}}>
                                    {chats.length > 0 ?
                                        <ChatListView chats={chats} onChatSelect={handleChatSelect} token={token}/>
                                        : <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height:'100%'
                                        }}>There's so empty here...</div>}
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={4.0} marginLeft={2.5}>
                            <Paper elevation={4}
                                   sx={{
                                       padding: 2,
                                       minHeight: "30vh",
                                       margin: 'auto',
                                       maxWidth: 700,
                                       bgcolor: 'rgba(0, 0, 0, 0.4)',
                                       textAlign:'center'
                                   }}>
                                People who might share your interests:

                            </Paper>
                        </Grid>
                    </Grid>
                </>

            ) : (
                <>
                    <ChatView chat={selectedChat} onBack={handleBack} setMessages={setMessages}/>
                </>
            )}


        </div>
    );
};

