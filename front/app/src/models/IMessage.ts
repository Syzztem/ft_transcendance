import IChannel from "./IChannel"
import IUser from "./IUser"

interface	IMessage
{
	content:string,
	sender: IUser,
	channel: IChannel,
}

export default IMessage