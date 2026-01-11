import { Context } from "grammy";
import { Conversation } from "@grammyjs/conversations";
import { getSettingsById, updateSettings } from "../models/settings.ts";
import { custom404DirPath, dbFile } from "../constants/paths.ts";
import { getTelegramDownloadUrl } from "../utils/telegram.ts";

export async function set_custom_404_image(
  conversation: Conversation,
  ctx: Context,
) {
  const userId = ctx.from?.id!;
  const settings = getSettingsById(userId, dbFile);
  console.log("Current settings:", settings);

  if (settings?.custom404ImagePath) {
    await ctx.reply(
      `You already have a custom 404 image set at: ${settings.custom404ImagePath}. Send a new image to replace it, /default to reset to default, or /cancel to keep current.`,
    );
  } else {
    await ctx.reply(
      `Send an image to use as your custom 404 image, /default to reset to default, or /cancel to skip.`,
    );
  }

  const choiceCtx = await conversation.wait();

  if (choiceCtx.message?.text === "/cancel") {
    await ctx.reply("Cancelled. Your custom 404 image has not been changed.");
    return;
  }

  if (choiceCtx.message?.text === "/default") {
    const currentPath = settings?.custom404ImagePath;
    if (currentPath) {
      try {
        await Deno.remove(currentPath);
        console.log("Deleted old custom 404 image:", currentPath);
      } catch (err) {
        console.error(`Failed to delete custom 404 image: ${err}`);
      }
    }
    settings!.custom404ImagePath = null;
    await conversation.external(() =>
      updateSettings(userId, settings!, dbFile)
    );
    console.log("Reset custom404ImagePath to null");
    await ctx.reply("Reset to default 404 image.");
    return;
  }

  if (choiceCtx.message?.photo) {
    try {
      const tmpFile = await choiceCtx.getFile();
      console.log("Downloading file from:", tmpFile.file_path);
      const selfieResponse = await fetch(
        getTelegramDownloadUrl().replace("<token>", ctx.api.token).replace(
          "<file_path>",
          tmpFile.file_path!,
        ),
      );

      if (selfieResponse.body) {
        await conversation.external(async () => {
          const fileName = `404_${userId}.jpg`;
          const filePath = `${custom404DirPath}/${fileName}`;
          console.log("Saving custom 404 image to:", filePath);
          const file = await Deno.open(filePath, {
            write: true,
            create: true,
          });

          const currentPath = settings?.custom404ImagePath;
          if (currentPath && currentPath !== filePath) {
            try {
              Deno.removeSync(currentPath);
              console.log("Deleted old custom 404 image:", currentPath);
            } catch (err) {
              console.error(`Failed to delete old custom 404 image: ${err}`);
            }
          }

          const realPath = await Deno.realPath(filePath);
          await selfieResponse.body.pipeTo(file.writable);
          console.log("Custom 404 image saved to:", realPath);

          settings!.custom404ImagePath = realPath;
          updateSettings(userId, settings!, dbFile);
          console.log("Updated settings with custom404ImagePath:", realPath);
        });

        await ctx.reply("Custom 404 image saved successfully!");
      }
    } catch (err) {
      console.log(`Jotbot Error: Failed to save custom 404 image: ${err}`);
      await ctx.reply("Failed to save custom 404 image. Please try again.");
    }
    return;
  }

  await ctx.reply(
    "Invalid input. Please send an image, /default, or /cancel.",
  );
}
