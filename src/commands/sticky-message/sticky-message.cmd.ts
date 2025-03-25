import {
	Constants,
	CommandInteraction,
	CreateApplicationCommandOptions,
	EmbedOptions,
	Guild,
	Client,
} from "oceanic.js";
import { DatabaseService } from "../../service/DatabaseService";
import { checkModPermission } from "../../util/permission.util";

const prisma = DatabaseService.getClient();

async function execute(interaction: CommandInteraction, client: Client) {
	await interaction.defer(64);

	if (!interaction.guildID || !interaction.member) {
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

	const interactionMember = interaction.member;

	if (!interactionMember) {
		return interaction.editOriginal(
			interaction.getErrorReply("Failed to locate the interaction member.")
		);
	}

	const hasPermission = await checkModPermission(interaction.member);

	if (!hasPermission) {
		return interaction.editOriginal(
			interaction.getErrorReply(
				"You don't have permission to run this command!"
			)
		);
	}

	const subcommand = interaction.data.options.getSubCommand(true)[0];

	switch (subcommand) {
		case "add-message":
			await addMessage(interaction, guild, client);
			break;

		case "list-messages":
			await listMessages(interaction, guild, client);
			break;

		case "remove-message":
			await removeMesssage(interaction, guild, client);
			break;
	}
}

async function addMessage(
	interaction: CommandInteraction,
	guild: Guild,
	client: Client
) {
	const name = interaction.data.options.getString("name", true);
	const messageID = interaction.data.options.getString("message_id", true);
	const stickyChannelIDs = interaction.data.options
		.getString("sticky_channel_ids", true)
		.split(",")
		.filter((i) => !isNaN(parseInt(i)))
		.join(",");

	const existing = await prisma.guildStickyMessage.findFirst({
		where: {
			guildID: guild.id,
			name,
		},
	});

	if (existing) {
		return interaction.editOriginal(
			interaction.getErrorReply("Sticky message with same name already exists.")
		);
	}

	const message = await client.rest.channels
		.getMessage(interaction.channelID, messageID)
		.catch((e) => {
			client.logger.error(e);
		});

	if (!message) {
		return interaction.editOriginal(
			interaction.getErrorReply(
				"Failed to find a message with given ID in this channel."
			)
		);
	}

	const messageContent = {
		content: message.content,
		embeds: message.embeds,
	};

	await prisma.guildStickyMessage.create({
		data: {
			guildID: guild.id,
			name,
			channelIDs: stickyChannelIDs,
			content: JSON.stringify(messageContent),
		},
	});

	for (const channelID of stickyChannelIDs.split(",")) {
		const stickyMessage = await client.rest.channels.createMessage(
			channelID,
			messageContent
		);

		await prisma.guildStickyMessageHistory.create({
			data: {
				guildID: guild.id,
				name,
				channelID,
				messageID: stickyMessage.id,
			},
		});
	}

	await interaction.editOriginal(
		interaction.getSuccessReply(`Sticky message "${name}" has  been created.`)
	);
}

async function listMessages(
	interaction: CommandInteraction,
	guild: Guild,
	_client: Client
) {
	const records = await prisma.guildStickyMessage.findMany({
		where: { guildID: guild.id },
	});

	if (records.length === 0) {
		return interaction.editOriginal(
			interaction.getDefaultReply("This server doesn't have any sticky messages.")
		);
	}

	const embed: EmbedOptions = {
		color: interaction.colors.default,
		title: "Sticky Messages | List",
		description: records
			.map(
				(r, i) =>
					`${i + 1}) ${r.name} -> ${r.channelIDs
						.split(",")
						.map((i) => `<#${i}>`)
						.join(", ")}`
			)
			.join("\n"),
	};

	await interaction.editOriginal({ embeds: [embed] });
}

async function removeMesssage(
	interaction: CommandInteraction,
	guild: Guild,
	_client: Client
) {
	const name = interaction.data.options.getString("name", true);

	const existing = await prisma.guildStickyMessage.findFirst({
		where: {
			guildID: guild.id,
			name,
		},
	});

	if (!existing) {
		return interaction.editOriginal(
			interaction.getErrorReply("Sticky message with this name doesn't exist.")
		);
	}

	await prisma.guildStickyMessage.delete({ where: { id: existing.id } });

	await prisma.guildStickyMessage.deleteMany({
		where: { guildID: guild.id, name: existing.name },
	});

	await interaction.editOriginal(
		interaction.getSuccessReply(`Sticky message "${name}" has been removed.`)
	);
}

export = {
	execute,
	options: {
		name: "sticky",
		description: "Manage sticky messages",
		options: [
			{
				name: "add-message",
				description: "Create a sticky message",
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: "name",
						description: "Name for this sticky message for managing later",
						type: Constants.ApplicationCommandOptionTypes.STRING,
						required: true,
					},
					{
						name: "message_id",
						description: "ID of a message in this channel",
						type: Constants.ApplicationCommandOptionTypes.STRING,
						required: true,
					},
					{
						name: "sticky_channel_ids",
						description:
							"IDs of the channels this message should stick in separated by commas",
						type: Constants.ApplicationCommandOptionTypes.STRING,
						required: true,
					},
				],
			},
			{
				name: "list-messages",
				description: "List sticky messages in the server",
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			},
			{
				name: "remove-message",
				description: "Remove a sticky message",
				type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
				options: [
					{
						name: "name",
						description: "Name of the sticky message",
						type: Constants.ApplicationCommandOptionTypes.STRING,
						required: true,
					},
				],
			},
		],
	} as CreateApplicationCommandOptions,
};
