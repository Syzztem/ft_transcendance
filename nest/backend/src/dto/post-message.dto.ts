import { Channel } from "src/entities/Channel";
import { User } from "src/entities/User";

export default class PostMessageDTO {
    message: string;
    channel: Channel;
    sender: User;
}