import React, {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {ProfileData} from "../../utils/Types";
import {defaultProfileIcon} from "../../utils/Constants";
interface User {
    userId: number;
    username: string;
    // Другие свойства пользователя
}


const SearchMessages = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [messages, setMessages] = useState<ProfileData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Токен не найден');
                // Обработка отсутствия токена, например, перенаправление на страницу входа
            }
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profiles/search?query=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        // Добавьте здесь любые другие заголовки, например, для аутентификации
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setMessages(data);
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
                    {messages.map(profile => (
                        <div className="follower-entry-container">
                            <li key={profile.profileId}
                                style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                <a href={`/profile/${profile.user.userId}`} style={{marginRight: '10px'}}>
                                    <img
                                        src={`${process.env.REACT_APP_STATIC_URL}/` + (profile.profilePictureUrl || defaultProfileIcon)}
                                        alt={profile.user.username}
                                        className="follower-entry-icon"
                                        style={{width: '100px', height: '100px', borderRadius: '50%'}}
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
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
};


export default SearchMessages;
