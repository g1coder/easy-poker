import { Box, Stack, Typography } from "@mui/material";
import { useContextSelector } from "use-context-selector";
import { ParticipantCard } from "./user-card";
import { RoomContext } from "@/providers/room-provider";
import { RoomDto } from "@/api";
import { CurrentTaskContext } from "@/providers";
import { useEffect } from "react";

interface UsersPanelProps {
    room: RoomDto;
}

export const UsersPanel = ({ room }: UsersPanelProps) => {
    // const onlineCount = users.filter((p) => p.connected).length;
    // const votedCount = users.filter((p) => p.voted).length;
    const left = 0; //onlineCount - votedCount;
    const task = useContextSelector(CurrentTaskContext, (c) => c.currentTask);
    const users = useContextSelector(RoomContext, (c) => c.users);

    console.log("task", task);

    const _users = users.map((user) => {
        const vote = task?.votes[user.id] || "";
        return {
            user,
            vote,
            voted: !!vote,
        };
    });

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
                {_users?.map((item) => (
                    <ParticipantCard key={item.user.id} {...item} />
                ))}
            </Stack>
        </Box>
    );
};
