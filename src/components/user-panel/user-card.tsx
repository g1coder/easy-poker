import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { User } from "@/api";
import styles from "./user-card.module.scss";

interface ParticipantCardProps {
    user: User;
    voted: boolean;
    vote: string;
    own: boolean;
    reveal: boolean;
}

export const ParticipantCard = ({
    user,
    voted,
    vote,
    own,
    reveal,
}: ParticipantCardProps) => {
    const { name, connected } = user;

    const renderContent = () => {
        if (!voted) {
            return <MoreHorizIcon fontSize="large" color="action" />;
        }

        if (reveal || own) {
            return (
                <Typography variant="h4" color="primary">
                    {vote || ""}
                </Typography>
            );
        }

        return (
            <DoneIcon
                fontSize="large"
                sx={{
                    color: "#3b82f6",
                }}
            />
        );
    };

    return (
        <Stack alignItems="center" spacing={1}>
            <Box className={styles.card} p={1}>
                {renderContent()}
                {own && (
                    <Typography className={styles.you} variant="body1">
                        you
                    </Typography>
                )}
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
