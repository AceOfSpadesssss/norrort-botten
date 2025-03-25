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
        title: "Utilities Branch",
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
            customID: "settings.base.utils",
            options: [
              {
                label: "Self Role",
                value: "settings.srole",
                description:
                  "Let your members request roles with a simple process",
              },
              {
                label: "Ticket",
                value: "settings.ticket",
                description:
                  "Support members with private messaging system for help requests",
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
  id: "settings.base.utils",
  execute,
};
