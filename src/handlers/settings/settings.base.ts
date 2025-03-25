import { MessageOptions } from "child_process";
import {
  Constants,
  ModalSubmitInteraction,
  CommandInteraction,
  InteractionContent,
  SelectOption,
} from "oceanic.js";
import { OWNER_IDS } from "../../constants";

async function execute(
  interaction: CommandInteraction | ModalSubmitInteraction
) {
  if (!interaction.acknowledged) {
    if (interaction instanceof CommandInteraction) {
      await interaction.defer(64).catch((_) => {});
    } else {
      await interaction.deferUpdate().catch((_) => {});
    }
  }

  let ownerOnlyOptions: SelectOption[] = [];
  if (OWNER_IDS.includes(interaction.user.id)) {
    ownerOnlyOptions = [
      {
        label: "Guild Blacklist",
        value: "settings.guild_blacklist",
        description: "Blacklist guilds from inviting the bot",
      },
    ];
  }

  const options: InteractionContent & MessageOptions = {
    embeds: [
      {
        title: `${interaction.guild?.name}'s Assembly Tree`,
        description: "In the select menu choose a category branch",
        color: interaction.colors.default,
      },
    ],
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            type: Constants.ComponentTypes.STRING_SELECT,
            placeholder: "Select a category branch",
            customID: "settings.base",
            options: [
              {
                emoji: { id: null, name: "⚔️" },
                label: "Guild Branch",
                value: "settings.base.guild",
                description:
                  "Things like welcome, guild stats, verification and level-up",
              },
              {
                emoji: { id: null, name: "⚡" },
                label: "Utilities Branch",
                value: "settings.base.utils",
                description: "Things like apps, forms, self roles and tickets",
              },
              {
                emoji: { id: null, name: "🎉" },
                label: "Engagement & Fun Branch",
                value: "settings.base.fun",
                description:
                  "Things like reviews, snippets, birthdays and suggestions",
              },
              {
                emoji: { id: null, name: "🤖" },
                label: "Bot Branch",
                value: "settings.base.bot",
                description:
                  "Things like common bot settings and bot-related configurations",
              },
              ...ownerOnlyOptions,
            ],
          },
        ],
      },
    ],
  };

  if (interaction instanceof CommandInteraction) {
    await interaction.editOriginal(options);
  } else {
    await interaction.editOriginal(options);
  }
}

export = {
  id: "settings.base",
  execute,
};
