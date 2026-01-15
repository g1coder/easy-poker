"use client";

import { Container, Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { RoomDto } from "@/api";
import Link from "next/link";

export const RestoreRoom = () => {
    const [sessions, setSessions] = useState<
        Array<{ id: string; name: string; isOwner: boolean }>
    >([]);

    const executeSessions = () => {
        const _sessions = getUuidItemsFromLocalStorage();
        if (_sessions.size > 0) {
            setSessions(Array.from(_sessions).map(([, room]) => room));
        }
    };

    useEffect(() => {
        executeSessions();
    }, []);

    if (!sessions.length) {
        return null;
    }

    console.log(sessions);

    return (
        <Container
            maxWidth="sm"
            sx={{
                marginTop: "2rem",
            }}
        >
            <Box textAlign="center" maxWidth="sm">
                <Typography variant="body1" gutterBottom>
                    previous sessions:
                </Typography>

                {sessions.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            marginTop: "0.5rem",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "1rem",
                        }}
                    >
                        <Typography variant="body1">{item.name}</Typography>
                        <Button
                            variant="outlined"
                            component={Link}
                            href={`/${item.id}${!item.isOwner ? "/join" : ""}`}
                        >
                            Join
                        </Button>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

function getUuidItemsFromLocalStorage() {
    return Object.keys(localStorage)
        .filter((key) =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                key
            )
        )
        .reduce((acc, key) => {
            try {
                const room = JSON.parse(localStorage[key]).room as RoomDto;
                acc.set(key, room);
            } catch (_) {}
            return acc;
        }, new Map<string, RoomDto>());
}
