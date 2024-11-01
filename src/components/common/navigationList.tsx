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
import {logout} from "../auth/service/UserService";


const NavigationList = ({setIsMusicPage}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('authToken');
    const currentUserId = localStorage.getItem('currentUserId');
    const profileUrl = currentUserId ? "/profile/" + currentUserId : "/profile";
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
        <ul className="navigation-list">

            <form onSubmit={handleSearch} className="header-search" style={{marginBottom: "30px", marginTop:"30px"}}>
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
            <li onClick={handleLogout} className={"logout-btn"}><ExitToAppIcon/>Logout</li>
        </ul>
    );
};

export default NavigationList;
