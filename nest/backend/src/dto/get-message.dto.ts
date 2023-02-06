import { Channel } from "src/database/entities/Channel";

export default class GetMessageDTO {
    channel: Channel;
    page: number;
}