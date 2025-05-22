import React, {useState, useRef, useEffect} from 'react';
import {useParams} from "react-router-dom";
import {CommentInput} from "./CommentInput";

interface PostCreatorProps {
    postId: number;
    profileId: number;
    setPosts;
    setCommentsCount;
}


export const CommentCreator: React.FC<PostCreatorProps> = ({postId, profileId, setPosts, setCommentsCount}) => {
    const [content, setContent] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {userId} = useParams();


    useEffect(() => {
        adjustTextAreaHeight();
    }, [content]);


    const adjustTextAreaHeight = () => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    };





    const currentUserId = localStorage.getItem('currentUserId');
    const isOwnProfile = currentUserId === userId || userId == null;

    return (
        <CommentInput postId={postId} profileId={profileId} setPosts={setPosts} setPostCommentCount={setCommentsCount}/>
    );
};
