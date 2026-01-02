"use client";

import { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { api, JoinRoomResponse } from "@/api";
import { useRouter } from "next/navigation";

interface JoinRoomProps {
    roomId: string | null;
}

export const JoinRoom = ({ roomId }: JoinRoomProps) => {
    const [userName, setUserName] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) return;
        setIsJoining(true);

        try {
            await api.post<JoinRoomResponse>(`/rooms/${roomId}/join`, {
                userName: userName.trim(),
            });

            router.push(`/${roomId}`);
        } catch (_) {
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
};
