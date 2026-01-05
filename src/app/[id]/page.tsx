"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { api, RoomDto } from "@/api";
import { Room } from "@/components/room";

const RoomPage = () => {
    const params = useParams<{ id: string }>();
    const roomId = String(params?.id);
    const router = useRouter();
    const [room, setRoom] = useState<RoomDto | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(`/rooms/${roomId}`);
                setRoom(response);
            } catch (_) {
                router.push(`/${roomId}/join`);
            }
        })();
    }, [roomId]);

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 3,
                height: "100vh",
                backgroundColor: "#f5f5f5",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {!room ? (
                <CircularProgress style={{ margin: "auto" }} />
            ) : (
                <Room room={room} />
            )}
        </Box>
    );
};

export default RoomPage;
