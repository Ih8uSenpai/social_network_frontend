import Post from "./Post";
import React, {useState, useRef, useEffect} from 'react';

import post from "./Post";
import {useParams} from "react-router-dom";
import {PostData} from "../../utils/Types";
import {Box, IconButton, Paper, TextareaAutosize, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from '@mui/icons-material/Send';
import PanoramaIcon from '@mui/icons-material/Panorama';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import {ChooseTrackMenu} from "./ChooseTrackMenu";
import {useAudioPlayer} from "../../Music/components/AudioPlayerContext";
import TrackList, {Track} from "../../Music/components/TrackList";

interface PostCreatorProps {
    profileId: number;
    onPostCreated: (newPost: PostData) => void;
    selectedTrack;
    setSelectedTrack;
    isVisible;
    setIsVisible;
}


const PostCreator: React.FC<PostCreatorProps> = ({
                                                     profileId,
                                                     onPostCreated,
                                                     selectedTrack,
                                                     setSelectedTrack,
                                                     isVisible,
                                                     setIsVisible
                                                 }) => {
    const [content, setContent] = useState('');

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {userId} = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [showTrackMenu, setShowTrackMenu] = useState(false);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [activeSection, setActiveSection] = useState('post_creator_preview');
    const {
        tracks,
        setTracks
    } = useAudioPlayer();
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
    };
    const token = localStorage.getItem('authToken');


    const handleMusicClick = () => {
        setShowTrackMenu(true);
    };


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            if (files.length > 0 || content || selectedTracks.length > 0) {
                const newPost = await createPost(profileId, content, files, selectedTracks);
                onPostCreated(newPost);
                setContent('');
                setPreviewUrls([]);
                setFiles([]);
                setSelectedTracks([]); // очищаем выбранные треки после отправки
            }
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

    async function createPost(profileId: number, content: string, files: File[], selectedTracks: Track[]): Promise<PostData> {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('content', content);

        files.forEach(file => formData.append('files', file));

        // Отправляем selectedTracks как JSON-строку с указанием правильного типа
        formData.append('selectedTracks', new Blob([JSON.stringify(selectedTracks)], { type: 'application/json' }));

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


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Предотвращаем добавление новой строки
            handleSubmit(e); // Вызываем отправку формы
        }
    };

    const handleSaveTrack = () => {
        if (selectedTrack) {
            setSelectedTracks((prevTracks) => [...prevTracks, selectedTrack]); // Добавляем выбранный трек
        }
        setShowTrackMenu(false); // Закрываем меню выбора треков
    };

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

                        <TextareaAutosize
                            value={content}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            ref={textAreaRef}
                            className={"create-post-area"}
                            placeholder={"What's happening?"}
                            style={{maxHeight: "300px", width: "90%", border: '1px solid gray', borderRadius: '5px'}}
                        />


                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >


                            <div className="post-creator-menu">

                                <IconButton onClick={handleClickAttachIcon}
                                            aria-label="attach file"><PanoramaIcon/></IconButton>
                                <IconButton><OndemandVideoIcon/></IconButton>
                                <IconButton onClick={handleMusicClick}>
                                    <MusicNoteIcon/>
                                </IconButton>

                                <ChooseTrackMenu
                                    showTrackMenu={showTrackMenu}
                                    setShowTrackMenu={setShowTrackMenu}
                                    token={token}
                                    selectedTrack={selectedTrack}
                                    setSelectedTrack={setSelectedTrack}
                                    isVisible={isVisible}
                                    setIsVisible={setIsVisible}
                                    onSaveTrack={handleSaveTrack}
                                />
                            </div>


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
                        )) : ''}

                        {selectedTracks.length > 0 &&
                            <Box sx={{marginTop: 2}}>
                                <TrackList token={token} OnSectionChange={handleSectionChange}
                                           section={"post_tracks"} onSelectTrack={setSelectedTrack}
                                           isProfilePage={true} setIsVisible={setIsVisible}
                                           tracks={tracks} setTracks={setTracks} selectedTracks={selectedTracks}/>
                            </Box>
                        }
                    </form>
                </Paper>
            )}
        </>
    );
};

export default PostCreator;
