export interface GetRoomRequest {
    roomId: string;
}

export interface JoinRoomResponse {
    roomId: string;
}

export interface RoomDto {
    id: string;
    name: string;
    isOwner: boolean;
    userId: string;
    skipVote: boolean;
}
