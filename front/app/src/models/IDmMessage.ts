import IUser from "./IUser"

interface	IDmMessage
{
	id: number,
	content: string,
	sender: IUser,
	receiver: IUser,
    timestamp: Date
}

export default IDmMessage