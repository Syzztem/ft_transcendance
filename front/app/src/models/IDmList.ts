import IDmMessage from "./IDmMessage"
import IUser from "./IUser"

interface	IDmList
{
	messages: Array<IDmMessage>,
	me: IUser
    friend: IUser,
	users: Array<IUser>,
	id: number
}

export default IDmList