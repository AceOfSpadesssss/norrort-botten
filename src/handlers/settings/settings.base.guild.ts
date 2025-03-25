import {
  Constants,
  InteractionContent,
  ComponentInteraction,
  CreateMessageOptions,
} from "oceanic.js";
import { MENU_HOME_BTN_LABEL, MENU_HOME_BTN_STYLE } from "../../constants";

async function execute(interaction: ComponentInteraction) {
  if (!interaction.acknowledged) {
    await interaction.deferUpdate();
  }

  const options: InteractionContent & CreateMessageOptions = {
    embeds: [
      {
        title: "Guild Branch",
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
            customID: "settings.base.guild",
            options: [
              {
                label: "Welcome",
                value: "settings.welcome",
                description:
                  "Give your new members a warm welcome to the community!",
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
  id: "settings.base.guild",
  execute,
};
