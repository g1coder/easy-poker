export interface GetRoomRequest {
    roomId: string;
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

export interface RoomDto {
    id: string;
    name: string;
    isOwner: boolean;
    userId: string;
}
