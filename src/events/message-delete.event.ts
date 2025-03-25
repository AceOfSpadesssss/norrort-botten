import { Message, Client } from "oceanic.js";
import { CleanService } from "../service/CleanService";

async function execute(message: Message | Object, client: Client) {
  await CleanService.checkMessage(message).catch((e) => {
    client.logger.error(e);
  });
}

export = {
  name: "messageDelete",
  once: false,
  execute,
};
