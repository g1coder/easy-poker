import { Room } from "@/types";
import { randomUUID } from "node:crypto";
import { Task } from "@/api";

const cards: number[] = [0, 1, 2, 3, 5, 8, 13, 21];

const mockTasks: Task[] = Array.from({ length: 20 }).map((_, idx) => ({
    id: idx.toString(),
    link: "http://localhost:3000/74b87805-71dc-422a-9cec-b8da5ccd1a66",
    vote: 1,
    votes: [],
}));

class RoomStore {
    private rooms: Map<string, Room> = new Map();
    private roomUsersMap: Map<string, Set<string>> = new Map();

    createRoom(roomName: string, ownerId: string): Room {
        const roomId = randomUUID();
        const room: Room = {
            id: roomId,
            name: roomName,
            ownerId,
            status: "waiting",
            votes: {},
            cards,
            isOwner: true,
            tasks: new Map(mockTasks.map((item) => [item.id, item])),
        };

        this.rooms.set(roomId, room);
        this.roomUsersMap.set(roomId, new Set([ownerId]));
        return room;
    }

    getRoom(roomId: string) {
        console.log("all rooms", [...this.rooms.values()]);
        return this.rooms.get(roomId);
    }

    addTasks(roomId: string, tasks: Task[]) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        tasks.forEach((task) => {
            room.tasks.set(task.id, task);
        });
    }

    deleteTasks(roomId: string, tasks: Task[]) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        tasks.forEach((task) => {
            room.tasks.delete(task.id);
        });
    }

    joinUser(roomId: string, userId: string) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        const users = this.roomUsersMap.get(roomId);
        if (users) {
            users.add(userId);
        }
    }
}

export const roomStore = new RoomStore();
