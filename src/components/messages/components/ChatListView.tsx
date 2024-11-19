// ChatListView.js
import React, {useRef} from 'react';
import {Chat, ChatMessage, ChatType} from "../../utils/Types";
import '../styles/Messages.css'
import {defaultChatIcon, defaultProfileIcon} from "../../utils/Constants";
import {Box, ListItem} from "@mui/material";
import {useIntersectionObserver} from "../../news/hooks/useIntersectionObserver";

interface ChatListViewProps {
    chats: Chat[];
    onChatSelect: (chatId: number) => void;
    token;
}

interface ChatViewProps {
    chat: Chat;
    onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({chat, onBack}) => {
    return (
        <div>
            <div className="chat-header">
                <button onClick={onBack}>Назад</button>
                <h3>{chat.name}</h3>
            </div>
            <div className="chat-content">
                {/* Здесь должен быть контент чата */}
            </div>
        </div>
    );
};

export const ChatListView: React.FC<ChatListViewProps> = ({chats, onChatSelect, token}) => {


    return (

            <ul className="chat-list"           style={{
                display: 'flex',
                flexDirection:"column",
                padding: '0',
                borderRadius: '5px',
                border:"none",
                cursor: 'pointer',
                marginBottom: '10px',
            }}>
                {chats.map((chat) => (
                    <li key={chat.id} onClick={() => onChatSelect(chat.id)}>
                        {chat.chatType !== null ?
                            chat.profileData !== null ?
                                chat.chatType.toString() === ChatType[ChatType.PRIVATE] ?

                                    <div className={chat.unviewedMessages == 0 ? "message-entry-container": "message-entry-container message-entry-container-highlight"} style={{position:"relative"}}>
                                        <img
                                            src={chat.profileData.profilePictureUrl || defaultProfileIcon}
                                            alt={chat.profileData.user.username}
                                            className="messages-user-icon"
                                            style={{marginLeft:10}}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold', color:'var(--text-color)'}}>{chat.profileData.firstName + " " + chat.profileData.lastName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-color4)' }}>@{chat.profileData.tag}</div>
                                        </div>
                                        {chat.unviewedMessages > 0 && <Box
                                            sx={{position:"absolute", right:10, top:"calc(50% - 25)", background:"#aaa",
                                                width:50, height:50, display:"flex", justifyContent:"center",
                                                alignItems:"center", borderRadius:"50%", fontSize:20}}>

                                            {chat.unviewedMessages}
                                        </Box>}
                                    </div>
                                    :
                                    <div className={"message-entry-container"}>
                                        <img
                                            src={defaultChatIcon}
                                            className="messages-user-icon"
                                        />
                                        <h3>{chat.name}</h3>
                                    </div>
                                :
                                <div className={"message-entry-container"}>
                                    <img
                                        src={defaultChatIcon}
                                        className="messages-user-icon"
                                    />
                                    <h3>{chat.name}</h3>
                                </div>
                            : null}
                    </li>
                ))}
            </ul>
    );
};


export default ChatView;
