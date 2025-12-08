"use client";

import React, { useState } from "react";
import { Grid, Paper, Box, Stack } from "@mui/material";

import { RoomHeader } from "@components/room-header";
import { Task } from "@/api";
import { TaskList } from "@components/room-task-list";
import { VotingPanel } from "@components/voting-panel/voting-panel";
import { UsersPanel } from "@components/user-panel/user-panel";
import { VotingControl } from "@components/voting-control/voting-control";
import { TaskPanel } from "@components/task-panel/task-panel";

const initialTasks: Task[] = [
    {
        id: "1",
        link: "http://localhost:3000/13cf2a79-1b53-4fcf-961f-67c88c1cd1ef",
        estimate: null,
        votes: {},
    },
    {
        id: "2",
        link: "http://localhost:3000/13cf2a79-1b53-4fcf-961f-67c88c1cd1ef",
        estimate: 15,
        votes: {},
    },
    {
        id: "3",
        link: "http://localhost:3000/13cf2a79-1b53-4fcf-961f-67c88c1cd1ef",
        estimate: null,
        votes: {},
    },
    {
        id: "4",
        link: "PROJ-126",
        estimate: 8,
        votes: {},
    },
    {
        id: "5",
        link: "PROJ-127",
        estimate: null,
        votes: {},
    },
];

const participants = [
    {
        id: "1",
        username: "Dexter Morgan",
        isOnline: true,
        hasVoted: true,
        vote: "8",
    },
    {
        id: "2",
        username: "Debra Morgan",
        isOnline: true,
        hasVoted: false,
        vote: "",
    },
    {
        id: "3",
        username: "Harry Morgan",
        isOnline: true,
        hasVoted: true,
        vote: "13",
    },
    {
        id: "4",
        username: "Rita Bennett",
        isOnline: false,
        hasVoted: false,
        vote: "",
    },
    {
        id: "5",
        username: "Angel Batista",
        isOnline: true,
        hasVoted: true,
        vote: "5",
    },
    {
        id: "6",
        username: "Vince Masuka",
        isOnline: true,
        hasVoted: false,
        vote: "",
    },
    {
        id: "7",
        username: "Maria LaGuerta",
        isOnline: true,
        hasVoted: true,
        vote: "20",
    },
    {
        id: "8",
        username: "James Doakes",
        isOnline: false,
        hasVoted: true,
        vote: "?",
    },
];

const PlanningPokerUI: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

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
            <RoomHeader
                title="RoomTest"
                href={
                    "http://localhost:3000/13cf2a79-1b53-4fcf-961f-67c88c1cd1ef"
                }
            />

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
                        {/*<TaskList tasks={tasks} onDeleteTask={() => {}} />*/}
                        <TaskPanel />
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
                                title="Make refactoring everything"
                                estimation="22"
                                isOwner
                            />
                            <UsersPanel participants={participants} />
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

export default PlanningPokerUI;
