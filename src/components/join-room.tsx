"use client";

import { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

interface JoinRoomProps {
    onJoined: (roomId: string, userId: string, userName: string) => void;
}

export default function JoinRoom({ onJoined }: JoinRoomProps) {
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");
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
                onJoined(roomId, data.userId, userName.trim());
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
        <Container maxWidth="sm">
            <Box textAlign="center" maxWidth="sm">
                <Typography
                    component="h1"
                    variant="h4"
                    gutterBottom
                    fontWeight={500}
                >
                    Join Planning Poker
                </Typography>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: "100%" }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Room Id"
                    name="roomId"
                    autoFocus
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value?.trim())}
                    placeholder="Enter room ID"
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Your Name"
                    name="userName"
                    autoComplete="name"
                    autoFocus
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isJoining || !userName.trim()}
                    size="large"
                >
                    {isJoining ? "Joining..." : "Join Room"}
                </Button>
            </Box>
        </Container>
    );
}
