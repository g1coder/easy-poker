import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { User } from "@/api";
import { ParticipantCard } from "./user-card";

interface UsersPanelProps {
    users: User[];
}

export const UsersPanel = ({ users }: UsersPanelProps) => {
    const onlineCount = users.filter((p) => p.connected).length;
    const votedCount = users.filter((p) => p.voted).length;
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
                {users?.length > 0 && (
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
                )}
            </Stack>

            <Stack direction="row" flexWrap="wrap" maxWidth="1000px" gap={4}>
                {users?.map((item) => (
                    <ParticipantCard key={item.id} user={item} />
                ))}
            </Stack>
        </Box>
    );
};
