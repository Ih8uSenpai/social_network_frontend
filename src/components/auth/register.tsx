import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../common/header';
// @ts-ignore

interface Errors {
    username?: string;
    passwordHash?: string;
    email?: string;
    tag?: string;
    firstName?: string;
    lastName?: string;

    [key: string]: string | undefined;
}

interface RegisterProps {
    register: boolean;
    setRegister;
}

export const Register:React.FC<RegisterProps> = ({register, setRegister}) => {
    const [username, setUsername] = useState('');
    const [passwordHash, setPasswordHash] = useState('');
    const [email, setEmail] = useState('');
    const [tag, setTag] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const [errors, setErrors] = useState<Errors>({});

    const validate = () => {
        let tempErrors: Errors = {};
        if (!username) tempErrors.username = "username is required";
        else if (username.length < 3 || username.length > 20) tempErrors.username = "username must contain 3-20 symbols"
        if (!passwordHash) tempErrors.passwordHash = "password is required";
        else if (passwordHash.length < 6 || passwordHash.length > 50) tempErrors.passwordHash = "password must contain 6-50 symbols"
        if ((!email) && !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) tempErrors.email = "email address required";
        if (!firstName) tempErrors.firstName = "first name is required";
        if (!lastName) tempErrors.lastName = "last name is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmitRegister = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            try {
                const registrationResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, passwordHash, email, firstName, lastName, tag}),
                });

                if (registrationResponse.ok) {
                    const data = await registrationResponse.json();
                    // Предполагается, что токен находится в поле `token` ответа
                    const token = data.token;

                    // Сохранение токена в localStorage
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('currentUserId', data.user.userId);

                    // Переход на страницу профиля
                    navigate('/profile');
                } else {
                    // Обработка ошибок регистрации
                }
            } catch (error) {
                console.error('Ошибка при регистрации:', error);
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
        }
    };

    return (
            <div className="auth-container">
                {register &&
                    <form onSubmit={handleSubmitRegister} className="auth-form">
                        <input className="auth-input"
                               type="text"
                               value={username}
                               onChange={e => setUsername(e.target.value)}
                               placeholder="Username"
                        />
                        <input className="auth-input"
                               type="password"
                               value={passwordHash}
                               onChange={e => setPasswordHash(e.target.value)}
                               placeholder="Password"
                        />
                        <input className="auth-input"
                               type="email"
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               placeholder="Email"
                        />
                        <input className="auth-input"
                               type="text"
                               value={tag}
                               onChange={e => setTag(e.target.value)}
                               placeholder="Tag"
                        />
                        <input className="auth-input"
                               type="text"
                               value={firstName}
                               onChange={e => setFirstName(e.target.value)}
                               placeholder="First Name"
                        />
                        <input className="auth-input"
                               type="text"
                               value={lastName}
                               onChange={e => setLastName(e.target.value)}
                               placeholder="Last Name"
                        />
                        <button type="submit" className="register-btn">Register</button>
                        {Object.keys(errors).length > 0 && (
                            <div className="form-errors">
                                {Object.keys(errors).map(key => (
                                    <p key={key}>{errors[key]}</p>
                                ))}
                            </div>
                        )}
                        <a className="back-to-login" onClick={() => setRegister(false)} style={{cursor:"pointer"}}>already have an account?</a>
                    </form>
                }
            </div>
    );
};
