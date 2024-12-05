import React, {useEffect, useRef, useState} from 'react';
import '../styles/profile.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../../utils/Types";
import {handleMessage} from "../service/ChatService";
import {defaultBannerImage, defaultProfileIcon} from "../../utils/Constants";
import {UserInfo} from "./UserInfo";
import {CropAvatar} from "./CropAvatar";
import Button from "@mui/material/Button";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {CropBanner} from "./CropBanner";

interface ProfileBannerProps {
    userId: string
    currentUserId: string;
    chatId: number;
    token: string;
    profile: ProfileData;
    isExisting: boolean;
    fetchProfile;
    navigate: NavigateFunction;
    isFollowing: boolean;
    handleFollowToggle;
    height?: string;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
                                                                userId,
                                                                currentUserId,
                                                                chatId,
                                                                token,
                                                                profile,
                                                                isExisting,
                                                                fetchProfile,
                                                                navigate,
                                                                isFollowing,
                                                                handleFollowToggle,
                                                                height = "300px"
                                                            }) => {
    const [image, setImage] = useState<File | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showWindow, setShowWindow] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [activeForm, setActiveForm] = useState<'banner' | 'icon' | null>(null);
    const isOwnProfile = currentUserId === userId || userId == null;
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        if (!showWindow) {
            console.log("showwindow=false")
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
        else {
            console.log("else showwindow=true")
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [settingsRef, showWindow]);

    const handleBannerSelect = () => {
        if (bannerInputRef.current) {
            bannerInputRef.current.click();
        }
    };


    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (profile != null) {
            if (e !== undefined)
                e.preventDefault();
            if (profile && image) { // проверка на существование профиля и изображения
                const formData = new FormData();
                formData.append('image', image);

                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error('Токен не найден');
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/profiles/upload-${activeForm}/${profile.user.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    method: 'POST',
                    body: formData,
                });


                if (response.ok) {
                    await fetchProfile();
                }
            }
        }
    };


    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
            setActiveForm('banner'); // Устанавливаем активной форму баннера
            e.target.value = '';
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
            setActiveForm('icon'); // Устанавливаем активной форму иконки
            e.target.value = '';
        }
    };

    useEffect(() => {
        if (image) {
            if (activeForm === 'banner' && bannerInputRef.current) {
                bannerInputRef.current.form?.requestSubmit();
            }
        }
    }, [image, activeForm]);


    return (
        <div className="profile-banner" style={{height: height}}>

            {isOwnProfile && (
                <div ref={settingsRef}>
                    <button className="settings-button"
                            onClick={() => setShowSettings(!showSettings)}><MoreHorizIcon/>
                    </button>

                    {showSettings && (
                        <div className="settings-menu">
                            <ul>
                                <li>
                                    <button><CropBanner
                                        profile={profile} token={token} fetchProfile={fetchProfile}
                                        setShowWindow={setShowWindow} setShowSettings={setShowSettings}/></button>
                                </li>
                                <li>
                                    <button><CropAvatar
                                        profile={profile} token={token} fetchProfile={fetchProfile}
                                        setShowWindow={setShowWindow} setShowSettings={setShowSettings}/></button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{display: 'none'}}>
                <input type="file" name={"image"} onChange={handleBannerChange} ref={bannerInputRef}
                       style={{display: 'none'}}/>
                <button type="submit">Загрузить</button>
            </form>

            <div className="banner-image-container">
                <img
                    src={`${process.env.REACT_APP_STATIC_URL}/` + (profile.profileBannerPictureUrl || defaultBannerImage)}
                    alt="Banner"
                    className="banner-image"
                />
            </div>
            <UserInfo userId={userId} currentUserId={currentUserId} chatId={chatId} token={token} profile={profile}
                      isExisting={isExisting} navigate={navigate} isFollowing={isFollowing}
                      handleFollowToggle={handleFollowToggle}/>
        </div>
    );
};