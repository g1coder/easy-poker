export * from "./room-dto";
import { Room, Task } from "../types";

export interface TaskDto extends Omit<Task, "votes"> {
    vote: string;
}

export interface RoomDto extends Room {
    isOwner: boolean;
}
