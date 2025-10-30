"use client";

import { useState } from "react";

interface JoinRoomProps {
    roomId: string;
    onJoined: (userId: string, userName: string) => void;
}

export default function JoinRoom({ roomId, onJoined }: JoinRoomProps) {
    const [userName, setUserName] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) return;

        setIsJoining(true);

        try {
            const response = await fetch(`/api/rooms/${roomId}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                onJoined(data.userId, userName.trim());
            } else {
                alert("Error joining room: " + data.error);
            }
        } catch (error) {
            console.error("Error joining room:", error);
            alert("Error joining room");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div
            style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
                Join Planning Poker
            </h1>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>
                Room: {roomId}
            </p>

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
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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

                <button
                    type="submit"
                    disabled={isJoining || !userName.trim()}
                    style={{
                        padding: "12px",
                        backgroundColor: isJoining ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: isJoining ? "not-allowed" : "pointer",
                    }}
                >
                    {isJoining ? "Joining..." : "Join Room"}
                </button>
            </form>
        </div>
    );
}
