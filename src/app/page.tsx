"use client";

import { useState } from "react";
import PokerRoom from "@components/poker-room";
import JoinRoom from "@components/join-room";
import CreateRoom from "@components/create-room";
import { Box, Button, Container } from "@mui/material";

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

    const handleJoined = (
        roomId: string,
        newUserId: string,
        newUserName: string
    ) => {
        setRoomId(roomId);
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

    return (
        <Container
            component="main"
            sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Box sx={{ width: "100%" }}>
                {appState === "create" && (
                    <CreateRoom
                        key="create"
                        onRoomCreated={handleRoomCreated}
                    />
                )}
                {appState === "join" && (
                    <JoinRoom key="join" onJoined={handleJoined} />
                )}

                <Box sx={{ textAlign: "center" }}>
                    <Button
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                        size="large"
                        onClick={() => {
                            setAppState((prev) =>
                                prev === "create" ? "join" : "create"
                            );
                        }}
                    >
                        {appState !== "create"
                            ? "Create new Room"
                            : "Join Existing Room"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
