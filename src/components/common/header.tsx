import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/header.css';
import {logout} from "../auth/service/UserService";

const Header = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('authToken');

    const handleLogout = () => {
        logout(token)
            .then(() => {
            localStorage.removeItem('authToken');
            navigate('/login');
        });
    };

    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        navigate(`/search?query=${search}`); // Переход на страницу поиска с запросом
    };

    return (
        <div className="header">
            <button onClick={handleLogout}>Logout</button>
            <form onSubmit={handleSearch} className="header-search">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
            </form>

        </div>
    );
};

export default Header;

