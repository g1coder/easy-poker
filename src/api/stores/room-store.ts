import { randomUUID } from "node:crypto";
import { Room, User, Task } from "../types";

class RoomStore {
    private rooms: Map<string, Room> = new Map();

    createRoom(roomName: string, owner: User): Room {
        const roomId = randomUUID();
        const room: Room = {
            id: roomId,
            name: roomName,
            ownerId: owner.id,
            status: "waiting",
            isOwner: true,
            tasks: [],
            users: [owner],
        };

        this.rooms.set(roomId, room);
        return room;
    }

    getRoom(roomId: string) {
        console.log("all rooms", [...this.rooms.values()]);
        return this.rooms.get(roomId);
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
        }));

        room.tasks.push(...tasks);
    }

    deleteTasks(roomId: string, tasks: string[]) {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        room.tasks.filter((task) => !tasks.includes(task.id));
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
}

export const roomStore = new RoomStore();
