"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import { api, RoomDto } from "@/api";
import { Room } from "@/components/room";
import { AxiosError } from "axios";
import { restoreRoom } from "@utils/save-room";

const RoomPage = () => {
    const params = useParams<{ id: string }>();
    const roomId = String(params?.id);
    const router = useRouter();
    const [room, setRoom] = useState<RoomDto | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [forRestore, setForRestore] = useState<RoomDto | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(`/rooms/${roomId}`);
                setRoom(response);
            } catch (error) {
                if (error instanceof AxiosError && error.status === 404) {
                    setNotFound(true);
                    const payload = restoreRoom(roomId);
                    if (payload) {
                        setForRestore(payload.room);
                    }

                    return;
                }

                router.push(`/${roomId}/join`);
            }
        })();
    }, [roomId]);

    const handleRestore = async () => {
        try {
            const data = restoreRoom(roomId);
            if (data?.room.isOwner) {
                const response = await api.post(
                    `/rooms/${roomId}/restore`,
                    data
                );
                setRoom(response);
            } else {
                router.push(`/${roomId}/join`);
            }
        } catch (_) {
            setForRestore(null);
        }
    };

    if (!room && !notFound) {
        return <CircularProgress style={{ margin: "auto" }} />;
    }

    if (room) {
        return <Room room={room} />;
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
            }}
        >
            <Box textAlign="center" maxWidth="sm">
                <Typography
                    component="h1"
                    variant="h4"
                    gutterBottom
                    fontWeight={500}
                >
                    Not found
                </Typography>
                <Stack gap={2} display="flex">
                    {forRestore && forRestore.isOwner && (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleRestore}
                        >
                            {forRestore.isOwner
                                ? "Try restore room"
                                : "Try join"}
                        </Button>
                    )}

                    <Button variant="outlined" size="large" href={`/`}>
                        Create new one
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default RoomPage;
