import {
  ComponentInteraction,
  Constants,
  ModalSubmitInteraction,
} from "oceanic.js";
import {
  MENU_BACK_BTN_LABEL,
  MENU_BACK_BTN_STYLE,
  MENU_HOME_BTN_LABEL,
  MENU_HOME_BTN_STYLE,
} from "../../../constants";
import { DatabaseService } from "../../../service/DatabaseService";

const prisma = DatabaseService.getClient();

async function execute(
  interaction: ComponentInteraction | ModalSubmitInteraction
) {
  if (!interaction.guildID || !interaction.member) return;

  if (!interaction.acknowledged) {
    await interaction.deferUpdate().catch((_) => {});
  }

  const welcomeRecord = await prisma.guildWelcomePanel.findFirst({
    where: { guildID: interaction.guildID },
  });

  await interaction.editOriginal({
    embeds: [
      {
        title: "Welcome Module",
        description:
          "Set up welcome module this will update in real-time when you add to it \n\n_You can use ``{@member}`` to mention members within the embed description._",
        color: interaction.colors.default,
        fields: [
          {
            name: "Welcome Channel",
            value:
              welcomeRecord && welcomeRecord.welcomeChannelID
                ? `<#${welcomeRecord.welcomeChannelID}>`
                : "Not Set",
          },
          {
            name: "Embed Title",
            value:
              welcomeRecord && welcomeRecord.embedTitle
                ? welcomeRecord.embedTitle
                : "Not Set",
          },
          {
            name: "Embed Description",
            value:
              welcomeRecord && welcomeRecord.embedDescription
                ? welcomeRecord.embedDescription
                : "Not Set",
          },
          {
            name: "Embed Color",
            value:
              welcomeRecord && welcomeRecord.embedColor
                ? welcomeRecord.embedColor.toString()
                : "Not Set",
            inline: true,
          },
          {
            name: "Ping Member?",
            value: welcomeRecord && welcomeRecord.pingMember ? "Yes" : "No",
            inline: true,
          },
          {
            name: "Background Image",
            value:
              welcomeRecord && welcomeRecord.backgroundImage
                ? `[View](${welcomeRecord.backgroundImage})`
                : "Not Set",
            inline: true,
          },
          {
            name: "Avatar Circle (Border) Color",
            value:
              welcomeRecord && welcomeRecord.avatarCircleColor
                ? welcomeRecord.avatarCircleColor
                : "#02f1b5",
            inline: true,
          },
          {
            name: "Give Roles",
            value:
              welcomeRecord && welcomeRecord.giveRoleIDs
                ? welcomeRecord.giveRoleIDs
                    .split(",")
                    .map((r) => `<@&${r}>`)
                    .join(",")
                : "Not Set",
            inline: true,
          },
        ],
      },
    ],
    components: [
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            type: Constants.ComponentTypes.STRING_SELECT,
            placeholder: "Select a root to customize",
            customID: "settings.ticket.manage_panel.select_root",
            options: [
              {
                label: "Welcome Channel",
                value: "settings.welcome.misc-channel",
                description: "Set channel used to post the welcome message",
              },
              {
                label: "Embed Title",
                value: "settings.welcome.embed-title",
                description: "Set the title of the welcome embed",
              },
              {
                label: "Embed Color",
                value: "settings.welcome.embed-color",
                description: "Set the color of the welcome embed",
              },
              {
                label: "Embed Description",
                value: "settings.welcome.embed-description",
                description:
                  "Set the description of the welcome embed (use ``{@member}`` to mention the member)",
              },
              {
                label: "Toggle Ping Member",
                value: "settings.welcome.misc-ping_member",
                description:
                  "Enable or Disable whether to ping the member with the welcome message",
              },
              {
                label: "Avatar Circle Background Image",
                value: "settings.welcome.misc-background_image",
                description:
                  "Set the background image of the avatar image ring",
              },
              {
                label: "Avatar Circle Border Color",
                value: "settings.welcome.misc-avatar_circle_color",
                description: "Set the color of the avatar image ring border",
              },
              {
                label: "Give Roles",
                value: "settings.welcome.misc-give_roles",
                description: "Set the roles to assign to the member upon join",
              },
            ],
          },
        ],
      },
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            type: Constants.ComponentTypes.BUTTON,
            customID: "settings.welcome.misc-live_test",
            style: Constants.ButtonStyles.SUCCESS,
            label: "Live Test",
          },
        ],
      },
      {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
          {
            customID: "settings.base.guild",
            type: Constants.ComponentTypes.BUTTON,
            label: MENU_BACK_BTN_LABEL,
            style: MENU_BACK_BTN_STYLE,
          },
          {
            customID: "settings.base",
            type: Constants.ComponentTypes.BUTTON,
            label: MENU_HOME_BTN_LABEL,
            style: MENU_HOME_BTN_STYLE,
          },
        ],
      },
    ],
  });
}

export = {
  id: "settings.welcome",
  execute,
};
