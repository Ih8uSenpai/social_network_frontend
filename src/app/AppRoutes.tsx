import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from '../components/auth/login';
import { Messages } from '../components/messages/Messages';
import { ProfilePage } from '../components/profile/ProfilePage';
import Search from '../components/search/Search';
import { FollowersPage } from '../components/followers/Followers';
import { FollowingPage } from '../components/followers/Following';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { MusicPage } from '../components/Music/MusicPage';
import { NewsPage } from '../components/news/NewsPage';
import SettingsPage from '../components/settings/SettingsPage';
import { WebSocketProvider } from '../components/websocket/WebSocketContext';
import Layout from '../components/common/Layout';
import ErrorBoundary from "../shared/components/ErrorBoundary";

interface Props {
    selectedTrack: any;
    setSelectedTrack: (track: any) => void;
    isVisible: boolean;
    setIsVisible: (v: boolean) => void;
    isMusicPage: boolean;
    setIsMusicPage: (v: boolean) => void;
}

const AppRoutes: React.FC<Props> = ({
                                        selectedTrack,
                                        setSelectedTrack,
                                        isVisible,
                                        setIsVisible,
                                        isMusicPage,
                                        setIsMusicPage
                                    }) => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="*"
                element={
                    <Layout
                        selectedTrack={selectedTrack}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        isMusicPage={isMusicPage}
                        setIsMusicPage={setIsMusicPage}
                    >
                        <ErrorBoundary>
                            <Routes>
                                <Route
                                    path="/music"
                                    element={
                                        <MusicPage
                                            selectedTrack={selectedTrack}
                                            setSelectedTrack={setSelectedTrack}
                                        />
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage
                                                selectedTrack={selectedTrack}
                                                setSelectedTrack={setSelectedTrack}
                                                isVisible={isVisible}
                                                setIsVisible={setIsVisible}
                                            />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile/:userId"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage
                                                selectedTrack={selectedTrack}
                                                setSelectedTrack={setSelectedTrack}
                                                isVisible={isVisible}
                                                setIsVisible={setIsVisible}
                                            />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile/:userId/followers"
                                    element={
                                        <ProtectedRoute>
                                            <FollowersPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile/:userId/following"
                                    element={
                                        <ProtectedRoute>
                                            <FollowingPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/settings/account"
                                    element={
                                        <ProtectedRoute>
                                            <SettingsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/search"
                                    element={
                                        <ProtectedRoute>
                                            <Search />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/messages"
                                    element={
                                        <ProtectedRoute>
                                            <Messages />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/messages/:chatId"
                                    element={
                                        <ProtectedRoute>
                                            <WebSocketProvider>
                                                <Messages />
                                            </WebSocketProvider>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/news"
                                    element={
                                        <NewsPage
                                            selectedTrack={selectedTrack}
                                            setSelectedTrack={setSelectedTrack}
                                            isVisible={isVisible}
                                            setIsVisible={setIsVisible}
                                        />
                                    }
                                />
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage
                                                selectedTrack={selectedTrack}
                                                setSelectedTrack={setSelectedTrack}
                                                isVisible={isVisible}
                                                setIsVisible={setIsVisible}
                                            />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </ErrorBoundary>
                    </Layout>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
