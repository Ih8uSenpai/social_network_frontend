import React, {useState, useRef, useEffect, FormEvent, ChangeEvent} from 'react';

import {useParams} from "react-router-dom";
import {ChatMessage} from "../../utils/Types";
import {WebSocketService} from "../../websocket/WebSocketService";
import SendIcon from '@mui/icons-material/Send';
import Picker from 'emoji-picker-react';
import {useWebSocket} from '../../websocket/WebSocketContext';
import Button from "@mui/material/Button";
import {IconButton, TextareaAutosize} from "@mui/material";
import axios from "../../../config/axiosConfig";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const handleEmojiClick = (emojiObject: any) => {
        setContent((prev) => prev + emojiObject.emoji);
        setShowEmojiPicker(false); // Close the emoji picker after selection
    };

    useEffect(() => {
        if (editMessage)
            setContent(editMessage.content);
    }, [editMessage]);

    const handleSubmitMessage = async () => {
        if (!content.trim()) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Auth token not found');
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/api/chats/${chatId}/messages`,
                { content },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                const newMessage = response.data;
                onMessageCreated(newMessage);
                setContent('');
                if (webSocketService && webSocketService.isConnectionActive()) {
                    webSocketService.sendMessage(newMessage);
                }
            } else {
                console.error('Failed to send message:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

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
            editMessage ? handleEditMessage() : handleSubmitMessage();
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
        <div style={{ position: 'relative' }}>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                editMessage ? handleEditMessage() : handleSubmitMessage();
            }}
            style={{
                position:"relative",
                display: 'flex',
                alignItems: 'center',
                padding: '10px 20px',
                borderTop: '1px solid #333'
            }}
        >
            <IconButton
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                style={{ cursor: 'pointer', marginRight: '10px' }}
            >
                <EmojiEmotionsIcon />
            </IconButton>
            {editMessage && (
                <label
                    style={{
                        position: "absolute",
                        top: "-25px",
                        left: "20px",
                        color: "#1da1f2",
                        fontSize: "14px",
                        backgroundColor: "var(--background-color1)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                        border: "1px solid #333",
                    }}
                >
                    Editing message:
                </label>
            )}
            <TextareaAutosize
                ref={textAreaRef}
                value={content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Start a new message"
                style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #555',
                    backgroundColor: 'var(--background-color2)',
                    color: 'var(--text-color)',
                    outline:"none",
                    marginRight: '10px',
                    resize: 'none',
                    maxHeight:"300px"
                }}
            />
            <Button
                type="submit"
                variant="contained"
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                }}
            >
                {editMessage ? "save" : <SendIcon />}

            </Button>
        </form>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '10px',
                        zIndex: 1000,
                    }}
                >
                    <Picker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>

    );
};

export default MessagesCreator;
