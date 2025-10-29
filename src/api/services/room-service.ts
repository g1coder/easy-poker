import { api } from "../api";

const createRoom = async () => {
    return api.post();
};

export const RoomService = {
    createRoom,
} as const;
