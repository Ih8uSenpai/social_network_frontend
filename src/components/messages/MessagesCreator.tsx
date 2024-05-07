import React, {useState, useRef, useEffect, FormEvent, ChangeEvent} from 'react';

import {useParams} from "react-router-dom";
import {ChatMessage} from "./Types";
import {WebSocketService} from "../websocket/WebSocketService";
import SendIcon from '@mui/icons-material/Send';

import {useWebSocket} from '../websocket/WebSocketContext';
import Button from "@mui/material/Button";
import {TextareaAutosize} from "@mui/material"; // Предположим, что useWebSocket - это ваш кастомный хук

interface MessagesCreatorProps {
    chatId: number;
    onMessageCreated: (newMessage: ChatMessage) => void;
    children?: React.ReactNode;
}

const MessagesCreator: React.FC<MessagesCreatorProps> = ({chatId, onMessageCreated, children}) => {
    const [content, setContent] = useState<string>('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {userId} = useParams<{ userId: string }>();
    const webSocketService = useWebSocket(); // Получаем экземпляр WebSocketService через кастомный хук


    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        adjustTextAreaHeight();
    };

    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
            <form onSubmit={handleSubmit} style={{display:"flex"}}>
                <TextareaAutosize
                    value={content}
                    onChange={handleChange}
                    ref={textAreaRef}
                    className={"create-post-area"}
                    placeholder={"write a message..."}
                    style={{maxHeight:"300px", width:"100%"}}
                />
                <Button type="submit" sx={{marginLeft:2}}><SendIcon/></Button>
            </form>


            {children}
        </div>
    );
};

export default MessagesCreator;
