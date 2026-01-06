import { User } from "@/api";

export interface GetRoomRequest {
    roomId: string;
}

export interface JoinRoomResponse {
    roomId: string;
}

export interface RoomDto {
    id: string;
    isOwner: boolean;
    name: string;
    userId: string;
    skipVote: boolean;
    users: User[];
}
