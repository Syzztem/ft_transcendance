import IUser from "./IUser"

interface	IDmMessage
{
	content:string,
	receiver: IUser,
    sender: IUser,
	users: Array<IUser>,
	id: number,
    timestamp: string
}

export default IDmMessage