


// Интерфейсы для пропсов компонентов


export interface ChatListViewProps {
    chats: Chat[];
    onChatSelect: (chatId: string) => void;
}

export interface ChatViewProps {
    chat: Chat;
    onBack: () => void;
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}


export interface User {
    userId: number;
    username: string;
    // Другие поля, если нужно
}

export interface ChatMessage {
    messageId: number;
    sender: User;
    chat: {
        id: number;
        name: string;
    };
    content: string;
    sentAt: string;
    viewed: boolean;
}

export interface Chat {
    id: number;
    name: string;
    chatType: ChatType;
    messages: ChatMessage[] | null;
    profileData: ProfileData;
    lastMessage;
    lastMessageSenderIconUrl;
    unviewedMessages:number;
}

export interface ChatViewProps {
    chat: Chat;
    onBack: () => void;
}

export enum ChatType {
    PRIVATE,
    GENERAL
}
// Интерфейс для данных пользователя
export interface UserData {
    userId: number;
    username: string;
    passwordHash: string;
    email: string;
    createdAt: string;
    enabled: boolean;
    isOnline: boolean;
    lastSeen: string;
    // Другие поля, которые вам могут понадобиться
}

// Интерфейс для данных поста
export interface PostData {
    id: number;
    content: string;
    createdAt: string;
    likesCount: number;
    sharesCount: number;
    commentsCount: number;
    profile: ProfileData;
    liked: boolean;
    postAttachments: string[];
}

// Интерфейс для данных профиля
export interface ProfileData {
    profileId: number;
    user: UserData;
    tag: string;
    about_me: string | null;
    country: string | null;
    interests: string | null;
    firstName: string;
    lastName: string;
    birthdate: Date | null;
    profilePictureUrl: string;
    profileBannerPictureUrl: string;
    updatedAt: string | null;
    followersCount: number;
    followingCount: number;
    posts: PostData[];
}

