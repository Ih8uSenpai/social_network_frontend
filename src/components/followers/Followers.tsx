import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import NavigationList from "../common/navigationList";
import {ProfileData} from "../messages/Types";
import styles from "../new_design/styles/UserProfile.module.css";
import {Box, List, ListItem, Paper} from "@mui/material";


interface User {
    userId: number;
    username: string;
}


interface FollowersProps {
    fullSize: boolean;
    size?: number;
    update: number;
    setUpdate;
}

export const FollowersPage = () => {

    return (
        <>
            <Followers fullSize={true} update={0} setUpdate={() => []}/>
        </>
    );
};

export async function fetchFollowers(userId: string, currentUserId): Promise<ProfileData[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Токен не найден');
        return;
    }

    try {
        const validatedUserId = userId ? userId : currentUserId;
        const response = await fetch(`http://localhost:8080/api/profiles/${validatedUserId}/followers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
            //setFollowers(data);
        } else {
            console.error('Ошибка при получении списка подписчиков');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export const Followers: React.FC<FollowersProps> = ({
                                                        fullSize,
                                                        size,
                                                        update,
                                                        setUpdate
                                                    }) => {
    const {userId} = useParams();
    const currentUserId = localStorage.getItem("currentUserId");
    const defaultProfileIcon = "http://localhost:8080/src/main/resources/static/standart_icon.jpg";
    const [followers, setFollowers] = useState<ProfileData[]>([]);
    const [hoveredProfileId, setHoveredProfileId] = useState<number | null>(null);

    useEffect(() => {
        if (userId) {
            fetchFollowers(userId, currentUserId).then((value) => setFollowers(value));
        }
    }, [userId, update, currentUserId]);


    return (
        <div style={{marginTop: 0, paddingTop: 0}}>
            {fullSize &&
                <List style={{marginTop: 0, paddingTop: 0}}>
                    {followers.map(profile => (
                        <List className="follower-entry-container">
                            <p key={profile.profileId}
                               style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <a href={`/profile/${profile.user.userId}`} style={{marginRight: '10px'}}>
                                    <img
                                        src={profile.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
                                        alt={profile.user.username}
                                        className="follower-entry-icon"
                                    />
                                </a>
                                <a href={`/profile/${profile.user.userId}`}
                                   style={{
                                       fontSize: '1.5em',
                                       color: "white",
                                       textDecoration: "none",
                                       alignSelf: "flex-start",
                                       marginLeft: '10px'
                                   }}>
                                    {profile.firstName} {profile.lastName}
                                </a>
                            </p>
                        </List>
                    ))}
                </List>}
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
                    {(followers.length < size ? followers : followers.slice(0, size)).map((profile, index) => (


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
                                    src={profile.profilePictureUrl || defaultProfileIcon} // Указать URL изображения по умолчанию
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
                    {followers.length == 0 &&
                        <Box sx={{color: '#999', width: '100%', textAlign: 'center'}}>looks like there's no followers
                            yet</Box>}
                </List>}

        </div>

    );
};
