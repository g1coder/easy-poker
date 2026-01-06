import { Box, Stack } from "@mui/material";
import { useContextSelector } from "use-context-selector";
import { ParticipantCard } from "./user-card";
import { RoomContext } from "@/providers/room-provider";
import { api, RoomDto } from "@/api";
import { CurrentTaskContext } from "@/providers";

interface UsersPanelProps {
    room: RoomDto;
}

export const UsersPanel = ({ room }: UsersPanelProps) => {
    // const onlineCount = users.filter((p) => p.connected).length;
    // const votedCount = users.filter((p) => p.voted).length;
    // const left = 0; //onlineCount - votedCount;
    const task = useContextSelector(CurrentTaskContext, (c) => c.currentTask);
    const users = useContextSelector(RoomContext, (c) => c.users);

    const _users = users.map((user) => {
        const vote = task?.votes[user.id] || "";
        return {
            user,
            vote,
            voted: !!vote,
        };
    });

    const handleDelete = async (userId: string) => {
        try {
            await api.post(`/rooms/${room.id}/delete-user`, {
                userId,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            p={2}
            sx={{
                borderRadius: "1rem",
                border: "1px solid #e5e7eb",
            }}
        >
            {/*<Stack alignItems="flex-end">*/}
            {/*    {users?.length > 0 && (*/}
            {/*        <Typography*/}
            {/*            variant="body1"*/}
            {/*            fontWeight={600}*/}
            {/*            color={left ? "warning" : "success"}*/}
            {/*            sx={{*/}
            {/*                padding: "0.25rem 1rem",*/}
            {/*                borderRadius: 1,*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {left ? `${left} left` : "all voted!"}*/}
            {/*        </Typography>*/}
            {/*    )}*/}
            {/*</Stack>*/}

            <Stack direction="row" flexWrap="wrap" maxWidth="1000px" gap={4}>
                {_users?.map((item, idx) => {
                    const onDelete =
                        idx !== 0 && room.isOwner
                            ? () => handleDelete(item.user.id)
                            : undefined;

                    return (
                        <ParticipantCard
                            key={item.user.id}
                            {...item}
                            own={room.userId === item.user.id}
                            skipVote={idx === 0 && room.skipVote}
                            reveal={
                                task?.status === "finished" ||
                                task?.status === "revealed"
                            }
                            onDelete={onDelete}
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};
