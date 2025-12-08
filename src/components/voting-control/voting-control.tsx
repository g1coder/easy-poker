import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneIcon from "@mui/icons-material/Done";
import RedoIcon from "@mui/icons-material/Redo";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import styles from "./voting-control.module.scss";

interface VotingPanelProps {
    title: string;
    estimation: string;
    isOwner?: boolean;
}

export const VotingControl = ({
    title,
    estimation,
    isOwner,
}: VotingPanelProps) => {
    const [isVoting, setIsVoting] = useState(false);

    return (
        <>
            <Box className={styles.container}>
                <Stack gap={1}>
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
                        {estimation}
                    </Typography>
                </Stack>
            </Box>
            {isOwner && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    mt={1}
                    gap={1}
                >
                    <Box>
                        {isVoting ? (
                            <Button
                                variant="contained"
                                startIcon={<RedoIcon />}
                                onClick={() => setIsVoting(false)}
                            >
                                Reveal cards
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                startIcon={<PlayArrowIcon />}
                                onClick={() => setIsVoting(true)}
                            >
                                Start voting
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<DoDisturbIcon />}
                            color="warning"
                            sx={{
                                ml: 1,
                            }}
                        >
                            Cancel voting
                        </Button>
                    </Box>
                    <Button variant="outlined" startIcon={<DoneIcon />}>
                        Done
                    </Button>
                </Stack>
            )}
        </>
    );
};
