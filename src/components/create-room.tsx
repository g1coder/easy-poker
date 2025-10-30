"use client";

import { useState } from "react";

interface CreateRoomProps {
    onRoomCreated: (roomId: string, roomName: string, userId: string) => void;
}

export default function CreateRoom({ onRoomCreated }: CreateRoomProps) {
    const [roomName, setRoomName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim() || !ownerName.trim()) return;

        setIsCreating(true);

        try {
            const roomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomId,
                    roomName: roomName.trim(),
                    ownerName: ownerName.trim(),
                    cards: [0, 1, 2, 3, 5, 8, 13, 21],
                }),
            });

            const data = await response.json();

            if (data.success) {
                onRoomCreated(roomId, roomName.trim(), data.userId);
            } else {
                alert("Error creating room: " + data.error);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Error creating room");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div
            style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
                Create Planning Poker Room
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "bold",
                        }}
                    >
                        Your Name:
                    </label>
                    <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Enter your name"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px",
                        }}
                        required
                    />
                </div>

                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "bold",
                        }}
                    >
                        Room Name:
                    </label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name"
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px",
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={
                        isCreating || !roomName.trim() || !ownerName.trim()
                    }
                    style={{
                        padding: "12px",
                        backgroundColor: isCreating ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: isCreating ? "not-allowed" : "pointer",
                    }}
                >
                    {isCreating ? "Creating..." : "Create Room"}
                </button>
            </form>
        </div>
    );
}
