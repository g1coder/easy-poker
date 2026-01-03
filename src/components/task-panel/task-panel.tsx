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
import { api, RoomDto } from "@/api";
import { useContextSelector } from "use-context-selector";
import { RoomContext, CurrentTaskContext } from "@/providers";

interface TaskPanelProps {
    room: RoomDto;
}

export const TaskPanel = ({ room }: TaskPanelProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tasks = useContextSelector(RoomContext, (c) => c.tasks) || [];
    const { currentTask, selectTask } = useContextSelector(
        CurrentTaskContext,
        (c) => c
    );

    const handleAddTasks = async (value: string[]) => {
        await api.post(`/rooms/${room.id}/tasks/add`, {
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

                {room.isOwner && (
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
                )}
            </Box>

            <List dense disablePadding>
                {tasks.map((task) => (
                    <Fragment key={task.id}>
                        <ListItem
                            onClick={() => {
                                selectTask(task.id);
                            }}
                            className={cx(
                                styles.listItem,
                                task.id === currentTask?.id && styles.selected
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

            {room.isOwner && (
                <AddTask
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddTasks={handleAddTasks}
                />
            )}
        </>
    );
};
