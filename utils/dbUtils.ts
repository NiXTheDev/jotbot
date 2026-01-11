import { existsSync, PathLike } from "node:fs";
import {
  addCustom404ImagePathColumn,
  createEntryTable,
  createGadScoreTable,
  createJournalEntryPhotosTable,
  createJournalTable,
  createPhqScoreTable,
  createSettingsTable,
  createUserTable,
  createVoiceRecordingTable,
} from "../db/migration.ts";
import { DatabaseSync } from "node:sqlite";
import { dbFileBasePath } from "../constants/paths.ts";

/**
 * @param dbFile
 */
export function createDatabase(dbFile: PathLike) {
  try {
    // Create db directory structure
    if (!existsSync(dbFileBasePath)) {
      Deno.mkdirSync(dbFileBasePath, { recursive: true });
    }

    // Create db
    createUserTable(dbFile);
    createGadScoreTable(dbFile);
    createPhqScoreTable(dbFile);
    createEntryTable(dbFile);
    createSettingsTable(dbFile);
    createJournalTable(dbFile);
    createJournalEntryPhotosTable(dbFile);
    createVoiceRecordingTable(dbFile);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to create database: ${err}`);
  }
}

export function runMigrations(dbFile: PathLike) {
  try {
    const db = new DatabaseSync(dbFile);
    db.exec("PRAGMA foreign_keys = ON;");

    // Check if journal_db exists, if not create it
    const journalTableExists = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='journal_db'",
    ).get();
    if (!journalTableExists) {
      console.log("Running migration: creating journal_db table");
      createJournalTable(dbFile);
    }

    // Check if journal_entry_photos table exists
    const photosTableExists = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='photo_db'",
    ).get();
    if (!photosTableExists) {
      console.log("Running migration: creating photo_db table");
      createJournalEntryPhotosTable(dbFile);
    }

    // Check if custom404ImagePath column exists in settings_db
    const columnInfo = db.prepare(
      "PRAGMA table_info(settings_db)",
    ).all();
    const columnExists = columnInfo.find((col) =>
      (col as Record<string, unknown>).name === "custom404ImagePath"
    );
    if (!columnExists) {
      console.log("Running migration: adding custom404ImagePath column");
      addCustom404ImagePathColumn(dbFile);
    }

    db.close();
  } catch (err) {
    console.error(`Failed to run migrations: ${err}`);
  }
}

/**
 * @param dbFile
 * @param tableName
 * @returns
 */
export function getLatestId(
  dbFile: PathLike,
  tableName: string,
): number {
  let id;
  try {
    const db = new DatabaseSync(dbFile);
    const query = Deno.readTextFileSync("db/sql/misc/get_latest_entry_id.sql")
      .replace("<TABLE_NAME>", tableName).trim();
    id = db.prepare(query).get();
  } catch (err) {
    console.error(`Failed to retrieve latest id from ${tableName}: ${err}`);
  }
  return Number(id?.seq);
}
