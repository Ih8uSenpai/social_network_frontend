import { Client, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WebSocketService {
    private client: Client;

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACK_BASE_URL}/ws`),
            onConnect: () => {
                console.log('Connected to WS');
            },
            // Заметьте, что 'onError' убран из конфигурации
        });

        // Установка обработчика ошибок
        this.client.onStompError = (frame: IFrame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.onWebSocketError = (error: Event) => {
            console.error('WebSocket error', error);
        };
    }


    connect() {
        this.client.activate();
    }

    disconnect() {
        if (this.client.active) {
            this.client.deactivate();
        }
    }

    subscribeToMessages(updateCallback: (message: string) => void, retryDelayMillis: number = 3000, maxRetries: number = 5): void {
        // Check if the client is not yet connected
        if (!this.client.connected) {
            console.warn("WebSocket connection is not yet established. Retrying...");

            // Attempt to reconnect with a delay
            setTimeout(() => {
                if (this.client.connected) {
                    // If reconnected, subscribe to messages
                    this.client.subscribe('/topic/messages', message => {
                        console.log('Received:', message.body);
                        // Call the callback function, passing the received message
                        updateCallback(message.body);
                    });
                } else if (maxRetries > 0) {
                    // If not reconnected and retries remaining, retry
                    this.subscribeToMessages(updateCallback, retryDelayMillis, maxRetries - 1);
                } else {
                    console.error("Reconnection failed after multiple retries. Unable to subscribe to messages.");
                    // Handle failure or additional error handling here
                }
            }, retryDelayMillis);

            return;
        }

        // Subscribe to the '/topic/messages' channel
        this.client.subscribe('/topic/messages', message => {
            console.log('Received:', message.body);
            // Call the callback function, passing the received message
            maxRetries = 5;
            updateCallback(message.body);
        });
    }


    sendMessage(message: string) {
        if (!this.client.active) {
            console.error("Cannot send message. STOMP connection is not active. Trying to reconnect...");

            // Попытка переподключения
            this.connect();

            // Опционально: Задержка перед повторной отправкой или использование механизма повтора
            setTimeout(() => {
                if (this.client.active) {
                    this.client.publish({ destination: '/app/sendMessage', body: message });
                } else {
                    console.error("Reconnection failed. Unable to send the message.");
                    // Дополнительная обработка ошибок переподключения
                }
            }, 5000); // 5 секунд задержки для примера

            return;
        }

        this.client.publish({ destination: '/app/sendMessage', body: message });
    }

    isConnectionActive(): boolean {
        return this.client.active;
    }

}
