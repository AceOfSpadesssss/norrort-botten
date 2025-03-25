import {
	ComponentInteraction,
	Constants,
	ModalSubmitInteraction,
} from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
import settingsSuggestionPanel from "./settings.suggestion";

const prisma = DatabaseService.getClient();

async function execute(
	interaction: ComponentInteraction | ModalSubmitInteraction
) {
	if (interaction instanceof ComponentInteraction) {
		return interaction.createModal({
			title: "Set Suggestion Channel",
			customID: "settings.suggestion.channel",
			components: [
				{
					type: Constants.ComponentTypes.ACTION_ROW,
					components: [
						{
							label: "Channel ID",
							type: Constants.ComponentTypes.TEXT_INPUT,
							style: Constants.TextInputStyles.SHORT,
							customID: "id",
							placeholder: "Place channel ID here",
							required: true,
						},
					],
				},
			],
		});
	}

	if (!interaction.acknowledged) {
		await interaction.deferUpdate().catch((_) => {});
	}

	if (!interaction.guildID) return;

	const suggestionChannelID = interaction.options.getString("id", true);

	await prisma.guildSuggestionPanel.upsert({
		create: {
			suggestionChannelID,
			guildID: interaction.guildID,
		},
		update: {
			suggestionChannelID,
		},
		where: {
			guildID: interaction.guildID,
		},
	});

	interaction.data.customID = `settings.suggestion`;
	await settingsSuggestionPanel.execute(interaction);
}

export = {
	id: "settings.suggestion.channel",
	execute,
};
