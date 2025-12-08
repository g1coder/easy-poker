import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./user-card.module.scss";

interface ParticipantCardProps {
    username: string;
    vote: string;
    isOnline: boolean;
    hasVoted: boolean;
}

export const ParticipantCard = ({
    username,
    vote,
    isOnline,
    hasVoted,
}: ParticipantCardProps) => {
    const renderContent = () => {
        if (!hasVoted) {
            return <MoreHorizIcon fontSize="large" color="action" />;
        }

        return hasVoted && vote ? (
            <Typography variant="h4" color="primary">
                {vote}
            </Typography>
        ) : (
            <DoneIcon
                fontSize="large"
                sx={{
                    color: "#10b981",
                }}
            />
        );
    };

    return (
        <Stack alignItems="center" spacing={1}>
            <Box className={styles.card} p={1}>
                {renderContent()}
            </Box>
            <Stack alignItems="center" direction="row" spacing={1}>
                <Box
                    className={styles.cirle}
                    sx={{ bgcolor: isOnline ? "#10b981" : "#6b7280" }}
                />
                <Typography variant="body1">{username}</Typography>
            </Stack>
        </Stack>
    );
};
