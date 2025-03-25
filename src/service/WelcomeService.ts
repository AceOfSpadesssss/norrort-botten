import { DatabaseService } from "./DatabaseService";
import Canvas from "canvas";
import { GuildWelcomePanel } from "@prisma/client";
import { CreateMessageOptions, Member, Client } from "oceanic.js";

const prisma = DatabaseService.getClient();

export class WelcomeService {
	static async handleMemberAdd(member: Member, client: Client) {
		const welcomePanel = await prisma.guildWelcomePanel.findFirst({
			where: {
				guildID: member.guild.id,
			},
		});

		if (!welcomePanel) {
			return;
		}

		const content = await this.getMessageContent(member, welcomePanel);
		if (!content) {
			client.logger.error(
				`Welcome module is not configured for ${member.guild.name}`
			);
			return;
		}

		await client.rest.channels.createMessage(
			welcomePanel.welcomeChannelID,
			content
		);

		if (welcomePanel.giveRoleIDs) {
			for (const roleID of welcomePanel.giveRoleIDs.split(",")) {
				await member.addRole(roleID).catch((_) => {});
			}
		}
	}

	static async getMessageContent(
		member: Member,
		wp?: GuildWelcomePanel
	): Promise<CreateMessageOptions | false> {
		const welcomePanel =
			wp ||
			(await prisma.guildWelcomePanel.findFirst({
				where: {
					guildID: member.guild.id,
				},
			}));

		if (!welcomePanel) {
			return false;
		}

		const banner = await this.generateBanner(member, welcomePanel);

		return {
			content: (welcomePanel.pingMember && `<@${member.id}>`) || undefined,
			embeds: [
				{
					title: welcomePanel.embedTitle,
					description: welcomePanel.embedDescription.replaceAll(
						"{@member}",
						`<@${member.id}>`
					),
					color: welcomePanel.embedColor,
					image: {
						url: "attachment://image.png",
					},
				},
			],
			files: [{ name: "image.png", contents: banner }],
		};
	}

	private static async generateBanner(
		member: Member,
		welcomePanel: GuildWelcomePanel
	) {
		Canvas.registerFont(`${__dirname}/../../assets/Raleway-ExtraBold.ttf`, {
			family: "Raleway",
		});

		Canvas.registerFont(`${__dirname}/../../assets/Roboto-Medium.ttf`, {
			family: "Roboto",
		});

		// generate welcome image
		const canvasWidth = 1100;
		const canvasHeight = 500;

		const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
		const ctx = canvas.getContext("2d");

		// draw background
		const background = await Canvas.loadImage(welcomePanel.backgroundImage);
		ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

		// settings for text
		ctx.fillStyle = "#ffffff";

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// guild name
		ctx.font = "40px Roboto";
		const guildNameText = member.guild.name;
		ctx.fillText(guildNameText, canvasWidth / 2, canvasHeight / 2 + 25);

		// welcome text
		ctx.font = "130px Raleway";
		const welcomeText = "WELCOME";
		ctx.fillText(welcomeText, canvasWidth / 2, canvasHeight / 2 + 110);

		// user tag
		ctx.font = "30px Roboto";
		const userTagText = `${member.username}#${member.discriminator}`;
		ctx.fillText(userTagText, canvasWidth / 2, canvasHeight / 2 + 190);

		// get avatar image
		const avatarUrl = member.avatarURL("png");

		const avatar = await Canvas.loadImage(avatarUrl);

		// draw avatar imagew
		const circleX = canvasWidth / 2;
		const circleY = canvasHeight / 2 - 110;
		const radius = 90;

		// avatar border
		ctx.beginPath();
		ctx.arc(circleX, circleY, radius + 4, 0, Math.PI * 2);
		ctx.fillStyle = welcomePanel.avatarCircleColor || "#02f1b5";
		ctx.fill();

		// circle for avatar
		ctx.beginPath();
		ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
		ctx.clip();

		ctx.drawImage(
			avatar,
			circleX - radius,
			circleY - radius,
			2 * radius,
			2 * radius
		);
		return canvas.toBuffer();
	}
}
