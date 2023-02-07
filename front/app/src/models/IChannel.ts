import IMessage from "./IMessage"
import IUser from "./IUser"

interface IChannel {
    name:     string,
    messages: Array<IMessage>,
    users:    Array<IUser>
  }

export default IChannel