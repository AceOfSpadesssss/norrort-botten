import { MessageOptions } from "child_process";
import {
  Constants,
  InteractionContent,
  ComponentInteraction,
} from "oceanic.js";
import { MENU_HOME_BTN_LABEL, MENU_HOME_BTN_STYLE } from "../../constants";

async function execute(interaction: ComponentInteraction) {
  if (!interaction.acknowledged) {
    await interaction.deferUpdate();
  }

  const options: InteractionContent & MessageOptions = {
    embeds: [
      {
        title: "Engagement & Fun Branch",
        description: "In the select menu choose the desired component",
        color: interaction.colors.default,
      },
    ],
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            type: Constants.ComponentTypes.STRING_SELECT,
            placeholder: "Select the desired component",
            customID: "settings.base.fun",
            options: [
              {
                label: "Suggestions",
                value: "settings.suggestion",
                description: "Collect and track suggestions from members",
              },
            ],
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
  };

  await interaction.editOriginal(options);
}

export = {
  id: "settings.base.fun",
  execute,
};
