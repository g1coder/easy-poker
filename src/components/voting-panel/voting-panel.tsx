import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { api, TaskDto } from "@/api";
import styles from "./voting-panel.module.scss";

interface VotingPanelProps {
    roomId: string;
    task: TaskDto | null;
}

const votes: string[] = ["1", "2", "3", "5", "8", "13", "21", "34", "?", "☕"];

export const VotingPanel = ({ roomId, task }: VotingPanelProps) => {
    const [, setVote] = useState<string>("");

    const handleVote =
        (value: string) => async (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            setVote(value);
            await api.post(`/rooms/${roomId}/session`, {
                action: "reveal",
                taskId: task?.id,
            });
        };

    return (
        <div className={styles.container}>
            {votes.map((vote) => {
                const isSelected = vote === task?.vote;
                return (
                    <div
                        key={vote}
                        className={`
                        ${styles.card} 
                        ${isSelected ? styles.selected : ""} 
                        ${task?.status === "finished" ? styles.disabled : ""}
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
