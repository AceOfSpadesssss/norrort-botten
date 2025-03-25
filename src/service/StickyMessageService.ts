import { Message, Client } from "oceanic.js";
import { DatabaseService } from "./DatabaseService";

const prisma = DatabaseService.getClient();

// store last message timestamps to prevent spam
const lastMessageTimestamps: { [channelID: string]: number } = {};

export class StickyMessageService {
	public static async checkMessage(message: Message, client: Client) {
		if (!message.guildID) return;

		// check if this is a sticky channel
		const messageRecord = await prisma.guildStickyMessage.findFirst({
			where: {
				guildID: message.guildID,
				channelIDs: { contains: message.channelID },
			},
		});

		if (!messageRecord) return;

		// get past sticky message and delete it
		const historyRecord = await prisma.guildStickyMessageHistory.findFirst({
			where: {
				guildID: message.guildID,
				name: messageRecord.name,
				channelID: message.channelID,
			},
		});

		if (!historyRecord) return;

		// check last message time in the channel to prevent abuse
		const timestamp = lastMessageTimestamps[message.channelID];

		if (timestamp) {
			const diff = new Date().getTime() - timestamp;
			if (diff < 6000) return;
		}

		// delete previous message
		await client.rest.channels.deleteMessage(
			historyRecord.channelID,
			historyRecord.messageID,
			"Sticky message"
		);

		// stick message again
		const stickyMessage = await client.rest.channels.createMessage(
			message.channelID,
			JSON.parse(messageRecord.content)
		);

		await prisma.guildStickyMessageHistory.update({
			where: { id: historyRecord.id },
			data: { messageID: stickyMessage.id },
		});

		lastMessageTimestamps[message.channelID] = message.createdAt.getTime();
	}
}
