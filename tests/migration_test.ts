import { DatabaseSync } from "node:sqlite";
import {
  createEntryTable,
  createGadScoreTable,
  createJournalTable,
  createPhqScoreTable,
  createSettingsTable,
  createUserTable,
} from "../db/migration.ts";
import { assertNotEquals } from "@std/assert/not-equals";
import { assertEquals } from "@std/assert/equals";

const testDbPath = "db/test_db/jotbot_test.db";
Deno.test("Test createEntryTable()", async () => {
  // Create test entry db
  createEntryTable(testDbPath);

  // Get table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'entry_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "entry_db");
  await Deno.remove(testDbPath);
});

Deno.test("Test createGadScoreTable()", async () => {
  // Create test gad score table
  createGadScoreTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'gad_score_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "gad_score_db");
  await Deno.remove(testDbPath);
});

Deno.test("Test createPhqScoreTable()", async () => {
  // Create test gad score table
  createPhqScoreTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'phq_score_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "phq_score_db");
  await Deno.remove(testDbPath);
});

Deno.test("Test createUserTable()", async () => {
  // Create test gad score table
  createUserTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'user_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "user_db");
  await Deno.remove(testDbPath);
});

Deno.test("Test createSettingsTable()", async () => {
  // Create test gad score table
  createSettingsTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'settings_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "settings_db");
  await Deno.remove(testDbPath);
});

Deno.test("Test createJournalTable()", async () => {
  // Create test gad score table
  createJournalTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'journal_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "journal_db");
  await Deno.remove(testDbPath);
});
