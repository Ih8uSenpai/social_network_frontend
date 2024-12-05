import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavigationList from "../common/navigationList";
import {ProfileData} from "../utils/Types";
import styles from "../profile/styles/UserProfile.module.css";
import {Box, Grid, IconButton, List, ListItem, Paper} from "@mui/material";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import {GridRow} from "@mui/x-data-grid-pro";
import {defaultProfileIcon} from "../utils/Constants";

interface User {
    userId: number;
    username: string;
}


interface FollowingProps {
    fullSize: boolean;
    size?: number;
    update: number;
    setUpdate;
}

export const FollowingPage = () => {

    return (
        <>
            <Following fullSize={true} update={0} setUpdate={() => []}/>
        </>
    );
};

export async function fetchFollowing(userId: string, currentUserId): Promise<ProfileData[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Токен не найден');
        return;
    }

    try {
        const validatedUserId = userId ? userId : currentUserId;
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profiles/${validatedUserId}/following`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
            //setFollowing(data);
        } else {
            console.error('Ошибка при получении списка подписчиков');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export const Following: React.FC<FollowingProps> = ({
                                                        fullSize,
                                                        size,
                                                        update,
                                                        setUpdate
                                                    }) => {
    const {userId} = useParams();
    const currentUserId = localStorage.getItem("currentUserId");
    const defaultProfileIcon = `${process.env.REACT_APP_BACK_BASE_URL}/src/main/resources/static/standart_icon.jpg`;
    const [following, setFollowing] = useState<ProfileData[]>([]);
    const [hoveredProfileId, setHoveredProfileId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchFollowing(userId, currentUserId).then((value) => setFollowing(value));
        }
    }, [userId, update, currentUserId]);


    return (
        <div style={{marginTop: 0, paddingTop: 0}}>
            {fullSize && (
                <div style={{position: "relative"}}>
                    <IconButton onClick={()=>navigate(-1)} style={{
                        color: "white",
                        cursor:"pointer",
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius:'50%',
                        margin:5,
                        position:"absolute",
                        zIndex:1
                    }}>
                        <KeyboardReturnIcon fontSize={"large"}
                        />
                    </IconButton>


                    <List style={{marginTop: 0, paddingTop: 10, background:"transparent"}}>
                        <div className="follower-entry-container" style={{width: '100%'}}>
                            {following.map(profile => (
                                <div key={profile.profileId} className="follower-entry" style={{width: '100%'}}>
                                    <p
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}>
                                        <img
                                            src={`${process.env.REACT_APP_STATIC_URL}/` + (profile?.profilePictureUrl || defaultProfileIcon)}
                                            alt={profile.user.username}
                                            className="follower-entry-icon"
                                            style={{
                                                marginRight: '10px',
                                                cursor: "pointer"
                                            }}
                                            onClick={() => navigate('/profile/' + profile.user.userId)}
                                        />
                                        <p
                                            style={{
                                                fontSize: '1.5em',
                                                color:'var(--text-color)',
                                                textDecoration: "none",
                                                alignSelf: "flex-start",
                                                marginLeft: '10px',
                                                cursor: "pointer"
                                            }}
                                            onClick={() => navigate('/profile/' + profile.user.userId)}
                                        >
                                            {profile.firstName} {profile.lastName}
                                        </p>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </List>
                </div>
            )}

            {!fullSize &&
                <List style={{
                    width: '100%',
                    height: 60,
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    background: "transparent",
                    paddingLeft: 5,
                    paddingRight: 5,
                    margin: 0
                }}>
                    {(following.length < size ? following : following.slice(0, size)).map((profile, index) => (


                        <ListItem key={index}
                                  style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginBottom: '10px',
                                      margin: 0,
                                      padding: 0,
                                      width: 100,
                                      background: "transparent"
                                  }}
                                  onMouseEnter={() => setHoveredProfileId(profile.profileId)}
                                  onMouseLeave={() => setHoveredProfileId(null)}>
                            <a href={`/profile/${profile.user.userId}`} style={{marginRight: '10px'}}>
                                <img
                                    src={`${process.env.REACT_APP_STATIC_URL}/` + (profile?.profilePictureUrl || defaultProfileIcon)}
                                    alt={profile.user.username}
                                    className="follower-entry-icon-small"
                                />
                            </a>
                            {hoveredProfileId === profile.profileId && (
                                <Paper elevation={4} sx={{
                                    position: 'absolute',
                                    top: -110,
                                    padding: 2,
                                    margin: 'auto',
                                    maxWidth: 200,
                                    width: 100,
                                    textAlign: 'center',
                                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                                    marginTop: 5
                                }}>
                                    {profile.firstName} {profile.lastName}
                                </Paper>
                            )}
                        </ListItem>

                    ))}
                    {following.length == 0 &&
                        <Box sx={{color: '#999', width: '100%', textAlign: 'center'}}>looks like there's no following
                            yet</Box>}
                </List>}

        </div>

    );
};
