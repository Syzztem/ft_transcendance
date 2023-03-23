import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://127.0.0.1:3000/", {
    transports: ["websocket"],
    autoConnect: false,
    auth: (cb) => {
        cb({token: localStorage.getItem('token')})
    }
});

export default socket
