import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./user-card.module.scss";
import { User } from "@/api";

interface ParticipantCardProps {
    user: User;
    voted: boolean;
    vote: string;
}

export const ParticipantCard = ({
    user,
    voted,
    vote,
}: ParticipantCardProps) => {
    const { name, id, connected } = user;

    const renderContent = () => {
        if (!voted) {
            return <MoreHorizIcon fontSize="large" color="action" />;
        }

        return voted && vote ? (
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
                    sx={{ bgcolor: connected ? "#10b981" : "#6b7280" }}
                />
                <Typography variant="body1">{name}</Typography>
            </Stack>
        </Stack>
    );
};
