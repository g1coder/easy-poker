"use client";

import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    CircularProgress,
} from "@mui/material";

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
            const roomId = `room-${Date.now()}-${Math.random().toString(36)}`;

            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomId,
                    roomName: roomName.trim(),
                    ownerName: ownerName.trim(),
                    cards: [0, 1, 2, 3, 5, 8, 13, 21, Infinity],
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
        <Container maxWidth="sm">
            <Box textAlign="center" maxWidth="sm">
                <Typography
                    component="h1"
                    variant="h4"
                    gutterBottom
                    fontWeight={500}
                >
                    Create Planning Poker Room
                </Typography>

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
                        name="ownerName"
                        autoComplete="name"
                        autoFocus
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Enter your name"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Room Name"
                        name="roomName"
                        autoComplete="off"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Enter room name"
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={
                            isCreating || !roomName.trim() || !ownerName.trim()
                        }
                        size="large"
                    >
                        {isCreating ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Creating...
                            </>
                        ) : (
                            "Create Room"
                        )}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
