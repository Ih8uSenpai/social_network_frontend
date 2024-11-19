import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './styles/navigationStyle.css'
import './styles/header.css'
import logo from '../resources/images/robin2.png'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MessageIcon from '@mui/icons-material/Message';
import FeedIcon from '@mui/icons-material/Feed';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SettingsIcon from '@mui/icons-material/Settings';
import {logout} from "../auth/service/UserService";
import {defaultProfileIcon} from "../utils/Constants";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {handleMessage} from "../profile/service/ChatService";
import {OnlineStatus} from "../profile/components/OnlineStatus";
import {OfflineStatus} from "../profile/components/OfflineStatus";
import {Menu, MenuItem, Popover} from "@mui/material";
import { ThemeProvider, useTheme } from "../themes/ThemeContext";

const NavigationList = ({setIsMusicPage, profile}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('authToken');
    const currentUserId = localStorage.getItem('currentUserId');
    const profileUrl = currentUserId ? "/profile/" + currentUserId : "/profile";
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout(token);
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        navigate(`/search?query=${search}`); // Переход на страницу поиска с запросом
    };

    return (
        <div className="navigation-list-positioning">

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disablePortal
                disableScrollLock
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                style={{top:"-80px"}}
            >
                <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>



            <ul className="navigation-list">

                <form onSubmit={handleSearch} className="header-search"
                      style={{marginBottom: "30px", marginTop: "30px"}}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                    />
                </form>
                <li onClick={() => setIsMusicPage(false)}><Link to={profileUrl}><AccountBoxIcon/> My profile</Link></li>
                <li onClick={() => setIsMusicPage(false)}><Link to="/news"><FeedIcon/> News</Link></li>
                <li onClick={() => setIsMusicPage(false)}><Link to="/messages"><MessageIcon/> Messages</Link></li>
                <li onClick={() => setIsMusicPage(true)}><Link to="/music"><LibraryMusicIcon/> Music</Link></li>
                <li onClick={() => setIsMusicPage(true)}><Link to="/settings/account"><SettingsIcon/> Settings</Link></li>
            </ul>
            <div className={"user-details-on-panel"} onClick={handleClick}>
                <img
                    src={profile?.profilePictureUrl || defaultProfileIcon}
                    alt="User Icon"
                    className="avatar"
                    style={{height: "50px", width: "50px", marginLeft: "10px"}}
                />

                <div style={{display: "flex", flexDirection: "column"}}>
                <span style={{
                    fontWeight: "bold",
                    color:"var(--text-color5)"
                }}>{profile?.firstName} {profile?.lastName}</span>
                    <span className="tag" style={{color:"var(--text-color4)"}}>@{profile?.tag}</span>
                </div>
                <span style={{alignSelf: "center", color: "var(--text-color)", marginLeft: "30px"}}><MoreHorizIcon/></span>



            </div>

        </div>
    );
};

export default NavigationList;
