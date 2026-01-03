import { useContextSelector } from "use-context-selector";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import RedoIcon from "@mui/icons-material/Redo";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { api, RoomDto } from "@/api";
import { CurrentTaskContext } from "@/providers";
import styles from "./voting-control.module.scss";

interface VotingPanelProps {
    room: RoomDto;
}

export const VotingControl = ({ room }: VotingPanelProps) => {
    const { id: roomId, isOwner } = room;
    const task = useContextSelector(CurrentTaskContext, (c) => c.currentTask);
    const { link: title, estimate, status } = task || {};

    const handleReveal = async () => {
        await api.post(`/rooms/${roomId}/session`, {
            action: "reveal",
            taskId: task?.id,
        });
    };

    const handleReset = async () => {
        await api.post(`/rooms/${roomId}/session`, {
            action: "reset",
            taskId: task?.id,
        });
    };

    const handleFinish = async () => {
        await api.post(`/rooms/${roomId}/session`, {
            action: "done",
            taskId: task?.id,
        });
    };

    const isFinished = status === "finished";
    return (
        <>
            <Box className={styles.container}>
                <Stack gap={1} flex={1}>
                    <Typography variant="caption" color="text.secondary">
                        CURRENT TASK
                    </Typography>
                    <Typography variant="h5" component="a" href={title}>
                        {title}
                    </Typography>
                </Stack>
                <Stack gap={1}>
                    <Typography variant="caption" color="text.secondary">
                        ESTIMATION
                    </Typography>
                    <Typography variant="h5" textAlign="end">
                        {estimate}
                    </Typography>
                </Stack>
            </Box>
            {isOwner && task && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    mt={1}
                    gap={1}
                >
                    <Box>
                        {status !== "revealed" ? (
                            <Button
                                variant="contained"
                                startIcon={<RedoIcon />}
                                onClick={handleReveal}
                            >
                                Reveal cards
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                startIcon={<DoDisturbIcon />}
                                color="warning"
                                sx={{
                                    ml: 1,
                                }}
                                onClick={handleReset}
                            >
                                Reset votes
                            </Button>
                        )}
                    </Box>
                    <Tooltip title="Freeze voting">
                        <Button
                            variant={"outlined"}
                            color={isFinished ? "error" : "primary"}
                            startIcon={!isFinished && <DoneIcon />}
                            onClick={isFinished ? handleReset : handleFinish}
                        >
                            {isFinished ? "Re-voiting" : "Done"}
                        </Button>
                    </Tooltip>
                </Stack>
            )}
        </>
    );
};
