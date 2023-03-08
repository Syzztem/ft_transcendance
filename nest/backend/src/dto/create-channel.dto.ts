import { User } from "src/entities/User";

export default class CreateChannelDTO {
    name: string;
    adminId: number;
    password?: string;
}