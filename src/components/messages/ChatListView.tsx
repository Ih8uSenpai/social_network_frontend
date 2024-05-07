// ChatListView.js
import React from 'react';
import {Chat, ChatType} from "./Types";
import './Messages.css'
import {defaultChatIcon, defaultProfileIcon} from "../utils/Constants";

interface ChatListViewProps {
    chats: Chat[];
    onChatSelect: (chatId: number) => void;
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

export const ChatListView: React.FC<ChatListViewProps> = ({chats, onChatSelect}) => {
    return (
        <div>

            <ul className="chat-list">
                {chats.map((chat) => (
                    <li key={chat.id} onClick={() => onChatSelect(chat.id)}>
                        {chat.chatType !== null ?
                            chat.profileData !== null ?
                                chat.chatType.toString() === ChatType[ChatType.PRIVATE] ?
                                    <div className={"message-entry-container"}>
                                        <img
                                            src={chat.profileData.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                            alt={chat.profileData.user.username}
                                            className="messages-user-icon"
                                        />
                                        <h3>{chat.profileData.firstName + " " + chat.profileData.lastName}</h3>
                                    </div>
                                    :
                                    <div className={"message-entry-container"}>
                                        <img
                                            src={defaultChatIcon} // Указать URL изображения по умолчанию
                                            className="messages-user-icon"
                                        />
                                        <h3>{chat.name}</h3>
                                    </div>
                                :
                                <div className={"message-entry-container"}>
                                    <img
                                        src={defaultChatIcon} // Указать URL изображения по умолчанию
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
