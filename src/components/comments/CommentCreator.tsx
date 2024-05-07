import React, {useState, useRef, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {PostData} from "../messages/Types";
import {Box, Paper} from "@mui/material";
import Button from "@mui/material/Button";
import {CommentInput} from "./CommentInput";
import {fetchComments} from "./service/CommentService";

interface PostCreatorProps {
    postId: number;
    profileId: number;
    setPosts;
}


export const CommentCreator: React.FC<PostCreatorProps> = ({postId, profileId, setPosts}) => {
    const [content, setContent] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {userId} = useParams();


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

            setContent(''); // Очистить поле ввода после создания поста
        } catch (error) {
            console.error(error);
        }
    };


    const currentUserId = localStorage.getItem('currentUserId');
    const isOwnProfile = currentUserId === userId || userId == null;

    return (
        <CommentInput postId={postId} profileId={profileId} setPosts={setPosts}/>
    );
};
