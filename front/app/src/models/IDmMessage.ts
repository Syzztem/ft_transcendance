import IUser from "./IUser"

interface	IDmMessage
{
	content: string,
	id: number,
    timestamp: string,
	sender: IUser
}

export default IDmMessage