import React, {ReactNode, useEffect, useState} from 'react';
import { Navigate } from 'react-router-dom';

const validateToken = async (token: string): Promise<boolean> => {
    const response = await fetch('http://localhost:8080/api/profiles/me', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    return response.ok;
}

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsAuthorized(false);
        } else {
            validateToken(token).then(isValid => {
                setIsAuthorized(isValid);
            });
        }
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>; // Или какой-то индикатор загрузки
    }

    return isAuthorized ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;