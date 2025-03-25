import {
  Constants,
  ComponentInteraction,
  ModalSubmitInteraction,
  ButtonStyles,
} from "oceanic.js";
import { MENU_HOME_BTN_LABEL, MENU_HOME_BTN_STYLE } from "../../../constants";

import { DatabaseService } from "../../../service/DatabaseService";

const prisma = DatabaseService.getClient();

async function execute(
  interaction: ComponentInteraction | ModalSubmitInteraction
) {
  if (!interaction.guildID) return;

  if (!interaction.acknowledged) {
    await interaction.deferUpdate().catch((_) => {});
  }

  const panel = await prisma.guildBlacklist.findMany();

  await interaction.editOriginal({
    embeds: [
      {
        title: "Guild Blacklist",
        description:
          "Manage Guild Blacklist\n\n" +
          (panel.map((p, index) => `${index + 1}) ${p.guildID}`).join("\n") ||
            "No Guilds"),
        color: interaction.colors.default,
      },
    ],
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            customID: "settings.guild_blacklist.edit-add",
            type: Constants.ComponentTypes.BUTTON,
            label: "Add Guild",
            style: ButtonStyles.PRIMARY,
          },
          {
            customID: "settings.guild_blacklist.edit-remove",
            type: Constants.ComponentTypes.BUTTON,
            label: "Remove Guild",
            style: ButtonStyles.PRIMARY,
          },
        ],
      },
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            customID: "settings.base",
            type: Constants.ComponentTypes.BUTTON,
            label: MENU_HOME_BTN_LABEL,
            style: MENU_HOME_BTN_STYLE,
          },
        ],
      },
    ],
  });
}

export = {
  id: "settings.guild_blacklist",
  execute,
};
