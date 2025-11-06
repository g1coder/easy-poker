import { Room, User, VoteResult } from "@/types";
import { randomUUID } from "node:crypto";
import { CreateRoomRequest } from "@/api";

const cards: number[] = [0, 1, 2, 3, 5, 8, 13, 21];

class RoomManager {
    private rooms: Map<string, Room> = new Map();
    private users: Map<string, User> = new Map();
    private userRoomMap: Map<string, string> = new Map(); // userId -> roomId

    createRoom(roomName: CreateRoomRequest["roomName"], ownerId: string): Room {
        const roomId = randomUUID();
        const room: Room = {
            id: roomId,
            name: roomName,
            ownerId,
            status: "waiting",
            votes: {},
            cards,
        };

        this.rooms.set(roomId, room);
        return room;
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    deleteRoom(roomId: string): boolean {
        const roomUsers = Array.from(this.users.values()).filter(
            (user) => this.userRoomMap.get(user.id) === roomId
        );

        roomUsers.forEach((user) => {
            this.users.delete(user.id);
            this.userRoomMap.delete(user.id);
        });

        return this.rooms.delete(roomId);
    }

    addUser(
        userId: string,
        userName: string,
        roomId: string,
        isOwner: boolean = false
    ): User {
        const room = this.getRoom(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        const user: User = {
            id: userId,
            name: userName,
            isOwner,
            voted: false,
            connected: true,
        };

        this.users.set(userId, user);
        this.userRoomMap.set(userId, roomId);

        return user;
    }

    removeUser(userId: string): boolean {
        const roomId = this.userRoomMap.get(userId);
        if (roomId) {
            const room = this.getRoom(roomId);
            if (room) {
                delete room.votes[userId];
            }
        }

        this.userRoomMap.delete(userId);
        return this.users.delete(userId);
    }

    getUser(userId: string): User | undefined {
        return this.users.get(userId);
    }

    getRoomUsers(roomId: string): User[] {
        return Array.from(this.users.values()).filter(
            (user) => this.userRoomMap.get(user.id) === roomId && user.connected
        );
    }

    startVoting(roomId: string): boolean {
        const room = this.getRoom(roomId);
        if (!room) return false;

        room.status = "voting";
        room.votes = {};

        this.getRoomUsers(roomId).forEach((user) => {
            user.voted = false;
            user.vote = undefined;
        });

        return true;
    }

    submitVote(roomId: string, userId: string, vote: number): boolean {
        const room = this.getRoom(roomId);
        const user = this.getUser(userId);

        if (!room || !user || room.status !== "voting") {
            return false;
        }

        room.votes[userId] = vote;
        user.voted = true;
        user.vote = vote;

        return true;
    }

    revealVotes(roomId: string): VoteResult[] | null {
        const room = this.getRoom(roomId);
        if (!room || room.status !== "voting") return null;

        room.status = "revealed";

        const votes = Object.values(room.votes).filter(
            (vote) => vote !== undefined
        );
        if (votes.length > 0) {
            const sum = votes.reduce((a, b) => a + b, 0);
            room.average = Math.round((sum / votes.length) * 100) / 100;
        }

        return Object.entries(room.votes).map(([userId, vote]) => {
            const user = this.getUser(userId);
            return {
                userId,
                userName: user?.name || "Unknown",
                vote,
            };
        });
    }

    resetVotes(roomId: string): boolean {
        const room = this.getRoom(roomId);
        if (!room) return false;

        room.status = "waiting";
        room.votes = {};
        room.average = undefined;

        this.getRoomUsers(roomId).forEach((user) => {
            user.voted = false;
            user.vote = undefined;
        });

        return true;
    }

    setUserConnection(userId: string, connected: boolean): void {
        const user = this.getUser(userId);
        if (user) {
            user.connected = connected;
        }
    }
}

export const roomManager = new RoomManager();
