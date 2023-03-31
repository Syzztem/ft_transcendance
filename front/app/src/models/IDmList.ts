import IDmMessage from "./IDmMessage"
import IUser from "./IUser"

interface	IDmList
{
	messages: Array<IDmMessage>,
	receiver: IUser,
    sender: IUser,
	users: Array<IUser>,
}

export default IDmList