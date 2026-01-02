"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { api } from "@/api";
import { Room } from "@/components/room";

const RoomPage = () => {
    const params = useParams<{ id: string }>();
    const roomId = String(params?.id);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await api.get(`/rooms/${roomId}`);
                setLoading(false);
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
            {loading ? (
                <CircularProgress style={{ margin: "auto" }} />
            ) : (
                <Room roomId={roomId} />
            )}
        </Box>
    );
};

export default RoomPage;
