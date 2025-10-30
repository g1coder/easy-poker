"use client";

import { useEffect, useState } from "react";
import { Message, User } from "@/model/socket";
import { useSocket } from "@/hooks/use-socket";

export const Room = () => {
    const { socket, isConnected } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("general");

    useEffect(() => {
        if (!socket) return;

        // Слушаем входящие сообщения
        socket.on("receive-message", (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Слушаем обновления пользователей
        socket.on("room-users", (data: { users: User[] }) => {
            setUsers(data.users);
        });

        socket.on("user-joined", (data: { user: User; users: User[] }) => {
            setUsers(data.users);
            setMessages((prev) => [
                ...prev,
                {
                    id: `system-${Date.now()}`,
                    text: `${data.user.username} joined the room`,
                    userId: "system",
                    username: "System",
                    timestamp: new Date(),
                    roomId,
                },
            ]);
        });

        socket.on("user-left", (data: { user: User; users: User[] }) => {
            setUsers(data.users);
            setMessages((prev) => [
                ...prev,
                {
                    id: `system-${Date.now()}`,
                    text: `${data.user.username} left the room`,
                    userId: "system",
                    username: "System",
                    timestamp: new Date(),
                    roomId,
                },
            ]);
        });

        return () => {
            socket.off("receive-message");
            socket.off("room-users");
            socket.off("user-joined");
            socket.off("user-left");
        };
    }, [socket, roomId]);

    const joinRoom = () => {
        if (socket && username && roomId) {
            socket.emit("join-room", { roomId, username });
        }
    };

    const sendMessage = () => {
        if (socket && messageInput.trim() && username && roomId) {
            socket.emit("send-message", {
                text: messageInput,
                userId: socket.id!,
                username,
                roomId,
            });
            setMessageInput("");
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button
                    onClick={joinRoom}
                    className="bg-blue-500 text-white p-2"
                    disabled={!username || !roomId}
                >
                    Join Room
                </button>
            </div>

            <div className="mb-4">
                Status: {isConnected ? "Connected" : "Disconnected"}
            </div>

            <div className="flex">
                <div className="w-3/4">
                    <div className="h-96 border overflow-y-auto p-2">
                        {messages.map((message) => (
                            <div key={message.id} className="mb-2">
                                <strong>{message.username}:</strong>{" "}
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div className="flex mt-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                            placeholder="Type a message..."
                            className="border p-2 flex-1"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-500 text-white p-2 ml-2"
                        >
                            Send
                        </button>
                    </div>
                </div>

                <div className="w-1/4 border p-2">
                    <h3 className="font-bold mb-2">Users in room:</h3>
                    {users.map((user) => (
                        <div key={user.id} className="py-1">
                            {user.username}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
