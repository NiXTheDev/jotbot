import { Context, InlineKeyboard } from "grammy";
import { Conversation } from "@grammyjs/conversations";
import { insertUser } from "../models/user.ts";
import { User } from "../types/types.ts";
import { dbFile } from "../constants/paths.ts";
import { logger } from "../utils/logger.ts";

export async function register(conversation: Conversation, ctx: Context) {
  try {
    let dob;
    try {
      while (true) {
        await ctx.editMessageText(
          `Okay ${ctx.from?.username} what is your date of birth? YYYY/MM/DD`,
        );
        const dobCtx = conversation.waitFor("message:text");
        dob = new Date((await dobCtx).message.text);

        if (isNaN(dob.getTime())) {
          (await dobCtx).reply("Invalid date entered.  Please try again.");
        } else {
          break;
        }
      }
    } catch (err) {
      logger.error(`Error getting DOB for user ${ctx.from?.id}: ${err}`);
      await ctx.reply(
        "❌ Sorry, there was an error processing your date of birth. Please try registering again with /start.",
      );
      return; // End conversation gracefully
    }

    const user: User = {
      telegramId: ctx.from?.id!,
      username: ctx.from?.username!,
      dob: dob,
      joinedDate: await conversation.external(() => {
        return new Date(Date.now());
      }),
    };

    logger.debug(`Registering new user: ${JSON.stringify(user)}`);
    try {
      insertUser(user, dbFile);
    } catch (err) {
      ctx.reply(`Failed to save user ${user.username}: ${err}`);
      logger.error(`Error inserting user ${user.username}: ${err}`);
    }
    await ctx.reply(
      `Welcome ${user.username}!  You have been successfully registered.  Would you like to start by recording an entry?`,
      { reply_markup: new InlineKeyboard().text("New Entry", "new-entry") },
    );
  } catch (error) {
    logger.error(
      `Error in register conversation for user ${ctx.from?.id}: ${error}`,
    );
    try {
      await ctx.reply(
        "❌ Sorry, there was an error during registration. Please try again with /start.",
      );
    } catch (replyError) {
      logger.error(`Failed to send error message: ${replyError}`);
    }
  }
}
