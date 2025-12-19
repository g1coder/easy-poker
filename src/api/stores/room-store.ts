import { randomUUID } from "node:crypto";
import { Room, User, Task } from "../types";
import { findTaskEstimation } from "@utils/find-task-estimation";

class RoomStore {
    private rooms: Map<string, Room> = new Map();
    private roomTasks: Map<string, Task[]> = new Map();

    createRoom(roomName: string, owner: User): Room {
        const roomId = randomUUID();
        const room: Room = {
            id: roomId,
            name: roomName,
            ownerId: owner.id,
            status: "waiting",
            users: [owner],
        };

        this.rooms.set(roomId, room);
        return room;
    }

    getRoom(roomId: string) {
        console.log("all rooms", [...this.rooms.values()]);
        return this.rooms.get(roomId);
    }

    getRoomTasks(roomId: string) {
        return this.roomTasks.get(roomId) || [];
    }

    getRoomTask(roomId: string, taskId: string) {
        const tasks = this.roomTasks.get(roomId) || [];
        return tasks.find((task) => task.id === taskId) || null;
    }

    addTasks(roomId: string, newTasks: string[]) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        const tasks: Task[] = newTasks.map((link) => ({
            id: randomUUID(),
            link,
            estimate: null,
            votes: {},
            status: "waiting",
        }));

        const _tasks = this.roomTasks.get(roomId) || [];
        _tasks.push(...tasks);

        this.roomTasks.set(roomId, _tasks);
    }

    deleteTasks(roomId: string, tasks: string[]) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        const _tasks = this.roomTasks.get(roomId) || [];
        _tasks.filter((task) => !tasks.includes(task.id));
    }

    joinUser(roomId: string, user: User) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        room.users.push(user);
    }

    getRoomUsers(roomId: string, connected = true): User[] {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        return room.users.filter((user) => user.connected === connected);
    }

    submitVote(roomId: string, user: User, taskId: string, vote: string) {
        const task = this.getRoomTask(roomId, taskId);
        if (!task || task?.status === "finished") return false;

        task.status = "voting";
        task.votes[user.id] = vote;

        return true;
    }

    resetVotes(roomId: string, taskId: string) {
        const task = this.getRoomTask(roomId, taskId);
        if (!task) return false;

        task.status = "waiting";
        task.votes = {};
        task.estimate = null;

        return true;
    }

    revealVotes(roomId: string, taskId: string) {
        const task = this.getRoomTask(roomId, taskId);
        if (!task) return false;

        task.status = "revealed";
        task.estimate = findTaskEstimation(task.votes);

        return true;
    }

    freezeVoting(roomId: string, taskId: string) {
        const task = this.getRoomTask(roomId, taskId);
        if (!task) return false;

        task.status = "finished";

        return true;
    }
}

export const roomStore = new RoomStore();
