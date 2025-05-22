import React, { createContext, useContext, useEffect } from 'react';
import { WebSocketService } from './WebSocketService';


const WebSocketContext = createContext<WebSocketService | null>(null);


export const useWebSocket = (): WebSocketService | null => {
    return useContext(WebSocketContext);
};

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const webSocketService = new WebSocketService();

    useEffect(() => {
        webSocketService.connect();

        return () => {
            webSocketService.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={webSocketService}>
            {children}
        </WebSocketContext.Provider>
    );
};
