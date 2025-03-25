import {
  ComponentInteraction,
  ComponentTypes,
  Constants,
  ModalSubmitInteraction,
} from "oceanic.js";
import { DatabaseService } from "../../../service/DatabaseService";
import { WelcomeService } from "../../../service/WelcomeService";
import settingsWelcome from "./settings.welcome";

const prisma = DatabaseService.getClient();

async function execute(
  interaction:
    | ComponentInteraction<ComponentTypes.STRING_SELECT>
    | ModalSubmitInteraction
) {
  if (!interaction.guildID || !interaction.member) return;

  const customID =
    interaction instanceof ModalSubmitInteraction
      ? interaction.data.customID
      : interaction.data.values?.getStrings()[0];

  const field = (customID || interaction.data.customID).split("-")[1];

  if (interaction instanceof ComponentInteraction) {
    switch (field) {
      case "channel":
        return interaction.createModal({
          title: "Set Welcome Channel",
          customID,
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: [
                {
                  label: "Channel ID",
                  type: Constants.ComponentTypes.TEXT_INPUT,
                  style: Constants.TextInputStyles.SHORT,
                  customID: "value",
                  placeholder: "Paste channel ID here",
                  required: true,
                },
              ],
            },
          ],
        });

      case "background_image":
        return interaction.createModal({
          title: "Set Background Image",
          customID,
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: [
                {
                  label: "Image URL",
                  type: Constants.ComponentTypes.TEXT_INPUT,
                  style: Constants.TextInputStyles.SHORT,
                  customID: "value",
                  placeholder: "Supports Discord links, Imgur links, etc",
                  required: true,
                },
              ],
            },
          ],
        });

      case "give_roles":
        return interaction.createModal({
          title: "Set Give Roles",
          customID,
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: [
                {
                  label: "Roles",
                  type: Constants.ComponentTypes.TEXT_INPUT,
                  style: Constants.TextInputStyles.SHORT,
                  placeholder:
                    "Place role ID here for multiple do: 13243232, 343425435",
                  customID: "value",
                  required: true,
                },
              ],
            },
          ],
        });

      case "avatar_circle_color":
        return interaction.createModal({
          title: "Set Avatar Circle Color",
          customID,
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: [
                {
                  label: "Color",
                  type: Constants.ComponentTypes.TEXT_INPUT,
                  style: Constants.TextInputStyles.SHORT,
                  placeholder: "#ffffff (hex codes)",
                  customID: "value",
                  required: true,
                },
              ],
            },
          ],
        });

      case "ping_member":
        await interaction.deferUpdate();

        const record = await prisma.guildWelcomePanel.findFirst({
          where: {
            guildID: interaction.guildID,
          },
        });

        let pingMember = false;

        if (!record || !record.pingMember) {
          pingMember = true;
        }

        await prisma.guildWelcomePanel.upsert({
          where: {
            guildID: interaction.guildID,
          },
          create: {
            guildID: interaction.guildID,
            pingMember: pingMember,
          },
          update: {
            pingMember: pingMember,
          },
        });

        return settingsWelcome.execute(interaction);

      case "live_test":
        await interaction.defer(64);
        const welcomeRecord = await prisma.guildWelcomePanel.findUnique({
          where: { guildID: interaction.guildID },
        });

        if (!welcomeRecord || !welcomeRecord.backgroundImage) {
          return interaction.editOriginal(
            interaction.getErrorReply(
              "Please set a background image before live testing."
            )
          );
        }

        const content = await WelcomeService.getMessageContent(
          interaction.member
        );

        if (!content) {
          return interaction.editOriginal(
            interaction.getErrorReply(
              "Please configure this module before testing."
            )
          );
        }

        return interaction.editOriginal(content);
    }
    return;
  }

  if (!interaction.acknowledged) {
    await interaction.deferUpdate().catch((_) => {});
  }

  // user input value
  const inputValue = interaction.options.getString("value", true);

  switch (field) {
    case "channel":
      await prisma.guildWelcomePanel.upsert({
        where: {
          guildID: interaction.guildID,
        },
        update: {
          welcomeChannelID: inputValue,
        },
        create: {
          welcomeChannelID: inputValue,
          guildID: interaction.guildID,
        },
      });
      break;

    case "background_image":
      await prisma.guildWelcomePanel.upsert({
        where: {
          guildID: interaction.guildID,
        },
        update: {
          backgroundImage: inputValue,
        },
        create: {
          backgroundImage: inputValue,
          guildID: interaction.guildID,
        },
      });
      break;

    case "give_roles":
      await prisma.guildWelcomePanel.upsert({
        where: {
          guildID: interaction.guildID,
        },
        update: {
          giveRoleIDs: inputValue
            .split(",")
            .map((i) => i.trim())
            .join(","),
        },
        create: {
          giveRoleIDs: inputValue
            .split(",")
            .map((i) => i.trim())
            .join(","),
          guildID: interaction.guildID,
        },
      });
      break;
  }

  if (field === "avatar_circle_color") {
    let value = inputValue;
    if (!value.startsWith("#")) value = "#" + value;

    const color = parseInt(value.replace("#", "0x"));

    if (isNaN(color)) {
      return interaction.createFollowup({
        ...interaction.getErrorReply("Please provide a valid Hex color code!"),
        flags: 64,
      });
    }

    await prisma.guildWelcomePanel.upsert({
      where: {
        guildID: interaction.guildID,
      },
      update: {
        avatarCircleColor: value,
        avatarCircleColorHex: color,
      },
      create: {
        avatarCircleColor: value,
        avatarCircleColorHex: color,
        guildID: interaction.guildID,
      },
    });
  }

  interaction.data.customID = "settings.welcome.embed";
  await settingsWelcome.execute(interaction);
}

export = {
  id: "settings.welcome.misc",
  execute,
};
