import IUser from "./IUser"

interface	IDmMessage
{
	content:string,
	receiver: Array<IUser>,
    sender: IUser,
	id: number,
    timestamp: string
}

export default IDmMessage