import {
  ComponentInteraction,
  ComponentTypes,
  Constants,
  ModalSubmitInteraction,
} from "oceanic.js";
import { OWNER_IDS } from "../../../constants";
import { DatabaseService } from "../../../service/DatabaseService";
import settingsGuild_blacklist from "./settings.guild_blacklist";

const prisma = DatabaseService.getClient();

async function execute(
  interaction:
    | ComponentInteraction<ComponentTypes.BUTTON>
    | ModalSubmitInteraction
) {
  if (!OWNER_IDS.includes(interaction.user.id)) {
    return;
  }

  const customID = interaction.data.customID;

  const field = customID.split("-")[1]?.trim();

  if (interaction instanceof ComponentInteraction) {
    if (field === "add") {
      return interaction.createModal({
        title: "Add Guild",
        customID,
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
              {
                label: "Guild ID",
                type: Constants.ComponentTypes.TEXT_INPUT,
                style: Constants.TextInputStyles.SHORT,
                customID: "value",
                placeholder: "Place guild ID here",
                required: true,
              },
            ],
          },
        ],
      });
    }
    if (field === "remove") {
      return interaction.createModal({
        title: "Remove Guild",
        customID,
        components: [
          {
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
              {
                label: "Guild ID",
                type: Constants.ComponentTypes.TEXT_INPUT,
                style: Constants.TextInputStyles.SHORT,
                customID: "value",
                placeholder: "Place guild ID here",
                required: true,
              },
            ],
          },
        ],
      });
    }
    return;
  }

  if (!interaction.acknowledged) {
    await interaction.deferUpdate().catch((_) => {});
  }

  if (!interaction.guildID) return;

  const value = interaction.options.getString("value", true).trim();

  if (field === "add") {
    await prisma.guildBlacklist.upsert({
      where: {
        guildID: value,
      },
      update: {},
      create: {
        guildID: value,
      },
    });
  } else {
    await prisma.guildBlacklist.deleteMany({
      where: {
        guildID: value,
      },
    });
  }

  await settingsGuild_blacklist.execute(interaction);
}

export = {
  id: "settings.guild_blacklist.edit",
  execute,
};
