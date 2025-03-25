import {
  CommandInteraction,
  Constants,
  CreateApplicationCommandOptions,
  Client,
} from "oceanic.js";

async function execute(interaction: CommandInteraction, client: Client) {
  if (!interaction.guildID || !interaction.member) {
    return interaction.createMessage({
      ...interaction.getErrorReply(
        "This command can only be used inside servers."
      ),
      flags: 64,
    });
  }

  const guild = client.guilds.get(interaction.guildID);

  if (!guild) {
    return interaction.createMessage({
      ...interaction.getErrorReply("Failed to find the server."),
      flags: 64,
    });
  }

  await interaction.createModal({
    title: "Create new suggestion",
    customID: "action.suggestion.create",
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            label: "Full Idea",
            type: Constants.ComponentTypes.TEXT_INPUT,
            style: Constants.TextInputStyles.PARAGRAPH,
            placeholder: "Write description here",
            customID: "full_idea",
            maxLength: 1024,
            required: true,
          },
        ],
      },
    ],
  });
}

export = {
  execute,
  options: {
    name: "suggest",
    description: "Suggest something to the server staff",
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  } as CreateApplicationCommandOptions,
};
