import IMessage from "./IMessage"
import IUser from "./IUser"

interface IChannel {
    name:     string,
    password: string,
    isPrivate: boolean,
    users:    Array<IUser>
    messages: Array<IMessage>,
    id:       number,
  }

export default IChannel