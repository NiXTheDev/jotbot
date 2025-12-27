import { DatabaseSync } from "node:sqlite";
import { JournalEntryPhoto } from "../types/types.ts";
import { PathLike } from "node:fs";
import { logger } from "../utils/logger.ts";

export function insertJournalEntryPhoto(
  jePhoto: JournalEntryPhoto,
  dbFile: PathLike,
) {
  try {
    const db = new DatabaseSync(dbFile);
    if (
      !(db.prepare("PRAGMA integrity_check;").get()?.integrity_check === "ok")
    ) throw new Error("JotBot Error: Databaes integrety check failed!");
    db.exec("PRAGMA foreign_keys = ON;");

    const queryResult = db.prepare(
      `INSERT INTO photo_db (entryId, path, caption, fileSize) VALUES (?, ?, ?, ?);`,
    ).run(
      jePhoto.journalEntryId,
      jePhoto.path,
      jePhoto.caption || null,
      jePhoto.fileSize,
    );

    db.close();
    return queryResult;
  } catch (err) {
    logger.error(
      `Failed to insert journal entry photo into photo_db: ${err}`,
    );
    throw err;
  }
}
