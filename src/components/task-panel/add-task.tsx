import { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    Divider,
} from "@mui/material";

interface AddTaskProps {
    open: boolean;
    onClose: () => void;
    onAddTasks: (tasks: string[]) => void;
}

export const AddTask = ({ open, onClose, onAddTasks }: AddTaskProps) => {
    const [taskInput, setTaskInput] = useState("");

    const handleSubmit = () => {
        const tasks = taskInput
            .split("\n")
            .map((task) => task.trim())
            .filter((task) => task.length > 0);

        if (tasks.length > 0) {
            onAddTasks(tasks);
            setTaskInput("");
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    maxWidth: "90vw",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 0,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        pb: 0,
                    }}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Add tasks
                    </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        To add several tasks at once, put each one in a new
                        line. You can add and edit tasks anytime.
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <TextField
                        multiline
                        rows={5}
                        fullWidth
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Paste or write multiple tasks using new line delimiter, example:"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                </Box>

                <Box
                    sx={{
                        p: 3,
                        pt: 2,
                        borderTop: 1,
                        borderColor: "divider",
                        bgcolor: "grey.50",
                    }}
                >
                    <Stack direction="row" spacing={2} justifyContent="end">
                        <Button variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!taskInput.trim()}
                        >
                            Create
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};
