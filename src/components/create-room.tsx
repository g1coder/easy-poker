"use client";

import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    CircularProgress,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { api, Room } from "@/api";
import { useRouter } from "next/navigation";
import PersonOffOutlined from "@mui/icons-material/PersonOffOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";

export const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [skipVote, setSkipVote] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim() || !ownerName.trim()) return;

        setIsCreating(true);

        try {
            const response = await api.post<Room>("/rooms", {
                roomName: roomName.trim(),
                ownerName: ownerName.trim(),
                skipVote,
            });

            router.push(`/${response.id}`);
        } catch (_) {
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

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={skipVote}
                                onChange={(event) => {
                                    setSkipVote(event.target.checked);
                                }}
                                color={skipVote ? "warning" : "primary"}
                                icon={<PersonOutlined />}
                                checkedIcon={<PersonOffOutlined />}
                            />
                        }
                        label={
                            <Typography
                                variant="body2"
                                fontWeight={500}
                                color={skipVote ? "error" : "primary"}
                            >
                                {skipVote
                                    ? "Owner will not vote"
                                    : "Owner can vote"}
                            </Typography>
                        }
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
};
