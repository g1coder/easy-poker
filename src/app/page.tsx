"use client";

import { useState } from "react";
import PokerRoom from "@components/poker-room";
import JoinRoom from "@components/join-room";
import CreateRoom from "@components/create-room";

type AppState = "create" | "join" | "room";

export default function Home() {
    const [appState, setAppState] = useState<AppState>("create");
    const [roomId, setRoomId] = useState("");
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    const handleRoomCreated = (
        newRoomId: string,
        roomName: string,
        newUserId: string
    ) => {
        setRoomId(newRoomId);
        setUserId(newUserId);
        setUserName(roomName);
        setAppState("room");
    };

    const handleJoined = (newUserId: string, newUserName: string) => {
        setUserId(newUserId);
        setUserName(newUserName);
        setAppState("room");
    };

    const handleBackToHome = () => {
        setAppState("create");
        setRoomId("");
        setUserId("");
        setUserName("");
    };

    if (appState === "room" && roomId && userId) {
        return (
            <div>
                <button
                    onClick={handleBackToHome}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        padding: "8px 16px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    ← New Session
                </button>
                <PokerRoom
                    roomId={roomId}
                    userId={userId}
                    userName={userName}
                />
            </div>
        );
    }

    if (appState === "join") {
        return (
            <div>
                <button
                    onClick={() => setAppState("create")}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        padding: "8px 16px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    ← Back
                </button>
                <JoinRoom roomId={roomId} onJoined={handleJoined} />
            </div>
        );
    }

    return (
        <div>
            <CreateRoom onRoomCreated={handleRoomCreated} />

            <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button
                    onClick={() => {
                        const roomId = prompt("Enter room ID:");
                        if (roomId) {
                            setRoomId(roomId);
                            setAppState("join");
                        }
                    }}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "transparent",
                        color: "#007bff",
                        border: "1px solid #007bff",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Join Existing Room
                </button>
            </div>
        </div>
    );
}
