import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";

/**
 * Starts the process of creating a new journal entry.
 * @param conversation 
 * @param ctx 
 */
export async function new_journal_entry(conversation: Conversation, ctx: Context) {
    await ctx.reply("Start new journal entry.");
}