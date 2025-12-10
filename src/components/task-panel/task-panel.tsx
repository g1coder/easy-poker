import { Fragment, useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
    Typography,
    Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./task-panel.module.scss";
import { cx } from "@/utils";
import { AddTask } from "./add-task";
import { TaskMenu } from "./task-menu";
import { api, Task } from "@/api";

interface TaskPanelProps {
    roomId: string;
    tasks: Task[];
    isOwner: boolean;
    selectedId: Task["id"] | null;
    onSelect: (task: Task) => void;
}

export const TaskPanel = ({
    roomId,
    tasks,
    isOwner,
    selectedId,
    onSelect,
}: TaskPanelProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTasks = async (value: string[]) => {
        await api.post(`/rooms/${roomId}/tasks/add`, {
            tasks: value,
        });
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    {`TASKS: ${tasks.length}`}
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        fontSize: "0.875rem",
                    }}
                >
                    Add tasks
                </Button>
            </Box>

            <List dense disablePadding>
                {tasks.map((task) => (
                    <Fragment key={task.id}>
                        <ListItem
                            onClick={() => {
                                onSelect(task);
                            }}
                            className={cx(
                                styles.listItem,
                                task.id === selectedId && styles.selected
                            )}
                            disablePadding
                            secondaryAction={
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Typography
                                        variant="body1"
                                        fontWeight={700}
                                        color="primary"
                                    >
                                        {task.estimate}
                                    </Typography>
                                    <TaskMenu onDelete={() => {}} />
                                </Stack>
                            }
                        >
                            <ListItemText
                                primary={
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {task.link}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </Fragment>
                ))}
            </List>

            {isOwner && (
                <AddTask
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddTasks={handleAddTasks}
                />
            )}
        </>
    );
};
