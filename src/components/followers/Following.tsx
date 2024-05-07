import React, {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {ProfileData} from "../messages/Types";
import styles from '../new_design/styles/UserProfile.module.css';
import NavigationList from "../common/navigationList";
import {List, ListItem} from "@mui/material";

interface User {
    userId: number;
    username: string;
    // Другие свойства пользователя
}


const Following = () => {
    const {userId} = useParams();
    const defaultProfileIcon = "http://localhost:8080/src/main/resources/static/standart_icon.jpg";
    const [following, setFollowing] = useState<ProfileData[]>([]);


    const fetchFollowing = async () => {
        const currentUserId = localStorage.getItem("currentUserId");
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Токен не найден');
            return;
        }

        try {
            const validatedUserId = userId ? userId : currentUserId;
            const response = await fetch(`http://localhost:8080/api/profiles/${validatedUserId}/following`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFollowing(data);
            } else {
                console.error('Ошибка при получении списка подписчиков');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    useEffect(() => {
        if (userId) {
            fetchFollowing();
        }
    }, [userId]);


    return (
        <>
            <div>
                <List>
                    {following.map(profile => (
                        <div className="follower-entry-container">
                            <ListItem key={profile.profileId}
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
                            </ListItem>
                        </div>
                    ))}
                </List>
            </div>
        </>

    );
};


export default Following;
