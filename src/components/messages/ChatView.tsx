import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from 'react';
import {ChatMessage, ChatType, ChatViewProps, ProfileData} from "./Types";
import MessagesCreator from "./MessagesCreator";
import {defaultChatIcon, defaultProfileIcon} from "../utils/Constants";
import {formatDate} from "../utils/formatDate";
import {useWebSocket} from "../websocket/WebSocketContext";
import {useIntersectionObserver} from "../news/hooks/useIntersectionObserver";

interface MessageProps {
    profileData: ProfileData;  // Замените ProfileData на фактический тип, если он у вас определен
    myProfilePicture: string;
    messageObject: ChatMessage; // Используйте ваш собственный тип, если он отличается
    currentUserId: string;
}

interface CustomDivRef extends HTMLDivElement {
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
}

const Message: React.FC<{ profileData: ProfileData, myProfilePicture: string, messageObject: ChatMessage, currentUserId: string }> =
    ({profileData, myProfilePicture, messageObject, currentUserId}) => {
        const messageRef = useRef(null);
        const token = localStorage.getItem('authToken');


        const markMessageAsViewed = async () => {
            if (!currentUserId) {
                console.error('Пользователь не идентифицирован');
                return;
            }
            if (messageObject.sender.userId == Number(currentUserId))
                return;

            await fetch(`http://localhost:8080/api/chats/mark-viewed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(messageObject.messageId)
            });
        };

        useIntersectionObserver(messageRef, markMessageAsViewed, {threshold: 0.1});

        return (
            <div style={{display: "flex", flexDirection: "row", marginTop: "5px"}}
                 className={messageObject.viewed == false ? "unviewed-message" : ""}
                 ref={messageRef}>
                {profileData !== null && myProfilePicture != null ?
                    messageObject.sender.userId.toString() === currentUserId ?
                        <a href={`/profile/${currentUserId}`}
                           style={{marginRight: "10px", alignSelf: "flex-start", justifySelf: "flex-start"}}>
                            <img
                                src={myProfilePicture || defaultProfileIcon} // Указать URL изображения по умолчанию
                                alt={messageObject.sender.username}
                                className="messages-user-icon"
                                style={{height: "50px", width: "50px"}}
                            />
                        </a>
                        :
                        <a href={`/profile/${profileData.user.userId}`}
                           style={{marginRight: "10px", alignSelf: "center"}}>
                            <img
                                src={profileData.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                alt={profileData.user.username}
                                className="messages-user-icon"
                                style={{height: "50px", width: "50px"}}
                            />
                        </a>
                    :
                    null
                }

                <div style={{display: "flex", flexDirection: "column", maxWidth: "100%"}} ref={messageRef}>
                    <div>
                        <strong>{messageObject.sender.username} </strong>
                        <small style={{
                            marginLeft: "3px",
                            fontSize: "0.8em",
                            color: "#ccc",
                            marginBottom: "2px"
                        }}>{formatDate(messageObject.sentAt)}</small>
                    </div>
                    <span style={{
                        maxWidth: "90%",
                        wordWrap: "break-word"
                    }}>{messageObject.content}</span>
                </div>
            </div>
        );
    };

export const ChatView: React.FC<ChatViewProps> = ({chat, onBack}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const currentUserId = localStorage.getItem('currentUserId');
    const myProfilePicture = localStorage.getItem('myProfilePicture');
    const webSocketService = useWebSocket();
    const token = localStorage.getItem('authToken');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [unreadIndex, setUnreadIndex] = useState(0);
    const messageRefs = useRef([]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chats/${chat.id}/messages`, {
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
    }, [chat.id, setMessages]);

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
                    messages.map((message, index) => (
                        <div ref={el => messageRefs.current[index] = el} key={message.messageId}>
                            <Message key={message.messageId}
                                     profileData={chat.profileData}
                                     myProfilePicture={myProfilePicture}
                                     messageObject={message}
                                     currentUserId={currentUserId}
                            />
                        </div>
                    ))
                ) : (
                    <h1 style={{color: "white"}}>There's no messages yet...</h1>
                )}
                <div/>
            </div>
            <MessagesCreator
                chatId={chat.id}
                onMessageCreated={() => {
                    updateMessages();
                }}>
            </MessagesCreator>
        </div>
    );
};
