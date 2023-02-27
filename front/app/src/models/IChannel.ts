import IMessage from "./IMessage"
import IUser from "./IUser"

interface IChannel {
    name:     string,
    id:       number,
    users:    Array<IUser>
    messages: Array<IMessage>,
  }

export default IChannel