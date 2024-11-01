// UserProfileInfo.tsx
import '../styles/UserProfileOptionalData.css' // Импорт стилей
import {calculateAge, updateProfile} from "../service/ProfileService";
import {ProfileData} from "../../utils/Types";
import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {Box, Paper, Typography} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {darkTheme} from "../themes/DarkTheme";
import EditIcon from '@mui/icons-material/Edit';
import {fetchComments} from "../../comments/service/CommentService";

interface UserProfileInfoProps {
    profile: ProfileData;
    token: string;
    fetchProfile;
}


export const UserProfileOptionalData: React.FC<UserProfileInfoProps> = ({
                                                                            profile,
                                                                            token,
                                                                            fetchProfile
                                                                        }) => {
    const age = calculateAge(profile.birthdate);
    const [isEditing, setIsEditing] = useState(false);
    const [editAboutMe, setEditAboutMe] = useState<string>();
    const [editBirthdate, setEditBirthdate] = useState<Date | null>();
    const [editCountry, setEditCountry] = useState<string>();
    const [editInterests, setEditInterests] = useState<string>();
    const currentUserId = Number(localStorage.getItem("currentUserId"));

    useEffect(() => {
        if (profile.user.userId == currentUserId){
            setEditAboutMe(profile.about_me || '');
            setEditBirthdate(profile.birthdate ? new Date(profile.birthdate) : null);
            setEditCountry(profile.country || '');
            setEditInterests(profile.interests || '');
        }
    }, [profile]);

    const handleSave = () => {
        const updates = {
            about_me: editAboutMe,
            birthdate: editBirthdate,
            country: editCountry,
            interests: editInterests,
        };

        updateProfile(profile, updates, token)
            .then(() => fetchProfile())
            .then(() => setIsEditing(false));
    };

    return (
            <Paper elevation={4} sx={{padding: 2, margin: 'auto', maxWidth: 600, bgcolor: 'rgba(0, 0, 0, 0.4)'}}>
                {isEditing ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <TextField
                                label="About Me"
                                variant="outlined"
                                fullWidth
                                value={editAboutMe}
                                onChange={(e) => setEditAboutMe(e.target.value)}
                            />
                            <DatePicker
                                label="Birthdate"
                                value={editBirthdate}
                                onChange={setEditBirthdate}
                                slotProps={{textField: {variant: 'outlined'}}}/>
                            <TextField
                                label="Country"
                                variant="outlined"
                                fullWidth
                                value={editCountry}
                                onChange={(e) => setEditCountry(e.target.value)}
                            />
                            <TextField
                                label="Interests"
                                variant="outlined"
                                fullWidth
                                value={editInterests}
                                onChange={(e) => setEditInterests(e.target.value)}
                            />
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </form>
                    </LocalizationProvider>
                ) : (
                    <Box sx={{position:"relative"}}>
                        <Typography variant="h6">About Me</Typography>
                        <Typography><span style={{color:'#bbb'}}>Bio:</span> {profile.about_me ? profile.about_me : "-"}</Typography>
                        <Typography><span style={{color:'#bbb'}}>Age:</span> {age ? age : "-"}</Typography>
                        <Typography><span style={{color:'#bbb'}}>Country:</span> {profile.country ? profile.country : "-"}</Typography>
                        <Typography><span style={{color:'#bbb'}}>Interests:</span> {profile.interests ? profile.interests : "-"}</Typography>
                        {profile.user.userId == currentUserId &&
                            <button className={'user-profile-optional-data-button'} onClick={() => setIsEditing(true)} style={{position:"absolute", top:-10, right:-10}}>
                                <EditIcon/>
                            </button>}
                    </Box>
                )}
            </Paper>
    );
};



