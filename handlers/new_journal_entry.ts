import { Conversation } from "@grammyjs/conversations";
import { Context, InlineKeyboard } from "grammy";
import { JournalEntry } from "../types/types.ts";
import { telegramDownloadUrl } from "../constants/strings.ts";

/**
 * Starts the process of creating a new journal entry.
 * @param conversation Conversation
 * @param ctx Context
 */
export async function new_journal_entry(
  conversation: Conversation,
  ctx: Context,
) {
  ctx.reply(`Hello ${ctx.from?.username!}!  Tell me what is on your mind.`);

  const journalEntryCtx = await conversation.waitFor("message:text");

  const confirmMsg = ctx.reply(
    `Would you like to upload any pictures with this journal entry ${ctx.from
      ?.username!}?`,
    {
      reply_markup: new InlineKeyboard().text("Yes", "image-upload-yes").text(
        "No",
        "image-upload-no",
      ),
    },
  );

  const imagesConfirmCtx = await conversation.waitForCallbackQuery([
    "image-upload-yes",
    "image-upload-no",
  ]);

  if (imagesConfirmCtx.callbackQuery.data === "image-upload-yes") {
    ctx.api.editMessageText(
      ctx.chatId!,
      (await confirmMsg).message_id,
      "Okay!  Send me some images.",
    );

    const imagesCtx = await conversation.waitFor("message:photo");

    const tmpFile = await imagesCtx.getFile();

    const response = await conversation.external(async () => {
      return await fetch(
        telegramDownloadUrl.replace("<token>", ctx.api.token).replace(
          "<file_path>",
          tmpFile.file_path!,
        ),
      );
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to recieve your images in Journal Entry");
    }
  }

  const journalEntry: JournalEntry = {
    userId: ctx.from?.id!,
    timestamp: await conversation.external(() => Date.now()),
    content: journalEntryCtx.message.text,
    length: journalEntryCtx.message.text.length,
  };

  console.log(journalEntry);
}
