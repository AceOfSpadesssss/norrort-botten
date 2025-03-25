import { Message, Client } from "oceanic.js";
import { StickyMessageService } from "../service/StickyMessageService";

async function execute(message: Message, client: Client) {
  if (message.author.bot) return;

  await StickyMessageService.checkMessage(message, client).catch((e) => {
    client.logger.error(e);
  });
}

export = {
  name: "messageCreate",
  once: false,
  execute,
};
