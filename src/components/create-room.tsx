"use client";

import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export const CreateRoom = () => {
    const [error, setError] = useState("");
    const [links, setLinks] = useState<string[]>([]);

    const tryCreateRoom = async () => {
        if (links.length === 0) {
            setError("No links found");
            return;
        }

        return true;
    };

    return (
        <Stack direction="column" spacing={2} minWidth={360}>
            <TextField
                label="Paste your links here"
                variant="standard"
                error={!!error}
                helperText={error}
                onChange={(event) => {
                    const regex = /https?:\/\/[^\s]+?(?=https?:\/\/|$)/g;
                    const value = event.target.value?.match(regex);
                    if (value) {
                        setLinks(value);
                    }
                }}
                multiline
                maxRows={10}
            />
            <Button variant="contained" onClick={tryCreateRoom}>
                Create Room
            </Button>
        </Stack>
    );
};
