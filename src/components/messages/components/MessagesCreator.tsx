import React, {useState, useRef, useEffect, FormEvent, ChangeEvent} from 'react';

import {useParams} from "react-router-dom";
import {ChatMessage} from "../../utils/Types";
import {WebSocketService} from "../../websocket/WebSocketService";
import SendIcon from '@mui/icons-material/Send';

import {useWebSocket} from '../../websocket/WebSocketContext';
import Button from "@mui/material/Button";
import {TextareaAutosize} from "@mui/material";
import axios from "axios";

interface MessagesCreatorProps {
    chatId: number;
    onMessageCreated: (newMessage: ChatMessage) => void;
    children?: React.ReactNode;
    editMessage: ChatMessage;
    setEditMessage;
    fetchMessages;
    setSelectedMessages;
}

const MessagesCreator: React.FC<MessagesCreatorProps> = ({
                                                             chatId,
                                                             onMessageCreated,
                                                             children,
                                                             editMessage,
                                                             setEditMessage,
                                                             fetchMessages,
                                                             setSelectedMessages
                                                         }) => {
    const [content, setContent] = useState<string>('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {userId} = useParams<{ userId: string }>();
    const webSocketService = useWebSocket();


    useEffect(() => {
        if (editMessage)
            setContent(editMessage.content);
    }, [editMessage]);

    const handleEditMessage = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Auth token not found');
                return;
            }
            const response = await axios.put(
                `http://localhost:8080/api/chats/messages`,
                editMessage,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                fetchMessages();
                setEditMessage(null);
                setContent('');
                setSelectedMessages([]);
            } else {
                console.error('Failed to edit message');
            }
        } catch (error) {
            console.error('Error edit message:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        if (editMessage) {
            editMessage.content = e.target.value;
            setEditMessage(editMessage);
        }
        adjustTextAreaHeight();
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Предотвращаем добавление новой строки
            handleSubmitForm(); // Вызываем отправку формы
        }
    };

    const handleSubmitForm = async () => {
        if (content.trim()) {
            try {
                await createMessage(chatId, content);
                setContent('');
                if (webSocketService && webSocketService.isConnectionActive()) {
                    webSocketService.sendMessage(content);
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            }
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmitForm();
    };

    const handleSubmitEdit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleEditMessage();
    };

    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    async function createMessage(chatId: number, content: string) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        const response = await fetch(`http://localhost:8080/api/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content}),
        });

        if (response.ok) {
            const newMessage = await response.json();
            onMessageCreated(newMessage); // Обновляет список сообщений в родительском компоненте
            setContent('');
        } else {
            throw new Error(`Ошибка при создании сообщения: ${response.statusText}`);
        }


    }

    return (
        <div className="message-creator-container">
            {editMessage && <label style={{paddingBottom: 10, marginLeft: 0, color: '#1da1f2'}}>Edit message:</label>}
            <form onSubmit={editMessage ? handleSubmitEdit : handleSubmit} style={{display: "flex"}}>
                <TextareaAutosize
                    value={content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    ref={textAreaRef}
                    className={"create-post-area"}
                    placeholder={"write a message..."}
                    style={{maxHeight: "300px", width: "100%"}}
                />
                <Button type="submit" sx={{marginLeft: 2}}><SendIcon/></Button>
            </form>


            {children}
        </div>
    );
};

export default MessagesCreator;
