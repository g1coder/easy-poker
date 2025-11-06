"use client";

import React, { useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Chip,
    Avatar,
    AvatarGroup,
    List,
    ListItem,
    Divider,
} from "@mui/material";

// Типы
interface Task {
    id: number;
    title: string;
    link: string;
    estimate: string | null;
}

interface User {
    id: number;
    name: string;
    avatar: string;
    voted: boolean;
}

type PokerCard = string;

// Константы
const initialTasks: Task[] = [
    {
        id: 1,
        title: "Реализация авторизации",
        link: "PROJ-123",
        estimate: null,
    },
    {
        id: 2,
        title: "Фикс бага с кэшированием",
        link: "PROJ-124",
        estimate: "5",
    },
    {
        id: 3,
        title: "Добавление темной темы",
        link: "PROJ-125",
        estimate: null,
    },
    {
        id: 4,
        title: "Оптимизация загрузки изображений",
        link: "PROJ-126",
        estimate: "8",
    },
    { id: 5, title: "Рефакторинг API", link: "PROJ-127", estimate: null },
];

const users: User[] = [
    { id: 1, name: "Алексей", avatar: "A", voted: true },
    { id: 2, name: "Мария", avatar: "M", voted: false },
    { id: 3, name: "Иван", avatar: "И", voted: true },
    { id: 4, name: "Ольга", avatar: "О", voted: false },
];

const pokerCards: PokerCard[] = [
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
    "21",
    "34",
    "?",
    "☕",
];

interface UserVotes {
    [taskId: number]: PokerCard;
}

const PlanningPokerUI: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedTask, setSelectedTask] = useState<Task>(initialTasks[0]);
    const [userVotes, setUserVotes] = useState<UserVotes>({});
    const [showResults, setShowResults] = useState<boolean>(false);

    const handleTaskSelect = (task: Task): void => {
        setSelectedTask(task);
        setShowResults(false);
    };

    const handleVote = (cardValue: PokerCard): void => {
        setUserVotes((prev) => ({
            ...prev,
            [selectedTask.id]: cardValue,
        }));
    };

    const handleRevealResults = (): void => {
        setShowResults(true);
    };

    const handleClearVotes = (): void => {
        setUserVotes((prev) => {
            const newVotes = { ...prev };
            delete newVotes[selectedTask.id];
            return newVotes;
        });
        setShowResults(false);
    };

    const votedUsersCount: number = users.filter((user) => user.voted).length;

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 2,
                height: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                color="primary"
            >
                Planning Poker
            </Typography>

            <Grid container spacing={2} sx={{ height: "calc(100vh - 100px)" }}>
                {/* Левая колонка - Список задач */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" component="h2">
                                Задачи для оценки
                            </Typography>
                            <Button variant="outlined" size="small">
                                Добавить задачу
                            </Button>
                        </Box>

                        <List sx={{ flexGrow: 1, overflow: "auto" }}>
                            {tasks.map((task, index) => (
                                <React.Fragment key={task.id}>
                                    <ListItem
                                        sx={{
                                            p: 1,
                                            cursor: "pointer",
                                            backgroundColor:
                                                selectedTask?.id === task.id
                                                    ? "action.selected"
                                                    : "transparent",
                                            borderRadius: 1,
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                            },
                                        }}
                                        onClick={() => handleTaskSelect(task)}
                                    >
                                        <Card
                                            sx={{ width: "100%" }}
                                            variant="outlined"
                                        >
                                            <CardContent
                                                sx={{
                                                    p: 2,
                                                    "&:last-child": { pb: 2 },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        alignItems:
                                                            "flex-start",
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            gutterBottom
                                                        >
                                                            {task.link}
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"
                                                            component="div"
                                                        >
                                                            {task.title}
                                                        </Typography>
                                                    </Box>
                                                    {task.estimate && (
                                                        <Chip
                                                            label={
                                                                task.estimate
                                                            }
                                                            color="primary"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </ListItem>
                                    {index < tasks.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Правая колонка - Оценка */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Заголовок выбранной задачи */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Оцениваем задачу:
                            </Typography>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                            >
                                {selectedTask.link}: {selectedTask.title}
                            </Typography>

                            {/* Статус голосования */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mt: 1,
                                }}
                            >
                                <AvatarGroup total={users.length}>
                                    {users.map((user: User) => (
                                        <Avatar
                                            key={user.id}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: user.voted
                                                    ? "success.main"
                                                    : "grey.400",
                                            }}
                                        >
                                            {user.avatar}
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {votedUsersCount} из {users.length}{" "}
                                    проголосовали
                                </Typography>
                            </Box>
                        </Box>

                        {/* Карточки для голосования */}
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Выберите оценку:
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                {pokerCards.map((card: PokerCard) => (
                                    <Grid item xs={2} key={card}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                transform:
                                                    userVotes[
                                                        selectedTask.id
                                                    ] === card
                                                        ? "scale(1.05)"
                                                        : "scale(1)",
                                                border:
                                                    userVotes[
                                                        selectedTask.id
                                                    ] === card
                                                        ? "2px solid"
                                                        : "1px solid",
                                                borderColor:
                                                    userVotes[
                                                        selectedTask.id
                                                    ] === card
                                                        ? "primary.main"
                                                        : "divider",
                                                backgroundColor:
                                                    userVotes[
                                                        selectedTask.id
                                                    ] === card
                                                        ? "primary.light"
                                                        : "background.paper",
                                                "&:hover": {
                                                    transform: "scale(1.05)",
                                                    boxShadow: 2,
                                                },
                                            }}
                                            onClick={() => handleVote(card)}
                                        >
                                            <CardContent
                                                sx={{
                                                    p: 2,
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    component="div"
                                                >
                                                    {card}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Результаты голосования */}
                            {showResults && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Результаты голосования:
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {users.map((user: User) => (
                                            <Chip
                                                key={user.id}
                                                avatar={
                                                    <Avatar>
                                                        {user.avatar}
                                                    </Avatar>
                                                }
                                                label={`${user.name}: ${userVotes[selectedTask.id] || "?"}`}
                                                variant="outlined"
                                                color={
                                                    user.voted
                                                        ? "success"
                                                        : "default"
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Кнопки действий */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                justifyContent: "flex-end",
                                mt: "auto",
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleClearVotes}
                                disabled={!userVotes[selectedTask.id]}
                            >
                                Сбросить голос
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleRevealResults}
                                disabled={!userVotes[selectedTask.id]}
                            >
                                Показать результаты
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                disabled={!showResults}
                            >
                                Завершить оценку
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlanningPokerUI;
