import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavigationList from "../common/navigationList"; // Импортируйте компонент списка навигации

import {ChatListView} from "./components/ChatListView";
import MessagesCreator from "./components/MessagesCreator";
import {Chat, ChatMessage, PostData, ProfileData} from "../utils/Types";
import {ChatType} from "../utils/Types";
import styles from "../profile/styles/UserProfile.module.css";
import {fetchChats} from "../profile/service/ChatService";
// @ts-ignore
import {Box, Grid, IconButton, Paper} from "@mui/material";
import axios from "../../config/axiosConfig";
import SelectMessageComponent from "./components/SelectMessageComponent";
import {defaultChatIcon, defaultProfileIcon} from "../utils/Constants";
import {Close} from "@mui/icons-material";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import {useWebSocket} from "../websocket/WebSocketContext";
import {useIntersectionObserver} from "../news/hooks/useIntersectionObserver";
import {formatDate} from "../utils/formatDate";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {Message} from "./components/Message";
import InboxWelcomeComponent from "./components/InboxWelcomeComponent";


export const Messages = () => {
    const [chats, setChats] = useState<Chat[]>([]); // chats теперь содержит объекты типа Chat с сообщениями
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const navigate = useNavigate();
    const {chatId} = useParams();
    const token = localStorage.getItem('authToken');
    const [search, setSearch] = useState('');
    const [searchNotFound, setSearchNotFound] = useState('');
    const currentUserId = localStorage.getItem('currentUserId');
    const myProfilePicture = localStorage.getItem('myProfilePicture');
    const webSocketService = useWebSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [unreadIndex, setUnreadIndex] = useState(0);
    const messageRefs = useRef([]);
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
    const [editMessage, setEditMessage] = useState<ChatMessage>(null);

    const toggleMessageSelection = (messageId: number) => {
        setSelectedMessages(prevSelected =>
            prevSelected.includes(messageId)
                ? prevSelected.filter(id => id !== messageId)
                : [...prevSelected, messageId]
        );
    };


    const deleteMessages = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Auth token not found');
                return;
            }
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/chats/messages/delete`,
                selectedMessages,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                console.log('Messages were deleted successfully');
                fetchMessages();
                setSelectedMessages([])
            } else {
                console.error('Failed to delete messages');
            }
        } catch (error) {
            console.error('Error deleting messages:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chats/${selectedChat.id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const fetchedMessages = await response.json();
                setMessages(fetchedMessages);

                const index = fetchedMessages.findIndex(m => !m.viewed);
                setUnreadIndex(index !== -1 ? index : fetchedMessages.length - 1);

            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    useEffect(() => {
        // Функция для получения сообщений
        fetchMessages()
    }, [selectedChat?.id, setMessages]);

    useEffect(() => {
        messageRefs.current = messageRefs.current.slice(0, messages.length);
    }, [messages.length]);

    const updateMessages = () => {
        fetchMessages().then(() => scrollToEnd());
    };

    useEffect(() => {
        if (unreadIndex !== -1 && messageRefs.current[unreadIndex]) {
            messageRefs.current[unreadIndex].scrollIntoView({behavior: "smooth"});
        }
    }, [unreadIndex]);

    const scrollToEnd = () => {
        if (messages && messages.length > 0) {
            messageRefs.current[messages.length - 1].scrollIntoView({behavior: "smooth"});
        }
    };


    useEffect(() => {
        if (webSocketService && webSocketService.subscribeToMessages) {
            // Pass the updateMessages callback to the WebSocketService
            webSocketService.subscribeToMessages(updateMessages);
        }
    }, [webSocketService]);

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

    async function createChat(name: string) {
        const currentUserId = localStorage.getItem('currentUserId'); // Получаем ID текущего пользователя

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


    const handleSearch = async (event) => {
        event.preventDefault();
        if (search.length == 0){
            fetchChats(setChats);
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chats/search`, {
                params: {query: search},
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.length == 0) {
                setSearchNotFound("There's nothing matching your query \"" + search + "\"");
            }
            setChats(response.data);
        } catch (error) {
            console.error('Ошибка при поиске треков:', error);
            setSearchNotFound(error);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                backgroundColor: 'transparent',
                color: '#fff',
            }}
        >
            {/* Left Section: Chat List */}
            <div
                style={{
                    borderRight: '1px solid #333',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    flex: 1,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color:"var(--text-color)",
                    }}
                >
                    <span>Messages</span>
                </div>

                {/* Search Bar */}
                {chats.length > 0  ? (
                        <>
                            <form onSubmit={handleSearch} className="messages-search">
                                <input
                                    type="text"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search Direct Messages"
                                    style={{
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid var(--background-color5)',
                                        backgroundColor: 'var(--background-color5)',
                                        color: 'var(--text-color)',
                                        outline: "none",
                                        marginBottom: '20px',
                                    }}
                                />
                            </form>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    height: '100%',
                                    padding: '10px',
                                    backgroundColor: 'var(--background-color8)',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginBottom: '10px',
                                }}
                            >

                                <ChatListView chats={chats} onChatSelect={handleChatSelect} token={token}/>
                            </div>
                        </>)
                    : searchNotFound.length > 0 ?
                        <>
                            <form onSubmit={handleSearch} className="messages-search">
                                <input
                                    type="text"
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search Direct Messages"
                                    style={{
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid var(--background-color5)',
                                        backgroundColor: 'var(--background-color5)',
                                        color: 'var(--text-color)',
                                        outline: "none",
                                        marginBottom: '20px',
                                    }}
                                />
                            </form>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems:"center",
                                height: '100%',
                                padding: '10px',
                                color:"var(--text-color)",
                                backgroundColor: 'var(--background-color5)',
                                borderRadius: '5px',
                                marginBottom: '10px',
                            }}
                        >
                            {searchNotFound}
                        </div>
                        </>
                        :
                        <InboxWelcomeComponent/>
                }
            </div>

            {/* Right Section: Chat Window */}
            {selectedChat ?
                <div
                    style={{
                        flex: 2,
                        display: 'flex',
                        flexDirection: 'column',

                    }}
                >
                    {/* Chat Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 20px',
                            borderBottom: '1px solid #333',
                            background:"var(--background-color1)",
                            color:"var(--text-color2)"
                        }}
                    >
                        <div style={{display: 'flex', alignItems: 'center', cursor: "pointer"}}>
                            <img
                                src={`${process.env.REACT_APP_STATIC_URL}/` + (selectedChat?.profileData?.profilePictureUrl || defaultProfileIcon)}
                                alt="Chat avatar"
                                className="messages-user-icon"
                                onClick={() => navigate('/profile/' + selectedChat?.profileData?.user.userId)}
                            />
                            <div
                                style={{fontWeight: 'bold'}}>{selectedChat?.profileData?.firstName + " " + selectedChat?.profileData?.lastName}</div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                        style={{
                            overflowY: 'auto',
                            height: "100%"
                        }}
                    >
                        <div>
                            <div className={"messages"}>
                                {messages.length > 0 && (
                                    messages.map((message, index) => (
                                        <div ref={el => messageRefs.current[index] = el} key={message.messageId}>
                                            <Message key={message.messageId}
                                                     profileData={selectedChat?.profileData}
                                                     myProfilePicture={myProfilePicture}
                                                     messageObject={message}
                                                     currentUserId={currentUserId}
                                                     onMessageSelect={toggleMessageSelection}
                                                     selectedMessages={selectedMessages}
                                                     setEditMessage={setEditMessage}
                                                     editMessage={editMessage}
                                                     setSelectedMessages={setSelectedMessages}
                                            />
                                        </div>
                                    ))
                                )}
                                <div/>
                            </div>
                        </div>


                    </div>

                    {/* Chat Input */}

                    {(selectedMessages?.length == 0 || editMessage) ?
                        <MessagesCreator
                            chatId={selectedChat?.id}
                            onMessageCreated={() => {
                                updateMessages();
                            }}
                            editMessage={editMessage}
                            setEditMessage={setEditMessage}
                            fetchMessages={fetchMessages}
                            setSelectedMessages={setSelectedMessages}/>
                        :
                        <div style={{
                            position: 'relative',
                            display: "flex",
                            width: '80%',
                            height: 75,
                            alignSelf: "center",
                            marginTop: 20,
                            borderRadius: 8,
                            backgroundColor: "var(--background-color1)",
                            padding: "2px 6px",
                            marginBottom: "10px",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                            border: "1px solid #333",
                        }}>
                            <p style={{
                                height: 'fit-content',
                                position: "absolute",
                                left: 70,
                                top: 0,
                                bottom: 0,
                                color:"var(--text-color)",
                                margin: "auto",
                                fontSize: 20
                            }}>{selectedMessages.length} {selectedMessages.length == 1 ? 'message' : 'messages'}</p>
                            <IconButton
                                onClick={() => setSelectedMessages([])}
                                style={{
                                    height: 40,
                                    position: "absolute",
                                    left: 10,
                                    top: 0,
                                    color:"var(--text-color)",
                                    bottom: 0,
                                    margin: "auto"
                                }}>
                                <Close/>
                            </IconButton>
                            <IconButton style={{
                                height: 50,
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                color:"var(--text-color)",
                                right: 155,
                                margin: "auto",
                                borderRadius: 10
                            }}><ReplyIcon style={{marginRight: 10, transform: 'scaleX(-1)'}}/>Forward
                            </IconButton>
                            <IconButton
                                onClick={deleteMessages}
                                style={{
                                    height: 50,
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    right: 30,
                                    margin: "auto",
                                    borderRadius: 10,
                                    color: "#f56c62"
                                }}><DeleteIcon style={{marginRight: 10}}/>Delete
                            </IconButton>
                        </div>
                    }

                </div>
                :
                <SelectMessageComponent/>
            }

        </div>
    );
};

