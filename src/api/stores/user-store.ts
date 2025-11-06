import { User } from "@/types";
import { getRandomValues } from "node:crypto";

const generateToken = () => {
    const arr = new Uint8Array(12);
    getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
};

class UserStore {
    #userSessionMap: Map<string, Pick<User, "id" | "name">> = new Map();

    public createUser(userName: string) {
        const token = generateToken();
        const user = {
            id: token,
            name: userName,
        };
        this.#userSessionMap.set(token, user);
        return user;
    }

    public getUser(token: string) {
        console.log("all users", [...this.#userSessionMap.values()]);

        console.log("target user", this.#userSessionMap.get(token));
        return this.#userSessionMap.get(token) || null;
    }
}

export const userStore = new UserStore();
