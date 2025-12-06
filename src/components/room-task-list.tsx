"use client";

import {
    Box,
    List,
    ListItem,
    IconButton,
    Typography,
    Chip,
    Paper,
    useTheme,
} from "@mui/material";
import { Delete, Launch } from "@mui/icons-material";
import { Task } from "@/api";

interface TaskItemProps {
    task: Task;
    onDelete: (taskId: string) => void;
}

interface TaskListProps {
    tasks: Task[];
    onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete }) => {
    return (
        <ListItem
            sx={{
                padding: 0.5,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    gap: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    padding: 1,
                    cursor: "pointer",
                    "&:hover": {
                        backgroundColor: "#ccc",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        component="a"
                        href={task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "primary.main",
                            textDecoration: "none",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                            fontSize: "0.875rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {task.link}
                    </Typography>
                </Box>

                <Typography fontSize="large" color="primary">
                    {task.estimate}
                </Typography>

                <IconButton
                    onClick={() => onDelete(task.id)}
                    size="small"
                    sx={{
                        color: "error.main",
                    }}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Box>
        </ListItem>
    );
};

interface TaskListProps {}

export const TaskList = ({ tasks, onDeleteTask }: TaskListProps) => {
    return (
        <List>
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onDelete={onDeleteTask} />
            ))}

            {tasks.length === 0 && (
                <ListItem>
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        sx={{ width: "100%", py: 3 }}
                    >
                        Задачи отсутствуют
                    </Typography>
                </ListItem>
            )}
        </List>
    );
};
