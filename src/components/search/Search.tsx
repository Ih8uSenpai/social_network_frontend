import React, {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Header from "../common/header";
import NavigationList from "../common/navigationList";
import {ChatListView} from "../messages/components/ChatListView";
import {ChatView} from "../messages/components/ChatView";
import './Search.css'
import {ProfileData} from "../utils/Types";
import styles from "../profile/styles/UserProfile.module.css";
import {ProfileBanner} from "../profile/components/ProfileBanner";
import {AdditionalInfo} from "../profile/components/Additionalnfo";
import {NavigationButtonsPanel} from "../profile/components/NavigationButtonsPanel";
import PostCreator from "../news/components/postCreator";
import PostsFeed from "../news/components/PostsFeed";
import {UserProfileOptionalData} from "../profile/components/UserProfileOptionalData";
import UserInfoSection from "../profile/components/UserInfoSection";
import {MusicPage} from "../Music/MusicPage";
import {defaultProfileIcon} from "../utils/Constants";

interface User {
    userId: number;
    username: string;
}


const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [profiles, setProfiles] = useState<ProfileData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Токен не найден');
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profiles/search?query=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setProfiles(data);
            } catch (err) {
                setError('Failed to fetch profiles');
            } finally {
                setIsLoading(false);
            }
        };

        if (query) {
            fetchProfiles();
        }
    }, [query]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div>
                <h2 style={{color: "white"}}>Search Results for "{query}"</h2>
                <ul>
                    {profiles.map(profile => (
                        <div className="follower-entry-container">
                            <li key={profile.profileId}
                                style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <img
                                    src={`${process.env.REACT_APP_STATIC_URL}/` + (profile.profilePictureUrl || defaultProfileIcon)}
                                    alt={profile.user.username}
                                    className="follower-entry-icon"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        marginRight: '10px',
                                        cursor: "pointer"
                                    }}
                                    onClick={() => navigate('/profile/' + profile.user.userId)}
                                />
                                <p
                                    style={{
                                        fontSize: '1.5em',
                                        color: "white",
                                        textDecoration: "none",
                                        alignSelf: "flex-start",
                                        marginLeft: '10px',
                                        cursor:"pointer"
                                    }}
                                    onClick={() => navigate('/profile/' + profile.user.userId)}>
                                    {profile.firstName} {profile.lastName}
                                </p>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
};


export default Search;
