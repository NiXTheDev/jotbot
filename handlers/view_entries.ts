import { Context } from "grammy";
import { Conversation } from "@grammyjs/conversations";
import { getEntriesByUserId } from "../models/entry.ts";

export async function view_entries(conversation: Conversation, ctx: Context) {
    const entries = getEntriesByUserId(ctx.from?.id!);
}