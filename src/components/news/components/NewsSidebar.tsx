import * as React from 'react';

import {
    Box,
    Card,
    CardContent,
    Container,
    createTheme,
    Grid,
    List, ListItem,
    Paper,
    ThemeProvider,
    Typography
} from "@mui/material";
import {darkTheme} from "../../profile/themes/DarkTheme";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {logout} from "../../auth/service/UserService";
import {fetchLikedPosts, fetchPosts, fetchRecommendedPosts} from "../../profile/service/PostService";
import {fetchNewsFeed} from "../service/NewsService";
import axios from "axios";


interface NewsSidebarProps {
    section: string;
    setSection;
    onSectionChange;
    setPosts;
}

export const NewsSidebar: React.FC<NewsSidebarProps> = ({
                                                            section, setSection, onSectionChange, setPosts
                                                        }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('authToken');
    const currentUserId = localStorage.getItem('currentUserId');
    const currentProfileId = localStorage.getItem('currentProfileId');
    const profileUrl = currentUserId ? "/profile/" + currentUserId : "/profile";
    const handleLogout = () => {
        logout(token);
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/api/posts/search', {
                params: { query: search },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setPosts(response.data);
        } catch (error) {
            console.error('Ошибка при поиске треков:', error);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>

            <Paper elevation={4} sx={{padding: 2, margin: 'auto', maxWidth: 600, bgcolor: 'rgba(0, 0, 0, 0.4)'}}>
                <form onSubmit={handleSearch} className="header-search header-search-full-width"
                      style={{marginBottom: "30px", marginTop: "30px"}}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for posts..."
                    />
                </form>
                <List>
                    <ListItem className={section === "news" ? "active" : ""}
                              onClick={() => {onSectionChange("news");
                                  fetchNewsFeed(Number(currentUserId), token)
                                      .then((posts) => {
                                          setPosts(posts);
                                      });}}>News</ListItem>
                    <ListItem className={section === "liked" ? "active" : ""}
                              onClick={() => {onSectionChange("liked");
                                  fetchLikedPosts(token)
                                      .then((posts) => {
                                          setPosts(posts);
                                      });}}>Liked</ListItem>
                    <ListItem className={section === "recommendations" ? "active" : ""}
                              onClick={() =>
                              {
                                  onSectionChange("recommendations");
                                  fetchRecommendedPosts(token)
                                      .then((posts) => {
                                          setPosts(posts);
                                      });
                              }}>Recommendations</ListItem>
                </List>
            </Paper>

        </ThemeProvider>
    );
}