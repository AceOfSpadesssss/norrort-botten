import {
  Member,
  Message,
  VoiceChannel,
  StageChannel,
  CreateMessageOptions,
  File,
  User,
  Guild,
  Client,
} from "oceanic.js";
import { getLongTimestamp } from "../util/common.util";
import { DatabaseService } from "./DatabaseService";
import { GeneralService } from "./GeneralService";

const prisma = DatabaseService.getClient();

type PostLogParams = {
  guildID: string;
  content: CreateMessageOptions;
  type?: "text" | "voice";
  files?: File[];
  channelID?: string;
};

export class GuildLogService {
  private static client: Client;

  static initialize(client: Client) {
    this.client = client;
  }

  static async postLog({
    guildID,
    channelID,
    content,
    files,
    type = "text",
  }: PostLogParams) {
    if (!channelID) {
      const panel = await prisma.guildAdvancedLogsPanel.findUnique({
        where: {
          guildID,
        },
      });

      if (panel) {
        channelID =
          type === "text" ? panel.textLogChannelID : panel.voiceLogChannelID;
      }
    }

    if (!channelID) {
      channelID = (
        await prisma.guildGeneralPanel.findFirst({
          where: { guildID },
        })
      )?.logChannelID;
    }

    if (!channelID) {
      this.client.logger.warn(
        `Guild: ${guildID} doesn't have a log channel set.`
      );
      return;
    }

    await this.client.rest.channels
      .createMessage(channelID, { ...content, files })
      .catch((e) => {
        this.client.logger.error(e);
      });
  }

  static async postGuildMemberAdd(member: Member, client: Client) {
    const createdSeconds = Math.floor(member.createdAt.getTime() / 1000);
    await this.postLog({
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(member.guildID),
            title: "Advanced Logs",
            fields: [
              {
                name: "Member Joined",
                value: `<@${member.id}> [${member.tag}]`,
              },
              {
                name: "Discord Account Created",
                value: `<t:${createdSeconds}:F>`,
              },
              {
                name: "Joined Server At",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
      guildID: member.guildID,
    });
  }

  static async postGuildMemberRemove(guild: Guild, member: Member | User) {
    let joinSeconds = undefined;

    //@ts-ignore
    if (member.joinedAt) {
      joinSeconds = Math.floor(
        //@ts-ignore
        (member.joinedAt.getTime() || new Date().getTime()) / 1000
      );
    }

    const createdSeconds = Math.floor(member.createdAt.getTime() / 1000);

    await this.postLog({
      guildID: guild.id,
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(guild.id),
            title: "Advanced Logs",
            fields: [
              {
                name: "Member Left",
                value: `<@${member.id}> [${member.tag}]`,
              },
              {
                name: "Discord Account Created",
                value: `<t:${createdSeconds}:F>`,
              },
              {
                name: "Joined Server At",
                value: joinSeconds ? `<t:${joinSeconds}:f>` : "Unknown",
              },
              {
                name: "Left Server At",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
    });
  }

  static async postMessageUpdate(
    oldMessage: Message | null,
    newMessage: Message
  ) {
    if (
      !newMessage?.guildID ||
      !newMessage.member ||
      newMessage.member.id === this.client.user.id
    )
      return;

    await this.postLog({
      guildID: newMessage.guildID,
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(newMessage.member.guildID),
            title: "Advanced Logs",
            fields: [
              {
                name: "Old Message",
                value: oldMessage?.content || "Unknown",
              },
              {
                name: "New Message",
                value: newMessage.content,
              },
              {
                name: "Edited By",
                value: `${newMessage.author.id} [${newMessage.author.tag}]`,
              },
              {
                name: "Timestamp",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
    });
  }

  static async postMessageDelete(message: Message | Object, client: Client) {
    if (
      !(message instanceof Message) ||
      !message?.guildID ||
      !message.member ||
      message.member.id === client.user.id
    ) {
      return;
    }

    await this.postLog({
      guildID: message.guildID,
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(message.member.guildID),
            title: "Advanced Logs",
            fields: [
              {
                name: "Deleted Message",
                value: message.content,
              },
              {
                name: "Deleted By",
                value: `${message.author.id} [${message.author.tag}]`,
              },
              {
                name: "Timestamp",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
    });
  }

  static async postVoiceChannelJoin(
    member: Member,
    channel: VoiceChannel | StageChannel
  ) {
    await this.postLog({
      guildID: member.guildID,
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(member.guildID),
            title: "Advanced Logs",
            fields: [
              {
                name: "Member Joined Voice",
                value: `<@${member.id}> [${member.tag}]`,
              },
              {
                name: "Channel",
                value: `<#${channel.id}>`,
              },
              {
                name: "Timestamp",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
      type: "voice",
    });
  }

  static async postVoiceChannelLeave(
    member: Member,
    channel: VoiceChannel | StageChannel
  ) {
    await this.postLog({
      guildID: member.guildID,
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(member.guildID),
            title: "Advanced Logs",
            fields: [
              {
                name: "Member Left Voice",
                value: `<@${member.id}> [${member.tag}]`,
              },
              {
                name: "Channel",
                value: `<#${channel.id}>`,
              },
              {
                name: "Timestamp",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
      type: "voice",
    });
  }

  static async postVoiceChannelSwitch(
    member: Member,
    newChannel: VoiceChannel | StageChannel,
    oldChannel: VoiceChannel | StageChannel
  ) {
    await this.postLog({
      guildID: member.guildID,
      content: {
        embeds: [
          {
            color: GeneralService.getDefaultColor(member.guildID),
            title: "Advanced Logs",
            fields: [
              {
                name: "Member Switched Voice",
                value: `<@${member.id}> [${member.tag}]`,
              },
              {
                name: "Channels",
                value: `From <#${oldChannel.id}> to <#${newChannel.id}>}`,
              },
              {
                name: "Timestamp",
                value: getLongTimestamp(),
              },
            ],
          },
        ],
      },
      type: "voice",
    });
  }
}
