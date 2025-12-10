"use client";

import React, { useState } from "react";
import { Grid, Paper, Box, Stack } from "@mui/material";

import { RoomHeader } from "@components/room-header";
import { Task } from "@/api";
import { VotingPanel } from "@components/voting-panel/voting-panel";
import { UsersPanel } from "@components/user-panel/user-panel";
import { VotingControl } from "@components/voting-control/voting-control";
import { TaskPanel } from "@components/task-panel/task-panel";
import { useRoom } from "@/hooks/use-room";
import { useParams } from "next/navigation";

const RoomPage = () => {
    const params = useParams<{ id: string }>();
    const roomId = String(params?.id);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const { room } = useRoom({
        roomId,
        onEvent: (event) => {
            console.log("Poker event received:", event.type);
        },
    });

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
            <RoomHeader title={room?.name || ""} href={window.location.href} />

            <Grid container spacing={2} sx={{ height: "calc(100vh - 100px)" }}>
                <Grid size="grow">
                    <Paper
                        sx={{
                            p: 2,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "auto",
                        }}
                    >
                        <TaskPanel
                            roomId={roomId}
                            tasks={room?.tasks || []}
                            isOwner={!!room?.ownerId}
                            selectedId={selectedTask?.id || null}
                            onSelect={setSelectedTask}
                        />
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            display: "flex",
                        }}
                    >
                        <Stack sx={{ gap: 2, width: "100%" }}>
                            <VotingControl
                                title={selectedTask?.link || ""}
                                estimation={selectedTask?.estimate || ""}
                                isOwner={!!room?.ownerId}
                            />
                            <UsersPanel users={room?.users || []} />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size="grow">
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                        }}
                    >
                        <VotingPanel onClick={() => {}} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RoomPage;
