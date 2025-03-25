import { GuildReminder } from "@prisma/client";
import { Job, scheduleJob } from "node-schedule";
import { DatabaseService } from "./DatabaseService";
import { LogService } from "./LogService";
import { Client } from "oceanic.js";

type OngoingReminder = {
  id: number;
  job: Job;
};

const logger = LogService.getLogger();
const prisma = DatabaseService.getClient();

export class ReminderService {
  private static ongoingReminders: Map<number, OngoingReminder> = new Map();
  private static client: Client;

  static async initialize(client: Client) {
    this.client = client;

    const reminders = await prisma.guildReminder.findMany();
    const nowTime = new Date().getTime();

    for (const reminder of reminders) {
      const endTime = reminder.createdDate.getTime() + reminder.duration * 1000;

      // check if reminder expired
      if (nowTime >= endTime) {
        await prisma.guildReminder.delete({
          where: {
            id: reminder.id,
          },
        });
        continue;
      }

      // if not expired, load it
      this.addToOngoingReminders(reminder);
    }

    client.logger.info(
      `reminders: loaded ${this.ongoingReminders.size} reminders`
    );
  }

  static addToOngoingReminders(reminder: GuildReminder) {
    const endDate = new Date(
      reminder.createdDate.getTime() + reminder.duration * 1000
    );

    this.ongoingReminders.set(reminder.id, {
      id: reminder.id,
      job: scheduleJob(endDate, () => {
        this.finishReminder(reminder);
        this.ongoingReminders.delete(reminder.id);
      }),
    });
  }

  static async finishReminder(reminder: GuildReminder) {
    try {
      await prisma.guildReminder.delete({
        where: {
          id: reminder.id,
        },
      });

      await this.client.rest.channels.createMessage(reminder.channelID, {
        content: `<@${reminder.memberID}>, ${reminder.message}`,
      });
    } catch (e) {
      logger.error(e);
    }
  }
}
