import { InlineKeyboard, Keyboard } from "grammy";
import { Key } from "node:readline";

export const registerKeyboard = new InlineKeyboard().text(
  "Register",
  "register-new-user",
);

export const deleteAccountConfirmKeyboard: InlineKeyboard = new InlineKeyboard()
  .text("Yes", "delete-account-yes")
  .text("No", "delete-account-no");

export const viewEntriesKeyboard: InlineKeyboard = new InlineKeyboard()
  .text("Prev", "previous-entry")
  .text("Delete", "delete-entry")
  .text("Next", "next-entry").row()
  .text("Back", "view-entry-backbutton");

export const mainCustomKeyboard: Keyboard = new Keyboard()
  .text("/new_entry").row()
  .text("/view_entries").row()
  .text("/delete_account")
  .resized()
  .persistent();
