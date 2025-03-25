import {
	ChannelTypes,
	ComponentInteraction,
	Constants,
	ModalSubmitInteraction,
} from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
import { GeneralService } from "../../../service/GeneralService";
import settingsGeneral from "./settings.general";

const prisma = DatabaseService.getClient();

async function execute(interaction: ComponentInteraction) {
	if (!interaction.guildID) return;

	const key = interaction.data.customID.split("-")[1]?.trim();

	if (key === "roleRecovery") {
		const existing = await prisma.guildBotModule.findUnique({
			where: {
				guildID_module: {
					guildID: interaction.guildID,
					module: "ROLE_RECOVERY",
				},
			},
		});

		await prisma.guildBotModule.upsert({
			where: {
				guildID_module: {
					guildID: interaction.guildID,
					module: "ROLE_RECOVERY",
				},
			},
			create: {
				guildID: interaction.guildID,
				module: "ROLE_RECOVERY",
				enabled: existing !== null ? !existing.enabled : true,
			},
			update: {
				enabled: existing !== null ? !existing.enabled : true,
			},
		});
	}

	await settingsGeneral.execute(interaction);
}

export = {
	id: "settings.general.toggle",
	execute,
};
