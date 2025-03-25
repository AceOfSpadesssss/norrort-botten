import {
  CommandInteraction,
  Constants,
  CreateApplicationCommandOptions,
} from "oceanic.js";
import { getLongTimestamp } from "../../util/common.util";

async function execute(interaction: CommandInteraction) {
  await interaction.defer();

  if (!interaction.guildID || !interaction.member) {
    return interaction.editOriginal(
      interaction.getErrorReply("This command can only be used inside servers.")
    );
  }

  const member =
    interaction.data.options.getMember("member", false) || interaction.member;

  await interaction.editOriginal({
    embeds: [
      {
        title: "Avatar Viewer",
        color: interaction.colors.default,
        author: { name: `${member.username}#${member.discriminator}` },
        description: "**Full Avatar**",
        fields: [
          {
            name: "Requested By",
            value: `<@${interaction.user.id}>`,
          },
          { name: "Timestamp", value: getLongTimestamp() },
        ],
        image: { url: member.avatarURL() },
      },
    ],
  });
}

export = {
  execute,
  options: {
    name: "avatar",
    description: "View avatar of a member",
    options: [
      {
        name: "member",
        description: "Someone in the server",
        type: Constants.ApplicationCommandOptionTypes.USER,
        required: false,
      },
    ],
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  } as CreateApplicationCommandOptions,
};
