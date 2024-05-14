// UserProfileInfo.tsx
import './styles/UserProfileOptionalData.css' // Импорт стилей
import {calculateAge, updateProfile} from "./service/ProfileService";
import {ProfileData} from "../messages/Types";
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {Box, Paper, Typography} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {darkTheme} from "./DarkTheme";
import EditIcon from '@mui/icons-material/Edit';

interface UserProfileInfoProps {
    profile: ProfileData;
    token: string;
    fetchProfile;
    isOwnProfile: boolean;
}


export const UserProfileOptionalData: React.FC<UserProfileInfoProps> = ({
                                                                            profile,
                                                                            token,
                                                                            fetchProfile,
                                                                            isOwnProfile
                                                                        }) => {
    const age = calculateAge(profile.birthdate);
    const [isEditing, setIsEditing] = useState(false);
    const [editAboutMe, setEditAboutMe] = useState(profile.about_me || '');
    const [editBirthdate, setEditBirthdate] = useState<Date | null>(profile.birthdate ? new Date(profile.birthdate) : null);
    const [editCountry, setEditCountry] = useState(profile.country || '');
    const [editInterests, setEditInterests] = useState(profile.interests || '');

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
                        {isOwnProfile &&
                            <button className={'user-profile-optional-data-button'} onClick={() => setIsEditing(true)} style={{position:"absolute", top:-10, right:-10}}>
                                <EditIcon/>
                            </button>}
                    </Box>
                )}
            </Paper>
    );
};



