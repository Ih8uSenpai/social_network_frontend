import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, IconButton, Paper, TextareaAutosize, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import PanoramaIcon from '@mui/icons-material/Panorama';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { ChooseTrackMenu } from './ChooseTrackMenu';
import { useAudioPlayer } from '../../Music/components/AudioPlayerContext';
import TrackList, { Track } from '../../Music/components/TrackList';
import { defaultProfileIcon } from '../../utils/Constants';
import axios from '../../../config/axiosConfig';
import AssistantIcon from '@mui/icons-material/Assistant';

const STABILITY_API_KEY = 'sk-YWSKrANkTi0Umw9v3ee3JVEMWQzSgOCct2DlsulHVkC1m0Tm';

const PostCreator = ({
                         profile,
                         onPostCreated,
                         selectedTrack,
                         setSelectedTrack,
                         isVisible,
                         setIsVisible,
                     }) => {
    const [content, setContent] = useState('');
    const [prompt, setPrompt] = useState('');
    const [usePostTextAsPrompt, setUsePostTextAsPrompt] = useState(false);
    const [showImageGenerator, setShowImageGenerator] = useState(false);
    const textAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const { userId } = useParams();
    const [previewUrls, setPreviewUrls] = useState([]);
    const [files, setFiles] = useState([]);
    const [showTrackMenu, setShowTrackMenu] = useState(false);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [activeSection, setActiveSection] = useState('post_creator_preview');
    const { tracks, setTracks } = useAudioPlayer();
    const token = localStorage.getItem('authToken');

    const handleMusicClick = () => setShowTrackMenu(true);
    const handleChange = (e) => setContent(e.target.value);
    const handleClickAttachIcon = () => fileInputRef.current?.click();
    const handleClickVideoIcon = () => videoInputRef.current?.click();
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files as FileList);
            setFiles((prev) => [...prev, ...newFiles]);
            const newPreviewUrls = newFiles.map((file) => ({
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' : 'image',
            }));
            setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
    };

    const createPost = async (profileId, content, files, selectedTracks) => {
        const formData = new FormData();
        formData.append('content', content);
        files.forEach((file) => formData.append('files', file));
        formData.append('selectedTracks', new Blob([JSON.stringify(selectedTracks)], { type: 'application/json' }));

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profiles/${profileId}/posts`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading post:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (files.length > 0 || content || selectedTracks.length > 0) {
            const newPost = await createPost(profile.profileId, content, files, selectedTracks);
            onPostCreated(newPost);
            setContent('');
            setPrompt('');
            setPreviewUrls([]);
            setFiles([]);
            setSelectedTracks([]);
        }
    };

    const handleGenerateImage = async () => {
        try {
            const selectedPrompt = usePostTextAsPrompt ? content : prompt;
            if (!selectedPrompt.trim()) {
                alert('Prompt пустой');
                return;
            }

            const formData = new FormData();
            formData.append('prompt', selectedPrompt);
            formData.append('output_format', 'png');
            formData.append('aspect_ratio', '1:1');
            formData.append('style_preset', 'photographic');
            formData.append('seed', '0');

            const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${STABILITY_API_KEY}`,
                    Accept: 'image/*',
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.errors?.join(', ') || 'Ошибка генерации');
            }

            const blob: Blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setPreviewUrls((prev) => [...prev, { url: imageUrl, type: 'image' }]);
            const filename = `generated_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
            const generatedFile = new File([blob], filename, { type: 'image/png' });
            setFiles((prev) => [...prev, generatedFile]);
            setShowImageGenerator(false);
            setPrompt('');
            setUsePostTextAsPrompt(false);
        } catch (error) {
            console.error(error);
            alert('Ошибка при генерации изображения');
        }
    };

    const handleSaveTrack = () => {
        if (selectedTrack) setSelectedTracks((prev) => [...prev, selectedTrack]);
        setShowTrackMenu(false);
    };

    const currentUserId = localStorage.getItem('currentUserId');
    const isOwnProfile = currentUserId === userId || userId == null;

    return isOwnProfile ? (
        <Paper elevation={4} sx={{ padding: 2, margin: 'auto', maxWidth: 700, bgcolor: 'var(--background-color3)' }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={`${process.env.REACT_APP_STATIC_URL}/` + (profile.profilePictureUrl || defaultProfileIcon)} className={'avatar'} style={{ height: '60px', width: '60px' }} />
                    <TextareaAutosize
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        ref={textAreaRef}
                        className={'create-post-area'}
                        placeholder={"What's happening?"}
                        style={{ maxHeight: '300px', width: '90%', border: 'none' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div className="post-creator-menu" style={{ color: '#1da1f2' }}>
                        <IconButton onClick={handleClickAttachIcon} aria-label="attach image" style={{ color: '#1da1f2' }}><PanoramaIcon /></IconButton>
                        <IconButton onClick={handleClickVideoIcon} style={{ color: '#1da1f2' }} aria-label="attach video">
                            <OndemandVideoIcon />
                        </IconButton>
                        <IconButton onClick={handleMusicClick} style={{ color: '#1da1f2' }}><MusicNoteIcon /></IconButton>
                        <IconButton onClick={() => setShowImageGenerator((prev) => !prev)} style={{ color: '#1da1f2' }}><AssistantIcon /></IconButton>
                        <ChooseTrackMenu showTrackMenu={showTrackMenu} setShowTrackMenu={setShowTrackMenu} token={token} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} isVisible={isVisible} setIsVisible={setIsVisible} onSaveTrack={handleSaveTrack} />
                    </div>
                    <Button type="submit" sx={{ width: '100px', background: 'var(--background-color5)' }}><SendIcon /></Button>
                </Box>

                <input accept="image/*" type="file" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} />
                <input accept="video/*" type="file" onChange={handleFileChange} style={{ display: 'none' }} ref={videoInputRef} />

                {previewUrls.map((media, index) => (
                    <Box key={index} sx={{ margin: '8px 0', width: '100%', textAlign: 'center' }}>
                        {media.type === 'image' ? (
                            <img src={media.url} alt={`Preview ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        ) : (
                            <video src={media.url} controls style={{ maxWidth: '100%', maxHeight: '240px' }} />
                        )}
                    </Box>
                ))}

                {selectedTracks.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                        <TrackList token={token} OnSectionChange={setActiveSection} section={"post_tracks"} onSelectTrack={setSelectedTrack} isProfilePage={true} setIsVisible={setIsVisible} tracks={tracks} setTracks={setTracks} selectedTracks={selectedTracks} />
                    </Box>
                )}

                {showImageGenerator && (
                    <Box sx={{ marginTop: 2, border: '1px solid #ccc', borderRadius: '8px', padding: 2 }}>
                        <TextField label="Prompt" fullWidth multiline minRows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={usePostTextAsPrompt} sx={{ marginBottom: 2 }} />
                        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <input type="checkbox" checked={usePostTextAsPrompt} onChange={() => setUsePostTextAsPrompt(prev => !prev)} style={{ marginRight: 8 }} />
                            Использовать текст поста как prompt
                        </label>
                        <Button variant="contained" onClick={handleGenerateImage}>Сгенерировать изображение</Button>
                    </Box>
                )}
            </form>
        </Paper>
    ) : null;
};

export default PostCreator;
