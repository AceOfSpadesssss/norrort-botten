import {
	ComponentInteraction,
	ComponentTypes,
	Constants,
	ModalSubmitInteraction,
} from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
import settingsWelcome from "./settings.welcome";

const prisma = DatabaseService.getClient();

async function execute(
	interaction:
		| ComponentInteraction<ComponentTypes.STRING_SELECT>
		| ModalSubmitInteraction
) {
	if (!interaction.guildID) return;

	const customID =
		interaction instanceof ModalSubmitInteraction
			? interaction.data.customID
			: interaction.data.values.getStrings()[0];

	const field = customID.split("-")[1];

	if (interaction instanceof ComponentInteraction) {
		switch (field) {
			case "title":
				return interaction.createModal({
					title: "Set Embed Title",
					customID: "settings.welcome.embed-title",
					components: [
						{
							type: Constants.ComponentTypes.ACTION_ROW,
							components: [
								{
									label: "Embed Title",
									type: Constants.ComponentTypes.TEXT_INPUT,
									style: Constants.TextInputStyles.SHORT,
									customID: "value",
									placeholder: "Write title here",
									required: true,
								},
							],
						},
					],
				});
			case "description":
				return interaction.createModal({
					title: "Change Embed Description",
					customID: "settings.welcome.embed-description",
					components: [
						{
							type: Constants.ComponentTypes.ACTION_ROW,
							components: [
								{
									label: "Embed Description",
									type: Constants.ComponentTypes.TEXT_INPUT,
									style: Constants.TextInputStyles.PARAGRAPH,
									customID: "value",
									placeholder: "Write description here",
									required: true,
								},
							],
						},
					],
				});
			case "color":
				return interaction.createModal({
					title: "Set Embed Color",
					customID: "settings.welcome.embed-color",
					components: [
						{
							type: Constants.ComponentTypes.ACTION_ROW,
							components: [
								{
									label: "Color",
									type: Constants.ComponentTypes.TEXT_INPUT,
									style: Constants.TextInputStyles.SHORT,
									customID: "value",
									placeholder: "#ffffff (hex codes)",
									required: true,
								},
							],
						},
					],
				});
		}
		return;
	}

	if (!interaction.acknowledged) {
		await interaction.deferUpdate().catch((_) => {});
	}

	// user input value
	const inputValue = interaction.options.getString("value", true);

	switch (field) {
		case "title":
			await prisma.guildWelcomePanel.upsert({
				where: {
					guildID: interaction.guildID,
				},
				update: {
					embedTitle: inputValue,
				},
				create: {
					embedTitle: inputValue,
					guildID: interaction.guildID,
				},
			});
			break;
		case "description":
			await prisma.guildWelcomePanel.upsert({
				where: {
					guildID: interaction.guildID,
				},
				update: {
					embedDescription: inputValue,
				},
				create: {
					embedDescription: inputValue,
					guildID: interaction.guildID,
				},
			});
			break;
		case "color":
			let value = inputValue;
			if (!value.startsWith("#")) value = "#" + value;

			const color = parseInt(value.replace("#", "0x"));

			if (isNaN(color)) {
				return interaction.createFollowup({
					...interaction.getErrorReply(
						"Please provide a valid Hex color code!"
					),
					flags: 64,
				});
			}

			await prisma.guildWelcomePanel.upsert({
				where: {
					guildID: interaction.guildID,
				},
				update: {
					embedColor: color,
				},
				create: {
					embedColor: color,
					guildID: interaction.guildID,
				},
			});
			break;
	}

	interaction.data.customID = "settings.welcome.embed";
	await settingsWelcome.execute(interaction);
}

export = {
	id: "settings.welcome.embed",
	execute,
};
