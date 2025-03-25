import { Constants, ModalSubmitInteraction } from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
import { getLongTimestamp } from "../../../util/common.util";

const prisma = DatabaseService.getClient();

async function execute(interaction: ModalSubmitInteraction) {
  if (!interaction.member || !interaction.guildID) return;

  if (!interaction.acknowledged) {
    await interaction.defer(64);
  }

  const suggestionChannelID = (
    await prisma.guildSuggestionPanel.findFirst({
      where: { guildID: interaction.guildID },
    })
  )?.suggestionChannelID;

  if (!suggestionChannelID) {
    return interaction.editOriginal(
      interaction.getErrorReply(
        "This server does not have a suggestions channel set."
      )
    );
  }

  const fullIdea = interaction.options.getString("full_idea", true);

  const message = await interaction.client.rest.channels.createMessage(
    suggestionChannelID,
    {
      embeds: [
        {
          color: interaction.colors.default,
          title: "New Suggestion",
          fields: [
            {
              name: "Full Idea",
              value: fullIdea,
            },
            { name: "Status of Suggestion", value: "Pending", inline: true },
            {
              name: "Suggested By",
              value: `<@${interaction.user.id}>`,
              inline: true,
            },
            {
              name: "Timestamp",
              value: getLongTimestamp(),
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
              customID: "action.suggestion.discuss",
              style: Constants.ButtonStyles.PRIMARY,
              label: "Discuss",
            },
            {
              type: Constants.ComponentTypes.BUTTON,
              customID: "action.suggestion.approve",
              style: Constants.ButtonStyles.SUCCESS,
              label: "Approve",
            },
            {
              type: Constants.ComponentTypes.BUTTON,
              customID: "action.suggestion.reject",
              style: Constants.ButtonStyles.DANGER,
              label: "Reject",
            },
          ],
        },
      ],
    }
  );

  await message.createReaction("✅");
  await message.createReaction("❌");

  await prisma.guildSuggestion.create({
    data: {
      guildID: interaction.guildID,
      memberID: interaction.member.id,
      memberTag: interaction.user.tag,
      messageID: message.id,
      fullIdea,
    },
  });

  await interaction.editOriginal(
    interaction.getSuccessReply("Your suggestion has been posted.")
  );
}

export = {
  id: "action.suggestion.create",
  execute,
};
