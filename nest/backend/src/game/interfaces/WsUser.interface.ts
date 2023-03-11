import { User } from "src/database/entities/User"

export default interface WsUser {
    socketId: string,
    user: User
}