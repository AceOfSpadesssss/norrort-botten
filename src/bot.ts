import { setGlobalDispatcher, Agent } from "undici";
import { Intents } from "oceanic.js";
import { CustomClient } from "./helpers/CustomClient";
import { TOKEN } from "./util/config.util";

setGlobalDispatcher(new Agent({ connect: { timeout: 20_000 } }));

async function initializeBot() {
  const client = new CustomClient({
    auth: `Bot ${TOKEN}`,
    gateway: {
      intents:
        Intents.GUILDS |
        Intents.GUILD_MESSAGES |
        Intents.GUILD_MEMBERS |
        Intents.GUILD_VOICE_STATES |
        Intents.MESSAGE_CONTENT,
    },
    allowedMentions: {
      repliedUser: true,
      roles: true,
      users: true,
      everyone: false,
    },
  });

  await client.connect();
}

initializeBot();
