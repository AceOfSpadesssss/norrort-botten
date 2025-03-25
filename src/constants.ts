import { Constants } from "oceanic.js";
import { resolve } from "path";

export const DISCORD_EMOJI_REGEX = /<:(?<name>.+):(?<id>\d+)>/;

// This is being used to prevent bot from re-changing the avatar and username on every restart.
// It's highly restricted by the API so it's better to only do it per update.
export const USER_EDITED_FILE = resolve(`${__dirname}/../user_edited`);

// Button labels for menus
export const MENU_BACK_BTN_LABEL = "Back";
export const MENU_BACK_BTN_STYLE = Constants.ButtonStyles.SECONDARY;

export const MENU_HOME_BTN_LABEL = "Home";
export const MENU_HOME_BTN_STYLE = Constants.ButtonStyles.SUCCESS;

export const OWNER_IDS = [
  "182681429182775296",
  "596798850744844289",
  "894681093528256612",
  "651019703040475137",
];
