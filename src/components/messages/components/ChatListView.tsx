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
        <div>

            <ul className="chat-list">
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
                                        <Box display={"flex"} flexDirection={"column"} maxWidth={'80%'}
                                             justifyContent={"center"} marginLeft={1}>
                                            <Box>{chat.profileData.firstName + " " + chat.profileData.lastName}</Box>
                                            {chat.lastMessage ?
                                                <Box sx={{fontSize:18, wordWrap:"break-word", color:"#ddd", display:"flex", alignItems:"center", marginTop:1}}>
                                                    <img
                                                        src={chat.lastMessageSenderIconUrl || defaultProfileIcon}
                                                        className="messages-user-icon-small"
                                                    />
                                                    {chat.lastMessage.length > 30 ? `${chat.lastMessage.slice(0, 30)}...` : chat.lastMessage}
                                                </Box>
                                                :
                                                <Box sx={{fontSize:18, color:"#bbb"}}>{"no messages"}</Box>}
                                        </Box>
                                        {chat.unviewedMessages > 0 && <Box
                                            sx={{position:"absolute", right:10, top:"30%", background:"#aaa",
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
        </div>
    );
};


export default ChatView;
