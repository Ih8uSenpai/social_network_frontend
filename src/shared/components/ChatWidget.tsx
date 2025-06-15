import React, { useState, useRef, useEffect } from 'react';
import AssistantIcon from '@mui/icons-material/Assistant';

interface Message {
    text: string;
    isUser: boolean;
}

type ResizeDir = 'nw' | 'ne' | 'sw' | 'se';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [size, setSize] = useState({ width: 350, height: 450 });
    const token = localStorage.getItem("authToken");

    const isDraggingRef = useRef(false);
    const isResizingRef = useRef(false);
    const resizeDirRef = useRef<ResizeDir>('se');

    const dragStart = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0 });
    const resizeStart = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, width: 0, height: 0 });

    const sessionId = useRef(
        Math.random().toString(36).substr(2) + Date.now().toString()
    );

    const onMouseMove = (e: MouseEvent) => {
        if (isDraggingRef.current) {
            const dx = e.clientX - dragStart.current.mouseX;
            const dy = e.clientY - dragStart.current.mouseY;
            setPosition({ x: dragStart.current.x + dx, y: dragStart.current.y + dy });
        } else if (isResizingRef.current) {
            const dx = e.clientX - resizeStart.current.mouseX;
            const dy = e.clientY - resizeStart.current.mouseY;
            let { x: startX, y: startY, width: startW, height: startH } = resizeStart.current;
            const minW = 300;
            const minH = 200;
            let newX = startX;
            let newY = startY;
            let newW = startW;
            let newH = startH;

            switch (resizeDirRef.current) {
                case 'se':
                    newW = Math.max(minW, startW + dx);
                    newH = Math.max(minH, startH + dy);
                    break;
                case 'sw':
                    newW = Math.max(minW, startW - dx);
                    newH = Math.max(minH, startH + dy);
                    newX = startX + (startW - newW);
                    break;
                case 'ne':
                    newW = Math.max(minW, startW + dx);
                    newH = Math.max(minH, startH - dy);
                    newY = startY + (startH - newH);
                    break;
                case 'nw':
                    newW = Math.max(minW, startW - dx);
                    newH = Math.max(minH, startH - dy);
                    newX = startX + (startW - newW);
                    newY = startY + (startH - newH);
                    break;
            }
            setPosition({ x: newX, y: newY });
            setSize({ width: newW, height: newH });
        }
    };

    const onMouseUp = () => {
        isDraggingRef.current = false;
        isResizingRef.current = false;
        document.removeEventListener('mousemove', onMouseMove as any);
        document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDownDrag = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        dragStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            x: position.x,
            y: position.y,
        };
        document.addEventListener('mousemove', onMouseMove as any);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseDownResize = (dir: ResizeDir) => (
        e: React.MouseEvent
    ) => {
        e.stopPropagation();
        isResizingRef.current = true;
        resizeDirRef.current = dir;
        resizeStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
        };
        document.addEventListener('mousemove', onMouseMove as any);
        document.addEventListener('mouseup', onMouseUp);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', onMouseMove as any);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const handleOpen = () => {
        const w = size.width;
        const h = size.height;
        const x = 50;
        const y = window.innerHeight - h - 100;
        setPosition({ x, y });
        setIsOpen(true);
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { text, isUser: true }]);
        try {
            const resp = await fetch(
                `${process.env.REACT_APP_BACK_BASE_URL}/${sessionId.current}/chat?question=${encodeURIComponent(text)}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            const answer = await resp.text();
            setMessages(prev => [...prev, { text: answer, isUser: false }]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const input = (e.currentTarget as any).question as HTMLInputElement;
        sendMessage(input.value);
        input.value = '';
    };

    return (
        <>
            <button
                style={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 24,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                onClick={handleOpen}
            >
                <AssistantIcon/>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: position.y,
                        left: position.x,
                        width: size.width,
                        height: size.height,
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: 'Arial, sans-serif',
                        zIndex: 1001,
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '12px 16px',
                            cursor: 'move',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        onMouseDown={onMouseDownDrag}
                    >
                        <span>AI-ассистент</span>
                        <button
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: 18,
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            padding: '12px',
                            overflowY: 'auto',
                        }}
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    justifyContent: m.isUser ? 'flex-end' : 'flex-start',
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        padding: '10px 14px',
                                        borderRadius: 16,
                                        backgroundColor: m.isUser ? 'rgba(118,75,162,0.1)' : 'rgba(102,126,234,0.1)',
                                        color: '#333',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            padding: '12px',
                            borderTop: '1px solid #eee',
                            backgroundColor: '#fafafa',
                        }}
                    >
                        <input
                            name="question"
                            type="text"
                            placeholder="Введите сообщение..."
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1px solid #ddd',
                                borderRadius: 8,
                                outline: 'none',
                                fontSize: 14,
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                marginLeft: 8,
                                padding: '10px 16px',
                                background: '#667eea',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            Отправить
                        </button>
                    </form>

                    {/* Resize handles */}
                    {(['nw','ne','sw','se'] as ResizeDir[]).map(dir => {
                        const styles: React.CSSProperties = { position: 'absolute', width: 16, height: 16, zIndex: 10 };
                        if (dir.includes('n')) styles.top = 0;
                        if (dir.includes('s')) styles.bottom = 0;
                        if (dir.includes('w')) styles.left = 0;
                        if (dir.includes('e')) styles.right = 0;
                        styles.cursor = `${dir}-resize`;
                        return <div key={dir} style={styles} onMouseDown={onMouseDownResize(dir)} />;
                    })}
                </div>
            )}
        </>
    );
};

export default ChatWidget;