import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from 'react';
import {ChatMessage, ChatType, ChatViewProps, ProfileData} from "../../utils/Types";
import MessagesCreator from "./MessagesCreator";
import {defaultChatIcon, defaultProfileIcon} from "../../utils/Constants";
import {formatDate} from "../../utils/formatDate";
import {useWebSocket} from "../../websocket/WebSocketContext";
import {useIntersectionObserver} from "../../news/hooks/useIntersectionObserver";
import {useNavigate} from "react-router-dom";
import {Box, Grid, IconButton, Paper} from "@mui/material";
import {ChatListView} from "./ChatListView";
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from "@mui/icons-material/Clear";
import axios from "../../../config/axiosConfig";
import {fetchPosts} from "../../profile/service/PostService";
import {Close} from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import ForwardIcon from '@mui/icons-material/Forward';

interface MessageProps {
    profileData: ProfileData;  // Замените ProfileData на фактический тип, если он у вас определен
    myProfilePicture: string;
    messageObject: ChatMessage; // Используйте ваш собственный тип, если он отличается
    currentUserId: string;
}

interface CustomDivRef extends HTMLDivElement {
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
}

const Message: React.FC<{
    profileData: ProfileData,
    myProfilePicture: string,
    messageObject: ChatMessage,
    currentUserId: string,
    onMessageSelect: (messageId: number) => void,
    selectedMessages: number[]
    setSelectedMessages;
    setEditMessage;
    editMessage;
}> = ({
          profileData,
          myProfilePicture,
          messageObject,
          currentUserId,
          onMessageSelect,
          selectedMessages,
          setEditMessage,
    setSelectedMessages,
          editMessage
      }) => {
    const messageRef = useRef(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const isSelected = selectedMessages.includes(messageObject.messageId);

    const markMessageAsViewed = async () => {
        if (!currentUserId) {
            console.error('Пользователь не идентифицирован');
            return;
        }
        if (messageObject.sender.userId == Number(currentUserId))
            return;

        await fetch(`${process.env.REACT_APP_API_BASE_URL}/chats/mark-viewed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageObject.messageId)
        });
    };

    const handleEditMessage = () => {
        setEditMessage(messageObject);
    };

    useIntersectionObserver(messageRef, markMessageAsViewed, {threshold: 0.1});


    const handleClick = () => {
        onMessageSelect(messageObject.messageId);
    };


    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '',
                cursor: "pointer"
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={messageObject.viewed == false ? "unviewed-message" : ""}
            ref={messageRef}
        >
            {messageObject.single && profileData !== null && myProfilePicture != null ? (
                messageObject.sender.userId.toString() === currentUserId ? (
                    <img
                        src={myProfilePicture || defaultProfileIcon}
                        alt={messageObject.sender.username}
                        className="messages-user-icon"
                        style={{
                            height: "50px",
                            width: "50px",
                            marginRight: "10px",
                            marginLeft: "25px",
                            alignSelf: "flex-start",
                            justifySelf: "flex-start",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate('/profile/' + currentUserId)}
                    />
                ) : (
                    <img
                        src={profileData.profilePictureUrl || defaultProfileIcon}
                        alt={profileData.user.username}
                        className="messages-user-icon"
                        style={{
                            height: "50px",
                            width: "50px",
                            marginRight: "10px",
                            marginLeft: "25px",
                            alignSelf: "center",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate('/profile/' + profileData.user.userId)}
                    />
                )
            ) : null}

            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                position: 'relative',
                paddingTop: 2,
                paddingBottom: 2
            }} ref={messageRef}>
                {messageObject.single && (
                    <div>
                        <strong>{messageObject.sender.username} </strong>
                        <small style={{
                            marginLeft: "3px",
                            fontSize: "0.8em",
                            color: "#ccc",
                            marginBottom: "2px"
                        }}>{formatDate(messageObject.sentAt)}</small>
                    </div>
                )}
                <span style={{
                    width: "90%",
                    wordWrap: "break-word",
                    borderRadius: '10px',
                    padding: 5
                }} className={!messageObject.single ? 'message-margin-left' : ''}>
                    {messageObject.content}
                </span>

                {messageObject.sender.userId === Number(currentUserId) && isHovered && (
                    <EditIcon
                        onClick={handleEditMessage}
                        className={'change-color-on-hover'}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: messageObject.single ? 20 : -60,
                            fontSize: 18,
                            cursor: "pointer"
                        }}
                    />
                )}

                {isHovered && (
                    <ReplyIcon fontSize={'small'}
                               className={'change-color-on-hover'}
                               style={{
                                   position: "absolute",
                                   top: 0,
                                   right: messageObject.single ? -10 : -90,
                                   fontSize: 18,
                                   cursor: "pointer"
                               }}
                    />
                )}

                {(isHovered || isSelected) && (
                    <CheckCircleIcon
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            fontSize: 18,
                            margin: "auto",
                            left: messageObject.single ? -80 : 5,
                            color: isSelected ? "" : '#aaa'
                        }}
                    />
                )}
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
    const navigate = useNavigate();
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
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chats/${chat.id}/messages`, {
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
        <div style={{overflow: "hidden"}}>
            <Grid container spacing={-2} marginTop={2}
                  sx={{minWidth: "1100px", maxHeight: '100%', overflow: 'auto', border: '1px solid transparent'}}
                  style={{overflow: "auto"}}>
                <Grid item xs={7.5}>
                    <Paper elevation={4}
                           sx={{
                               overflow: 'auto',
                               position: 'relative',
                               padding: 2,
                               minHeight: "90vh",
                               maxHeight: "90vh",
                               margin: 'auto',
                               maxWidth: 700,
                               bgcolor: 'rgba(0, 0, 0, 0.4)'
                           }}>


                        <div className={"messages-container"}>
                            {chat.chatType !== null ?
                                chat.profileData !== null ?
                                    chat.chatType.toString() === ChatType[ChatType.PRIVATE] ?
                                        <div className={"message-entry-container"}
                                             style={{
                                                 position: 'absolute',
                                                 justifyContent: "space-between",
                                                 top: 0,
                                                 right: 0,
                                                 height: 20
                                             }}>
                                            <button className="back-to-chats" onClick={onBack}>ᐸ Назад</button>
                                            <h3>{chat.profileData.firstName + " " + chat.profileData.lastName}</h3>
                                            <img
                                                src={chat.profileData.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                                alt={chat.profileData.user.username}
                                                className="messages-user-icon"
                                                onClick={() => navigate('/profile/' + chat.profileData.user.userId)}
                                                style={{marginRight: '10px', cursor: "pointer"}}
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




                            <div className={"messages"} style={{marginTop: 50}}>
                                {messages.length > 0 ? (
                                    messages.map((message, index) => (
                                        <div ref={el => messageRefs.current[index] = el} key={message.messageId}>
                                            <Message key={message.messageId}
                                                     profileData={chat.profileData}
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
                                ) : (
                                    <p style={{
                                        color: "#aaa",
                                        position: "absolute",
                                        top: 0,
                                        bottom: 0,
                                        right: 0,
                                        left: 0,
                                        margin: "auto",
                                        height: "fit-content",
                                        width: 'fit-content'
                                    }}>There's no messages yet...</p>
                                )}
                                <div/>
                            </div>
                            {(selectedMessages?.length == 0 || editMessage) ?
                                <MessagesCreator
                                    chatId={chat.id}
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
                                    background: 'rgba(255,255,255,0.25)',
                                    alignSelf: "center",
                                    marginTop: 20,
                                    borderRadius: 8
                                }}>
                                    <p style={{
                                        height: 'fit-content',
                                        position: "absolute",
                                        left: 70,
                                        top: 0,
                                        bottom: 0,
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
                               textAlign: 'center'
                           }}>
                        People who might share your interests:

                    </Paper>
                </Grid>
            </Grid>


        </div>

    );
};
