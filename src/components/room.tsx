import { Grid, Paper, Stack } from "@mui/material";
import { RoomHeader } from "@components/room-header";
import { VotingPanel } from "@components/voting-panel/voting-panel";
import { UsersPanel } from "@components/user-panel/user-panel";
import { VotingControl } from "@components/voting-control/voting-control";
import { TaskPanel } from "@components/task-panel/task-panel";
import { RoomDto } from "@/api";
import { RoomProvider } from "@/providers/room-provider";
import { CurrentTaskProvider } from "@/providers";

interface RoomProps {
    room: RoomDto;
}

export const Room = ({ room }: RoomProps) => {
    const skipVoting = !(room.isOwner && room.skipVote);

    return (
        <RoomProvider roomId={room.id}>
            <CurrentTaskProvider>
                <RoomHeader title={room.name} />
                <Grid
                    container
                    spacing={2}
                    sx={{ height: "calc(100vh - 100px)" }}
                >
                    <Grid size="auto">
                        <Paper
                            sx={{
                                p: 2,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "auto",
                                minWidth: "360px",
                            }}
                        >
                            <TaskPanel room={room} />
                        </Paper>
                    </Grid>
                    <Grid size="grow">
                        <Paper
                            sx={{
                                p: 2,
                                height: "100%",
                                display: "flex",
                            }}
                        >
                            <Stack sx={{ gap: 2, width: "100%" }}>
                                <VotingControl room={room} />
                                <UsersPanel room={room} />
                                {skipVoting && <VotingPanel room={room} />}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </CurrentTaskProvider>
        </RoomProvider>
    );
};
