import React, {useEffect, useState} from 'react';
import '../styles/UserInfoSection.css';
import {ProfileStatistics} from "./ProfileStatistics";
import {Box, IconButton, Modal, Paper} from "@mui/material";
import {fetchComments} from "../../comments/service/CommentService";
import {fetchPhotos} from "../service/ProfileService";
import {PostComment} from "../../comments/CommentInput";
import Post from "../../news/components/Post";
import Button from "@mui/material/Button";
import Carousel from "react-material-ui-carousel";
import '../styles/PhotoSection.css';
import {photo_box_style} from "../../utils/Constants";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import {useParams} from "react-router-dom";

interface PhotoInputProps {
    profileId: number;
}


export const PhotoSection: React.FC<PhotoInputProps> = ({profileId}) => {
    const token = localStorage.getItem('authToken');
    const currentUserId = localStorage.getItem("currentUserId");
    const {userId} = useParams();
    const [photos, setPhotos] = useState<string[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [open, setOpen] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    useEffect(() => {
        fetchPhotos(profileId, token).then((fetchedPhotos) => {
            setPhotos(fetchedPhotos);
        });
    }, [profileId, token]);

    const deletePhoto = async (index) => {
        try {

            const response = await axios.delete(`http://localhost:8080/api/profiles/photo/${index}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            fetchPhotos(profileId, token).then((fetchedPhotos) => {
                setPhotos(fetchedPhotos);
            });
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };
    const handleOpen = (index) => {
        setSelectedIndex(index);
        setOpen(true);
    };


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {photos.length == 0 &&
                <Box sx={{width: '100%', color: '#999', textAlign: 'center', marginTop: 5, marginBottom: 5}}>Unfortunately,
                    there's no photos added...</Box>}
            <Paper elevation={4} sx={{
                padding: 0,
                margin: 'auto',
                width: 700,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                color: 'black',
                display: 'flex',
                flexDirection: 'column',
                transitionDuration: '3s'

            }}>

                <Paper elevation={4} sx={{
                    padding: 0,
                    margin: 'auto',
                    width: 700,
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    color: 'black',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start'
                }}>
                    {(photos.length > 0 && showAll ? photos : photos.slice(0, 6)).map((photo, index) => (
                        <div key={index} style={{
                            width: 'calc(33.3% - 1px)',
                            display: 'flex',
                            justifyContent: 'center',
                            position: "relative"
                        }}
                        onMouseLeave={() => setHoverIndex(null)}>
                            <img src={`http://localhost:8080/${photo}`}
                                 style={{width: '100%', height: '200px', objectFit: 'cover', border: '3px solid black'}}
                                 alt={`Photo ${index + 1}`} onClick={() => handleOpen(index)}
                                 onMouseEnter={() => setHoverIndex(index)}
                                 />
                            {index == hoverIndex && currentUserId == userId &&
                                <CloseIcon sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    background: 'black',
                                    borderRadius: '50%',
                                    margin:'5px',
                                    color:'gray'
                                }} onClick={() => deletePhoto(index)}/>}
                        </div>
                    ))}

                </Paper>
                {photos.length > 6 && (
                    <Button variant="contained" onClick={() => setShowAll(!showAll)}
                            sx={{display: 'block', marginTop: '20px', marginBottom: '20px', justifySelf: 'flex-end'}}>
                        {showAll ? 'Показать меньше' : 'Показать все'}
                    </Button>
                )}
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={photo_box_style}>
                    <Carousel fullHeightHover={true} autoPlay={false} changeOnFirstRender={true} index={selectedIndex}
                              height={750} className={'photo'}>
                        {photos.map((url, index) => (
                            <Box key={index} sx={{width: 1750, textAlign: 'center'}}>
                                <p style={{
                                    width: 1750,
                                    height: "100%",
                                    background: "rgba(0,0,0,0.5)",
                                    position: "absolute",
                                    zIndex: -1,
                                    right: 0,
                                    top: -16
                                }}></p>
                                <img src={"http://localhost:8080/" + url} alt={`Preview ${url}`}
                                     style={{maxWidth: 1750, height: 750, objectFit: 'cover'}}/>
                            </Box>

                        ))}
                    </Carousel>

                </Box>
            </Modal>
        </>
    );
};

