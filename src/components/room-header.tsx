"use client";

import React, { useState } from "react";
import {
    Typography,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Stack,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";

interface RoomHeaderProps {
    title: string;
    href: string;
}

export const RoomHeader = ({ title, href }: RoomHeaderProps) => {
    const [open, setOpen] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(href);
            setOpen(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <>
            <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="h5" align="center" color="primary">
                    {title}
                </Typography>

                <Tooltip title="Copy room link">
                    <IconButton
                        size="large"
                        onClick={handleCopy}
                        sx={{
                            color: "text.secondary",
                            "&:hover": {
                                backgroundColor: "action.hover",
                                color: "primary.main",
                            },
                        }}
                    >
                        <ContentCopy sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    setOpen(false);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Link has been copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
};
