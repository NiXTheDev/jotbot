import { DatabaseSync } from "node:sqlite";
import { User } from "../types/types.ts";

export function insertUser(user: User) {
  const db = new DatabaseSync("db/jotbot.db");
  if (
    !(db.prepare("PRAGMA integrity_check;").get()?.integrity_check === "ok")
  ) throw new Error("JotBot Error: Databaes integrety check failed!");

  db.prepare(`
        INSERT INTO user_db (telegramId, username, dob, joinedDate) VALUES (?, ?, ?, ?);
    `).run(
    user.telegramId,
    user.username,
    user.dob.getTime(),
    user.joinedDate.getTime(),
  );

  db.close();
}

export function deleteUser(userTelegramId: number) {
  const db = new DatabaseSync("db/jotbot.db");
  if (
    !(db.prepare("PRAGMA integrity_check;").get()?.integrity_check === "ok")
  ) throw new Error("JotBot Error: Databaes integrety check failed!");

  db.prepare(`DELETE FROM user_db WHERE telegramId = ${userTelegramId};`).run();

  db.close();
}

export function userExists(userTelegramId: number): boolean {
  const db = new DatabaseSync("db/jotbot.db");
  if (
    !(db.prepare("PRAGMA integrity_check;").get()?.integrity_check === "ok")
  ) throw new Error("JotBot Error: Databaes integrety check failed!");

  const user = db.prepare(
    `SELECT EXISTS(SELECT 1 FROM user_db WHERE telegramId = '${userTelegramId}')`,
  ).get();
  let ue: number = 0;
  for (const u in user) {
    ue = Number(user[u]);
  }
  db.close();

  if (ue === 1) {
    return true;
  }
  return false;
}
