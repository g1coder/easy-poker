import { useState } from "react";
import { Box, Typography } from "@mui/material";
import styles from "./voting-panel.module.scss";

interface VotingPanelProps {
    onClick: (value: string) => void;
    vote?: string;
    disabled?: boolean;
}

const votes: string[] = ["1", "2", "3", "5", "8", "13", "21", "34", "?", "☕"];

export const VotingPanel = (props: VotingPanelProps) => {
    const [selectedVote, setSelectedVote] = useState<string | null>(
        props.vote || null
    );

    const handleSelect =
        (value: string) => (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            setSelectedVote(value);
            props.onClick(value);
        };

    return (
        <div className={styles.container}>
            {votes.map((vote) => {
                const isSelected = vote === selectedVote;
                return (
                    <div
                        key={vote}
                        className={`
                        ${styles.card} 
                        ${isSelected ? styles.selected : ""} 
                        ${props.disabled ? styles.disabled : ""}
                      `}
                        role="button"
                        tabIndex={0}
                        onClick={handleSelect(vote)}
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
