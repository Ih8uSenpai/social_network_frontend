import Post from "./Post";
import React, {useState, useRef, useEffect} from 'react';

import post from "./Post";
import {useParams} from "react-router-dom";
import {PostData} from "../messages/Types";
import {Box, IconButton, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from '@mui/icons-material/Send';

interface PostCreatorProps {
    profileId: number;
    onPostCreated: (newPost: PostData) => void;
}

interface PostContent {
    content: string;
    mediaUrl: string;
    mediaType: string;
}


const PostCreator: React.FC<PostCreatorProps> = ({profileId, onPostCreated}) => {
    const [content, setContent] = useState('');

    const textAreaRef = useRef<HTMLDivElement>(null);
    const {userId} = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        adjustTextAreaHeight();
    }, [content]);

    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = 'auto'; // Сброс высоты
            textArea.style.height = `${textArea.scrollHeight}px`; // Установка новой высоты
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    // Функция handleSubmit и createPost здесь
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const newPost = await createPost(profileId, content, files);
            onPostCreated(newPost); // Callback для обновления UI
            setContent(''); // Очистить поле ввода после создания поста
            setPreviewUrls(null);
            setFiles(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles(prevFiles => [...prevFiles, ...newFiles]);

            // Обновление массива URL-адресов превью
            const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
        }
    };

    const handleClickAttachIcon = () => {
        fileInputRef.current?.click();
    };

    async function createPost(profileId: number, content: string, files: File[]): Promise<PostData> {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('content', content);

        // Перебор массива файлов и добавление каждого в formData
        if (files)
            files.forEach(file => {
                formData.append('files', file);
            });

        if (!token) {
            console.error('Токен не найден');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/api/profiles/${profileId}/posts`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading post:', error);
            return;
        }
    }


    const currentUserId = localStorage.getItem('currentUserId');
    const isOwnProfile = currentUserId === userId || userId == null;

    return (
        <>
            {isOwnProfile && (
                <Paper elevation={4} sx={{
                    padding: 2,
                    margin: 'auto',
                    maxWidth: 700,
                    bgcolor: 'rgba(0, 0, 0, 0.4)'
                }}>
                    <form onSubmit={handleSubmit} style={{maxWidth: '700'}}>
                        <TextField
                            fullWidth={true}
                            variant="outlined"
                            label="What's happening?"
                            value={content}
                            onChange={handleChange}
                            ref={textAreaRef}
                        />
                        {/* Кнопка для добавления документа */}
                        <div className="add-document-icon">
                            {/* <FaPaperclip size={20}/> */}
                        </div>

                        {/* Кнопка отправки поста */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <IconButton onClick={handleClickAttachIcon} color="primary" aria-label="attach file">
                                <AttachFileIcon/>
                            </IconButton>
                            <Button type="submit" sx={{width: '100px'}}><SendIcon/></Button>
                        </Box>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                            ref={fileInputRef}
                        />
                        {previewUrls ? previewUrls.map((url, index) => (
                            <Box key={index} sx={{margin: '8px 0', width: '100%', textAlign: 'center'}}>
                                <img src={url} alt={`Preview ${index + 1}`}
                                     style={{maxWidth: '100%', maxHeight: '100px'}}/>
                            </Box>
                        )): ''}
                    </form>
                </Paper>
            )}
        </>
    );
};

export default PostCreator;
