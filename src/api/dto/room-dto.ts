import { Room, Task } from "../types";

export interface GetRoomRequest {
    roomId: string;
}

export interface GetRoomResponse extends Omit<Room, "ownerId" | "tasks"> {
    tasks: Task[];
}

export interface CreateRoomRequest {
    roomName: string;
    ownerName: string;
}

export interface CreateRoomResponse {
    roomId: string;
    isOwner: boolean;
}

export interface JoinRoomRequest {
    roomId: string;
    userName: string;
}

export interface JoinRoomResponse {
    roomId: string;
}

export interface AddRoomTasksRequest {
    roomId: string;
    tasks: string[];
}
