import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Login} from './components/auth/login';
import {Messages} from "./components/messages/Messages";
import {ProfilePage} from "./components/profile/ProfilePage";
import Search from "./components/search/Search";
import {FollowersPage} from "./components/followers/Followers";
import {FollowingPage} from "./components/followers/Following";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import {WebSocketProvider} from "./components/websocket/WebSocketContext";
import {MusicPage} from "./components/Music/MusicPage";
import {ThemeProvider} from "./components/themes/ThemeContext";
import {AdapterDayjs} from '@mui/x-date-pickers-pro/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers-pro';
import {NewsPage} from "./components/news/NewsPage";
import {AudioPlayerProvider} from "./components/Music/components/AudioPlayerContext";
import Layout from "./components/common/Layout";
import SettingsPage from "./components/settings/SettingsPage";

function App() {
    const [selectedTrack, setSelectedTrack] = React.useState(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isMusicPage, setIsMusicPage] = React.useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AudioPlayerProvider selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="*" element={
                                <Layout selectedTrack={selectedTrack} isVisible={isVisible} setIsVisible={setIsVisible} isMusicPage={isMusicPage} setIsMusicPage={setIsMusicPage}>
                                    <Routes>
                                        <Route path="/music" element={<MusicPage selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack}/>}/>

                                        <Route path="/profile"
                                               element={<ProtectedRoute><ProfilePage selectedTrack={selectedTrack}
                                                                                     setSelectedTrack={setSelectedTrack}
                                                                                     isVisible={isVisible}
                                                                                     setIsVisible={setIsVisible}/></ProtectedRoute>}/>
                                        <Route path="/messages" element={<ProtectedRoute>

                                            <Messages/>

                                        </ProtectedRoute>}/>
                                        <Route path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>}/>
                                        <Route path="/profile/:userId"
                                               element={<ProtectedRoute><ProfilePage selectedTrack={selectedTrack}
                                                                                     setSelectedTrack={setSelectedTrack}
                                                                                     isVisible={isVisible}
                                                                                     setIsVisible={setIsVisible}/></ProtectedRoute>}/>
                                        <Route path="/profile/:userId/followers"
                                               element={<ProtectedRoute><FollowersPage/></ProtectedRoute>}/>
                                        <Route path="/profile/:userId/following"
                                               element={<ProtectedRoute><FollowingPage/></ProtectedRoute>}/>
                                        <Route path="/settings/account"
                                               element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>
                                        <Route path="/"
                                               element={<ProtectedRoute><ProfilePage selectedTrack={selectedTrack}
                                                                                     setSelectedTrack={setSelectedTrack}
                                                                                     isVisible={isVisible}
                                                                                     setIsVisible={setIsVisible}/></ProtectedRoute>}/>

                                        <Route path="/messages/:chatId" element={<ProtectedRoute>
                                            <WebSocketProvider>
                                                <Messages/>
                                            </WebSocketProvider>
                                        </ProtectedRoute>}/>

                                        <Route path="/news" element={<NewsPage selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} isVisible={isVisible} setIsVisible={setIsVisible}/>}/>
                                    </Routes>
                                </Layout>}/>
                        </Routes>

                    </Router>
                </AudioPlayerProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;
