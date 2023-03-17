import IChannel from "./IChannel"

interface IUser {
    username: string,
    login42: string,
    email: string,
    rank: number,
    token: string,
    wins: number,
    losses: number,
    level: number,
    profilePic: string,
    friends : Array<IUser>
    blocked: Array<IUser>,
    channels: Array<IChannel>,
  }

export default IUser