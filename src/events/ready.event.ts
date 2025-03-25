import { Client } from "oceanic.js";
import { DRMService } from "../service/DRMService";
import { GeneralService } from "../service/GeneralService";
import { GuildLogService } from "../service/GuildLogService";
import { ReminderService } from "../service/ReminderService";

async function execute(client: Client) {
  await GeneralService.initialize().catch((e) => {
    client.logger.error(e);
  });

  GuildLogService.initialize(client);

  ReminderService.initialize(client).catch((e) => {
    client.logger.error(e);
  });

  DRMService.initialize(client);
}

export = {
  name: "ready",
  once: true,
  execute,
};
