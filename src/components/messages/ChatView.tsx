import React, {useEffect, useRef, useState} from 'react';
import {ChatMessage, ChatType, ChatViewProps, ProfileData} from "./Types";
import MessagesCreator from "./MessagesCreator";
import {defaultChatIcon, defaultProfileIcon} from "../utils/Constants";
import {formatDate} from "../utils/formatDate";
import {useWebSocket} from "../websocket/WebSocketContext";

export const ChatView: React.FC<ChatViewProps> = ({chat, onBack}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUserId = localStorage.getItem('currentUserId');
    const myProfilePicture = localStorage.getItem('myProfilePicture');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const webSocketService = useWebSocket();
    const token = localStorage.getItem('authToken');

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chats/${chat.id}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const fetchedMessages: ChatMessage[] = await response.json();
                setMessages(fetchedMessages);
            } else {
                console.error('Ошибка при получении сообщений');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    useEffect(() => {
        // Функция для получения сообщений
        fetchMessages()
    }, [chat.id, setMessages]);

    useEffect(() => {
        // Прокрутка к последнему сообщению
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const updateMessages = () => {
        fetchMessages();
    };
    useEffect(() => {
        if (webSocketService && webSocketService.subscribeToMessages) {
            // Pass the updateMessages callback to the WebSocketService
            webSocketService.subscribeToMessages(updateMessages);
        }
    }, [webSocketService]);
    return (
        <div className={"messages-container"}>
            {chat.chatType !== null ?
                chat.profileData !== null ?
                    chat.chatType.toString() === ChatType[ChatType.PRIVATE] ?
                        <div className={"message-entry-container"}
                             style={{
                                 justifyContent: "space-between",
                                 border: "1px solid #ccc",
                                 borderRadius: "10px 10px 0 0",
                                 padding: "5px"
                             }}>
                            <button className="back-to-chats" onClick={onBack}>ᐸ Назад</button>
                            <h3>{chat.profileData.firstName + " " + chat.profileData.lastName}</h3>
                            <a href={`/profile/${chat.profileData.user.userId}`} style={{marginRight: '10px'}}>
                                <img
                                    src={chat.profileData.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                    alt={chat.profileData.user.username}
                                    className="messages-user-icon"
                                />
                            </a>

                        </div>
                        :
                        <div className={"message-entry-container"}
                             style={{
                                 justifyContent: "space-between",
                                 border: "1px solid #ccc",
                                 borderRadius: "10px 10px 0 0",
                                 padding: "5px"
                             }}>
                            <button className="back-to-chats" onClick={onBack}>ᐸ Назад</button>
                            <h3>{chat.name}</h3>
                            <img
                                src={defaultChatIcon} // Указать URL изображения по умолчанию
                                className="messages-user-icon"
                            />
                        </div>
                    :
                    <div className={"message-entry-container"}
                         style={{
                             justifyContent: "space-between",
                             border: "1px solid #ccc",
                             borderRadius: "10px 10px 0 0",
                             padding: "5px"
                         }}>
                        <button className="back-to-chats" onClick={onBack}>ᐸ Назад</button>
                        <h3>{chat.name}</h3>
                        <img
                            src={defaultChatIcon} // Указать URL изображения по умолчанию
                            className="messages-user-icon"
                        />
                    </div>
                : null}

            <div className={"messages"}>
                {messages.length > 0 ? (
                    messages.map(message => (
                        <div key={message.messageId} style={{display: "flex", flexDirection: "row", marginTop: "5px"}}>
                            {chat.profileData !== null && myProfilePicture != null ?
                                message.sender.userId.toString() === currentUserId ?
                                    <a href={`/profile/${currentUserId}`}
                                       style={{marginRight: '10px', alignSelf: "flex-start", justifySelf:"flex-start"}}>
                                        <img
                                            src={myProfilePicture || defaultProfileIcon} // Указать URL изображения по умолчанию
                                            alt={message.sender.username}
                                            className="messages-user-icon"
                                            style={{height: "50px", width: "50px"}}
                                        />
                                    </a>
                                    :
                                    <a href={`/profile/${chat.profileData.user.userId}`}
                                       style={{marginRight: '10px', alignSelf: "center"}}>
                                        <img
                                            src={chat.profileData.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                            alt={chat.profileData.user.username}
                                            className="messages-user-icon"
                                            style={{height: "50px", width: "50px"}}
                                        />
                                    </a>
                                :
                                null
                            }

                            <div style={{display: "flex", flexDirection: "column", maxWidth:"100%"}}>
                                <div>
                                    <strong>{message.sender.username} </strong>
                                    <small style={{
                                        marginLeft: "3px",
                                        fontSize: "0.8em",
                                        color: "#ccc",
                                        marginBottom: "2px"
                                    }}>{formatDate(message.sentAt)}</small>
                                </div>
                                <span style={{
                                    maxWidth: "90%",
                                    wordWrap: "break-word"
                                }}>{message.content}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1 style={{color: "white"}}>There's no messages yet...</h1>
                )}
                <div ref={messagesEndRef}/>
            </div>
            <MessagesCreator
                chatId={chat.id}
                onMessageCreated={() => {
                    updateMessages(); // Обновите список сообщений после успешной отправки
                }}>
            </MessagesCreator>
        </div>
    );
};
