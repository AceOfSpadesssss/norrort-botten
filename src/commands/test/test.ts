import Canvas from "canvas";
import { writeFileSync } from "fs";

async function init() {
	const interaction = {
		member: {
			username: "DMX",
			discriminator: "534334",
			avatarURL: "https://i.imgur.com/pu0NG9m.jpg",
		},
	};

	Canvas.registerFont(`${__dirname}/Raleway-ExtraBold.ttf`, {
		family: "Raleway",
	});

	Canvas.registerFont(`${__dirname}/Roboto-Medium.ttf`, {
		family: "Roboto",
	});

	// generate welcome image
	const canvasWidth = 1100;
	const canvasHeight = 500;

	const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
	const ctx = canvas.getContext("2d");

	// draw background
	const background = await Canvas.loadImage(`${__dirname}/background.png`);
	ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

	// settings for text
	ctx.fillStyle = "#ffffff";

	// welcome text
	// ctx.font = "23px sans-serif";
	// const memberTagText = `${interaction.member.username}#${interaction.member.discriminator}`;

	// ctx.fillText(memberTagText, canvasWidth / 2, canvasHeight /2);

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// guild name
	ctx.font = "40px Roboto";
	const guildNameText = "GUILD NAME";
	ctx.fillText(guildNameText, canvasWidth / 2, canvasHeight / 2 + 25);

	// welcome text
	ctx.font = "130px Raleway";
	const welcomeText = "WELCOME";
	ctx.fillText(welcomeText, canvasWidth / 2, canvasHeight / 2 + 110);

	// user tag
	ctx.font = "30px Roboto";
	const userTagText = "SAMPLddddddddE#34343";
	ctx.fillText(userTagText, canvasWidth / 2, canvasHeight / 2 + 190);

	// get avatar image
	const avatarUrl = interaction.member.avatarURL;

	const avatar = await Canvas.loadImage(avatarUrl);

	// draw avatar imagew
	const circleX = canvasWidth / 2;
	const circleY = canvasHeight / 2 - 110;
	const radius = 90;

	// avatar border
	ctx.beginPath();
	ctx.arc(circleX, circleY, radius + 4, 0, Math.PI * 2);
	ctx.fillStyle = "#02f1b5";
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

	writeFileSync(`${__dirname}/life.png`, canvas.toBuffer());
}

init();
