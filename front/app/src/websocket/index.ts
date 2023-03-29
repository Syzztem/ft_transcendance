import { io, Socket, ManagerOptions, SocketOptions} from "socket.io-client";

const options: Partial<ManagerOptions & SocketOptions> = {
    transports: ["websocket"],
    autoConnect: false,
    auth: (cb) => {
        cb({token: localStorage.getItem('token')})
    }
}

export const socket: Socket = io("http://" + process.env.VUE_APP_URL + ":3000/", options);
export const chatSocket: Socket = io("http://" + process.env.VUE_APP_URL + ":3000/chat", options)

