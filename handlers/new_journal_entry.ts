import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";
import { JournalEntry } from "../types/types.ts";

/**
 * Starts the process of creating a new journal entry.
 * @param conversation Conversation
 * @param ctx Context
 */
export async function new_journal_entry(conversation: Conversation, ctx: Context) {
    const ctxMsg = await ctx.reply("Tell me what's on your mind.", );

    const journalEntryContent = conversation.waitFor(["message:text", "message:photo"]);

    // const entry: JournalEntry = {
    //     userId: ctx.from?.id!,
    //     timestamp: new Date(await conversation.external(() => Date.now())),
    //     content: (await journalEntryContent).message.text!,
    //     length: (await journalEntryContent).message.text!.length,
    //     images: // TODO: I need to download files and then store the paths
    // }
}