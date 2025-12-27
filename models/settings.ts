import { PathLike } from "node:fs";
import { Settings } from "../types/types.ts";
import { withDB } from "../utils/dbHelper.ts";

/**
 * @param userId
 * @param dbFile
 * @returns
 */
export function insertSettings(userId: number, dbFile: PathLike) {
  return withDB(dbFile, (db) => {
    const queryResult = db.prepare(
      `INSERT INTO settings_db (userId) VALUES (?);`,
    ).run(userId);

    if (queryResult.changes === 0) {
      throw new Error("Insert failed: no changes made");
    }

    return queryResult;
  });
}

export function updateSettings(
  userId: number,
  updatedSettings: Settings,
  dbFile: PathLike,
) {
  return withDB(dbFile, (db) => {
    const queryResult = db.prepare(
      `UPDATE OR FAIL settings_db SET storeMentalHealthInfo = ?, custom404ImagePath = ? WHERE userId = ?`,
    ).run(
      Number(updatedSettings.storeMentalHealthInfo),
      updatedSettings.custom404ImagePath || null,
      userId,
    );

    if (queryResult.changes === 0) {
      throw new Error("Update failed: no changes made");
    }

    return queryResult;
  });
}

/**
 * @param userId
 * @param dbFile
 * @returns
 */
export function getSettingsById(
  userId: number,
  dbFile: PathLike,
): Settings | undefined {
  return withDB(dbFile, (db) => {
    const queryResult = db.prepare(
      `SELECT * FROM settings_db WHERE userId = ?`,
    ).get(userId);

    if (!queryResult) return undefined;

    return {
      id: Number(queryResult.id),
      userId: Number(queryResult.userId),
      storeMentalHealthInfo: Boolean(Number(queryResult.storeMentalHealthInfo)),
      custom404ImagePath: queryResult.custom404ImagePath?.toString() || null,
    };
  });
}

export function updateCustom404Image(
  userId: number,
  imagePath: string | null,
  dbFile: PathLike,
) {
  return withDB(dbFile, (db) => {
    // First, ensure settings exist for this user
    const existingSettings = db.prepare(
      `SELECT id FROM settings_db WHERE userId = ?`,
    ).get(userId);

    if (!existingSettings) {
      // Create settings record if it doesn't exist
      console.log(`Creating new settings record for user ${userId}`);
      const insertResult = db.prepare(
        `INSERT INTO settings_db (userId, custom404ImagePath) VALUES (?, ?)`,
      ).run(userId, imagePath);
      return insertResult;
    }

    // Update existing settings
    console.log(`Updating existing settings for user ${userId}`);
    const queryResult = db.prepare(
      `UPDATE settings_db SET custom404ImagePath = ? WHERE userId = ?`,
    ).run(imagePath, userId);

    if (queryResult.changes === 0) {
      throw new Error("Update failed: no changes made");
    }

    return queryResult;
  });
}
