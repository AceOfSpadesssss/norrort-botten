import {
  CommandInteraction,
  Constants,
  CreateApplicationCommandOptions,
  Client,
} from "oceanic.js";
import { DatabaseService } from "../../service/DatabaseService";
import { GuildLogService } from "../../service/GuildLogService";
import { ReminderService } from "../../service/ReminderService";
import { getMilliseconds } from "../../util/common.util";

const prisma = DatabaseService.getClient();

async function execute(interaction: CommandInteraction, client: Client) {
  await interaction.defer(64);
  const { member } = interaction;

  if (!interaction.guildID || !member) {
    return interaction.editOriginal(
      interaction.getErrorReply("This command can only be used inside servers.")
    );
  }

  const guild = client.guilds.get(interaction.guildID);

  if (!guild) {
    return interaction.editOriginal(
      interaction.getErrorReply("Failed to locate the Discord server.")
    );
  }

  const duration = interaction.data.options.getInteger("duration", true);
  const unit = interaction.data.options.getString("unit", true);
  const message = interaction.data.options.getString("message", true);

  const record = await prisma.guildReminder.create({
    data: {
      guildID: guild.id,
      memberID: member.id,
      channelID: interaction.channelID,
      message: message,
      duration: getMilliseconds(duration, unit) / 1000,
    },
  });

  ReminderService.addToOngoingReminders(record);

  await GuildLogService.postLog({
    guildID: guild.id,
    content: {
      embeds: [
        {
          color: interaction.colors.default,
          title: "Log Entry: Reminder Created",
          fields: [
            {
              name: "Member",
              value: `${member.username}#${member.discriminator} (${member.id})`,
            },
            {
              name: "Message",
              value: message,
            },
            {
              name: "Duration",
              value: `${duration}${unit}`,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    },
  });

  await interaction.editOriginal(
    interaction.getSuccessReply("Your reminder has been saved.")
  );
}

export = {
  execute,
  options: {
    name: "remind",
    description: "Remind me something",
    options: [
      {
        name: "message",
        description: "What should I remind?",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: true,
      },
      {
        name: "duration",
        description: "Duration to remind in",
        type: Constants.ApplicationCommandOptionTypes.INTEGER,
        required: true,
      },
      {
        name: "unit",
        description: "Time unit of duration",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: true,
        choices: [
          { name: "Seconds", value: "s" },
          { name: "Minutes", value: "m" },
          { name: "Hours", value: "h" },
          { name: "Days", value: "d" },
        ],
      },
    ],
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  } as CreateApplicationCommandOptions,
};
