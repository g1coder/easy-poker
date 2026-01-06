import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { api, RoomDto } from "@/api";
import { useContextSelector } from "use-context-selector";
import styles from "./voting-panel.module.scss";
import { CurrentTaskContext } from "@/providers";

interface VotingPanelProps {
    room: RoomDto;
}

const votes: string[] = ["1", "2", "3", "5", "8", "13", "21", "34", "55"];

export const VotingPanel = ({ room }: VotingPanelProps) => {
    const { id: roomId, userId } = room;
    const [, setVote] = useState<string>("");
    const task = useContextSelector(CurrentTaskContext, (c) => c.currentTask);
    const canVoting = task?.status === "waiting" || task?.status === "voting";

    const handleVote =
        (value: string) => async (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();

            if (!canVoting) {
                return;
            }

            setVote(value);
            await api.post(`/rooms/${roomId}/vote`, {
                vote: value,
                taskId: task?.id,
            });
        };

    if (!task) {
        return null;
    }

    return (
        <div className={styles.container}>
            {votes.map((vote) => {
                const isSelected = vote === task?.votes[userId];
                return (
                    <div
                        key={vote}
                        className={`
                        ${styles.card} 
                        ${isSelected ? styles.selected : ""} 
                        ${!canVoting ? styles.disabled : ""}
                      `}
                        role="button"
                        tabIndex={0}
                        onClick={handleVote(vote)}
                    >
                        <Box className={styles.content} p={1}>
                            <Typography
                                variant="h4"
                                color={isSelected ? "white" : "primary"}
                            >
                                {vote}
                            </Typography>
                        </Box>
                    </div>
                );
            })}
        </div>
    );
};
