import axios, { AxiosResponse } from "axios";

const apiPrefix = "api";

const axiosInstance = axios.create({
    baseURL: `/${apiPrefix}`,
    withCredentials: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxy = <P = any>(func: (...args: P[]) => Promise<AxiosResponse>) => {
    return <T = P>(...args: P[]): Promise<T> => {
        return new Promise((resolve, reject) => {
            func(...args)
                .then((response) => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    };
};

export const api = {
    get: proxy(axiosInstance.get),
    post: proxy(axiosInstance.post),
    patch: proxy(axiosInstance.patch),
    delete: proxy(axiosInstance.delete),
    put: proxy(axiosInstance.put),
};
