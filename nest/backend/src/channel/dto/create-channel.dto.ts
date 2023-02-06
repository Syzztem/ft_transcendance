import { User } from "../../database/entities/User";

export default class CreateChannelDTO {
    name: string;
    admin: User;
}