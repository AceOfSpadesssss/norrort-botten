import {
  ComponentInteraction,
  Constants,
  ModalSubmitInteraction,
} from "oceanic.js";
import {
  MENU_BACK_BTN_LABEL,
  MENU_BACK_BTN_STYLE,
  MENU_HOME_BTN_LABEL,
  MENU_HOME_BTN_STYLE,
} from "../../../constants";
import { DatabaseService } from "../../../service/DatabaseService";

const prisma = DatabaseService.getClient();

async function execute(
  interaction: ComponentInteraction | ModalSubmitInteraction
) {
  if (!interaction.guildID || !interaction.member) return;

  if (!interaction.acknowledged) {
    await interaction.deferUpdate().catch((_) => {});
  }

  const suggestionRecord = await prisma.guildSuggestionPanel.findFirst({
    where: { guildID: interaction.guildID },
  });

  await interaction.editOriginal({
    embeds: [
      {
        title: "Suggestion Module",
        description:
          "Set up suggestion this will update in real-time when you add to it",
        color: interaction.colors.default,
        fields: [
          {
            name: "Channel",
            value: suggestionRecord
              ? `<#${suggestionRecord.suggestionChannelID}>`
              : "Not Set",
          },
        ],
      },
    ],
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            type: Constants.ComponentTypes.BUTTON,
            customID: "settings.suggestion.channel",
            style: Constants.ButtonStyles.PRIMARY,
            label: "Set Suggestions Channel",
          },
        ],
      },
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            customID: "settings.base.fun",
            type: Constants.ComponentTypes.BUTTON,
            label: MENU_BACK_BTN_LABEL,
            style: MENU_BACK_BTN_STYLE,
          },
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
  id: "settings.suggestion",
  execute,
};
