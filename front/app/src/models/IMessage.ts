import IChannel from "./IChannel"
import IUser from "./IUser"

interface	IMessage
{
	content:string,
	sender: IUser,
	channel: IChannel,
	timestamp: Date,
}

export default IMessage