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

export interface SetupRoomRequest {
    roomId: string;
    skipVote: boolean;
}

export interface RoomDto {
    id: string;
    name: string;
    isOwner: boolean;
    userId: string;
    skipVote: boolean;
}
