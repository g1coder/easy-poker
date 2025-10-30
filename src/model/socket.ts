// types/socket.ts
export interface Message {
    id: string;
    text: string;
    userId: string;
    username: string;
    timestamp: Date;
    roomId: string;
}

export interface User {
    id: string;
    username: string;
    roomId: string;
}

export interface ClientToServerEvents {
    "join-room": (data: { roomId: string; username: string }) => void;
    "send-message": (data: Omit<Message, "id" | "timestamp">) => void;
    "typing-start": (data: { roomId: string; username: string }) => void;
    "typing-stop": (data: { roomId: string }) => void;
    disconnect: () => void;
}

export interface ServerToClientEvents {
    "user-joined": (data: { user: User; users: User[] }) => void;
    "user-left": (data: { user: User; users: User[] }) => void;
    "receive-message": (data: Message) => void;
    "user-typing": (data: { username: string; roomId: string }) => void;
    "user-stop-typing": (data: { roomId: string }) => void;
    "room-users": (data: { users: User[] }) => void;
}
