import { ComponentInteraction, Constants } from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
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
  if (!suggestion) return;

  // get original message
  const message = await interaction.client.rest.channels.getMessage(
    interaction.channelID,
    interaction.message.id
  );

  // create thread
  const threadChannel = await message.startThread({
    name: `New Suggestion ${suggestion.memberTag}`,
    autoArchiveDuration: 10080,
  });

  // edit original message
  await message.edit({
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: (
          (message.components && message.components[0].components) ||
          []
        ).filter((c) => {
          if (c.type !== Constants.ComponentTypes.BUTTON) return true;
          if (c.label === "Discuss") return false;
          return true;
        }),
      },
    ],
  });

  // update db
  await prisma.guildSuggestion.update({
    where: {
      id: suggestion.id,
    },
    data: {
      threadID: threadChannel.id,
    },
  });

  await interaction.editOriginal(
    interaction.getSuccessReply("Discussion has been created.")
  );
}

export = {
  id: "action.suggestion.discuss",
  execute,
};
