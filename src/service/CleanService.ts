import { AnyChannel, Message } from "oceanic.js";
import { DatabaseService } from "./DatabaseService";

const prisma = DatabaseService.getClient();

export class CleanService {
	static async checkChannel(channel: AnyChannel) {
		await prisma.guildTicket.updateMany({
			where: {
				ticketChannelID: channel.id,
			},
			data: {
				status: "deleted",
			},
		});
	}

	static async checkMessage(message: Message | Object) {}
}
