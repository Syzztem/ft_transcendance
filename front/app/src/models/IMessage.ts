import IChannel from "./IChannel"
import IUser from "./IUser"

interface	IMessage
{
	id: number,
	content:string,
	sender: IUser,
	timestamp: Date,
	channel: IChannel
}

export default IMessage