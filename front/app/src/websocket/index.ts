import { io, Socket, ManagerOptions, SocketOptions} from "socket.io-client";

const options: Partial<ManagerOptions & SocketOptions> = {
    transports: ["websocket"],
    autoConnect: false,
    auth: (cb) => {
        cb({token: localStorage.getItem('token')})
    }
}

export const socket: Socket = io("http://127.0.0.1:3000/", options);
export const chatSocket: Socket = io("http://127.0.0.1:3000/chat", options)

