import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {defaultProfileIcon} from "./Constants";

const UserTooltip = ({tag}) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const hideTimeout = useRef(null);
    const navigate = useNavigate();


    const fetchProfile = async () => {
        if (profile || loading) return;
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Auth token not found');
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profiles/findByTag?tag=${tag}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
        } catch (err) {
            setError('User not found');
        } finally {
            setLoading(false);
        }
    };
    const showTooltipHandler = () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setShowTooltip(true);
        fetchProfile();
    };

    const hideTooltipHandler = () => {
        hideTimeout.current = setTimeout(() => {
            setShowTooltip(false);
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        };
    }, []);

    return (
        <span
            onMouseEnter={showTooltipHandler}
            onMouseLeave={hideTooltipHandler}
            style={{ position: 'relative', color: '#1da1f2', cursor: 'pointer' }}
        >
            @{tag}
            {showTooltip && profile && (
                <div
                    className="tooltip-content"
                    onMouseEnter={() => clearTimeout(hideTimeout.current)}
                    style={{
                        position: 'absolute', top: '-75px', left: 0, backgroundColor: '#fff',
                        padding: '10px', borderRadius: '5px', border: '1px solid #ddd',
                        display: 'flex', alignItems: 'flex-start', zIndex: 1000,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '5px',
                        width: '200px', fontSize: '0.9em'
                    }}
                    onClick={() => navigate('/profile/' + profile.user.userId)}
                >
                    <img src={`${process.env.REACT_APP_STATIC_URL}/` + (profile?.profilePictureUrl || defaultProfileIcon)} alt="avatar" style={{
                        width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'
                    }} />
                    <div>
                        <strong>{profile.firstName} {profile.lastName}</strong><br />
                        <span style={{ color: '#666', fontSize: '0.8em' }}>{profile.about_me}</span>
                    </div>
                </div>
            )}
            {showTooltip && loading && (
                <div className="tooltip-content" style={{
                    position: 'absolute', top: '100%', left: 0, backgroundColor: '#fff',
                    padding: '10px', borderRadius: '5px', border: '1px solid #ddd',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '5px',
                    fontSize: '0.9em', color: '#666'
                }}>Loading...</div>
            )}
            {showTooltip && error && (
                <div className="tooltip-content" style={{
                    position: 'absolute', top: '100%', left: 0, backgroundColor: '#fff',
                    padding: '10px', borderRadius: '5px', border: '1px solid #ddd',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '5px',
                    fontSize: '0.9em', color: 'red'
                }}>{error}</div>
            )}
        </span>
    );


};

export const formatText = (text: string) => {
    if (!text) return;

    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
        const words = line.split(' ');

        const formattedWords = words.map((word, wordIndex) => {
            if (word.startsWith('#')) {
                return (
                    <span key={wordIndex} style={{color: '#1da1f2'}}>
                        {word}{' '}
                    </span>
                );
            } else if (word.startsWith('@')) {
                const tag = word.substring(1);
                return (
                    <span>
                    <UserTooltip key={wordIndex} tag={tag}/>
                        {' '}
                        </span>
                );
            }

            return word + ' ';
        });

        return (
            <React.Fragment key={lineIndex}>
                {formattedWords}
                {lineIndex < lines.length - 1 && <br/>}
            </React.Fragment>
        );
    });
};
