import IMessage from "./IMessage"
import IUser from "./IUser"

interface IChannel {
    name:       string,
    admin:      IUser,
    password:   string,
    isPrivate:  boolean,
    users:      Array<IUser>,
    messages:   Array<IMessage>,
    id:         number,
    mods:       Array<IUser>
  }

export default IChannel