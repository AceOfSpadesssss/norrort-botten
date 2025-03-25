import { Guild, Client } from "oceanic.js";
import { promisify } from "util";
import { DatabaseService } from "./DatabaseService";

const prisma = DatabaseService.getClient();
const sleep = promisify(setTimeout);

export class DRMService {
  private static client: Client;

  static async initialize(client: Client) {
    this.client = client;

    await sleep(20000);

    this.checkGuilds().catch((e) => {
      this.client.logger.error(e);
    });

    setInterval(() => {
      this.checkGuilds().catch((e) => {
        this.client.logger.error(e);
      });
    }, 4.32e7);

    this.client.logger.info("[DRM Service] initialized");
  }

  static async checkGuild(guild: Guild) {
    try {
      const isInBlacklist = await prisma.guildBlacklist.findUnique({
        where: {
          guildID: guild.id,
        },
      });

      if (isInBlacklist) {
        await guild.leave();
      }
    } catch (e) {
      this.client.logger.error(e);
    }
  }

  static async checkGuilds() {
    this.client.logger.info("[DRM Service] checking guilds");

    const guilds = Array.from(this.client.guilds.values());

    for (const guild of guilds) {
      await this.checkGuild(guild);
    }
  }
}
