import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './styles/Login.css'
// @ts-ignore
import {LicenseInfo} from "@mui/x-date-pickers-pro";
// @ts-ignore
import music1 from "../resources/music/la_vaguette.mp3";
// @ts-ignore
import music2 from "../resources/music/hope.mp3";
// @ts-ignore
import music3 from "../resources/music/HOYO-MiX - Emberfire Instrumental.mp3";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import {Register} from "./register";
import { ThemeProvider, useTheme } from "../themes/ThemeContext";
LicenseInfo.setLicenseKey(
    'e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y',
);

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const audioRef = useRef(new Audio());
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState('');
    const musicTracks = [music1, music2, music3];
    const [register, setRegister] = useState(false);
    const [randomIndex, setRandomIndex] = useState(0);
    const { isDarkMode, toggleTheme } = useTheme();
    const video = isDarkMode ? "/video/bg1.mp4" : "/video/bg4.mp4";
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            setIsMusicPlaying(true);
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUserId', data.user.userId);
            navigate("/news/");
        } else {
            console.error('Ошибка при входе');
        }
    };

    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying);
    };

    const selectRandomTrack = () => {
        setRandomIndex(Math.floor(Math.random() * musicTracks.length));
        return musicTracks[randomIndex];
    };

    const selectNextTrack = () => {
        setRandomIndex((randomIndex + 1) % musicTracks.length);
        return musicTracks[randomIndex];
    };


    useEffect(() => {
        if (!currentTrack) {
            setCurrentTrack(selectRandomTrack());
            if (!audioRef.current.paused)
                setIsMusicPlaying(true);
        }
    }, []);

    useEffect(() => {
        if (isMusicPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isMusicPlaying]);

    useEffect(() => {
        audioRef.current.src = currentTrack;
    }, [currentTrack]);

    useEffect(() => {
        const handleTrackEnd = () => {
            const nextTrack = selectNextTrack();
            setCurrentTrack(nextTrack);
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleTrackEnd);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleTrackEnd);
            }
        };
    }, [currentTrack]);


    return (
        <div className="video-background">
            <video src={video} autoPlay loop muted/>

            <audio ref={audioRef} autoPlay hidden src={music1} onPlay={() => setIsMusicPlaying(true)}/>

            <button type="button" onClick={toggleMusic} style={{
                marginTop: 10,
                marginLeft: 10,
                borderRadius: 100,
                background: "rgba(0,0,0,0.5)",
                color: "white"
            }}>
                {isMusicPlaying ? (<MusicNoteIcon/>) : <MusicOffIcon/>}
            </button>

            {register == false ?
                <div className="auth-container">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input className="auth-input"
                               type="text"
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               placeholder="Username"
                        />
                        <input className="auth-input"
                               type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               placeholder="Password"
                        />
                        <button type="submit" className="login-btn">Login</button>
                        <button type="button" className="register-btn" onClick={() => setRegister(true)}>Register
                        </button>
                    </form>
                </div> :
                <Register register={register} setRegister={setRegister}/>
            }

        </div>

    );

};

