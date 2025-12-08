import React from "react";
import { ParticipantCard } from "./user-card";
import { Box, Stack, Typography } from "@mui/material";

interface Participant {
    id: string;
    username: string;
    isOnline: boolean;
    hasVoted: boolean;
    vote: string;
}

interface ParticipantsPanelProps {
    participants: Participant[];
}

export const UsersPanel: React.FC<ParticipantsPanelProps> = ({
    participants,
}) => {
    const onlineCount = participants.filter((p) => p.isOnline).length;
    const votedCount = participants.filter((p) => p.hasVoted).length;
    const left = onlineCount - votedCount;

    return (
        <Box
            p={2}
            sx={{
                borderRadius: "1rem",
                border: "1px solid #e5e7eb",
            }}
        >
            <Stack alignItems="flex-end">
                <Typography
                    variant="body1"
                    fontWeight={600}
                    color={left ? "warning" : "success"}
                    sx={{
                        padding: "0.25rem 1rem",
                        borderRadius: 1,
                    }}
                >
                    {left ? `${left} left` : "all voted!"}
                </Typography>
            </Stack>

            <Stack direction="row" flexWrap="wrap" maxWidth="1000px" gap={4}>
                {participants?.map((item) => (
                    <ParticipantCard key={item.id} {...item} />
                ))}
            </Stack>
        </Box>
    );
};
