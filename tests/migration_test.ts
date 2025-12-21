import { DatabaseSync } from "node:sqlite";
import {
  createEntryTable,
  createGadScoreTable,
  createPhqScoreTable,
  createSettingsTable,
  createUserTable,
} from "../db/migration.ts";
import { assertNotEquals } from "@std/assert/not-equals";
import { assertEquals } from "@std/assert/equals";

const testDbPath = "db/test_db/jotbot_test.db";
Deno.test("Test createEntryTable()", () => {
  // Create test entry db
  createEntryTable(testDbPath);

  // Get table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'entry_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "entry_db");
});

Deno.test("Test createGadScoreTable()", () => {
  // Create test gad score table
  createGadScoreTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'gad_score_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "gad_score_db");
});

Deno.test("Test createPhqScoreTable()", () => {
  // Create test gad score table
  createPhqScoreTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'phq_score_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "phq_score_db");
});

Deno.test("Test createUserTable()", () => {
  // Create test gad score table
  createUserTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'user_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "user_db");
});

Deno.test("Test createSettingsTable()", () => {
  // Create test gad score table
  createSettingsTable(testDbPath);

  // Get the table info from the table
  const db = new DatabaseSync(testDbPath);
  const table = db.prepare(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name = 'settings_db';`,
  ).get();

  assertNotEquals(table, undefined);
  assertEquals(table?.name, "settings_db");
  Deno.remove(testDbPath);
});
