import { ComponentInteraction } from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
import { GuildLogService } from "../../../service/GuildLogService";
import { checkModPermission } from "../../../util/permission.util";

const prisma = DatabaseService.getClient();

async function execute(interaction: ComponentInteraction) {
  if (!interaction.member || !interaction.guildID) return;

  await interaction.defer(64);

  // check permission
  const hasPermission = await checkModPermission(interaction.member);

  if (!hasPermission) {
    return interaction.editOriginal(
      interaction.getErrorReply(
        "You don't have permissions to perform this action."
      )
    );
  }

  const suggestion = await prisma.guildSuggestion.findFirst({
    where: { guildID: interaction.guildID, messageID: interaction.message.id },
  });

  if (!suggestion) {
    return interaction.editOriginal(
      interaction.getErrorReply("Failed to find the suggestion.")
    );
  }

  await GuildLogService.postLog({
    guildID: interaction.guildID,
    content: {
      embeds: [
        {
          color: interaction.colors.success,
          author: {
            iconURL: interaction.user.avatarURL(),
            name: `${interaction.user.username}#${interaction.user.discriminator}`,
          },
          title: "Suggestion Approved",
          fields: [
            { name: "User", value: `<@${suggestion.memberID}>` },
            {
              name: "Time of Approval",
              value: `<t:${Math.floor(new Date().getTime() / 1000)}:f>`,
              inline: true,
            },
            {
              name: "Moderator",
              value: `<@${interaction.user.id}>`,
              inline: true,
            },
            { name: "Approval ID", value: `${suggestion.id}`, inline: true },
          ],
        },
      ],
    },
  });

  // edit original message
  const message = await interaction.client.rest.channels.getMessage(
    interaction.channelID,
    interaction.message.id
  );
  const embed = message.embeds[0];

  embed.color = interaction.colors.success;

  embed.fields?.forEach((field) => {
    if (field.name === "Status of Suggestion") {
      field.value = "Approved";
    }
  });

  await message.edit({ embeds: message.embeds, components: [] });

  // mark in db
  await prisma.guildSuggestion.update({
    where: { id: suggestion.id },
    data: { status: "approved" },
  });

  // archive thread
  if (suggestion.threadID) {
    await interaction.client.rest.channels.edit(suggestion.threadID, {
      archived: true,
    });
  }

  await interaction.editOriginal(
    interaction.getSuccessReply("Suggestion has been approved successfully.")
  );
}

export = {
  id: "action.suggestion.approve",
  execute,
};
