import React, { useState } from 'react';
import axios from "../../../config/axiosConfig";
import { Box, TextField, Button } from '@mui/material';

interface TrackUploadProps {
    token: string;
}

export const TrackUpload: React.FC<TrackUploadProps> = ({ token }) => {
    const [file, setFile] = useState<File | null>(null);
    const [icon, setIcon] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setIcon(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file || !title || !artist) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('icon', icon);
        formData.append('track', JSON.stringify({ title, artist }));

        try {
            await axios.post('http://localhost:8080/api/tracks/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Track uploaded successfully');
        } catch (error) {
            console.error('Error uploading track:', error);
            alert('Failed to upload track');
        }
    };

    // Проверка, заполнены ли все поля и выбран ли файл
    const isFormFilled = file && title && artist;

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                margin="normal"
                required
                id="artist"
                label="Artist"
                name="artist"
                autoComplete="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
            />
            <br/>
            <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 2 }}
            >
                Upload File
                <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>

            <Button
                variant="contained"
                component="label"
                sx={{ mt: 2, mb: 2 }}
            >
                Upload Icon
                <input
                    type="file"
                    hidden
                    onChange={handleIconChange}
                />
            </Button>
            <Button
                type="submit"
                variant="contained"
                sx={{mt: 2, mb: 2  }}
                disabled={!isFormFilled} // Кнопка становится доступной только если все поля заполнены и файл выбран
            >
                Submit
            </Button>
        </Box>
    );
};
