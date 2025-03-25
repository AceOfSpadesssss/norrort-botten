import { Member } from "oceanic.js";
import { DatabaseService } from "../service/DatabaseService";

const prisma = DatabaseService.getClient();

export async function checkModPermission(member: Member) {
	if (member.permissions.has("ADMINISTRATOR")) return true;

	const moderationPanel = await prisma.guildModerationPanel.findFirst({
		where: {
			guildID: member.guildID,
		},
	});

	if (!moderationPanel || moderationPanel.modRoleIDs.trim() === "") {
		return false;
	}

	for (const roleID of moderationPanel.modRoleIDs.split(",")) {
		if (member.roles.includes(roleID)) return true;
	}

	return false;
}
