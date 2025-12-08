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

type MockTask = { id: string; title: string; estimate: string };

const tasks: MockTask[] = [
    { id: "1", title: "Add dark mode", estimate: "1" },
    { id: "2", title: "Fix login bug", estimate: "" },
    { id: "3", title: "User profile", estimate: "3" },
];

export const TaskPanel = () => {
    const [selectedTask, setSelectedTask] = useState<MockTask | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(selectedTask);

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
                                setSelectedTask(task);
                            }}
                            className={cx(
                                styles.listItem,
                                task.id === selectedTask?.id && styles.selected
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
                                            {task.title}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    </Fragment>
                ))}
            </List>

            <AddTask
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddTasks={(_tasks) => {
                    console.log("ADD", _tasks);
                }}
            />
        </>
    );
};
