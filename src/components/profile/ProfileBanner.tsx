import React, {useEffect, useRef, useState} from 'react';
import './styles/profile.css';
import {NavigateFunction} from 'react-router-dom';
import {ProfileData} from "../messages/Types";
import {handleMessage} from "./service/ChatService";
import {defaultBannerImage, defaultProfileIcon} from "../utils/Constants";
import {UserInfo} from "./UserInfo";
import {CropTest} from "./CropTest";
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
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [activeForm, setActiveForm] = useState<'banner' | 'icon' | null>(null);
    const isOwnProfile = currentUserId === userId || userId == null;



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

                const response = await fetch(`http://localhost:8080/api/profiles/upload-${activeForm}/${profile.user.userId}`, {
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
                <>
                    <button className="settings-button"
                            onClick={() => setShowSettings(!showSettings)}><MoreHorizIcon/>
                    </button>

                    {showSettings && (
                        <div className="settings-menu">
                            <ul>
                                <li>
                                    <button><CropBanner profile={profile} token={token} fetchProfile={fetchProfile}/></button>
                                </li>
                                <li>
                                    <button><CropTest profile={profile} token={token} fetchProfile={fetchProfile}/></button>
                                </li>
                            </ul>
                        </div>
                    )}
                </>
            )}

            <form onSubmit={handleSubmit} style={{display: 'none'}}>
                <input type="file" name={"image"} onChange={handleBannerChange} ref={bannerInputRef}
                       style={{display: 'none'}}/>
                <button type="submit">Загрузить</button>
            </form>

            <div className="banner-image-container">
                <img
                    src={profile.profileBannerPictureUrl || defaultBannerImage}
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