import React, { Component, ReactNode } from 'react';
import {Button, Paper} from "@mui/material";
import '../../fonts.css';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
        error: null,
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // Здесь можно отправить ошибку в лог-сервис
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ position: 'relative', width: '100%', height: '700px', padding: '2rem' }}>
                    <img
                        src="/images/error_vivian2.png"
                        alt="error"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '20%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 0,
                            height: '400px',
                        }}
                    />

                    <div
                        style={{
                            position: 'relative',
                            marginLeft: '300px',
                            zIndex: 1,
                            marginTop:"150px",
                            maxWidth: '500px',
                            background: '#fff',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontFamily: 'sans-serif',
                            fontSize: '1rem',
                            color: '#333',
                        }}
                    >
                        <div
                            style={{
                                content: "''",
                                position: 'absolute',
                                top: '50%',
                                left: '-30px',
                                marginTop: '-10px',
                                width: 0,
                                height: 0,
                                border: '10px solid transparent',
                                borderRightColor: '#fff',
                                transform: 'rotate(-20deg)',
                            }}
                        />
                        <h2 style={{ marginTop: 0, fontFamily:"MyFont" }}>Ааа... <br/>И-извините... Похоже, что-то пошло не так...</h2>
                        <p>{this.state.error?.message || 'Неизвестная ошибка'}</p>
                        <Button onClick={this.handleReload}>Обновить страницу</Button>
                    </div>
                </div>

            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;