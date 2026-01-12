import { Context, InlineKeyboard } from "grammy";
import { Conversation } from "@grammyjs/conversations";
import { insertUser, userExists } from "../models/user.ts";
import { User } from "../types/types.ts";
import { dbFile } from "../constants/paths.ts";
import { getSettingsById, insertSettings } from "../models/settings.ts";

export async function register(conversation: Conversation, ctx: Context) {
  // Check if user already exists
  if (userExists(ctx.from?.id!, dbFile)) {
    await ctx.reply(
      `You are already registered, ${ctx.from?.username}! Use /new_entry to create a new entry.`,
    );
    return;
  }

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
    await ctx.reply(`Failed to save birthdate: ${err}`);
    throw new Error(`Failed to save birthdate: ${err}`);
  }

  const user: User = {
    telegramId: ctx.from?.id!,
    username: ctx.from?.username!,
    dob: dob,
    joinedDate: await conversation.external(() => {
      return new Date(Date.now());
    }),
  };

  console.log(user);
  try {
    insertUser(user, dbFile);
    console.log("User inserted, now inserting settings...");
    insertSettings(ctx.from?.id!, dbFile);
    console.log("Settings inserted for user:", ctx.from?.id);
    const settingsCheck = getSettingsById(ctx.from?.id!, dbFile);
    console.log("Settings after insert:", settingsCheck);
  } catch (err) {
    ctx.reply(`Failed to save user ${user.username}: ${err}`);
    console.log(`Error inserting user ${user.username}: ${err}`);
  }

  await ctx.editMessageText(
    `Before we finish, would you like to set a custom 404 image? This image will be shown when viewing entries without a selfie.`,
    {
      reply_markup: new InlineKeyboard().text("New Entry", "new-entry"),
    },
  );
}
