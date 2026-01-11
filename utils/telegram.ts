export function getTelegramDownloadUrl(): string {
  const baseUrl = Deno.env.get("TELEGRAM_API_BASE_URL") ||
    "https://api.telegram.org";
  return `${baseUrl}/file/bot<token>/<file_path>`;
}
