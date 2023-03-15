import { Channel } from "src/database/entities/Channel";

export default class GetMessageDTO {
    channelId: number;
    page: number;
}