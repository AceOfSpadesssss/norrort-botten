require("dotenv").config();
import { parseYAML } from "./common.util";

export const {
  TOKEN = process.env.TOKEN,
  STATUS = "online",
  ACTIVITY_NAME = process.env.ACTIVITY_NAME || "",
  ACTIVITY_TYPE = process.env.ACTIVITY_TYPE || "",
  PRODUCTION = parseInt(process.env.PRODUCTION || "1"),
  TEST_GUILD_ID = process.env.TEST_GUILD_ID,
} = {};
