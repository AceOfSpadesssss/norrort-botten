import {
  CommandInteraction,
  Constants,
  CreateApplicationCommandOptions,
} from "oceanic.js";

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
        author: { name: `${member.username}#${member.discriminator}` },
        color: interaction.colors.default,
        thumbnail: {
          url: member.avatarURL(),
        },
        description:
          `**Discord Fields**\n` +
            `**• Discord ID:** ${member.id}\n` +
            `**• Nickname:** ${member.nick || "None"}\n` +
            `**• Creation Date:** <t:${Math.floor(
              member.createdAt.getTime() / 1000
            )}:F>\n` +
            `**• Joined Date:** <t:${Math.floor(
              (member.joinedAt?.getTime() || 0) / 1000
            )}:F>\n` +
            `**• Status:** ${member.presence || "invisible"}\n` +
            `**• Permission(s):** ${member.permissions.allow}\n\n` +
            `**Roles**\n` +
            member.roles.map((id) => `<@&${id}>`).join(", ") || "None",
      },
    ],
  });
}

export = {
  execute,
  options: {
    name: "user",
    description: "View information about a member",
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
