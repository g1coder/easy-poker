import { User } from "../types";
import { getRandomValues } from "node:crypto";

const generateToken = () => {
    const arr = new Uint8Array(12);
    getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
};

class UserStore {
    #userSessionMap: Map<string, User> = new Map();

    public createUser(userName: string) {
        const token = generateToken();
        const user: User = {
            id: token,
            name: userName,
            connected: true,
            voted: false,
        };
        this.#userSessionMap.set(token, user);
        return user;
    }

    public getUser(token: string) {
        console.log("all users", [...this.#userSessionMap.values()]);

        console.log("target user.ts", this.#userSessionMap.get(token));
        return this.#userSessionMap.get(token) || null;
    }

    public setUserConnection(userId: string, connected: boolean) {
        const user = this.getUser(userId);
        if (user) {
            user.connected = connected;
        }
    }
}

export const userStore = new UserStore();
